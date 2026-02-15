import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import type { PatientRecord } from '../context/DataContext';

interface Stats {
  total: number;
  pending: number;
  inReview: number;
  completed: number;
  flagged: number;
  accuracy: string;
  avgCodes: string;
}

export const generatePatientReportPDF = (records: PatientRecord[], stats: Stats) => {
  try {
    if (!records || records.length === 0) {
      alert('No records available to generate PDF');
      return;
    }

    const doc = new jsPDF() as any;

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Patient Coding Report', 14, 22);

    // Add date and summary
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 14, 32);
    doc.text(`Total Records: ${stats?.total || 0}`, 14, 40);
    doc.text(`Pending: ${stats?.pending || 0} | In Review: ${stats?.inReview || 0} | Completed: ${stats?.completed || 0}`, 14, 47);
    doc.text(`Accuracy Score: ${stats?.accuracy || '0'}% | Avg Codes/Record: ${stats?.avgCodes || '0'}`, 14, 54);

    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(14, 58, 196, 58);

    // Prepare table data
    const tableData = records.map((record) => {
      const confidenceSum = record.codes?.reduce((sum, c) => sum + (c?.confidence || 0), 0) || 0;
      const codeCount = record.codes?.length || 0;
      const avgConfidence = codeCount > 0 ? Math.round((confidenceSum / codeCount) * 100) : 0;

      return [
        record.patientName || '',
        record.mrn || '',
        format(new Date(record.dateOfService), 'MMM d, yyyy'),
        record.department || '',
        record.status || '',
        codeCount.toString(),
        `${avgConfidence}%`
      ];
    });

    // Add table
    doc.autoTable({
      startY: 65,
      head: [['Patient Name', 'MRN', 'Date of Service', 'Department', 'Status', 'Codes', 'Confidence']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [20, 184, 166], // Teal color to match theme
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249],
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25 },
        2: { cellWidth: 28 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 },
        5: { cellWidth: 15 },
        6: { cellWidth: 22 },
      },
    });

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    doc.save(`patient-coding-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
