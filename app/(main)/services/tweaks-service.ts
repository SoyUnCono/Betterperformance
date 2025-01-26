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
  success: boolean;
  data?: T;
  error?: string;
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
          title: "Success!",
          description: "Tweak created successfully",
          variant: "success",
        });
        return response.data;
      }
      toast({
        title: "Error",
        description: response.data.error || "Error creating tweak",
        variant: "error",
      });
      return response.data;
    } catch (error) {
      console.error("Error in createTweak:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Error creating tweak";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "error",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "error",
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
          title: "Updated",
          description: "Tweak updated successfully",
          variant: "default",
        });
        return response.data;
      }
      toast({
        title: "Error",
        description: response.data.error || "Error updating tweak",
        variant: "default",
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateTweak:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Error updating tweak";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "default",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "default",
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
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/type`,
        { type: tweakType }
      );
      if (response.data.success) {
        toast({
          title: "Updated",
          description: "Tweak type updated successfully",
          variant: "default",
        });
        return response.data;
      }
      toast({
        title: "Error",
        description: response.data.error || "Error updating tweak type",
        variant: "default",
      });
      return response.data;
    } catch (error) {
      console.error("Error in changeTweakType:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Error updating tweak type";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "default",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "default",
      });
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
          title: "Deleted",
          description: "Tweak deleted successfully",
          variant: "default",
        });
        return response.data;
      }
      toast({
        title: "Error",
        description: response.data.error || "Error deleting tweak",
        variant: "default",
      });
      return response.data;
    } catch (error) {
      console.error("Error in deleteTweak:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Error deleting tweak";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "default",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "default",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  toggleTweakVisibility: async (
    tweakId: string
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/visibility`
      );
      if (response.data.success) {
        toast({
          title: "Updated",
          description: "Visibility updated successfully",
          variant: "default",
        });
        return response.data;
      }
      toast({
        title: "Error",
        description: response.data.error || "Error changing visibility",
        variant: "default",
      });
      return response.data;
    } catch (error) {
      console.error("Error in toggleTweakVisibility:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Error changing visibility";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "default",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "default",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  publishTweak: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/publish`
      );
      if (response.data.success) {
        toast({
          title: "Success!",
          description: "Tweak published successfully",
          variant: "default",
        });
        return response.data;
      }
      toast({
        title: "Error",
        description: response.data.error || "Error publishing tweak",
        variant: "default",
      });
      return response.data;
    } catch (error) {
      console.error("Error in publishTweak:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Error publishing tweak";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "default",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "default",
      });
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
          title: "Updated",
          description: "Favorite status updated",
          variant: "default",
        });
        return response.data;
      }
      toast({
        title: "Error",
        description: response.data.error || "Error updating favorite status",
        variant: "default",
      });
      return response.data;
    } catch (error) {
      console.error("Error in toggleSaveTweak:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Error updating favorite status";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "default",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "default",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  incrementViewCount: async (
    tweakId: string
  ): Promise<ServiceResponse<Tweak>> => {
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

  incrementDownloadCount: async (
    tweakId: string
  ): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/download`
      );
      if (response.data.success) {
        toast({
          title: "Success!",
          description: "Tweak downloaded successfully",
          variant: "success",
        });
        return response.data;
      }
      toast({
        title: "Error",
        description: response.data.error || "Error downloading tweak",
        variant: "error",
      });
      return response.data;
    } catch (error) {
      console.error("Error in incrementDownloadCount:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Error downloading tweak";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "error",
        });
        return {
          success: false,
          error: errorMessage,
        };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "error",
      });
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },

  downloadTweak: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      // First I increment the download counter
      const downloadResult =
        await TweaksService.incrementDownloadCount(tweakId);
      if (!downloadResult.success) {
        return downloadResult;
      }

      // I get the tweak data
      const tweak = downloadResult.data;
      if (!tweak || !tweak.regedit) {
        return {
          success: false,
          error: "Tweak not found or has no content",
        };
      }

      // I determine the file type and comment prefix
      let fileExt = ".reg";
      let commentPrefix = ";";

      switch (tweak.tweak_type?.toLowerCase()) {
        case "batch":
          fileExt = ".bat";
          commentPrefix = "REM";
          break;
        case "powershell":
          fileExt = ".ps1";
          commentPrefix = "#";
          break;
        case "registry":
          fileExt = ".reg";
          commentPrefix = ";";
          break;
        default:
          fileExt = ".txt";
          commentPrefix = "#";
      }

      // I create the warning message
      const warningMessage =
        fileExt === ".reg"
          ? "Windows Registry Editor Version 5.00\r\n\r\n"
          : "";
      const warning =
        `${warningMessage}${commentPrefix} ⚠️ WARNING ⚠️\r\n\r\n` +
        `${commentPrefix} BetterPerformance is not responsible for any misuse of the tweaks generated by this website.\r\n` +
        `${commentPrefix} These tweaks are automatically created as soon as you click the "Download" button.\r\n\r\n` +
        `${commentPrefix} IMPORTANT:\r\n` +
        `${commentPrefix} Before applying any tweak, please make sure to create a restore point.\r\n` +
        `${commentPrefix} This will allow you to revert changes in case you are not satisfied with the before/after effects of the tweak.\r\n\r\n` +
        `${commentPrefix} The services offered by BetterPerformance are COMPLETELY FREE.\r\n` +
        `${commentPrefix} However, we appreciate any donations you may want to make to help maintain the website and ensure its continuity.\r\n\r\n` +
        `${commentPrefix} It is STRICTLY FORBIDDEN to sell any of the tweaks generated by this website\r\n` +
        `${commentPrefix} or to commercialize any service related to the use of this platform.\r\n` +
        `${commentPrefix} If it is proven that a user is violating this rule, the following actions will be taken:\r\n\r\n` +
        `${commentPrefix}     Permanent ban of the user to prevent future access to the website.\r\n` +
        `${commentPrefix}     Legal actions against the user, if applicable.\r\n\r\n` +
        `${commentPrefix} COPYRIGHT NOTICE:\r\n` +
        `${commentPrefix} All copyright rights are reserved by BetterPerformance.\r\n` +
        `${commentPrefix} While some elements of the tweaks may not be 100% original to the author,\r\n` +
        `${commentPrefix} their development is entirely managed and created by BetterPerformance.\r\n\r\n` +
        `${commentPrefix} Enjoy the service, use it responsibly, and don't forget to create a restore point! 🙌\r\n\r\n`;

      // I create the complete content
      const content = warning + tweak.regedit;

      // I create the blob and URL
      const blob = new Blob([content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);

      // I create and trigger the download link
      const link = document.createElement("a");
      link.href = url;
      link.download = `${tweak.title}${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        data: tweak,
      };
    } catch (error) {
      console.error("Error in downloadTweak:", error);
      return {
        success: false,
        error: "Failed to download tweak",
      };
    }
  },

  toggleFavorite: async (tweakId: string): Promise<ServiceResponse<Tweak>> => {
    try {
      const response = await axios.patch<ServiceResponse<Tweak>>(
        `/api/tweaks/${tweakId}/favorite`
      );
      return response.data;
    } catch (error) {
      console.error("Error in toggleFavorite:", error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error:
            error.response?.data?.error || "Failed to toggle favorite status",
        };
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  },
};
