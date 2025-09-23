import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Eye, EyeOff, Palette } from "lucide-react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { TemplateSelector } from "@/components/TemplateSelector";
import { InvoiceData, currencies } from "@/types/invoice";
import { InvoiceTemplate } from "@/types/templates";
import { generatePDF } from "@/utils/pdfGenerator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const CreateInvoice = () => {
  const [showPreview, setShowPreview] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>(
    InvoiceTemplate.MODERN
  );
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  // Get user and profile data
  const { user } = useAuth();
  const { profile, profileLoading, refreshProfile } = useProfile(
    user?.id || null
  );

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "INV-001",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days from now
    currency: "USD",
    businessInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: null,
    },
    clientInfo: {
      name: "",
      email: "",
      address: "",
    },
    lineItems: [],
    taxRate: 0,
    discountRate: 0,
    notes: "Thank you for your business!",
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    total: 0,
  });

  // Calculate totals whenever line items, tax, or discount change
  const calculateTotals = useCallback((data: InvoiceData) => {
    const subtotal = data.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = (subtotal * data.discountRate) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * data.taxRate) / 100;
    const total = taxableAmount + taxAmount;

    return {
      ...data,
      subtotal,
      discountAmount,
      taxAmount,
      total,
    };
  }, []);

  const handleUpdateInvoiceData = useCallback(
    (newData: InvoiceData) => {
      const dataWithTotals = calculateTotals(newData);
      setInvoiceData(dataWithTotals);
    },
    [calculateTotals]
  );

  // Recalculate totals when relevant data changes
  useEffect(() => {
    const dataWithTotals = calculateTotals(invoiceData);
    if (dataWithTotals.total !== invoiceData.total) {
      setInvoiceData(dataWithTotals);
    }
  }, [
    invoiceData.lineItems,
    invoiceData.taxRate,
    invoiceData.discountRate,
    calculateTotals,
  ]);

  // Prefill business information from user profile (only if fields are empty)
  useEffect(() => {
    if (profile && !profileLoading) {
      setInvoiceData((prevData) => {
        // Only prefill if the current business info is empty
        const hasExistingData =
          prevData.businessInfo.name ||
          prevData.businessInfo.email ||
          prevData.businessInfo.phone ||
          prevData.businessInfo.address;

        if (hasExistingData) {
          return prevData; // Don't overwrite existing data
        }

        return {
          ...prevData,
          businessInfo: {
            ...prevData.businessInfo,
            name: profile.business_name || prevData.businessInfo.name,
            email: profile.email || prevData.businessInfo.email,
            phone: profile.phone || prevData.businessInfo.phone,
            address: profile.address || prevData.businessInfo.address,
            logo: profile.logo_url || prevData.businessInfo.logo,
          },
        };
      });
    }
  }, [profile, profileLoading]);

  // Function to manually prefill from profile
  const handlePrefillFromProfile = () => {
    if (profile) {
      setInvoiceData((prevData) => ({
        ...prevData,
        businessInfo: {
          ...prevData.businessInfo,
          name: profile.business_name || prevData.businessInfo.name,
          email: profile.email || prevData.businessInfo.email,
          phone: profile.phone || prevData.businessInfo.phone,
          address: profile.address || prevData.businessInfo.address,
          logo: profile.logo_url || prevData.businessInfo.logo,
        },
      }));
      toast({
        title: "Success!",
        description: "Business information updated from your profile.",
      });
    }
  };

  const handleGeneratePDF = async () => {
    if (!invoicePreviewRef.current) {
      toast({
        title: "Error",
        description: "Invoice preview not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!invoiceData.businessInfo.name || !invoiceData.clientInfo.name) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in both business and client names before generating PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generatePDF(invoicePreviewRef.current, invoiceData);
      toast({
        title: "Success!",
        description: "Invoice PDF has been generated and downloaded.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCurrency = currencies.find(
    (c) => c.code === invoiceData.currency
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Invoice</h1>
          <p className="text-muted-foreground mt-1">
            Create professional invoices in minutes
          </p>
          {profileLoading && (
            <p className="text-sm text-blue-600 mt-2">
              Loading your business profile...
            </p>
          )}
          {profile && !profileLoading && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-green-600">
                ✓ Business information prefilled from your profile
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrefillFromProfile}
                className="text-xs h-6 px-2"
              >
                Refresh
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="md:hidden"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Preview
              </>
            )}
          </Button>

          <Button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="bg-primary-gradient hover:opacity-90 transition-opacity"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Invoice Details</h2>
          </div>

          <InvoiceForm
            invoiceData={invoiceData}
            onUpdateInvoiceData={handleUpdateInvoiceData}
            userId={user?.id}
          />

          {/* Template Selector */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                Template Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className={`space-y-6 ${!showPreview ? "hidden xl:block" : ""}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Live Preview</h2>
            </div>

            {invoiceData.total > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">
                  {selectedCurrency?.symbol}
                  {invoiceData.total.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <div className="sticky top-6">
            <InvoicePreview
              ref={invoicePreviewRef}
              invoiceData={invoiceData}
              template={selectedTemplate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
