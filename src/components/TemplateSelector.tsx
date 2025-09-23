import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceTemplate, TemplateInfo } from "@/types/templates";

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplate;
  onSelectTemplate: (template: InvoiceTemplate) => void;
}

const templateInfos: TemplateInfo[] = [
  {
    id: InvoiceTemplate.MODERN,
    name: "Modern",
    description:
      "Clean and professional with subtle gradients and soft shadows",
    preview:
      "bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200",
  },
  {
    id: InvoiceTemplate.CLASSIC,
    name: "Classic",
    description:
      "Traditional business invoice with bold typography and structure",
    preview: "bg-white border-4 border-gray-900",
  },
  {
    id: InvoiceTemplate.MINIMAL,
    name: "Minimal",
    description:
      "Ultra-clean design with lots of white space and light typography",
    preview: "bg-white border border-gray-200",
  },
  {
    id: InvoiceTemplate.CREATIVE,
    name: "Creative",
    description: "Modern design with colorful gradients and rounded elements",
    preview:
      "bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 border-2 border-purple-200",
  },
  {
    id: InvoiceTemplate.CORPORATE,
    name: "Corporate",
    description:
      "Formal and structured layout perfect for enterprise businesses",
    preview:
      "bg-gray-50 border-t-4 border-gray-900 border-l-2 border-r-2 border-b-2",
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Template</h3>
        <p className="text-sm text-muted-foreground">
          Select an invoice template that matches your business style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templateInfos.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-medium ${
                isSelected
                  ? "ring-2 ring-primary shadow-medium"
                  : "hover:shadow-soft"
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <CardContent className="p-4 space-y-3">
                {/* Preview */}
                <div
                  className={`h-24 rounded-lg ${template.preview} relative overflow-hidden`}
                >
                  <div className="absolute inset-2 space-y-1">
                    <div className="h-2 bg-gray-300/60 rounded w-1/2"></div>
                    <div className="h-1 bg-gray-300/40 rounded w-3/4"></div>
                    <div className="h-1 bg-gray-300/40 rounded w-1/3"></div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{template.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Select Button */}
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.id);
                  }}
                >
                  {isSelected ? "Selected" : "Select"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
