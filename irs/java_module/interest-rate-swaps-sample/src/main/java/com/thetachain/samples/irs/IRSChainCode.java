package com.thetachain.samples.irs;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.thetachain.core.annotations.ThetaContract;
import com.thetachain.core.annotations.ThetaEndPoint;
import com.thetachain.core.contracts.ThetaContext;

@ThetaContract
public class IRSChainCode {
    private static final Logger logger = LoggerFactory.getLogger(IRSChainCode.class);
    private static final String FIND_PROPOSAL_WITH_PK_SQL = "SELECT * FROM BLOCKCHAIN.IRS_CONTRACT_PROPOSAL  WHERE CONTRACT_ID = ?  AND BUYER_ID = ? AND SELLER_ID = ? AND PROPOSED_BY = ?";
    private static final String FIND_CONTRACT_WITH_PK_SQL = "SELECT * FROM BLOCKCHAIN.IRS_CONTRACT  WHERE CONTRACT_ID = ?  AND BUYER_ID = ? AND SELLER_ID = ? ";
    private static final String FIND_INTEREST_RATE_WITH_PK_SQL = "SELECT INTEREST_RATE FROM BLOCKCHAIN.IRS_INTEREST_RATE  WHERE INDEX_NAME = ? AND PERIOD = ? AND VALID_FOR_DATE = ?";
    private static final String INSERT_INTEREST_RATE_SQL = "INSERT INTO BLOCKCHAIN.IRS_INTEREST_RATE (INDEX_NAME, PERIOD, INTEREST_RATE , VALID_FOR_DATE ) VALUES(?,?, ?,?)";

    @ThetaEndPoint("addInterestRate")
    public void addInterestRate(ThetaContext ctx, Map<String, String> params) throws Exception {
	try (PreparedStatement pstmt = ctx.getDBConnection().prepareStatement(INSERT_INTEREST_RATE_SQL)) {
	    pstmt.setString(1, params.get("indexName"));
	    pstmt.setString(2, params.get("period"));
	    pstmt.setString(3, params.get("interestRate"));
	    pstmt.setString(4, params.get("validForDate"));
	    pstmt.executeUpdate();
	}
    }

    @ThetaEndPoint("proposeContract")
    public void processProposal(ThetaContext ctx, Map<String, String> params) throws Exception {
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	IRSContractProposal proposal = new IRSContractProposal();
	setValues(params, sdf, proposal);

	IRSContractProposal existingProposals = findProposal(ctx, proposal.getContractId(), proposal.getBuyerId(),
		proposal.getSellerId(), proposal.getProposedBy());
	if (existingProposals != null) {
	    ctx.update(proposal);
	} else {
	    ctx.insert(proposal);
	}
	String counterProposedBy = proposal.getProposedBy().equals(proposal.getBuyerId()) ? proposal.getSellerId()
		: proposal.getBuyerId();
	IRSContractProposal counterProposal = findProposal(ctx, proposal.getContractId(), proposal.getBuyerId(),
		proposal.getSellerId(), counterProposedBy);
	if (counterProposal != null) {
	    if (matches(proposal, counterProposal)) {
		proposal.setStatus("MATCHED");
		counterProposal.setStatus("MATCHED");
		IRSContract contract = createContract(proposal);
		ctx.insert(contract);
	    } else {
		proposal.setStatus("MISMATCH");
		counterProposal.setStatus("MISMATCH");
	    }
	    ctx.update(proposal);
	    ctx.update(counterProposal);
	} else {
	    // We are done
	}
    }

    @ThetaEndPoint("checkForPayments")
    public void checkForPayments(ThetaContext ctx, Map<String, String> params) throws Exception {
	IRSContract contract = findContract(ctx, params.get("contractId"), params.get("buyerId"),
		params.get("sellerId"));
	Date nextPaymentDate = contract.getNextPaymentDate();
	BigDecimal floatInterest = findInterestRate(ctx, contract.getFloatingRateIndex(), contract.getCouponFrequency(), nextPaymentDate);
	if (floatInterest == null) {
	    throw new IllegalStateException("No Interest Rate for " + contract.getFloatingRateIndex() +":"+ contract.getCouponFrequency() + ":" + nextPaymentDate);
	}
	BigDecimal percentOfDays = new BigDecimal(0);
	Date lastPaymentDate = contract.getPrevPaymentDate();
	lastPaymentDate = lastPaymentDate == null ? contract.getStartDate() : lastPaymentDate;
	int noOfDays = getDateDiff(nextPaymentDate, lastPaymentDate);
	floatInterest.add(contract.getFloatingRateSpread());
	BigDecimal fixedInterest = contract.getFixedLegRate();
	BigDecimal fraction = new BigDecimal(noOfDays);
	fraction.setScale(6, RoundingMode.HALF_EVEN);
	fraction = fraction.divide(new BigDecimal("365.0000"), MathContext.DECIMAL128);
	fraction = fraction.multiply(contract.getNotionalAmount());
	fraction = fraction.divide(new BigDecimal("100.0000"), MathContext.DECIMAL128);
	BigDecimal floatAmt = floatInterest.multiply(fraction);
	BigDecimal fixedAmt = fixedInterest.multiply(fraction);
	BigDecimal netPayment = fixedAmt.subtract(floatAmt);
	IRSContractFlow flow = new IRSContractFlow();
	flow.setBuyerId(contract.getBuyerId());
	flow.setSellerId(contract.getSellerId());
	flow.setContractId(contract.getContractId());
	flow.setPaymentDueDate(nextPaymentDate);
	flow.setFixedLegAmount(fixedAmt);
	flow.setFloatLegAmount(floatAmt);
	flow.setNetPayment(netPayment);
	setNextPaymentDate(contract);
	ctx.update(contract);
	ctx.insert(flow);
    }

    private int getDateDiff(Date d1, Date d2) {
	long diff = d2.toInstant().until(d1.toInstant(), ChronoUnit.DAYS);
	return (int) diff;
    }

    private boolean matches(IRSContractProposal p, IRSContractProposal cp) {
	boolean flrCond = equals(p.getFixedLegRate(), cp.getFixedLegRate());
	boolean cfCond = equals(p.getCouponFrequency(), cp.getCouponFrequency());
	boolean friCond = equals(p.getFloatingRateIndex(), cp.getFloatingRateIndex());
	boolean frsCond = equals(p.getFloatingRateSpread(), cp.getFloatingRateSpread());
	boolean mdCond = equals(p.getMaturityDate(), cp.getMaturityDate());
	boolean naCond = equals(p.getNotionalAmount(), cp.getNotionalAmount());
	boolean sdCond = equals(p.getStartDate(), cp.getStartDate());
	boolean rv = cfCond && flrCond && friCond && frsCond && mdCond && naCond && sdCond;
	logger.info("Comparing [" + p + "] and [" + cp + "]" + flrCond + ":" + cfCond + ":" + friCond + ":" + frsCond
		+ ":" + mdCond + ":" + naCond + ":" + sdCond + "=>" + rv);
	return rv;
    }

    private boolean equals(BigDecimal o1, BigDecimal o2) {
	int maxScale = Math.max(o1.scale(), o2.scale());
	o1 = o1.setScale(maxScale);
	o2 = o2.setScale(maxScale);
	return o1.equals(o2);
    }

    private boolean equals(Object o1, Object o2) {
	return o1 == null ? (o2 == null ? true : false) : o1.equals(o2);
    }

    private IRSContract createContract(IRSContractProposal proposal) {
	IRSContract rv = new IRSContract();
	rv.setBuyerId(proposal.getBuyerId());
	rv.setContractId(proposal.getContractId());
	rv.setCouponFrequency(proposal.getCouponFrequency());
	rv.setFixedLegRate(proposal.getFixedLegRate());
	rv.setFloatingRateIndex(proposal.getFloatingRateIndex());
	rv.setFloatingRateSpread(proposal.getFloatingRateSpread());
	rv.setMaturityDate(proposal.getMaturityDate());
	rv.setNotionalAmount(proposal.getNotionalAmount());
	rv.setSellerId(proposal.getSellerId());
	rv.setStartDate(proposal.getStartDate());
	setNextPaymentDate(rv);
	return rv;
    }

    private void setNextPaymentDate(IRSContract contract) {
	Calendar c = Calendar.getInstance();
	if (contract.getNextPaymentDate() != null) {
	    c.setTime(contract.getNextPaymentDate());
	} else {
	    c.setTime(contract.getStartDate());
	}
	if ("Monthly".equals(contract.getCouponFrequency())) {
	    c.roll(Calendar.MONTH, 1);
	}
	if (contract.getNextPaymentDate() != null) {
	    contract.setPrevPaymentDate(contract.getNextPaymentDate());
	}
	contract.setNextPaymentDate(c.getTime());
    }

    private void setValues(Map<String, String> params, SimpleDateFormat sdf, IRSContractProposal proposal)
	    throws ParseException {
	proposal.setBuyerId(params.get("buyerId"));
	proposal.setContractId(params.get("contractId"));
	proposal.setCouponFrequency(params.get("couponFreq"));
	proposal.setFixedLegRate(new BigDecimal(params.get("fixedLegRate")));
	proposal.setFloatingRateIndex(params.get("floatingRateIndex"));
	proposal.setFloatingRateSpread(new BigDecimal(params.get("spread")));
	proposal.setMaturityDate(sdf.parse(params.get("maturityDate")));
	proposal.setNotionalAmount(new BigDecimal(params.get("notionalAmount")));
	proposal.setProposedBy(params.get("proposedBy"));
	proposal.setSellerId(params.get("sellerId"));
	proposal.setStartDate(sdf.parse(params.get("startDate")));
	proposal.setStatus(params.get("status"));
    }

    private IRSContractProposal findProposal(ThetaContext ctx, String contractId, String buyerId, String sellerId,
	    String proposedBy) throws SQLException {
	List<IRSContractProposal> tmp = ctx.runPreparedQuery(FIND_PROPOSAL_WITH_PK_SQL, IRSContractProposal.class,
		contractId, buyerId, sellerId, proposedBy);
	return tmp == null || tmp.size() == 0 ? null : tmp.get(0);
    }

    private IRSContract findContract(ThetaContext ctx, String contractId, String buyerId, String sellerId)
	    throws SQLException {
	List<IRSContract> tmp = ctx.runPreparedQuery(FIND_CONTRACT_WITH_PK_SQL, IRSContract.class, contractId, buyerId,
		sellerId);
	return tmp == null || tmp.size() == 0 ? null : tmp.get(0);
    }

    private BigDecimal findInterestRate(ThetaContext ctx, String indexName, String period, Date validForDate) throws SQLException {
	try (PreparedStatement pstmt = ctx.getDBConnection().prepareStatement(FIND_INTEREST_RATE_WITH_PK_SQL)) {
	    pstmt.setString(1, indexName);
	    pstmt.setString(2, period);
	    pstmt.setDate(3, new java.sql.Date(validForDate.getTime()));
	    try (ResultSet rs = pstmt.executeQuery()) {
		if (rs.next()) {
		    return rs.getBigDecimal(1);
		} else {
		    return null;
		}
	    }
	}
    }

}
