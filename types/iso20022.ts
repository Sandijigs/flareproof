/**
 * ISO 20022 message type definitions
 * Based on pacs.008.001.08 (Financial Institution to Financial Institution Customer Credit Transfer)
 */

export interface ISO20022Message {
  messageId: string
  creationDateTime: string
  numberOfTransactions: number
  controlSum: string
  initiatingParty: Party
  paymentInformation: PaymentInfo[]
}

export interface PaymentInfo {
  paymentInfoId: string
  paymentMethod: 'TRF' // Transfer
  numberOfTransactions: number
  controlSum: string
  requestedExecutionDate: string
  debtor: Party
  debtorAccount: Account
  debtorAgent: Agent
  creditTransferTransaction: CreditTransfer[]
}

export interface CreditTransfer {
  paymentId: {
    instructionId: string
    endToEndId: string
  }
  amount: {
    instructedAmount: string
    currency: string
  }
  creditor: Party
  creditorAccount: Account
  creditorAgent: Agent
  remittanceInfo?: {
    unstructured: string
  }
}

export interface Party {
  name: string
  id?: string
  postalAddress?: {
    country: string
    addressLine?: string[]
  }
}

export interface Account {
  id: {
    iban?: string
    other?: {
      id: string
      schemeName: string
    }
  }
  currency?: string
}

export interface Agent {
  financialInstitutionId: {
    bic?: string
    name?: string
    other?: {
      id: string
      schemeName: string
    }
  }
}
