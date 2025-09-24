import { Configuration, OpenAIApi } from "openai";
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
      notes: string;
    };
  };
  message: string;
  error?: string;
}

export class AIService {
  private static openai: OpenAIApi | null = null;

  /**
   * Initialize OpenAI client
   */
  private static getOpenAIClient(): OpenAIApi {
    if (!this.openai) {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables."
        );
      }
      const configuration = new Configuration({
        apiKey: apiKey,
      });
      this.openai = new OpenAIApi(configuration);
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

1. Business Information (use these if provided, otherwise generate realistic ones):
   - Business Name: ${
     request.businessName || "Generate a professional business name"
   }
   - Email: ${request.businessEmail || "Generate a professional email"}
   - Phone: ${request.businessPhone || "Generate a professional phone number"}
   - Address: ${
     request.businessAddress || "Generate a professional business address"
   }

2. Client Information (extract from description or generate realistic):
   - Client Name
   - Client Email  
   - Client Address

3. Line Items (extract services/products from description):
   - Professional descriptions
   - Realistic quantities
   - Reasonable rates
   - Calculated amounts

4. Invoice Details:
   - Invoice number (format: INV-YYYY-NNNN)
   - Issue date (today's date)
   - Due date (30 days from issue date)
   - Currency (USD unless specified)
   - Tax rate (8-15% unless specified)
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
      "description": "Service description",
      "quantity": 1,
      "rate": 100,
      "amount": 100
    }
  ],
  "invoiceDetails": {
    "invoiceNumber": "INV-2024-0001",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-14", 
    "currency": "USD",
    "taxRate": 10,
    "notes": "Thank you for your business! Payment is due within 30 days."
  }
}

Make sure all data is realistic, professional, and appropriate for the described services.`;

      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional business consultant who specializes in creating detailed, realistic invoices. Always provide accurate, professional, and industry-appropriate data.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseText = completion.data.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("No response from OpenAI");
      }

      // Parse the JSON response
      const aiResponse = JSON.parse(responseText);

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
        (item: any, index: number) => ({
          id: `ai-generated-${Date.now()}-${index}`,
          description: item.description || "Service",
          quantity: Math.max(1, parseInt(item.quantity) || 1),
          rate: Math.max(0, parseFloat(item.rate) || 0),
          amount: Math.max(0, parseFloat(item.amount) || 0),
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
            notes:
              aiResponse.invoiceDetails.notes || "Thank you for your business!",
          },
        },
        message: "AI invoice generated successfully",
      };
    } catch (error: any) {
      ErrorService.logError("AIService.generateInvoiceFromDescription", error);
      return {
        success: false,
        message: "Failed to generate AI invoice",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
