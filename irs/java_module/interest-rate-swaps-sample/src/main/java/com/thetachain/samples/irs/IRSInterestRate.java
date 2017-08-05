package com.thetachain.samples.irs;

import java.math.BigDecimal;
import java.util.Date;

import com.thetachain.core.annotations.ThetaName;
import com.thetachain.core.annotations.ThetaPrimaryKey;

@ThetaName("IRS_INTEREST_RATE")
@ThetaPrimaryKey({ "INDEX_NAME", "VALID_FOR_DATE" })
public class IRSInterestRate {

    @ThetaName("INDEX_NAME")
    String indexName;

    @ThetaName("INTEREST_RATE")
    BigDecimal interestRate;

    @ThetaName("VALID_FOR_DATE")
    Date validForDate;

    public String getIndexName() {
	return indexName;
    }

    public void setIndexName(String indexName) {
	this.indexName = indexName;
    }

    public BigDecimal getInterestRate() {
	return interestRate;
    }

    public void setInterestRate(BigDecimal interestRate) {
	this.interestRate = interestRate;
    }

    public Date getValidForDate() {
	return validForDate;
    }

    public void setValidForDate(Date validForDate) {
	this.validForDate = validForDate;
    }

    @Override
    public String toString() {
	return "IRSInterestRate [indexName=" + indexName + ", interestRate=" + interestRate + ", validForDate="
		+ validForDate + "]";
    }

}
