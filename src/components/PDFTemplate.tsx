import React, { forwardRef } from "react";
import { InvoiceData } from "@/types/invoice";

interface PDFTemplateProps {
  invoiceData: InvoiceData;
  children: React.ReactNode;
}

export const PDFTemplate = forwardRef<HTMLDivElement, PDFTemplateProps>(
  ({ invoiceData, children }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full min-h-screen bg-white"
        style={{
          width: "210mm",
          minHeight: "297mm",
          maxWidth: "none",
          margin: "0",
          padding: "10mm",
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          lineHeight: "1.4",
          color: "#333",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    );
  }
);

PDFTemplate.displayName = "PDFTemplate";
