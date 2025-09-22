import { ClientService, Client } from "@/services/client.service";
import { ValidationService } from "@/services/validation.service";
import { ErrorService } from "@/services/error.service";

export interface ClientControllerResponse {
  success: boolean;
  data?: Client | Client[];
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export class ClientController {
  /**
   * Get all clients for a user
   */
  static async getClients(userId: string): Promise<ClientControllerResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const response = await ClientService.getClients(userId);
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ClientController.getClients", error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching clients",
      };
    }
  }

  /**
   * Get a single client by ID
   */
  static async getClient(
    clientId: string,
    userId: string
  ): Promise<ClientControllerResponse> {
    try {
      if (!clientId) {
        return {
          success: false,
          message: "Client ID is required",
        };
      }

      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const response = await ClientService.getClient(clientId, userId);
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ClientController.getClient", error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching client",
      };
    }
  }

  /**
   * Create a new client with validation
   */
  static async createClient(
    userId: string,
    clientData: Omit<Client, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<ClientControllerResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      // Validate client data
      const validation = this.validateClientData(clientData);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        };
      }

      // Clean and prepare data
      const cleanedData = this.cleanClientData(clientData);

      const response = await ClientService.createClient(userId, cleanedData);
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ClientController.createClient", error);
      return {
        success: false,
        message: "An unexpected error occurred while creating client",
      };
    }
  }

  /**
   * Update an existing client with validation
   */
  static async updateClient(
    clientId: string,
    userId: string,
    updates: Partial<Omit<Client, "id" | "user_id" | "created_at">>
  ): Promise<ClientControllerResponse> {
    try {
      if (!clientId) {
        return {
          success: false,
          message: "Client ID is required",
        };
      }

      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      // Validate only the fields being updated
      const validation = this.validateClientData(updates, true);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        };
      }

      const cleanedData = this.cleanClientData(updates);
      const response = await ClientService.updateClient(
        clientId,
        userId,
        cleanedData
      );

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ClientController.updateClient", error);
      return {
        success: false,
        message: "An unexpected error occurred while updating client",
      };
    }
  }

  /**
   * Delete a client
   */
  static async deleteClient(
    clientId: string,
    userId: string
  ): Promise<ClientControllerResponse> {
    try {
      if (!clientId) {
        return {
          success: false,
          message: "Client ID is required",
        };
      }

      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const response = await ClientService.deleteClient(clientId, userId);
      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ClientController.deleteClient", error);
      return {
        success: false,
        message: "An unexpected error occurred while deleting client",
      };
    }
  }

  /**
   * Validate client data
   */
  private static validateClientData(
    data: Partial<Omit<Client, "id" | "user_id" | "created_at" | "updated_at">>,
    isUpdate: boolean = false
  ): { isValid: boolean; errors: Array<{ field: string; message: string }> } {
    const errors: Array<{ field: string; message: string }> = [];

    // Validate name if provided
    if (data.name !== undefined) {
      if (!data.name.trim()) {
        errors.push({
          field: "name",
          message: "Client name is required",
        });
      } else if (data.name.trim().length < 2) {
        errors.push({
          field: "name",
          message: "Client name must be at least 2 characters",
        });
      } else if (data.name.trim().length > 100) {
        errors.push({
          field: "name",
          message: "Client name must be less than 100 characters",
        });
      }
    }

    // Validate email if provided
    if (data.email !== undefined) {
      if (!data.email.trim()) {
        errors.push({
          field: "email",
          message: "Email is required",
        });
      } else {
        const emailValidation = ValidationService.validateEmail(data.email);
        if (!emailValidation.isValid) {
          errors.push({
            field: "email",
            message: emailValidation.message,
          });
        }
      }
    }

    // Validate address if provided
    if (
      data.address !== undefined &&
      data.address &&
      data.address.length > 500
    ) {
      errors.push({
        field: "address",
        message: "Address must be less than 500 characters",
      });
    }

    // For create operations, ensure required fields are present
    if (!isUpdate) {
      if (!data.name || !data.email) {
        if (!data.name) {
          errors.push({
            field: "name",
            message: "Client name is required",
          });
        }
        if (!data.email) {
          errors.push({
            field: "email",
            message: "Email is required",
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clean client data
   */
  private static cleanClientData(
    data: Partial<Omit<Client, "id" | "user_id" | "created_at" | "updated_at">>
  ): Partial<Omit<Client, "id" | "user_id" | "created_at" | "updated_at">> {
    const cleaned: Partial<
      Omit<Client, "id" | "user_id" | "created_at" | "updated_at">
    > = {};

    // Clean string fields
    if (data.name !== undefined) {
      cleaned.name = data.name.trim();
    }
    if (data.email !== undefined) {
      cleaned.email = data.email.trim().toLowerCase();
    }
    if (data.address !== undefined) {
      cleaned.address = data.address?.trim() || null;
    }

    return cleaned;
  }
}
