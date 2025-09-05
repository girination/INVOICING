import React, { forwardRef } from 'react';
import { InvoiceData, currencies } from '@/types/invoice';

interface MinimalTemplateProps {
  invoiceData: InvoiceData;
}

export const MinimalTemplate = forwardRef<HTMLDivElement, MinimalTemplateProps>(
  ({ invoiceData }, ref) => {
    const selectedCurrency = currencies.find(c => c.code === invoiceData.currency);
    const currencySymbol = selectedCurrency?.symbol || '$';

    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const formatCurrency = (amount: number) => {
      return `${currencySymbol}${amount.toFixed(2)}`;
    };

    return (
      <div ref={ref} className="bg-white p-12 space-y-12 min-h-[800px]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            {invoiceData.businessInfo.logo && (
              <div className="w-24 h-12 mb-6">
                <img
                  src={URL.createObjectURL(invoiceData.businessInfo.logo)}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-light text-gray-900 tracking-wide">
              {invoiceData.businessInfo.name || 'Business Name'}
            </h1>
            <div className="text-sm text-gray-500 space-y-1 leading-relaxed">
              {invoiceData.businessInfo.address && (
                <div className="whitespace-pre-line">{invoiceData.businessInfo.address}</div>
              )}
              {invoiceData.businessInfo.email && <div>{invoiceData.businessInfo.email}</div>}
              {invoiceData.businessInfo.phone && <div>{invoiceData.businessInfo.phone}</div>}
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <div className="text-3xl font-light text-gray-900 tracking-wider">INVOICE</div>
            <div className="text-gray-500">#{invoiceData.invoiceNumber}</div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Bill To</div>
              <div className="space-y-1">
                <div className="font-medium text-gray-900">{invoiceData.clientInfo.name}</div>
                {invoiceData.clientInfo.email && (
                  <div className="text-sm text-gray-600">{invoiceData.clientInfo.email}</div>
                )}
                {invoiceData.clientInfo.address && (
                  <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {invoiceData.clientInfo.address}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-400">Issue Date</span>
              <span className="text-sm">{formatDate(invoiceData.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-400">Due Date</span>
              <span className="text-sm">{formatDate(invoiceData.dueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs uppercase tracking-wider text-gray-400">Currency</span>
              <span className="text-sm">{invoiceData.currency}</span>
            </div>
          </div>
        </div>

        {/* Line Items */}
        {invoiceData.lineItems.length > 0 && (
          <div className="space-y-6">
            <div className="border-t border-gray-200 pt-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-4 text-xs uppercase tracking-wider text-gray-400 font-normal">
                      Description
                    </th>
                    <th className="text-right pb-4 text-xs uppercase tracking-wider text-gray-400 font-normal w-16">
                      Qty
                    </th>
                    <th className="text-right pb-4 text-xs uppercase tracking-wider text-gray-400 font-normal w-24">
                      Rate
                    </th>
                    <th className="text-right pb-4 text-xs uppercase tracking-wider text-gray-400 font-normal w-32">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="space-y-4">
                  {invoiceData.lineItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-4 text-sm leading-relaxed">
                        <div className="whitespace-pre-line">{item.description}</div>
                      </td>
                      <td className="text-right py-4 text-sm">{item.quantity}</td>
                      <td className="text-right py-4 text-sm">{formatCurrency(item.rate)}</td>
                      <td className="text-right py-4 text-sm font-medium">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-6">
              <div className="w-80 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(invoiceData.subtotal)}</span>
                </div>
                
                {invoiceData.discountRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount ({invoiceData.discountRate}%)</span>
                    <span>-{formatCurrency(invoiceData.discountAmount)}</span>
                  </div>
                )}
                
                {invoiceData.taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax ({invoiceData.taxRate}%)</span>
                    <span>{formatCurrency(invoiceData.taxAmount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-light">
                    <span>Total</span>
                    <span>{formatCurrency(invoiceData.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoiceData.notes && (
          <div className="border-t border-gray-200 pt-8 space-y-3">
            <div className="text-xs uppercase tracking-wider text-gray-400">Notes</div>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {invoiceData.notes}
            </div>
          </div>
        )}
      </div>
    );
  }
);

MinimalTemplate.displayName = 'MinimalTemplate';