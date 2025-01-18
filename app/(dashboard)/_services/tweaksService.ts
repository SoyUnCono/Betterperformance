"use client";
import axios, { AxiosError } from "axios";
import { Tweak, TweakType } from "@prisma/client";

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
  createTweak: async (
    values: CreateTweakDTO
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      console.log("Creating tweak with values:", values);
      const response = await axios.post<{
        success: boolean;
        data: Tweak;
        error?: string;
      }>("/api/tweaks/create", values);

      if (!response.data.success) {
        console.error("Error from server:", response.data.error);
        return {
          success: false,
          error: response.data.error || "Failed to create tweak",
        };
      }

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error in createTweak:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  updateTweak: async (
    tweakID: string,
    values: UpdateTweakDTO
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakID}/update`,
        values
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error in updateTweak:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Error updating tweak",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  changeTweakType: async (
    tweakID: string,
    tweakType: TweakType
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakID}/type`,
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

  deleteTweak: async (tweakID: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.delete<{
        success: boolean;
        data: Tweak;
        message: string;
      }>(`/api/tweaks/${tweakID}/delete`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error in deleteTweak:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.error || "Error deleting tweak",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  publishTweak: async (tweakID: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakID}/publish`
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
          error: error.response?.data?.error || "Error publishing tweak",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  unpublishTweak: async (tweakID: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakID}/unpublish`
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
          error: error.response?.data?.error || "Error unpublishing tweak",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  toggleSaveTweak: async (tweakID: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakID}/favorite`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error in toggleSaveTweak:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error:
            error.response?.data?.error ||
            "Error toggling tweak favorite status",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  incrementViewCount: async (
    tweakID: string
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(`/api/tweaks/${tweakID}/view`);
      return {
        success: true,
        data: response.data,
      };
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

  incrementDownloadCount: async (
    tweakID: string
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<Tweak>(
        `/api/tweaks/${tweakID}/download`
      );

      if (!response.data) {
        console.error("No data received from download increment");
        return {
          success: false,
          error: "No data received from server",
        };
      }

      return {
        success: true,
        data: {
          ...response.data,
          downloadCount: Number(response.data.downloadCount || 0),
        },
      };
    } catch (error) {
      console.error("Error in incrementDownloadCount:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error:
            error.response?.data?.error || "Error incrementing download count",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },
};
