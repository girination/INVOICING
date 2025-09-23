import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Upload, Sparkles, UserPlus } from "lucide-react";
import { InvoiceData, LineItem, currencies } from "@/types/invoice";
import { toast } from "@/hooks/use-toast";
import { ClientService, Client } from "@/services/client.service";
import { UserProfile } from "@/services/profile.service";

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  onUpdateInvoiceData: (data: InvoiceData) => void;
  userId?: string | null;
  profile?: UserProfile | null;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  onUpdateInvoiceData,
  userId,
  profile,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const handleLogoUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload an image smaller than 2MB",
            variant: "destructive",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        onUpdateInvoiceData({
          ...invoiceData,
          businessInfo: {
            ...invoiceData.businessInfo,
            logo: file,
          },
        });
      }
    },
    [invoiceData, onUpdateInvoiceData]
  );

  const addLineItem = useCallback(() => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };

    onUpdateInvoiceData({
      ...invoiceData,
      lineItems: [...invoiceData.lineItems, newItem],
    });
  }, [invoiceData, onUpdateInvoiceData]);

  const updateLineItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) => {
      const updatedItems = invoiceData.lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      });

      onUpdateInvoiceData({
        ...invoiceData,
        lineItems: updatedItems,
      });
    },
    [invoiceData, onUpdateInvoiceData]
  );

  const removeLineItem = useCallback(
    (id: string) => {
      const updatedItems = invoiceData.lineItems.filter(
        (item) => item.id !== id
      );
      onUpdateInvoiceData({
        ...invoiceData,
        lineItems: updatedItems,
      });
    },
    [invoiceData, onUpdateInvoiceData]
  );

  const selectedCurrency = currencies.find(
    (c) => c.code === invoiceData.currency
  );

  // Check if profile is complete (has essential business information)
  const isProfileComplete =
    profile &&
    profile.business_name &&
    profile.email &&
    profile.phone &&
    profile.address;

  // Check if profile has a logo
  const hasProfileLogo = profile && profile.logo_url;

  // Fetch clients when component mounts or userId changes
  useEffect(() => {
    const fetchClients = async () => {
      if (!userId) return;

      setClientsLoading(true);
      try {
        const response = await ClientService.getClients(userId);
        if (response.success && Array.isArray(response.data)) {
          setClients(response.data);
        } else {
          toast({
            title: "Error",
            description: response.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Error",
          description: "Failed to fetch clients",
          variant: "destructive",
        });
      } finally {
        setClientsLoading(false);
      }
    };

    fetchClients();
  }, [userId]);

  // Handle client selection
  const handleClientSelect = useCallback(
    (clientId: string) => {
      setSelectedClientId(clientId);
      const selectedClient = clients.find((client) => client.id === clientId);

      if (selectedClient) {
        onUpdateInvoiceData({
          ...invoiceData,
          clientInfo: {
            name: selectedClient.name,
            email: selectedClient.email,
            address: selectedClient.address || "",
          },
        });
      }
    },
    [clients, invoiceData, onUpdateInvoiceData]
  );

  const handleAIGenerate = () => {
    toast({
      title: "Coming Soon!",
      description:
        "AI invoice generation will be available once you connect to Supabase.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Invoice Generator */}
      <Card className="shadow-soft border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Invoice Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aiPrompt">Describe your invoice</Label>
            <Textarea
              id="aiPrompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Example: Create an invoice for web design services. Client is Acme Corp, 3 pages at $500 each, 10% tax, due in 30 days..."
              className="min-h-[100px]"
            />
          </div>
          <Button
            onClick={handleAIGenerate}
            disabled={!aiPrompt.trim()}
            className="w-full bg-primary-gradient hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Invoice with AI
          </Button>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">💡 Tips for better results:</p>
            <ul className="space-y-1 ml-4">
              <li>• Mention client name and your business details</li>
              <li>• Describe services/products with quantities and rates</li>
              <li>• Include tax rates, discounts, and payment terms</li>
              <li>• Specify currency if not USD</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Business Information - Only show if profile is incomplete or no logo */}
      {(!isProfileComplete || !hasProfileLogo) && (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {isProfileComplete ? "Company Logo" : "Business Information"}
            </CardTitle>
            {isProfileComplete && (
              <p className="text-sm text-muted-foreground">
                Your business information is complete. You can only update your
                logo here.
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo Upload - Always show if no profile logo */}
            {!hasProfileLogo && (
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="sr-only"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("logo")?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                  </div>
                  {logoPreview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border shadow-soft">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain bg-background"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business Information Fields - Only show if profile is incomplete */}
            {!isProfileComplete && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={invoiceData.businessInfo.name}
                    onChange={(e) =>
                      onUpdateInvoiceData({
                        ...invoiceData,
                        businessInfo: {
                          ...invoiceData.businessInfo,
                          name: e.target.value,
                        },
                      })
                    }
                    placeholder="Your Business Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Email</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={invoiceData.businessInfo.email}
                    onChange={(e) =>
                      onUpdateInvoiceData({
                        ...invoiceData,
                        businessInfo: {
                          ...invoiceData.businessInfo,
                          email: e.target.value,
                        },
                      })
                    }
                    placeholder="business@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Phone</Label>
                  <Input
                    id="businessPhone"
                    value={invoiceData.businessInfo.phone}
                    onChange={(e) =>
                      onUpdateInvoiceData({
                        ...invoiceData,
                        businessInfo: {
                          ...invoiceData.businessInfo,
                          phone: e.target.value,
                        },
                      })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Address</Label>
                  <Textarea
                    id="businessAddress"
                    value={invoiceData.businessInfo.address}
                    onChange={(e) =>
                      onUpdateInvoiceData({
                        ...invoiceData,
                        businessInfo: {
                          ...invoiceData.businessInfo,
                          address: e.target.value,
                        },
                      })
                    }
                    placeholder="123 Business St, City, State 12345"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Client Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientSelect">Select Client</Label>
            <Select
              value={selectedClientId}
              onValueChange={handleClientSelect}
              disabled={clientsLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    clientsLoading
                      ? "Loading clients..."
                      : clients.length === 0
                      ? "No clients found. Add clients first."
                      : "Choose a client"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id!}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {client.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {clients.length === 0 && !clientsLoading && (
              <p className="text-sm text-muted-foreground">
                No clients found.{" "}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => window.open("/app/clients", "_blank")}
                  className="p-0 h-auto text-primary"
                >
                  Add your first client
                </Button>
              </p>
            )}
          </div>

          {/* Display selected client info */}
          {selectedClientId && (
            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Selected Client Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium">
                    {invoiceData.clientInfo.name}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm">{invoiceData.clientInfo.email}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">
                    Address
                  </Label>
                  <p className="text-sm whitespace-pre-line">
                    {invoiceData.clientInfo.address}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Manual client entry option */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Don't see your client? You can still enter details manually below
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={invoiceData.clientInfo.name}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    clientInfo: {
                      ...invoiceData.clientInfo,
                      name: e.target.value,
                    },
                  })
                }
                placeholder="Client Name or Company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={invoiceData.clientInfo.email}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    clientInfo: {
                      ...invoiceData.clientInfo,
                      email: e.target.value,
                    },
                  })
                }
                placeholder="client@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              id="clientAddress"
              value={invoiceData.clientInfo.address}
              onChange={(e) =>
                onUpdateInvoiceData({
                  ...invoiceData,
                  clientInfo: {
                    ...invoiceData.clientInfo,
                    address: e.target.value,
                  },
                })
              }
              placeholder="123 Client St, City, State 12345"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Invoice Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    invoiceNumber: e.target.value,
                  })
                }
                placeholder="INV-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Issue Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceData.date}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    date: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    dueDate: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={invoiceData.currency}
              onValueChange={(value) =>
                onUpdateInvoiceData({
                  ...invoiceData,
                  currency: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Line Items</CardTitle>
          <Button onClick={addLineItem} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoiceData.lineItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No items added yet. Click "Add Item" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoiceData.lineItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg"
                >
                  <div className="md:col-span-4 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, "description", e.target.value)
                      }
                      placeholder="Service or product description"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="text-center"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Rate ({selectedCurrency?.symbol})</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) =>
                        updateLineItem(
                          item.id,
                          "rate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="md:col-span-3 space-y-2">
                    <Label>Amount</Label>
                    <div className="h-9 px-3 py-2 bg-muted rounded-md flex items-center text-sm overflow-hidden">
                      <span className="truncate">
                        {selectedCurrency?.symbol}
                        {item.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex items-center justify-center">
                    <Button
                      onClick={() => removeLineItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax & Discount */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Tax & Discount
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={invoiceData.taxRate}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    taxRate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountRate">Discount (%)</Label>
              <Input
                id="discountRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={invoiceData.discountRate}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    discountRate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={invoiceData.notes}
              onChange={(e) =>
                onUpdateInvoiceData({
                  ...invoiceData,
                  notes: e.target.value,
                })
              }
              placeholder="Thank you for your business!"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Banking Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Banking Information
            <span className="text-sm font-normal text-muted-foreground">
              (Optional)
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            This information will be included in your invoices for international
            client payments. If you provide any banking information, all three
            fields (bank name, account number, and SWIFT code) become required.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={invoiceData.bankingInfo.bankName}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    bankingInfo: {
                      ...invoiceData.bankingInfo,
                      bankName: e.target.value,
                    },
                  })
                }
                placeholder="Bank Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">
                Account Number
                {(invoiceData.bankingInfo.bankName ||
                  invoiceData.bankingInfo.accountNumber ||
                  invoiceData.bankingInfo.swiftCode) && (
                  <span className="text-red-500"> *</span>
                )}
              </Label>
              <Input
                id="accountNumber"
                value={invoiceData.bankingInfo.accountNumber}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    bankingInfo: {
                      ...invoiceData.bankingInfo,
                      accountNumber: e.target.value,
                    },
                  })
                }
                placeholder="1234567890"
              />
              {(invoiceData.bankingInfo.bankName ||
                invoiceData.bankingInfo.accountNumber ||
                invoiceData.bankingInfo.swiftCode) && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Required when providing banking information
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="swiftCode">
                SWIFT Code
                {(invoiceData.bankingInfo.bankName ||
                  invoiceData.bankingInfo.accountNumber ||
                  invoiceData.bankingInfo.swiftCode) && (
                  <span className="text-red-500"> *</span>
                )}
              </Label>
              <Input
                id="swiftCode"
                value={invoiceData.bankingInfo.swiftCode}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    bankingInfo: {
                      ...invoiceData.bankingInfo,
                      swiftCode: e.target.value,
                    },
                  })
                }
                placeholder="BOFAUS3N"
                className="uppercase"
              />
              <p className="text-xs text-muted-foreground">
                8-11 character code for international wire transfers
              </p>
              {(invoiceData.bankingInfo.bankName ||
                invoiceData.bankingInfo.accountNumber ||
                invoiceData.bankingInfo.swiftCode) && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Required when providing banking information
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN (International)</Label>
              <Input
                id="iban"
                value={invoiceData.bankingInfo.iban}
                onChange={(e) =>
                  onUpdateInvoiceData({
                    ...invoiceData,
                    bankingInfo: {
                      ...invoiceData.bankingInfo,
                      iban: e.target.value,
                    },
                  })
                }
                placeholder="GB29 NWBK 6016 1331 9268 19"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
