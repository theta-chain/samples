export class Offer {
  counterParty: string;
  proposedBy: string;
  contractId: string;
  buyerId: string;
  sellerId: string;
  fixedLegRate: string;
  floatingRateIndex: string;
  spread: string;
  notionalAmount: string;
  startDate: Date;
  maturityDate: Date;
  couponFreq: string;
  status: string;
}


export class Contract {
  counterParty: string;
  contractId: string;
  buyerId: string;
  sellerId: string;
  fixedLegRate: string;
  floatingRateIndex: string;
  spread: string;
  notionalAmount: number;
  startDate: Date;
  maturityDate: Date;
  couponFreq: string;
  nextPaymentDueDate: Date;
}

export class InterestRate {
  indexName: string;
  period: string;
  interestRate: number;
  validForDate: Date;
}

