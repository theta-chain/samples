CREATE TABLE BLOCKCHAIN.IRS_CONTRACT ( CONTRACT_ID VARCHAR(45) , 
	BUYER_ID VARCHAR(256) , SELLER_ID VARCHAR(256) , FIXED_LEG_RATE DECIMAL(20,6), FLOATING_RATE_INDEX VARCHAR(45) , 
	FLOATING_RATE_SPREAD DECIMAL(20,6) , NOTIONAL_AMOUNT DECIMAL(20,6),  START_DATE DATE , 
	COUPON_FREQUENCY VARCHAR(45) , MATURITY_DATE DATE , PREV_PAYMENT_DATE DATE, NEXT_PAYMENT_DATE DATE,
	PRIMARY KEY (CONTRACT_ID,BUYER_ID,SELLER_ID)) ;
	
	
CREATE TABLE BLOCKCHAIN.IRS_CONTRACT_PROPOSAL ( PROPOSED_BY VARCHAR(256), CONTRACT_ID VARCHAR(45) , 
	BUYER_ID VARCHAR(256) , SELLER_ID VARCHAR(256) , FIXED_LEG_RATE DECIMAL(20,6), 
	FLOATING_RATE_INDEX VARCHAR(45) , FLOATING_RATE_SPREAD DECIMAL(20,6) ,  
	NOTIONAL_AMOUNT DECIMAL(20,6), START_DATE DATE , COUPON_FREQUENCY VARCHAR(45) , 
	MATURITY_DATE DATE ,STATUS VARCHAR(45), 
	PRIMARY KEY (PROPOSED_BY,CONTRACT_ID,BUYER_ID,SELLER_ID)) ;
	

CREATE TABLE BLOCKCHAIN.IRS_CONTRACT_PAYMENT ( PROPOSED_BY VARCHAR(256), CONTRACT_ID VARCHAR(45) , 
	PAYMENT_DUE_DATE DATE, PAYMENT_AMOUNT DECIMAL, PAYMENT_REMITTANCE_DATE DATE, PAYMENT_REFERENCE_ID VARCHAR(256),
	PRIMARY KEY (CONTRACT_ID, PAYMENT_DUE_DATE)) ;

CREATE TABLE BLOCKCHAIN.IRS_INTEREST_RATE ( INDEX_NAME VARCHAR(45), INTEREST_RATE DECIMAL, 
	VALID_FOR_DATE DATE, PRIMARY KEY(INDEX_NAME, VALID_FOR_DATE));
	