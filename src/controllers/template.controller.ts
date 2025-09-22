import { TemplateService, InvoiceTemplate } from "@/services/template.service";
import { ErrorService } from "@/services/error.service";

export interface TemplateControllerResponse {
  success: boolean;
  data?: InvoiceTemplate | InvoiceTemplate[];
  message: string;
  error?: string;
}

export class TemplateController {
  /**
   * Get all available invoice templates
   */
  static async getTemplates(): Promise<TemplateControllerResponse> {
    try {
      const response = await TemplateService.getTemplates();
      return {
        success: response.success,
        data: response.data,
        message: response.message,
        error: response.error,
      };
    } catch (error) {
      ErrorService.logError("TemplateController.getTemplates", error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching templates",
      };
    }
  }

  /**
   * Get a single template by ID
   */
  static async getTemplate(
    templateId: string
  ): Promise<TemplateControllerResponse> {
    try {
      if (!templateId) {
        return {
          success: false,
          message: "Template ID is required",
        };
      }

      const response = await TemplateService.getTemplate(templateId);
      return {
        success: response.success,
        data: response.data,
        message: response.message,
        error: response.error,
      };
    } catch (error) {
      ErrorService.logError("TemplateController.getTemplate", error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching template",
      };
    }
  }

  /**
   * Download template in specified format
   */
  static async downloadTemplate(
    templateId: string,
    format: "pdf" | "word" | "excel"
  ): Promise<TemplateControllerResponse> {
    try {
      if (!templateId) {
        return {
          success: false,
          message: "Template ID is required",
        };
      }

      if (!format || !["pdf", "word", "excel"].includes(format)) {
        return {
          success: false,
          message: "Valid format (pdf, word, excel) is required",
        };
      }

      const response = await TemplateService.downloadTemplate(
        templateId,
        format
      );
      return {
        success: response.success,
        message: response.message,
        error: response.error,
      };
    } catch (error) {
      ErrorService.logError("TemplateController.downloadTemplate", error);
      return {
        success: false,
        message: "An unexpected error occurred while downloading template",
      };
    }
  }
}
