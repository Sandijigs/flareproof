import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Proof } from '@/types/proof'
import { formatDate, formatAddress, formatAmount } from './utils'

/**
 * Generate a professional PDF proof document
 * @param proof - The proof object to generate PDF from
 * @returns jsPDF instance
 */
export function generateProofPDF(proof: Proof): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // ===== HEADER =====
  doc.setFillColor(59, 130, 246) // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('FlareProof', 20, 25)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('ISO 20022 Compliant Payment Proof', pageWidth - 20, 25, {
    align: 'right',
  })

  // ===== VERIFICATION BADGE =====
  const badgeY = 50
  doc.setFillColor(16, 185, 129) // Success green
  doc.roundedRect(20, badgeY, 50, 20, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('✓ VERIFIED', 45, badgeY + 12, { align: 'center' })

  // ===== PROOF ID =====
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`Proof ID: ${proof.id}`, 80, badgeY + 12)

  // ===== PROOF DETAILS SECTION =====
  let currentY = badgeY + 35
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Proof Details', 20, currentY)

  autoTable(doc, {
    startY: currentY + 5,
    head: [],
    body: [
      ['Created', formatDate(proof.createdAt)],
      ['Status', proof.status.toUpperCase()],
      ['Proof Hash', formatAddress(proof.hash, 16)],
      [
        'Anchor Transaction',
        proof.anchorTx ? formatAddress(proof.anchorTx, 16) : 'Pending',
      ],
      ['Block Number', proof.anchorBlock ? proof.anchorBlock.toString() : 'Pending'],
      [
        'Creator Address',
        proof.creator ? formatAddress(proof.creator, 16) : 'Unknown',
      ],
    ],
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 120, font: 'courier' },
    },
  })

  // ===== TRANSACTIONS SECTION =====
  currentY = (doc as any).lastAutoTable.finalY + 20

  // Check if we need a new page
  if (currentY > pageHeight - 100) {
    doc.addPage()
    currentY = 20
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Transactions', 20, currentY)

  autoTable(doc, {
    startY: currentY + 5,
    head: [['Type', 'Amount (FLR)', 'To/From', 'Date', 'Status']],
    body: proof.transactions.map((tx) => [
      tx.type.toUpperCase(),
      formatAmount(tx.valueFormatted),
      formatAddress(tx.type === 'send' ? tx.to : tx.from, 8),
      formatDate(tx.timestamp),
      tx.status.toUpperCase(),
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 30, halign: 'right', font: 'courier' },
      2: { cellWidth: 40, font: 'courier' },
      3: { cellWidth: 45 },
      4: { cellWidth: 25 },
    },
  })

  // ===== ISO 20022 INFORMATION =====
  currentY = (doc as any).lastAutoTable.finalY + 20

  // Check if we need a new page
  if (currentY > pageHeight - 80) {
    doc.addPage()
    currentY = 20
  }

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('ISO 20022 Message Information', 20, currentY)

  autoTable(doc, {
    startY: currentY + 5,
    head: [],
    body: [
      ['Message Type', 'pacs.008.001.08 (Customer Credit Transfer)'],
      ['Message ID', proof.iso20022.messageId],
      ['Creation Date/Time', proof.iso20022.creationDateTime],
      ['Number of Transactions', proof.iso20022.numberOfTransactions.toString()],
      ['Control Sum', `${proof.iso20022.controlSum} FLR`],
      ['Initiating Party', proof.iso20022.initiatingParty.name],
    ],
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  })

  // ===== QR CODE SECTION =====
  currentY = (doc as any).lastAutoTable.finalY + 20

  if (currentY > pageHeight - 60) {
    doc.addPage()
    currentY = 20
  }

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(
    'Scan QR code or visit the URL below to verify this proof online:',
    20,
    currentY
  )

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://flareproof.xyz'}/proof/${proof.id}`
  doc.setFont('courier', 'normal')
  doc.setFontSize(9)
  doc.text(verifyUrl, 20, currentY + 7)

  // ===== FOOTER =====
  const footerY = pageHeight - 20
  doc.setDrawColor(200, 200, 200)
  doc.line(20, footerY - 10, pageWidth - 20, footerY - 10)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(128, 128, 128)
  doc.text(
    `This proof is anchored on Flare Network and can be verified at: ${verifyUrl}`,
    pageWidth / 2,
    footerY - 5,
    { align: 'center' }
  )

  doc.text('Generated by FlareProof', pageWidth / 2, footerY, { align: 'center' })

  return doc
}

/**
 * Generate and download PDF proof
 * Alias for downloadProofPDF for consistency with component usage
 */
export async function generatePDF(proof: Proof) {
  return downloadProofPDF(proof)
}

/**
 * Download proof as PDF file
 * @param proof - The proof to download
 */
export function downloadProofPDF(proof: Proof) {
  const doc = generateProofPDF(proof)
  doc.save(`FlareProof-${proof.id}.pdf`)
}

/**
 * Download proof as XML file
 * @param proof - The proof to download
 */
export function downloadProofXML(proof: Proof) {
  const blob = new Blob([proof.xmlContent], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `FlareProof-${proof.id}.xml`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Download proof as JSON file
 * @param proof - The proof to download
 */
export function downloadProofJSON(proof: Proof) {
  const json = JSON.stringify(proof, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `FlareProof-${proof.id}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
