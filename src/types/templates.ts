export enum InvoiceTemplate {
  MODERN = 'modern',
  CLASSIC = 'classic', 
  MINIMAL = 'minimal',
  CREATIVE = 'creative',
  CORPORATE = 'corporate'
}

export interface TemplateInfo {
  id: InvoiceTemplate;
  name: string;
  description: string;
  preview: string;
}