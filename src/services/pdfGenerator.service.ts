import jsPDF from "jspdf";
import { InvoiceTemplate } from "./template.service";

export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes?: string;
}

export class PDFGeneratorService {
  /**
   * Generate a PDF invoice based on template and data
   */
  static generateInvoicePDF(
    template: InvoiceTemplate,
    data: InvoiceData
  ): jsPDF {
    // Create PDF with A4 paper size (210 x 297 mm)
    // A4 dimensions: 210mm width x 297mm height
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 15; // 15mm margins for A4
    const contentWidth = pageWidth - margin * 2; // 180mm content width

    // Set up colors based on template
    const colors = this.getTemplateColors(template.id);

    // Add header
    this.addHeader(doc, template, data, colors, pageWidth, margin);

    // Add company and client info
    this.addCompanyClientInfo(doc, data, colors, pageWidth, margin);

    // Add line items table
    this.addLineItemsTable(doc, data, colors, pageWidth, margin);

    // Add totals
    this.addTotals(doc, data, colors, pageWidth, margin);

    // Add notes and thank you
    this.addNotesAndThankYou(
      doc,
      template,
      data,
      colors,
      pageWidth,
      margin,
      pageHeight
    );

    return doc;
  }

  /**
   * Get template-specific colors
   */
  private static getTemplateColors(templateId: string) {
    switch (templateId) {
      case "classic":
        return {
          primary: "#000000",
          secondary: "#666666",
          accent: "#000000",
          background: "#ffffff",
        };
      case "modern":
        return {
          primary: "#2563eb",
          secondary: "#1e40af",
          accent: "#3b82f6",
          background: "#f8fafc",
        };
      case "minimal":
        return {
          primary: "#374151",
          secondary: "#6b7280",
          accent: "#9ca3af",
          background: "#ffffff",
        };
      case "corporate":
        return {
          primary: "#1f2937",
          secondary: "#4b5563",
          accent: "#6b7280",
          background: "#f9fafb",
        };
      case "creative":
        return {
          primary: "#7c3aed",
          secondary: "#a855f7",
          accent: "#c084fc",
          background: "#faf5ff",
        };
      default:
        return {
          primary: "#000000",
          secondary: "#666666",
          accent: "#000000",
          background: "#ffffff",
        };
    }
  }

  /**
   * Add header section
   */
  private static addHeader(
    doc: jsPDF,
    template: InvoiceTemplate,
    data: InvoiceData,
    colors: any,
    pageWidth: number,
    margin: number
  ) {
    const y = margin + 8;

    // Template-specific header styling (optimized for A4)
    switch (template.id) {
      case "classic":
        doc.setFontSize(22);
        doc.setTextColor(colors.primary);
        doc.text("INVOICE", margin, y);
        doc.setFontSize(11);
        doc.setTextColor(colors.secondary);
        doc.text(`#${data.invoiceNumber}`, margin, y + 7);
        break;

      case "modern":
        // Blue header background
        doc.setFillColor(colors.primary);
        doc.rect(margin, y - 4, pageWidth - margin * 2, 12, "F");
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text("INVOICE", margin + 4, y + 4);
        doc.setFontSize(11);
        doc.text(`#${data.invoiceNumber}`, margin + 4, y + 10);
        break;

      case "minimal":
        doc.setFontSize(16);
        doc.setTextColor(colors.primary);
        doc.text("Invoice", pageWidth / 2, y, { align: "center" });
        doc.setFontSize(11);
        doc.setTextColor(colors.secondary);
        doc.text(`#${data.invoiceNumber}`, pageWidth / 2, y + 7, {
          align: "center",
        });
        break;

      case "corporate":
        doc.setFontSize(14);
        doc.setTextColor(colors.primary);
        doc.text("INVOICE", margin, y);
        doc.setFontSize(11);
        doc.setTextColor(colors.secondary);
        doc.text(`Invoice #: ${data.invoiceNumber}`, margin, y + 7);
        break;

      case "creative":
        doc.setFontSize(18);
        doc.setTextColor(colors.primary);
        doc.text("✨ INVOICE ✨", pageWidth / 2, y, { align: "center" });
        doc.setFontSize(11);
        doc.setTextColor(colors.secondary);
        doc.text(`#${data.invoiceNumber}`, pageWidth / 2, y + 7, {
          align: "center",
        });
        break;
    }
  }

  /**
   * Add company and client information
   */
  private static addCompanyClientInfo(
    doc: jsPDF,
    data: InvoiceData,
    colors: any,
    pageWidth: number,
    margin: number
  ) {
    const y = margin + 30;

    // Company info (left side) - optimized for A4
    doc.setFontSize(11);
    doc.setTextColor(colors.primary);
    doc.text(data.companyName, margin, y);

    doc.setFontSize(9);
    doc.setTextColor(colors.secondary);
    doc.text(data.companyAddress, margin, y + 5);
    doc.text(data.companyEmail, margin, y + 10);
    doc.text(data.companyPhone, margin, y + 15);

    // Client info (right side) - optimized for A4
    const clientX = pageWidth - margin - 70; // Adjusted for A4 width
    doc.setFontSize(11);
    doc.setTextColor(colors.primary);
    doc.text("Bill To:", clientX, y);
    doc.text(data.clientName, clientX, y + 5);

    doc.setFontSize(9);
    doc.setTextColor(colors.secondary);
    doc.text(data.clientAddress, clientX, y + 10);
    doc.text(data.clientEmail, clientX, y + 15);
  }

  /**
   * Add line items table
   */
  private static addLineItemsTable(
    doc: jsPDF,
    data: InvoiceData,
    colors: any,
    pageWidth: number,
    margin: number
  ) {
    const y = margin + 65;
    const tableWidth = pageWidth - margin * 2;
    const colWidths = [
      tableWidth * 0.4,
      tableWidth * 0.15,
      tableWidth * 0.2,
      tableWidth * 0.25,
    ];

    // Table header - optimized for A4
    doc.setFillColor(colors.background);
    doc.rect(margin, y - 4, tableWidth, 8, "F");

    doc.setFontSize(9);
    doc.setTextColor(colors.primary);
    doc.text("Description", margin + 2, y + 1);
    doc.text("Qty", margin + colWidths[0] + 2, y + 1);
    doc.text("Rate", margin + colWidths[0] + colWidths[1] + 2, y + 1);
    doc.text(
      "Amount",
      margin + colWidths[0] + colWidths[1] + colWidths[2] + 2,
      y + 1
    );

    // Table rows
    let currentY = y + 12;
    data.lineItems.forEach((item, index) => {
      if (currentY > 200) {
        // A4 page break at 200mm
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(8);
      doc.setTextColor(colors.secondary);
      doc.text(item.description, margin + 2, currentY);
      doc.text(item.quantity.toString(), margin + colWidths[0] + 2, currentY, {
        align: "center",
      });
      doc.text(
        `$${item.rate.toFixed(2)}`,
        margin + colWidths[0] + colWidths[1] + 2,
        currentY,
        { align: "right" }
      );
      doc.text(
        `$${item.amount.toFixed(2)}`,
        margin + colWidths[0] + colWidths[1] + colWidths[2] + 2,
        currentY,
        { align: "right" }
      );

      currentY += 6; // Reduced spacing for A4
    });
  }

  /**
   * Add totals section
   */
  private static addTotals(
    doc: jsPDF,
    data: InvoiceData,
    colors: any,
    pageWidth: number,
    margin: number
  ) {
    const totalsX = pageWidth - margin - 70; // Adjusted for A4
    const totalsY = margin + 100; // Adjusted for A4

    doc.setFontSize(9);
    doc.setTextColor(colors.secondary);
    doc.text("Subtotal:", totalsX, totalsY);
    doc.text(`$${data.subtotal.toFixed(2)}`, totalsX + 50, totalsY, {
      align: "right",
    });

    doc.text(`VAT (${data.vatRate}%):`, totalsX, totalsY + 6);
    doc.text(`$${data.vatAmount.toFixed(2)}`, totalsX + 50, totalsY + 6, {
      align: "right",
    });

    // Total line
    doc.setLineWidth(0.5);
    doc.setDrawColor(colors.accent);
    doc.line(totalsX, totalsY + 10, totalsX + 50, totalsY + 10);

    doc.setFontSize(11);
    doc.setTextColor(colors.primary);
    doc.text("Total:", totalsX, totalsY + 16);
    doc.text(`$${data.total.toFixed(2)}`, totalsX + 50, totalsY + 16, {
      align: "right",
    });
  }

  /**
   * Add notes and thank you message
   */
  private static addNotesAndThankYou(
    doc: jsPDF,
    template: InvoiceTemplate,
    data: InvoiceData,
    colors: any,
    pageWidth: number,
    margin: number,
    pageHeight: number
  ) {
    const y = pageHeight - 35; // Adjusted for A4

    // Payment terms - optimized for A4
    doc.setFontSize(8);
    doc.setTextColor(colors.secondary);
    doc.text("Payment Terms:", margin, y);
    doc.text(`Due Date: ${data.dueDate}`, margin, y + 5);
    doc.text("Payment methods: Bank Transfer, Credit Card", margin, y + 10);

    // Thank you message
    const thankYouMessages = {
      classic: "Thank you for your business!",
      modern: "Thank you for choosing us!",
      minimal: "Thank you!",
      corporate: "Thank you for your continued partnership.",
      creative: "✨ Thank you for your creativity! ✨",
    };

    doc.setFontSize(9);
    doc.setTextColor(colors.primary);
    doc.text(
      thankYouMessages[template.id as keyof typeof thankYouMessages] ||
        "Thank you!",
      pageWidth / 2,
      y + 18,
      { align: "center" }
    );
  }

  /**
   * Generate sample invoice data for preview
   */
  static generateSampleData(templateId: string): InvoiceData {
    const baseData = {
      companyName: "Your Company",
      companyAddress: "123 Business Street, City, State 12345",
      companyEmail: "billing@yourcompany.com",
      companyPhone: "+1 (555) 123-4567",
      clientName: "Client Name",
      clientAddress: "456 Client Avenue, City, State 67890",
      clientEmail: "client@example.com",
      invoiceNumber: "INV-001",
      invoiceDate: new Date().toLocaleDateString(),
      dueDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      lineItems: [
        {
          description: "Web Development",
          quantity: 1,
          rate: 1000,
          amount: 1000,
        },
        { description: "Design Services", quantity: 1, rate: 500, amount: 500 },
      ],
      subtotal: 1500,
      vatRate: 20,
      vatAmount: 300,
      total: 1800,
      notes: "Please pay within 30 days of invoice date.",
    };

    // Template-specific adjustments
    switch (templateId) {
      case "modern":
        return {
          ...baseData,
          lineItems: [
            { description: "Consulting", quantity: 2, rate: 750, amount: 1500 },
            {
              description: "Implementation",
              quantity: 1,
              rate: 800,
              amount: 800,
            },
          ],
          subtotal: 2300,
          vatRate: 15,
          vatAmount: 345,
          total: 2645,
        };
      case "minimal":
        return {
          ...baseData,
          lineItems: [
            { description: "Design Work", quantity: 1, rate: 800, amount: 800 },
            {
              description: "Development",
              quantity: 1,
              rate: 1200,
              amount: 1200,
            },
            { description: "Testing", quantity: 1, rate: 300, amount: 300 },
          ],
          subtotal: 2300,
          vatRate: 10,
          vatAmount: 230,
          total: 2530,
        };
      case "corporate":
        return {
          ...baseData,
          companyName: "Your Company Ltd.",
          lineItems: [
            {
              description: "Software License",
              quantity: 5,
              rate: 200,
              amount: 1000,
            },
            {
              description: "Support Package",
              quantity: 1,
              rate: 500,
              amount: 500,
            },
            { description: "Training", quantity: 2, rate: 300, amount: 600 },
          ],
          subtotal: 2100,
          vatRate: 18,
          vatAmount: 378,
          total: 2478,
        };
      case "creative":
        return {
          ...baseData,
          companyName: "Your Creative Studio",
          lineItems: [
            { description: "Logo Design", quantity: 8, rate: 75, amount: 600 },
            {
              description: "Brand Identity",
              quantity: 12,
              rate: 85,
              amount: 1020,
            },
            { description: "Mockups", quantity: 6, rate: 60, amount: 360 },
          ],
          subtotal: 1980,
          vatRate: 12,
          vatAmount: 237.6,
          total: 2217.6,
        };
      default:
        return baseData;
    }
  }
}
