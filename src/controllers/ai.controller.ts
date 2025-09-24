import {
  AIService,
  AIInvoiceRequest,
  AIInvoiceResponse,
} from "@/services/ai.service";

export class AIController {
  /**
   * Generate complete invoice data from description
   */
  static async generateInvoiceFromDescription(
    request: AIInvoiceRequest
  ): Promise<AIInvoiceResponse> {
    // Validate input
    const errors: { field: string; message: string }[] = [];

    if (!request.prompt || request.prompt.trim() === "") {
      errors.push({
        field: "prompt",
        message: "Invoice description is required",
      });
    }

    if (request.prompt && request.prompt.trim().length < 10) {
      errors.push({
        field: "prompt",
        message:
          "Please provide a more detailed description (at least 10 characters)",
      });
    }

    if (errors.length > 0) {
      return {
        success: false,
        message: "Validation failed",
        error: errors.map((e) => `${e.field}: ${e.message}`).join(", "),
      };
    }

    return AIService.generateInvoiceFromDescription(request);
  }
}
