import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Download,
  Eye,
  Star,
  Sparkles,
  FileText,
  FileSpreadsheet,
  FileImage,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { TemplateController } from "@/controllers/template.controller";
import { InvoiceTemplate } from "@/services/template.service";

export default function Templates() {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] =
    useState<InvoiceTemplate | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await TemplateController.getTemplates();
      if (response.success) {
        setTemplates(response.data as InvoiceTemplate[]);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter templates based on search and category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      template.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(templates.map((t) => t.category))),
  ];

  const handleDownload = async (
    template: InvoiceTemplate,
    format: "pdf" | "word" | "excel"
  ) => {
    setIsDownloading(true);
    try {
      const response = await TemplateController.downloadTemplate(
        template.id,
        format
      );
      if (response.success) {
        toast({
          title: "Download Started",
          description: response.message,
        });
        setIsDownloadModalOpen(false);
      } else {
        toast({
          title: "Download Failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading template:", error);
      toast({
        title: "Error",
        description: "Failed to download template",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const openDownloadModal = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setIsDownloadModalOpen(true);
  };

  const openPreviewModal = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileImage className="h-4 w-4" />;
      case "word":
        return <FileText className="h-4 w-4" />;
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderTemplatePreview = (template: InvoiceTemplate) => {
    const baseStyles = "text-xs p-2 h-full flex flex-col";

    switch (template.id) {
      case "classic":
        return (
          <div className={`${baseStyles} bg-white`}>
            <div className="border-b pb-2 mb-2">
              <div className="font-bold text-sm">INVOICE</div>
              <div className="text-gray-600">#INV-001</div>
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <div className="font-semibold">Your Company</div>
                <div className="text-gray-600 text-xs">123 Business St</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">Client Name</div>
                <div className="text-gray-600 text-xs">Client Address</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="flex-1 mb-2">
              <div className="border rounded p-1 mb-1">
                <div className="grid grid-cols-4 gap-1 text-xs font-medium border-b pb-1 mb-1">
                  <div>Description</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Web Development</div>
                  <div className="text-center">1</div>
                  <div className="text-right">$1,000.00</div>
                  <div className="text-right">$1,000.00</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Design Services</div>
                  <div className="text-center">1</div>
                  <div className="text-right">$500.00</div>
                  <div className="text-right">$500.00</div>
                </div>
              </div>

              {/* Totals */}
              <div className="text-right space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>$1,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (20%):</span>
                  <span>$300.00</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total:</span>
                  <span>$1,800.00</span>
                </div>
              </div>
            </div>

            {/* Thank You Note */}
            <div className="text-center text-xs text-gray-600 italic mt-auto">
              Thank you for your business!
            </div>
          </div>
        );

      case "modern":
        return (
          <div
            className={`${baseStyles} bg-gradient-to-br from-blue-50 to-indigo-100`}
          >
            <div className="bg-blue-600 text-white p-2 -m-2 mb-2 rounded-t">
              <div className="font-bold text-sm">INVOICE</div>
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <div className="font-semibold text-blue-900">Your Company</div>
                <div className="text-blue-700 text-xs">123 Business St</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-900">Client Name</div>
                <div className="text-blue-700 text-xs">Client Address</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="flex-1 mb-2">
              <div className="bg-white rounded p-1 mb-1">
                <div className="grid grid-cols-4 gap-1 text-xs font-medium text-blue-900 border-b border-blue-200 pb-1 mb-1">
                  <div>Service</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Total</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Consulting</div>
                  <div className="text-center">2</div>
                  <div className="text-right">$750.00</div>
                  <div className="text-right">$1,500.00</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Implementation</div>
                  <div className="text-center">1</div>
                  <div className="text-right">$800.00</div>
                  <div className="text-right">$800.00</div>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white rounded p-2 text-right space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>$2,300.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">VAT (15%):</span>
                  <span>$345.00</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-blue-200 pt-1">
                  <span className="text-blue-900">Total:</span>
                  <span className="text-blue-900">$2,645.00</span>
                </div>
              </div>
            </div>

            {/* Thank You Note */}
            <div className="text-center text-xs text-blue-700 italic mt-auto">
              Thank you for choosing us!
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className={`${baseStyles} bg-white`}>
            <div className="text-center mb-2">
              <div className="font-light text-lg">Invoice</div>
              <div className="text-gray-500 text-xs">#INV-001</div>
            </div>
            <div className="space-y-1 mb-2">
              <div className="text-sm">Your Company</div>
              <div className="text-xs text-gray-500">123 Business St</div>
              <div className="text-sm mt-2">Client Name</div>
              <div className="text-xs text-gray-500">Client Address</div>
            </div>

            {/* Line Items */}
            <div className="flex-1 mb-2">
              <div className="space-y-1 mb-2">
                <div className="flex justify-between text-xs">
                  <span>Design Work</span>
                  <span>$800.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Development</span>
                  <span>$1,200.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Testing</span>
                  <span>$300.00</span>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>$2,300.00</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (10%):</span>
                  <span>$230.00</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total:</span>
                  <span>$2,530.00</span>
                </div>
              </div>
            </div>

            {/* Thank You Note */}
            <div className="text-center text-xs text-gray-500 italic mt-auto">
              Thank you!
            </div>
          </div>
        );

      case "corporate":
        return (
          <div className={`${baseStyles} bg-gray-50`}>
            <div className="border-b-2 border-gray-300 pb-2 mb-2">
              <div className="font-bold text-sm uppercase tracking-wide">
                INVOICE
              </div>
              <div className="text-gray-600 text-xs">Invoice #: INV-001</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="font-semibold text-sm">FROM:</div>
                <div className="text-xs">Your Company Ltd.</div>
                <div className="text-xs text-gray-600">123 Business St</div>
              </div>
              <div>
                <div className="font-semibold text-sm">TO:</div>
                <div className="text-xs">Client Corporation</div>
                <div className="text-xs text-gray-600">Client Address</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="flex-1 mb-2">
              <div className="bg-white border rounded p-1 mb-1">
                <div className="grid grid-cols-4 gap-1 text-xs font-semibold border-b border-gray-200 pb-1 mb-1">
                  <div>Item</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Total</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Software License</div>
                  <div className="text-center">5</div>
                  <div className="text-right">$200.00</div>
                  <div className="text-right">$1,000.00</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Support Package</div>
                  <div className="text-center">1</div>
                  <div className="text-right">$500.00</div>
                  <div className="text-right">$500.00</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Training</div>
                  <div className="text-center">2</div>
                  <div className="text-right">$300.00</div>
                  <div className="text-right">$600.00</div>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white border rounded p-2 text-right space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Subtotal:</span>
                  <span>$2,100.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>VAT (18%):</span>
                  <span>$378.00</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-gray-300 pt-1">
                  <span>Total Amount:</span>
                  <span>$2,478.00</span>
                </div>
              </div>
            </div>

            {/* Thank You Note */}
            <div className="text-center text-xs text-gray-600 italic mt-auto">
              Thank you for your continued partnership.
            </div>
          </div>
        );

      case "creative":
        return (
          <div
            className={`${baseStyles} bg-gradient-to-br from-purple-100 to-pink-100`}
          >
            <div className="text-center mb-2">
              <div className="font-bold text-lg text-purple-800">
                ✨ INVOICE ✨
              </div>
              <div className="text-purple-600 text-xs">#INV-001</div>
            </div>
            <div className="flex justify-between mb-2">
              <div>
                <div className="font-semibold text-purple-900">Your Studio</div>
                <div className="text-purple-700 text-xs">Creative Space</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-purple-900">Client Name</div>
                <div className="text-purple-700 text-xs">Client Address</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="flex-1 mb-2">
              <div className="bg-white rounded-lg p-1 mb-1 shadow-sm">
                <div className="grid grid-cols-4 gap-1 text-xs font-semibold text-purple-900 border-b border-purple-200 pb-1 mb-1">
                  <div>Project</div>
                  <div className="text-center">Hours</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Total</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Logo Design</div>
                  <div className="text-center">8</div>
                  <div className="text-right">$75.00</div>
                  <div className="text-right">$600.00</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Brand Identity</div>
                  <div className="text-center">12</div>
                  <div className="text-right">$85.00</div>
                  <div className="text-right">$1,020.00</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>Mockups</div>
                  <div className="text-center">6</div>
                  <div className="text-right">$60.00</div>
                  <div className="text-right">$360.00</div>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white rounded-lg p-2 text-right space-y-1 shadow-sm">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-700">Subtotal:</span>
                  <span>$1,980.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-purple-700">VAT (12%):</span>
                  <span>$237.60</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-purple-200 pt-1">
                  <span className="text-purple-900">Total:</span>
                  <span className="text-purple-900">$2,217.60</span>
                </div>
              </div>
            </div>

            {/* Thank You Note */}
            <div className="text-center text-xs text-purple-700 italic mt-auto">
              ✨ Thank you for your creativity! ✨
            </div>
          </div>
        );

      default:
        return (
          <div
            className={`${baseStyles} bg-gray-100 items-center justify-center`}
          >
            <div className="text-center text-gray-500">
              <FileImage className="h-8 w-8 mx-auto mb-1" />
              <p className="text-xs">Preview</p>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Invoice Templates
        </h1>
        <p className="text-muted-foreground mt-2">
          Choose from our collection of professional invoice templates. Download
          in your preferred format.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="shadow-soft hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {template.name}
                    {template.isPopular && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {template.isNew && (
                      <Badge variant="default" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Template Preview */}
              <div className="aspect-[3/2] bg-white rounded-lg border-2 border-muted-foreground/25 overflow-hidden shadow-sm">
                {renderTemplatePreview(template)}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>

              {/* Download Formats */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">
                  Available Formats:
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {template.downloadFormats.map((format) => (
                    <div
                      key={format.type}
                      className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                    >
                      {getFormatIcon(format.type)}
                      <span className="text-xs">{format.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openDownloadModal(template)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3"
                  onClick={() => openPreviewModal(template)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="text-center py-12">
            <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No templates found
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No templates are available at the moment."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Download Modal */}
      <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Template
            </DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium">{selectedTemplate.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose your preferred format
                </p>
              </div>

              <div className="space-y-3">
                {selectedTemplate.downloadFormats.map((format) => (
                  <div
                    key={format.type}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() =>
                      handleDownload(selectedTemplate, format.type)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getFormatIcon(format.type)}
                      </div>
                      <div>
                        <p className="font-medium">{format.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {format.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" disabled={isDownloading}>
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Template Preview
            </DialogTitle>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-lg">{selectedTemplate.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Large Template Preview */}
              <div className="bg-white rounded-lg border-2 border-muted-foreground/25 overflow-hidden shadow-lg">
                <div className="aspect-[3/2] p-4">
                  {renderTemplatePreview(selectedTemplate)}
                </div>
              </div>

              {/* Template Features */}
              <div className="space-y-3">
                <h4 className="font-medium">Template Features:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTemplate.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="flex-1"
                >
                  Close Preview
                </Button>
                <Button
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    openDownloadModal(selectedTemplate);
                  }}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
