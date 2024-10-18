import axios from "axios";

export const UserService = {
  updateUsername: async (userId: string, values: any) => {
    try {
      const response = await axios.patch(`/api/user/${userId}`, values);
      return response.data;
    } catch (error) {
      console.log(`Error updating username: ${error}`);
      throw error;
    }
  },
};
