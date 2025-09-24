import OpenAI from "openai";
import { ErrorService } from "./error.service";

export interface AIInvoiceRequest {
  prompt: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
}

export interface AIInvoiceResponse {
  success: boolean;
  data?: {
    businessInfo: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    clientInfo: {
      name: string;
      email: string;
      address: string;
    };
    lineItems: Array<{
      id: string;
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }>;
    invoiceDetails: {
      invoiceNumber: string;
      issueDate: string;
      dueDate: string;
      currency: string;
      taxRate: number;
      discountRate: number;
      notes: string;
    };
  };
  message: string;
  error?: string;
}

export class AIService {
  private static openai: OpenAI | null = null;

  // Cost-effective model options (cheapest to most expensive):
  // - gpt-3.5-turbo-1106: Latest 3.5 turbo, most cost-effective (~$0.001/1K tokens)
  // - gpt-3.5-turbo: Standard 3.5 turbo (~$0.002/1K tokens)
  // - gpt-4o-mini: Cheapest GPT-4 model (~$0.00015/1K tokens input, ~$0.0006/1K tokens output)
  // - gpt-4o: Most capable but expensive (~$0.005/1K tokens input, ~$0.015/1K tokens output)
  private static readonly MODEL =
    import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini";

  /**
   * Initialize OpenAI client
   */
  private static getOpenAIClient(): OpenAI {
    if (!this.openai) {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables."
        );
      }
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });
    }
    return this.openai;
  }

  /**
   * Generate complete invoice data from description
   */
  static async generateInvoiceFromDescription(
    request: AIInvoiceRequest
  ): Promise<AIInvoiceResponse> {
    try {
      const openai = this.getOpenAIClient();

      const prompt = `You are an AI assistant that generates complete invoice data from a user's description. 

User's description: "${request.prompt}"

Based on this description, generate a complete invoice with the following structure:

1. Business Information (use these if provided):
   - Business Name: ${request.businessName || ""}
   - Email: ${request.businessEmail || ""}
   - Phone: ${request.businessPhone || ""}
   - Address: ${request.businessAddress || ""}

2. Client Information (extract from description):
   - Client Name
   - Client Email  
   - Client Address

3. Line Items (extract services/products from description):
   - Generic service descriptions (do NOT include client names in descriptions)
   - Realistic quantities
   - Reasonable rates
   - Calculated amounts

4. Invoice Details:
   - Invoice number (format: INV-YYYY-NNNN)
   - Issue date (extract from description or use today's date)
   - Due date (extract from description or calculate from issue date)
   - Currency (extract from description - look for currency codes like USD, EUR, GBP, BWP, etc.)
   - Tax rate (extract from description or use 8-15% if not specified)
   - Discount rate (IMPORTANT: Look for phrases like "discount of X%", "X% discount", "give a discount of X%" - extract the percentage and use it)
   - Professional notes

Return the response in this exact JSON format:
{
  "businessInfo": {
    "name": "Business Name",
    "email": "business@email.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Business St, City, State 12345"
  },
  "clientInfo": {
    "name": "Client Name",
    "email": "client@email.com", 
    "address": "456 Client Ave, City, State 67890"
  },
  "lineItems": [
    {
      "description": "Consultation Services",
      "quantity": 3,
      "rate": 500,
      "amount": 1500
    }
  ],
  "invoiceDetails": {
    "invoiceNumber": "INV-2024-0001",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-14", 
    "currency": "BWP",
    "taxRate": 10,
    "discountRate": 5,
    "notes": "Thank you for your business! Payment is due within 30 days."
  }
}

Make sure all data is realistic, professional, and appropriate for the described services.

CRITICAL: Line item descriptions must be generic service names only (e.g., "Consultation Services", "Web Development", "Design Work"). Do NOT include client names, company names, or specific project details in the line item descriptions.

CURRENCY EXTRACTION: Pay special attention to currency codes in the description (BWP, USD, EUR, GBP, etc.) and use the EXACT currency mentioned. Do NOT default to USD if another currency is specified.

DISCOUNT EXTRACTION: Look for discount percentages in phrases like "discount of 5%", "5% discount", "give a discount of 5%", etc. and set the discountRate field to the extracted percentage.

EXAMPLE: If user says "BWP 500 per hour", use "BWP" as the currency, not "USD".
EXAMPLE: If user says "give a discount of 5%", set discountRate to 5.`;

      const completion = await openai.chat.completions.create({
        model: this.MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a professional business consultant who specializes in creating detailed, realistic invoices. Always provide accurate, professional, and industry-appropriate data. IMPORTANT: Line item descriptions should be generic service descriptions (e.g., 'Consultation Services', 'Web Development', 'Design Work') and should NEVER include client names or company names in the description. CRITICAL: Always extract and use the exact currency specified in the user's description (e.g., BWP, USD, EUR, GBP, etc.) - do NOT default to USD if another currency is mentioned. DISCOUNT EXTRACTION: Pay special attention to discount percentages mentioned in the user's description (e.g., 'discount of 5%', '5% discount', 'give a discount of 5%') and ALWAYS include the discountRate field with the extracted percentage.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500, // Reduced for cost savings
        temperature: 0.3, // Lower temperature for more consistent, cheaper responses
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("No response from OpenAI");
      }

      // Extract JSON from markdown code blocks if present
      let jsonText = responseText;
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      // Parse the JSON response
      const aiResponse = JSON.parse(jsonText);

      // Validate the response structure
      if (
        !aiResponse.businessInfo ||
        !aiResponse.clientInfo ||
        !aiResponse.lineItems ||
        !aiResponse.invoiceDetails
      ) {
        throw new Error("Invalid response format from AI");
      }

      // Ensure all line items have required fields and generate IDs
      const validatedLineItems = aiResponse.lineItems.map(
        (
          item: {
            description?: string;
            quantity?: number;
            rate?: number;
            amount?: number;
          },
          index: number
        ) => ({
          id: `ai-generated-${Date.now()}-${index}`,
          description: item.description || "Service",
          quantity: Math.max(1, parseInt(String(item.quantity)) || 1),
          rate: Math.max(0, parseFloat(String(item.rate)) || 0),
          amount: Math.max(0, parseFloat(String(item.amount)) || 0),
        })
      );

      return {
        success: true,
        data: {
          businessInfo: {
            name: aiResponse.businessInfo.name || "Your Business",
            email: aiResponse.businessInfo.email || "business@email.com",
            phone: aiResponse.businessInfo.phone || "+1 (555) 123-4567",
            address:
              aiResponse.businessInfo.address ||
              "123 Business St, City, State 12345",
          },
          clientInfo: {
            name: aiResponse.clientInfo.name || "Client Name",
            email: aiResponse.clientInfo.email || "client@email.com",
            address:
              aiResponse.clientInfo.address ||
              "456 Client Ave, City, State 67890",
          },
          lineItems: validatedLineItems,
          invoiceDetails: {
            invoiceNumber:
              aiResponse.invoiceDetails.invoiceNumber || "INV-2024-0001",
            issueDate:
              aiResponse.invoiceDetails.issueDate ||
              new Date().toISOString().split("T")[0],
            dueDate:
              aiResponse.invoiceDetails.dueDate ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            currency: aiResponse.invoiceDetails.currency || "USD",
            taxRate: Math.max(
              0,
              Math.min(50, parseFloat(aiResponse.invoiceDetails.taxRate) || 10)
            ),
            discountRate: Math.max(
              0,
              Math.min(
                100,
                parseFloat(aiResponse.invoiceDetails.discountRate) || 0
              )
            ),
            notes:
              aiResponse.invoiceDetails.notes || "Thank you for your business!",
          },
        },
        message: "AI invoice generated successfully",
      };
    } catch (error: unknown) {
      ErrorService.logError(
        "AIService.generateInvoiceFromDescription",
        error instanceof Error ? error.message : String(error)
      );
      return {
        success: false,
        message: "Failed to generate AI invoice",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
