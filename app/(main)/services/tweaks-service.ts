"use client";
import axios from "axios";
import { Tweak, TweakType } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";

interface CreateTweakDTO {
  title: string;
  short_description?: string;
}

interface UpdateTweakDTO {
  title?: string;
  short_description?: string;
  description?: string;
  author?: string;
  categoryId?: string;
  icon_url?: string;
  regedit?: string;
}

interface ServiceResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export const TweaksService = {
  async createTweak(values: CreateTweakDTO): Promise<ServiceResponse<Tweak>> {
    try {
      const response = await axios.post<ServiceResponse<Tweak>>(
        "/api/tweaks/create",
        values
      );
      if (response.data.success) {
        toast({
          title: "¡Éxito!",
          description: "Tweak creado correctamente",
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error in createTweak:", error);
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.error || "Error al crear el tweak",
        });
        return {
          success: false,
          error: error.response?.data?.error || "Failed to create tweak",
        };
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  updateTweak: async (
    tweakId: string,
    values: UpdateTweakDTO
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/update`,
        values
      );
      if (response.data.success) {
        toast({
          title: "¡Éxito!",
          description: "Tweak actualizado correctamente",
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error in updateTweak:", error);
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.error || "Error al actualizar el tweak",
        });
        return {
          success: false,
          error: error.response?.data?.error || "Error updating tweak",
        };
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  changeTweakType: async (
    tweakId: string,
    tweakType: TweakType
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakId}/type`,
        tweakType
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error in changeTweakType:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Error updating tweak type",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  deleteTweak: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.delete<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/delete`
      );
      if (response.data.success) {
        toast({
          title: "¡Éxito!",
          description: "Tweak eliminado correctamente",
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error in deleteTweak:", error);
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.error || "Error al eliminar el tweak",
        });
        return {
          success: false,
          error: error.response?.data?.error || "Failed to delete tweak",
        };
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  toggleTweakVisibility: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/visibility`
      );
      if (response.data.success) {
        toast({
          title: "¡Éxito!",
          description: "Visibilidad actualizada correctamente",
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error in toggleTweakVisibility:", error);
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.error || "Error al cambiar la visibilidad",
        });
        return {
          success: false,
          error: error.response?.data?.error || "Failed to toggle visibility",
        };
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  publishTweak: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakId}/publish`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error in publishTweak:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to publish tweak",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  unpublishTweak: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakId}/unpublish`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error in unpublishTweak:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Failed to unpublish tweak",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  toggleSaveTweak: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/favorite`
      );
      if (response.data.success) {
        toast({
          title: "¡Éxito!",
          description: "Estado de favorito actualizado",
        });
      }
      return response.data;
    } catch (error) {
      console.error("Error in toggleSaveTweak:", error);
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.error || "Error al cambiar estado de favorito",
        });
        return {
          success: false,
          error: error.response?.data?.error || "Failed to toggle favorite",
        };
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  incrementViewCount: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/view`
      );
      return response.data;
    } catch (error) {
      console.error("Error in incrementViewCount:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Error incrementing view count",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  incrementDownloadCount: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/download`
      );
      return response.data;
    } catch (error) {
      console.error("Error in incrementDownloadCount:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Error incrementing download count",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },
};
