import OpenAI from "openai";
import { ErrorService } from "./error.service";

export interface AIInvoiceRequest {
  prompt: string;
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: string;
  language?: string; // Support for different languages
  templateStyle?: "professional" | "creative" | "minimal"; // Different invoice styles
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
      phone?: string; // Added optional phone
    };
    lineItems: Array<{
      id: string;
      description: string;
      quantity: number;
      rate: number;
      amount: number;
      category?: string; // Optional categorization
    }>;
    invoiceDetails: {
      invoiceNumber: string;
      issueDate: string;
      dueDate: string;
      currency: string;
      taxRate: number;
      discountRate: number;
      discountAmount?: number; // Calculated discount amount
      subtotal: number; // Added subtotal calculation
      taxAmount: number; // Added tax amount calculation
      total: number; // Added total calculation
      notes: string;
      terms?: string; // Optional terms and conditions
      paymentMethods?: string[]; // Optional payment methods
    };
    metadata?: {
      processingTime: number;
      tokensUsed: number;
      confidence: number; // AI confidence score
    };
  };
  message: string;
  error?: string;
  suggestions?: string[]; // Suggestions for improvement
}

// Enhanced validation schemas
const MAX_LINE_ITEMS = 50;
const MAX_PROMPT_LENGTH = 2000;

export class AIService {
  private static openai: OpenAI | null = null;
  private static requestCache = new Map<string, AIInvoiceResponse>();
  private static readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  // Enhanced model configuration with fallback
  private static readonly MODELS = {
    primary: import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini",
    fallback: "gpt-3.5-turbo-1106",
  };

  /**
   * Initialize OpenAI client with enhanced error handling
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
        timeout: 30000, // 30 second timeout
        maxRetries: 2, // Retry failed requests
      });
    }
    return this.openai;
  }

  /**
   * Generate cache key for request
   */
  private static getCacheKey(request: AIInvoiceRequest): string {
    return JSON.stringify({
      prompt: request.prompt.trim().toLowerCase(),
      businessName: request.businessName,
      businessEmail: request.businessEmail,
      language: request.language,
      templateStyle: request.templateStyle,
    });
  }

  /**
   * Validate request input
   */
  private static validateRequest(request: AIInvoiceRequest): {
    isValid: boolean;
    error?: string;
  } {
    if (!request.prompt || request.prompt.trim().length === 0) {
      return { isValid: false, error: "Prompt cannot be empty" };
    }

    if (request.prompt.length > MAX_PROMPT_LENGTH) {
      return {
        isValid: false,
        error: `Prompt too long. Maximum ${MAX_PROMPT_LENGTH} characters allowed`,
      };
    }

    if (
      request.businessEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.businessEmail)
    ) {
      return { isValid: false, error: "Invalid business email format" };
    }

    return { isValid: true };
  }

  /**
   * Calculate invoice totals
   */
  private static calculateTotals(
    lineItems: any[],
    taxRate: number,
    discountRate: number
  ) {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    const discountAmount = (subtotal * discountRate) / 100;
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = (discountedSubtotal * taxRate) / 100;
    const total = discountedSubtotal + taxAmount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  /**
   * Enhanced prompt generation with better context
   */
  private static generatePrompt(request: AIInvoiceRequest): string {
    const currentDate = new Date().toISOString().split("T")[0];
    const language = request.language || "English";
    const style = request.templateStyle || "professional";

    return `You are an expert business consultant specializing in invoice generation. Generate a complete, ${style} invoice based on the user's description.

CONTEXT:
- Current Date: ${currentDate}
- Language: ${language}
- Style: ${style}
- Supports ALL currencies (USD, EUR, GBP, BWP, ZAR, CAD, AUD, JPY, CHF, SEK, NOK, DKK, etc.)

USER'S REQUEST: "${request.prompt}"

BUSINESS INFO (use if provided, otherwise generate realistic data):
- Name: ${request.businessName || "[Generate professional business name]"}
- Email: ${request.businessEmail || "[Generate professional email]"}
- Phone: ${request.businessPhone || "[Generate phone number]"}
- Address: ${request.businessAddress || "[Generate business address]"}

REQUIREMENTS:
1. Extract or generate realistic client information from the description
2. Create appropriate line items with generic service descriptions (NEVER include client names in descriptions)
3. Use EXACT currency mentioned in description (look for BWP, USD, EUR, etc.)
4. Extract discount percentages from phrases like "5% discount", "discount of 10%"
5. Generate professional invoice numbers (format: INV-YYYY-NNNN)
6. Set realistic due dates (typically 15-30 days from issue date)
7. Include appropriate tax rates (8-15% if not specified)
8. Add professional notes and terms

CRITICAL RULES:
- Line item descriptions must be generic (e.g., "Consultation Services", "Web Development")
- Currency MUST match what's mentioned in the request
- Discount rates should be extracted from the description
- All amounts should be realistic and properly calculated
- Invoice numbers should be sequential and professional

Return ONLY valid JSON in this exact format:
{
  "businessInfo": {
    "name": "Professional Business Name",
    "email": "contact@business.com",
    "phone": "+1 (555) 123-4567",
    "address": "123 Business Street, City, State 12345"
  },
  "clientInfo": {
    "name": "Client Company Name",
    "email": "client@company.com",
    "address": "456 Client Avenue, City, State 67890",
    "phone": "+1 (555) 987-6543"
  },
  "lineItems": [
    {
      "description": "Consultation Services",
      "quantity": 10,
      "rate": 150,
      "amount": 1500,
      "category": "Consulting"
    }
  ],
  "invoiceDetails": {
    "invoiceNumber": "INV-2024-0001",
    "issueDate": "${currentDate}",
    "dueDate": "2024-02-15",
    "currency": "USD",
    "taxRate": 10,
    "discountRate": 0,
    "notes": "Thank you for your business. Payment is due within 30 days.",
    "terms": "Payment terms: Net 30 days. Late fees may apply.",
    "paymentMethods": ["Bank Transfer", "Credit Card", "PayPal"]
  },
  "confidence": 85
}`;
  }

  /**
   * Generate complete invoice data from description with enhanced features
   */
  static async generateInvoiceFromDescription(
    request: AIInvoiceRequest
  ): Promise<AIInvoiceResponse> {
    const startTime = Date.now();

    try {
      // Validate input
      const validation = this.validateRequest(request);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Invalid request",
          error: validation.error,
        };
      }

      // Check cache
      const cacheKey = this.getCacheKey(request);
      const cached = this.requestCache.get(cacheKey);
      if (cached && Date.now() - startTime < this.CACHE_TTL) {
        return {
          ...cached,
          message: "Invoice generated successfully (from cache)",
        };
      }

      const openai = this.getOpenAIClient();
      const prompt = this.generatePrompt(request);

      let completion;
      try {
        // Try primary model first
        completion = await openai.chat.completions.create({
          model: this.MODELS.primary,
          messages: [
            {
              role: "system",
              content: `You are a professional invoice generation AI. Always return valid JSON only. Be precise with currency detection and discount extraction. Generate realistic, professional data that matches the user's requirements.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.2, // Lower temperature for consistency
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        });
      } catch (modelError) {
        // Fallback to cheaper model if primary fails
        console.warn("Primary model failed, using fallback:", modelError);
        completion = await openai.chat.completions.create({
          model: this.MODELS.fallback,
          messages: [
            {
              role: "system",
              content:
                "You are a professional invoice generator. Return only valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1500,
          temperature: 0.3,
        });
      }

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("No response from OpenAI");
      }

      // Extract JSON with improved parsing
      let jsonText = responseText.trim();
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }

      // Parse and validate JSON
      let aiResponse;
      try {
        aiResponse = JSON.parse(jsonText);
      } catch (parseError) {
        // Try to fix common JSON issues
        jsonText = jsonText.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
        aiResponse = JSON.parse(jsonText);
      }

      // Validate response structure
      if (
        !aiResponse.businessInfo ||
        !aiResponse.clientInfo ||
        !aiResponse.lineItems ||
        !aiResponse.invoiceDetails
      ) {
        throw new Error(
          "Invalid response format from AI - missing required fields"
        );
      }

      if (aiResponse.lineItems.length > MAX_LINE_ITEMS) {
        aiResponse.lineItems = aiResponse.lineItems.slice(0, MAX_LINE_ITEMS);
      }

      // Process and validate line items
      const validatedLineItems = aiResponse.lineItems.map(
        (item: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          description: String(item.description || "Service").substring(0, 200),
          quantity: Math.max(
            1,
            Math.min(10000, parseInt(String(item.quantity)) || 1)
          ),
          rate: Math.max(
            0,
            Math.min(1000000, parseFloat(String(item.rate)) || 0)
          ),
          amount: Math.max(
            0,
            Math.min(10000000, parseFloat(String(item.amount)) || 0)
          ),
          category: item.category
            ? String(item.category).substring(0, 50)
            : undefined,
        })
      );

      // Calculate totals
      const taxRate = Math.max(
        0,
        Math.min(50, parseFloat(aiResponse.invoiceDetails.taxRate) || 0)
      );
      const discountRate = Math.max(
        0,
        Math.min(100, parseFloat(aiResponse.invoiceDetails.discountRate) || 0)
      );
      const totals = this.calculateTotals(
        validatedLineItems,
        taxRate,
        discountRate
      );

      const processingTime = Date.now() - startTime;
      const tokensUsed = completion.usage?.total_tokens || 0;

      const response: AIInvoiceResponse = {
        success: true,
        data: {
          businessInfo: {
            name: String(
              aiResponse.businessInfo.name || "Your Business"
            ).substring(0, 100),
            email: String(
              aiResponse.businessInfo.email || "business@email.com"
            ).substring(0, 100),
            phone: String(
              aiResponse.businessInfo.phone || "+1 (555) 123-4567"
            ).substring(0, 50),
            address: String(
              aiResponse.businessInfo.address ||
                "123 Business St, City, State 12345"
            ).substring(0, 200),
          },
          clientInfo: {
            name: String(aiResponse.clientInfo.name || "Client Name").substring(
              0,
              100
            ),
            email: String(
              aiResponse.clientInfo.email || "client@email.com"
            ).substring(0, 100),
            address: String(
              aiResponse.clientInfo.address ||
                "456 Client Ave, City, State 67890"
            ).substring(0, 200),
            phone: aiResponse.clientInfo.phone
              ? String(aiResponse.clientInfo.phone).substring(0, 50)
              : undefined,
          },
          lineItems: validatedLineItems,
          invoiceDetails: {
            invoiceNumber: String(
              aiResponse.invoiceDetails.invoiceNumber ||
                `INV-${new Date().getFullYear()}-0001`
            ),
            issueDate:
              aiResponse.invoiceDetails.issueDate ||
              new Date().toISOString().split("T")[0],
            dueDate:
              aiResponse.invoiceDetails.dueDate ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            currency: aiResponse.invoiceDetails.currency || "USD",
            taxRate,
            discountRate,
            discountAmount: totals.discountAmount,
            subtotal: totals.subtotal,
            taxAmount: totals.taxAmount,
            total: totals.total,
            notes: String(
              aiResponse.invoiceDetails.notes || "Thank you for your business!"
            ).substring(0, 500),
            terms: aiResponse.invoiceDetails.terms
              ? String(aiResponse.invoiceDetails.terms).substring(0, 500)
              : undefined,
            paymentMethods: Array.isArray(
              aiResponse.invoiceDetails.paymentMethods
            )
              ? aiResponse.invoiceDetails.paymentMethods.slice(0, 5)
              : undefined,
          },
          metadata: {
            processingTime,
            tokensUsed,
            confidence: Math.max(0, Math.min(100, aiResponse.confidence || 75)),
          },
        },
        message: "Invoice generated successfully",
      };

      // Cache the response
      this.requestCache.set(cacheKey, response);

      // Clean old cache entries
      if (this.requestCache.size > 100) {
        const oldestKey = this.requestCache.keys().next().value;
        this.requestCache.delete(oldestKey);
      }

      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      ErrorService.logError(
        "AIService.generateInvoiceFromDescription",
        errorMessage
      );

      return {
        success: false,
        message: "Failed to generate AI invoice",
        error: errorMessage,
        suggestions: [
          "Try simplifying your prompt",
          "Check if all required information is provided",
          "Ensure your OpenAI API key is valid",
          "Try again in a few moments",
        ],
      };
    }
  }

  /**
   * Clear cache (useful for testing or memory management)
   */
  static clearCache(): void {
    this.requestCache.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.requestCache.size,
      keys: Array.from(this.requestCache.keys()),
    };
  }
}
