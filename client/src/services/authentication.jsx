import axios from "axios";

const apiAuthenticationService = axios.create({
  baseURL: "/api/authentication",
});

export const signIn = async (data) => {
  try {
    const response = await apiAuthenticationService.post(`/sign-in`, data);
    console.log('responsein service', response);
    return response.data.user;
  } catch (error) {
    console.log('error service', error);
    throw error;
  }
};

export const signUp = async (data) => {
  try {
    const response = await apiAuthenticationService.post(`/sign-up`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    await apiAuthenticationService.post(`/sign-out`);
  } catch (error) {
    throw error;
  }
};

export const loadUserInformation = async () => {
  try {
    const response = await apiAuthenticationService.get(`/user-information`);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const editUser = async (data) => {
  try {
    const response = await apiAuthenticationService.post(`/edit-user`, data);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await apiAuthenticationService.post(`/password-recovery`, {
      email: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await apiAuthenticationService.post("/reset", {
      params: data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePasswordViaEmail = async (data) => {
  try {
    const response = await apiAuthenticationService.post(
      "/updatePasswordViaEmail",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (data) => {
  try {
    const response = await apiAuthenticationService.post(
      "/updatePassword",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getEmployeeUsers = async () => {
  try {
    const response = await apiAuthenticationService.get(
      "/get-employees");
    return response;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const deleteUser = async (data) => {
  try {
    const response = await apiAuthenticationService.delete(`/delete-user/${data}`);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};