import axios from "axios";

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
      console.log("Updating tweak with:", values);
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

  updateRegedit: async (tweakID: string, regeditID: string, value: any) => {
    try {
      const response = await axios.patch(
        `/api/tweaks/${tweakID}/${regeditID}/update`,
        value
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating regedit: ${error}`);
      throw error;
    }
  },

  addRegedit: async (
    tweakID: string,
    regeditData: {
      path: string;
      entries: { key: string; value: string }[];
    }
  ) => {
    try {
      const response = await axios.patch(
        `/api/tweaks/${tweakID}/add`,
        regeditData
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding regedit: ${error}`);
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

  deleteRegedit: async (tweakID: string, regeditID: string) => {
    try {
      const response = await axios.delete(
        `/api/tweaks/${tweakID}/${regeditID}/delete`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting regedit: ${error}`);
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
