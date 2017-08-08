package com.thetachain.samples.irs;

import java.math.BigDecimal;
import java.util.Date;

import com.thetachain.core.annotations.ThetaName;
import com.thetachain.core.annotations.ThetaPrimaryKey;

@ThetaName("IRS_CONTRACT_FLOWS")
@ThetaPrimaryKey({ "CONTRACT_ID", "BUYER_ID", "SELLER_ID", "PAYMENT_DUE_DATE" })
public class IRSContractFlow {

    @ThetaName("CONTRACT_ID")
    private String contractId;

    @ThetaName("BUYER_ID")
    private String buyerId;

    @ThetaName("SELLER_ID")
    private String sellerId;

    @ThetaName("FIXED_LEG_AMOUNT")
    private BigDecimal fixedLegAmount;

    @ThetaName("FLOAT_LEG_AMOUNT")
    private BigDecimal floatLegAmount;

    @ThetaName("NET_AMOUNT")
    private BigDecimal netPayment;

    @ThetaName("PAYMENT_DUE_DATE")
    private Date paymentDueDate;

    @ThetaName("PAYMENT_REMITTANCE_DATE")
    private Date remittanceDate;

    @ThetaName("PAYMENT_REFERENCE_ID")
    private String referenceId;

    public String getContractId() {
	return contractId;
    }

    public void setContractId(String contractId) {
	this.contractId = contractId;
    }

    public String getBuyerId() {
	return buyerId;
    }

    public void setBuyerId(String buyerId) {
	this.buyerId = buyerId;
    }

    public String getSellerId() {
	return sellerId;
    }

    public void setSellerId(String sellerId) {
	this.sellerId = sellerId;
    }

    public BigDecimal getFixedLegAmount() {
	return fixedLegAmount;
    }

    public void setFixedLegAmount(BigDecimal fixedLegAmount) {
	this.fixedLegAmount = fixedLegAmount;
    }

    public BigDecimal getFloatLegAmount() {
	return floatLegAmount;
    }

    public void setFloatLegAmount(BigDecimal floatLegAmount) {
	this.floatLegAmount = floatLegAmount;
    }

    public BigDecimal getNetPayment() {
	return netPayment;
    }

    public void setNetPayment(BigDecimal netPayment) {
	this.netPayment = netPayment;
    }

    public Date getPaymentDueDate() {
	return paymentDueDate;
    }

    public void setPaymentDueDate(Date paymentDueDate) {
	this.paymentDueDate = paymentDueDate;
    }

    public Date getRemittanceDate() {
	return remittanceDate;
    }

    public void setRemittanceDate(Date remittanceDate) {
	this.remittanceDate = remittanceDate;
    }

    public String getReferenceId() {
	return referenceId;
    }

    public void setReferenceId(String referenceId) {
	this.referenceId = referenceId;
    }

}
