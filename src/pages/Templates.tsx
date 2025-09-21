import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Table, 
  Eye,
  Palette,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  format: 'PDF' | 'DOCX' | 'XLSX';
  category: 'Professional' | 'Creative' | 'Minimal' | 'Corporate';
  preview?: string;
  popular?: boolean;
}

export default function Templates() {
  const templates: Template[] = [
    {
      id: '1',
      name: 'Modern Business Invoice',
      description: 'Clean and professional template with modern design elements',
      format: 'PDF',
      category: 'Professional',
      popular: true,
    },
    {
      id: '2',
      name: 'Classic Corporate Invoice',
      description: 'Traditional corporate style with formal layout',
      format: 'PDF',
      category: 'Corporate',
    },
    {
      id: '3',
      name: 'Creative Design Invoice',
      description: 'Colorful and creative template for design agencies',
      format: 'PDF',
      category: 'Creative',
    },
    {
      id: '4',
      name: 'Minimal Clean Invoice',
      description: 'Simple and clean design with focus on content',
      format: 'PDF',
      category: 'Minimal',
    },
    {
      id: '5',
      name: 'Excel Invoice Template',
      description: 'Editable Excel spreadsheet with automatic calculations',
      format: 'XLSX',
      category: 'Professional',
      popular: true,
    },
    {
      id: '6',
      name: 'Word Invoice Template',
      description: 'Customizable Word document template',
      format: 'DOCX',
      category: 'Professional',
    },
  ];

  const handleDownloadTemplate = (template: Template) => {
    toast({
      title: 'Download Started',
      description: `Downloading ${template.name} template...`,
    });
    // In a real app, this would trigger the actual file download
  };

  const handlePreviewTemplate = (template: Template) => {
    toast({
      title: 'Preview',
      description: `Opening preview for ${template.name}...`,
    });
    // In a real app, this would open a preview modal or new tab
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF':
        return <FileText className="h-4 w-4" />;
      case 'XLSX':
        return <Table className="h-4 w-4" />;
      case 'DOCX':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF':
        return 'bg-red-100 text-red-800';
      case 'XLSX':
        return 'bg-green-100 text-green-800';
      case 'DOCX':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Professional':
        return 'bg-blue-100 text-blue-800';
      case 'Creative':
        return 'bg-purple-100 text-purple-800';
      case 'Minimal':
        return 'bg-gray-100 text-gray-800';
      case 'Corporate':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Invoice Templates</h1>
        <p className="text-muted-foreground mt-2">
          Download professional invoice templates in various formats.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">PDF Templates</h3>
            <p className="text-sm text-muted-foreground">Ready-to-use PDF formats</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Table className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Excel Templates</h3>
            <p className="text-sm text-muted-foreground">Editable spreadsheets</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4 text-center">
            <Palette className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Multiple Styles</h3>
            <p className="text-sm text-muted-foreground">Various design options</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="shadow-soft hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {template.name}
                  {template.popular && (
                    <Badge variant="secondary" className="ml-2">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge 
                  variant="outline" 
                  className={`${getFormatColor(template.format)} border-0`}
                >
                  {getFormatIcon(template.format)}
                  {template.format}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`${getCategoryColor(template.category)} border-0`}
                >
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>

              {/* Preview Area */}
              <div className="aspect-[3/4] bg-gradient-to-br from-muted/30 to-muted/60 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Template Preview</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handlePreviewTemplate(template)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-primary-gradient hover:opacity-90"
                  onClick={() => handleDownloadTemplate(template)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Instructions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>How to Use Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">
                1
              </div>
              <h4 className="font-semibold mb-2">Download Template</h4>
              <p className="text-sm text-muted-foreground">
                Choose and download the template that best fits your business needs.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">
                2
              </div>
              <h4 className="font-semibold mb-2">Customize Content</h4>
              <p className="text-sm text-muted-foreground">
                Edit the template with your business information and invoice details.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2 font-semibold">
                3
              </div>
              <h4 className="font-semibold mb-2">Send to Client</h4>
              <p className="text-sm text-muted-foreground">
                Save as PDF or print the completed invoice to send to your clients.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}