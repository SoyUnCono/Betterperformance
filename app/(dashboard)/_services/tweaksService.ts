import axios from "axios";
import { TweakType } from "@prisma/client";

export const TweaksService = {
  createTweak: async (values: any) => {
    try {
      const response = await axios.post("/api/tweaks/create", values);
      return response.data;
    } catch (error) {
      console.error(`Error creating tweak: ${error}`);
      throw error;
    }
  },

  updateTweak: async (tweakID: string, values: any) => {
    try {
      const response = await axios.patch(
        `/api/tweaks/${tweakID}/update`,
        values
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating tweak: ${error}`);
      throw error;
    }
  },

  changeTweakType: async (tweakID: string, values: any) => {
    try {
      const response = await axios.patch(`/api/tweaks/${tweakID}/type`, values);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error || "Error updating tweak");
      }
      throw error;
    }
  },

  deleteTweak: async (tweakID: string) => {
    try {
      const response = await axios.delete(`/api/tweaks/${tweakID}/delete`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting tweak: ${error}`);
      throw error;
    }
  },

  publishTweak: async (tweakID: string) => {
    try {
      const response = await axios.patch(`/api/tweaks/${tweakID}/publish`);
      return response.data;
    } catch (error) {
      console.error(`Error publishing tweak: ${error}`);
      throw error;
    }
  },

  unpublishTweak: async (tweakID: string) => {
    try {
      const response = await axios.patch(`/api/tweaks/${tweakID}/unpublish`);
      return response.data;
    } catch (error) {
      console.error(`Error unpublishing tweak: ${error}`);
      throw error;
    }
  },

  toggleSaveTweak: async (tweakID: string) => {
    try {
      const response = await axios.patch(`/api/tweaks/${tweakID}/favorite`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling save state for tweak: ${error}`);
      throw error;
    }
  },
};
