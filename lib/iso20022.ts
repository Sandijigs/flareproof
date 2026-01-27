import { Transaction } from '@/types/transaction'
import { generateProofId } from './utils'
import type { ISO20022Message, CreditTransfer } from '@/types/iso20022'
import { PAYMENT_METHODS, SCHEME_NAMES } from './constants'

/**
 * Generate ISO 20022 pacs.008 message from Flare transactions
 * @param transactions - Array of transactions to include in the proof
 * @param senderName - Optional name of the sender (defaults to generic name)
 * @returns ISO20022Message object
 */
export function generatePacs008(
  transactions: Transaction[],
  senderName: string = 'Flare Network User'
): ISO20022Message {
  const messageId = generateProofId()
  const now = new Date().toISOString()

  // Calculate total amount across all transactions
  const totalAmount = transactions.reduce(
    (sum, tx) => sum + parseFloat(tx.valueFormatted),
    0
  )

  // Map each transaction to a credit transfer record
  const creditTransfers: CreditTransfer[] = transactions.map((tx, index) => ({
    paymentId: {
      instructionId: `${messageId}-${index + 1}`,
      endToEndId: tx.hash.slice(0, 35), // ISO 20022 max 35 chars
    },
    amount: {
      instructedAmount: tx.valueFormatted,
      currency: 'FLR', // Flare native token
    },
    creditor: {
      name: 'Recipient',
      id: tx.to,
    },
    creditorAccount: {
      id: {
        other: {
          id: tx.to,
          schemeName: SCHEME_NAMES.FLARE_ADDRESS,
        },
      },
    },
    creditorAgent: {
      financialInstitutionId: {
        name: 'Flare Network',
        other: {
          id: 'FLARE',
          schemeName: SCHEME_NAMES.BLOCKCHAIN_NETWORK,
        },
      },
    },
    remittanceInfo: {
      unstructured: `Blockchain Transaction: ${tx.hash}`,
    },
  }))

  return {
    messageId,
    creationDateTime: now,
    numberOfTransactions: transactions.length,
    controlSum: totalAmount.toFixed(18),
    initiatingParty: {
      name: senderName,
      id: transactions[0]?.from || '',
    },
    paymentInformation: [
      {
        paymentInfoId: `${messageId}-PMT`,
        paymentMethod: PAYMENT_METHODS.TRANSFER,
        numberOfTransactions: transactions.length,
        controlSum: totalAmount.toFixed(18),
        requestedExecutionDate: transactions[0]
          ? new Date(transactions[0].timestamp).toISOString().split('T')[0]
          : now.split('T')[0],
        debtor: {
          name: senderName,
          id: transactions[0]?.from,
        },
        debtorAccount: {
          id: {
            other: {
              id: transactions[0]?.from || '',
              schemeName: SCHEME_NAMES.FLARE_ADDRESS,
            },
          },
        },
        debtorAgent: {
          financialInstitutionId: {
            name: 'Flare Network',
            other: {
              id: 'FLARE',
              schemeName: SCHEME_NAMES.BLOCKCHAIN_NETWORK,
            },
          },
        },
        creditTransferTransaction: creditTransfers,
      },
    ],
  }
}

/**
 * Generate XML representation of ISO 20022 message
 * @param message - ISO20022Message object
 * @returns XML string
 */
export function generateXML(message: ISO20022Message): string {
  const creditTransferXML = message.paymentInformation[0].creditTransferTransaction
    .map(
      (ct) => `
      <CdtTrfTxInf>
        <PmtId>
          <InstrId>${escapeXml(ct.paymentId.instructionId)}</InstrId>
          <EndToEndId>${escapeXml(ct.paymentId.endToEndId)}</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="${escapeXml(ct.amount.currency)}">${ct.amount.instructedAmount}</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>${escapeXml(ct.creditor.name)}</Nm>
          <Id>${escapeXml(ct.creditor.id || '')}</Id>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <Othr>
              <Id>${escapeXml(ct.creditorAccount.id.other?.id || '')}</Id>
              <SchmeNm>${escapeXml(ct.creditorAccount.id.other?.schemeName || '')}</SchmeNm>
            </Othr>
          </Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>${escapeXml(ct.remittanceInfo?.unstructured || '')}</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>${escapeXml(message.messageId)}</MsgId>
      <CreDtTm>${message.creationDateTime}</CreDtTm>
      <NbOfTxs>${message.numberOfTransactions}</NbOfTxs>
      <CtrlSum>${message.controlSum}</CtrlSum>
      <InitgPty>
        <Nm>${escapeXml(message.initiatingParty.name)}</Nm>
        <Id>${escapeXml(message.initiatingParty.id || '')}</Id>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>${escapeXml(message.paymentInformation[0].paymentInfoId)}</PmtInfId>
      <PmtMtd>${message.paymentInformation[0].paymentMethod}</PmtMtd>
      <NbOfTxs>${message.paymentInformation[0].numberOfTransactions}</NbOfTxs>
      <CtrlSum>${message.paymentInformation[0].controlSum}</CtrlSum>
      <ReqdExctnDt>${message.paymentInformation[0].requestedExecutionDate}</ReqdExctnDt>
      <Dbtr>
        <Nm>${escapeXml(message.paymentInformation[0].debtor.name)}</Nm>
        <Id>${escapeXml(message.paymentInformation[0].debtor.id || '')}</Id>
      </Dbtr>
      <DbtrAcct>
        <Id>
          <Othr>
            <Id>${escapeXml(message.paymentInformation[0].debtorAccount.id.other?.id || '')}</Id>
            <SchmeNm>${escapeXml(message.paymentInformation[0].debtorAccount.id.other?.schemeName || '')}</SchmeNm>
          </Othr>
        </Id>
      </DbtrAcct>
      ${creditTransferXML}
    </PmtInf>
  </FIToFICstmrCdtTrf>
</Document>`
}

/**
 * Escape special XML characters
 * @param str - String to escape
 * @returns Escaped string
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
