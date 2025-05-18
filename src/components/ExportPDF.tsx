import React from 'react';
import { FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useDebtStore } from '../store/debtStore';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../utils/formatters';

const ExportPDF: React.FC = () => {
  const { debtItems, workSessions, getSummary } = useDebtStore();
  
  const handleExport = () => {
    const doc = new jsPDF();
    const summary = getSummary();
    
    // Set font size and style
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Debt Tracker Report', 105, 20, { align: 'center' });
    
    // Date of report
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 105, 27, { align: 'center' });
    
    // Summary section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Financial Summary', 20, 40);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Total Debt: ${formatCurrency(summary.totalDebt)}`, 25, 50);
    doc.text(`Total Paid: ${formatCurrency(summary.totalPaid)}`, 25, 58);
    doc.text(`Remaining Balance: ${formatCurrency(summary.remainingBalance)}`, 25, 66);
    
    // Calculate payment percentage
    const percentagePaid = summary.totalDebt > 0 
      ? (summary.totalPaid / summary.totalDebt) * 100 
      : 0;
    doc.text(`Repayment Progress: ${percentagePaid.toFixed(1)}%`, 25, 74);
    
    // Debt Items section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Debt Items', 20, 90);
    
    if (debtItems.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('No debt items recorded.', 25, 100);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Date', 25, 100);
      doc.text('Description', 65, 100);
      doc.text('Amount', 165, 100, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      let yPos = 110;
      
      // Sort debt items by date (most recent first)
      [...debtItems]
        .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
        .forEach((item, index) => {
          // Add a new page if we're running out of space
          if (yPos > 270) {
            doc.addPage();
            yPos = 30;
            
            // Add headers on the new page
            doc.setFont('helvetica', 'bold');
            doc.text('Date', 25, 20);
            doc.text('Description', 65, 20);
            doc.text('Amount', 165, 20, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            yPos = 30;
          }
          
          // Alternate row colors for readability
          if (index % 2 === 0) {
            doc.setFillColor(245, 247, 250);
            doc.rect(20, yPos - 5, 170, 10, 'F');
          }
          
          doc.text(format(parseISO(item.date), 'MM/dd/yyyy'), 25, yPos);
          
          // Handle long descriptions by truncating
          const maxDescLength = 50;
          const description = item.description.length > maxDescLength
            ? item.description.substring(0, maxDescLength) + '...'
            : item.description;
          doc.text(description, 65, yPos);
          
          doc.text(formatCurrency(item.amount), 165, yPos, { align: 'right' });
          yPos += 10;
        });
      
      yPos += 10; // Add some space after the table
      
      // Check if we need to add a new page for the work sessions
      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      } else {
        yPos += 10;
      }
    }
    
    // Work Sessions section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const workSessionsYPos = debtItems.length === 0 ? 110 : yPos;
    doc.text('Work Sessions', 20, workSessionsYPos);
    
    if (workSessions.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('No work sessions recorded.', 25, workSessionsYPos + 10);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Date', 25, workSessionsYPos + 10);
      doc.text('Hours', 65, workSessionsYPos + 10);
      doc.text('% Applied', 95, workSessionsYPos + 10);
      doc.text('Amount Applied', 165, workSessionsYPos + 10, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      let yPos = workSessionsYPos + 20;
      
      // Sort work sessions by date (most recent first)
      [...workSessions]
        .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
        .forEach((session, index) => {
          // Add a new page if we're running out of space
          if (yPos > 270) {
            doc.addPage();
            yPos = 30;
            
            // Add headers on the new page
            doc.setFont('helvetica', 'bold');
            doc.text('Date', 25, 20);
            doc.text('Hours', 65, 20);
            doc.text('% Applied', 95, 20);
            doc.text('Amount Applied', 165, 20, { align: 'right' });
            doc.setFont('helvetica', 'normal');
            yPos = 30;
          }
          
          // Alternate row colors for readability
          if (index % 2 === 0) {
            doc.setFillColor(245, 247, 250);
            doc.rect(20, yPos - 5, 170, 10, 'F');
          }
          
          doc.text(format(parseISO(session.date), 'MM/dd/yyyy'), 25, yPos);
          doc.text(session.hours.toString(), 65, yPos);
          doc.text(session.fullPayment ? '100%' : '35%', 95, yPos);
          doc.text(formatCurrency(session.amountApplied), 165, yPos, { align: 'right' });
          yPos += 10;
        });
    }
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`, 
        105, 
        285, 
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save('debt-tracker-report.pdf');
  };
  
  return (
    <button 
      onClick={handleExport}
      className="btn-accent flex items-center justify-center space-x-2 w-full sm:w-auto"
    >
      <FileText size={16} />
      <span>Export PDF Report</span>
    </button>
  );
};

export default ExportPDF;