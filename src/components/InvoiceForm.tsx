import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Upload } from 'lucide-react';
import { InvoiceData, LineItem, currencies } from '@/types/invoice';
import { toast } from '@/hooks/use-toast';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  onUpdateInvoiceData: (data: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceData,
  onUpdateInvoiceData,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [invoiceData, onUpdateInvoiceData]);

  const addLineItem = useCallback(() => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };

    onUpdateInvoiceData({
      ...invoiceData,
      lineItems: [...invoiceData.lineItems, newItem],
    });
  }, [invoiceData, onUpdateInvoiceData]);

  const updateLineItem = useCallback((id: string, field: keyof LineItem, value: string | number) => {
    const updatedItems = invoiceData.lineItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
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
  }, [invoiceData, onUpdateInvoiceData]);

  const removeLineItem = useCallback((id: string) => {
    const updatedItems = invoiceData.lineItems.filter((item) => item.id !== id);
    onUpdateInvoiceData({
      ...invoiceData,
      lineItems: updatedItems,
    });
  }, [invoiceData, onUpdateInvoiceData]);

  const selectedCurrency = currencies.find(c => c.code === invoiceData.currency);

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  onClick={() => document.getElementById('logo')?.click()}
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
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <CardTitle className="text-lg font-semibold">Invoice Details</CardTitle>
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
                  <div className="md:col-span-5 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="Service or product description"
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Rate ({selectedCurrency?.symbol})</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Amount</Label>
                    <div className="h-9 px-3 py-2 bg-muted rounded-md flex items-center text-sm">
                      {selectedCurrency?.symbol}{item.amount.toFixed(2)}
                    </div>
                  </div>

                  <div className="md:col-span-1 flex items-end">
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
          <CardTitle className="text-lg font-semibold">Tax & Discount</CardTitle>
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
    </div>
  );
};