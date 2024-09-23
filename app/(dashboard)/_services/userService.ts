import axios from "axios";

interface UpdateUsernamePayload {
  username: string;
}

export const UserService = {
  async updateUsername(data: UpdateUsernamePayload): Promise<void> {
    try {
      const response = await axios.put("/api/user/update-username", data);
      return response.data;
    } catch (error: Error) {
      throw new Error(error.response?.data?.message || "Error desconocido");
    }
  },
};
