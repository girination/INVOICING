import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoiceData } from '@/types/invoice';

export const generatePDF = async (invoiceElement: HTMLElement, invoiceData: InvoiceData): Promise<void> => {
  try {
    // Create canvas from the invoice element
    const canvas = await html2canvas(invoiceElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: invoiceElement.offsetWidth,
      height: invoiceElement.offsetHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit the content
    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // If content is too tall, scale it down
    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    
    if (imgHeight > pdfHeight - 20) {
      finalHeight = pdfHeight - 20; // 10mm margin on top and bottom
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }
    
    // Center the image
    const xOffset = (pdfWidth - finalWidth) / 2;
    const yOffset = (pdfHeight - finalHeight) / 2;
    
    // Add the image to PDF
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
    
    // Generate filename
    const filename = `invoice-${invoiceData.invoiceNumber || 'draft'}-${new Date().getTime()}.pdf`;
    
    // Download the PDF
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export const generatePDFBuffer = async (invoiceElement: HTMLElement): Promise<Uint8Array> => {
  try {
    const canvas = await html2canvas(invoiceElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    
    if (imgHeight > pdfHeight - 20) {
      finalHeight = pdfHeight - 20;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
    }
    
    const xOffset = (pdfWidth - finalWidth) / 2;
    const yOffset = (pdfHeight - finalHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
    
    const arrayBuffer = pdf.output('arraybuffer');
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error generating PDF buffer:', error);
    throw new Error('Failed to generate PDF buffer.');
  }
};