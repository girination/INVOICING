import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Upload, Save, User, Building2, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Profile() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    // Business Information
    businessName: 'Your Business Name',
    email: 'business@example.com',
    phone: '+1 (555) 123-4567',
    website: 'https://yourbusiness.com',
    address: '123 Business Street\nCity, State 12345\nCountry',
    
    // Tax & Legal Information
    taxId: 'TAX123456789',
    registrationNumber: 'REG987654321',
    
    // Invoice Settings
    defaultCurrency: 'USD',
    defaultTaxRate: 10,
    defaultPaymentTerms: 30,
    invoicePrefix: 'INV',
    
    // Bank Information (optional)
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    iban: '',
  });

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        title: 'Logo Updated',
        description: 'Your business logo has been updated.',
      });
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    toast({
      title: 'Profile Saved',
      description: 'Your profile information has been saved successfully.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Business Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your business information and invoice settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Business Logo */}
        <div className="lg:col-span-1">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Business Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 overflow-hidden">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Business logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Building2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Upload Logo</Label>
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
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Logo
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 400x400px, PNG or JPG, max 5MB
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Information */}
        <div className="lg:col-span-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={profileData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Your Business Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="business@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your business address"
                  className="min-h-[80px]"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                  <Input
                    id="taxId"
                    value={profileData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="TAX123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Business Registration</Label>
                  <Input
                    id="registrationNumber"
                    value={profileData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    placeholder="REG987654321"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Settings */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Invoice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Input
                id="defaultCurrency"
                value={profileData.defaultCurrency}
                onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
                placeholder="USD"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
              <Input
                id="defaultTaxRate"
                type="number"
                min="0"
                max="100"
                value={profileData.defaultTaxRate}
                onChange={(e) => handleInputChange('defaultTaxRate', e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultPaymentTerms">Payment Terms (days)</Label>
              <Input
                id="defaultPaymentTerms"
                type="number"
                min="1"
                value={profileData.defaultPaymentTerms}
                onChange={(e) => handleInputChange('defaultPaymentTerms', e.target.value)}
                placeholder="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                value={profileData.invoicePrefix}
                onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                placeholder="INV"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banking Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Banking Information (Optional)</CardTitle>
          <p className="text-sm text-muted-foreground">
            This information will be included in your invoices for client payments.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={profileData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                placeholder="Bank of America"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={profileData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                placeholder="1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                value={profileData.routingNumber}
                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                placeholder="021000021"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iban">IBAN (International)</Label>
              <Input
                id="iban"
                value={profileData.iban}
                onChange={(e) => handleInputChange('iban', e.target.value)}
                placeholder="GB29 NWBK 6016 1331 9268 19"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary-gradient hover:opacity-90">
          <Save className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </div>
    </div>
  );
}