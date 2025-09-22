import { supabase } from "@/lib/supabase";
import { ErrorService } from "./error.service";

export interface Client {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientServiceResponse {
  success: boolean;
  data?: Client | Client[];
  message: string;
  error?: string;
}

export class ClientService {
  /**
   * Get all clients for a user
   */
  static async getClients(userId: string): Promise<ClientServiceResponse> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        ErrorService.logError("ClientService.getClients", error);
        return {
          success: false,
          message: "Failed to fetch clients",
          error: error.message,
        };
      }

      return {
        success: true,
        data: data || [],
        message: "Clients fetched successfully",
      };
    } catch (error) {
      ErrorService.logError("ClientService.getClients", error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching clients",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }

  /**
   * Get a single client by ID
   */
  static async getClient(
    clientId: string,
    userId: string
  ): Promise<ClientServiceResponse> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        ErrorService.logError("ClientService.getClient", error);
        return {
          success: false,
          message: "Failed to fetch client",
          error: error.message,
        };
      }

      return {
        success: true,
        data: data || null,
        message: data ? "Client fetched successfully" : "Client not found",
      };
    } catch (error) {
      ErrorService.logError("ClientService.getClient", error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching client",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }

  /**
   * Create a new client
   */
  static async createClient(
    userId: string,
    clientData: Omit<Client, "id" | "user_id" | "created_at" | "updated_at">
  ): Promise<ClientServiceResponse> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .insert({
          user_id: userId,
          ...clientData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        ErrorService.logError("ClientService.createClient", error);
        return {
          success: false,
          message: "Failed to create client",
          error: error.message,
        };
      }

      return {
        success: true,
        data,
        message: "Client created successfully",
      };
    } catch (error) {
      ErrorService.logError("ClientService.createClient", error);
      return {
        success: false,
        message: "An unexpected error occurred while creating client",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }

  /**
   * Update an existing client
   */
  static async updateClient(
    clientId: string,
    userId: string,
    updates: Partial<Omit<Client, "id" | "user_id" | "created_at">>
  ): Promise<ClientServiceResponse> {
    try {
      const { data, error } = await supabase
        .from("clients")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        ErrorService.logError("ClientService.updateClient", error);
        return {
          success: false,
          message: "Failed to update client",
          error: error.message,
        };
      }

      return {
        success: true,
        data,
        message: "Client updated successfully",
      };
    } catch (error) {
      ErrorService.logError("ClientService.updateClient", error);
      return {
        success: false,
        message: "An unexpected error occurred while updating client",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }

  /**
   * Delete a client
   */
  static async deleteClient(
    clientId: string,
    userId: string
  ): Promise<ClientServiceResponse> {
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId)
        .eq("user_id", userId);

      if (error) {
        ErrorService.logError("ClientService.deleteClient", error);
        return {
          success: false,
          message: "Failed to delete client",
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Client deleted successfully",
      };
    } catch (error) {
      ErrorService.logError("ClientService.deleteClient", error);
      return {
        success: false,
        message: "An unexpected error occurred while deleting client",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }
}
