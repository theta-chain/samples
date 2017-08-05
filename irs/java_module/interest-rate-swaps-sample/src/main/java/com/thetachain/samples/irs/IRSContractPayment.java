package com.thetachain.samples.irs;

import java.math.BigDecimal;
import java.util.Date;

import com.thetachain.core.annotations.ThetaName;
import com.thetachain.core.annotations.ThetaPrimaryKey;

@ThetaName("IRS_CONTRACT_PAYMENT")
@ThetaPrimaryKey({ "CONTRACT_ID", "PAYMENT_DUE_DATE" })
public class IRSContractPayment {

    @ThetaName("PROPOSED_BY")
    private String proposedBy;

    @ThetaName("CONTRACT_ID")
    private String contractId;

    @ThetaName("PAYMENT_DUE_DATE")
    private Date paymentDueDate;

    @ThetaName("PAYMENT_AMOUNT")
    private BigDecimal paymentAmount;

    @ThetaName("PAYMENT_REMITTANCE_DATE")
    private Date remittanceDate;

    @ThetaName("PAYMENT_REFERENCE_ID")
    private String referenceId;

    public String getProposedBy() {
	return proposedBy;
    }

    public void setProposedBy(String proposedBy) {
	this.proposedBy = proposedBy;
    }

    public String getContractId() {
	return contractId;
    }

    public void setContractId(String contractId) {
	this.contractId = contractId;
    }

    public Date getPaymentDueDate() {
	return paymentDueDate;
    }

    public void setPaymentDueDate(Date paymentDueDate) {
	this.paymentDueDate = paymentDueDate;
    }

    public BigDecimal getPaymentAmount() {
	return paymentAmount;
    }

    public void setPaymentAmount(BigDecimal paymentAmount) {
	this.paymentAmount = paymentAmount;
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

    @Override
    public String toString() {
	return "IRSContractPayment [proposedBy=" + proposedBy + ", contractId=" + contractId + ", paymentDueDate="
		+ paymentDueDate + ", paymentAmount=" + paymentAmount + ", remittanceDate=" + remittanceDate
		+ ", referenceId=" + referenceId + "]";
    }

}
