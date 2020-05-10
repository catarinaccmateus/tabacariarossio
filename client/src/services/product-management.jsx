import axios from "axios";

const apiAuthenticationService = axios.create({
  baseURL: "/api/products"
});

export const Create = async data => {

  const dataTransformed = new FormData();

  for (let x = 0; x < data.image.length; x++) {
    dataTransformed.append("image", data.image[x]);
  }

  //in order to pass form data and data simultaneously, I convert all data into form aswell:
  for(let property in data) {
    dataTransformed.append(property, data[property]);
  }

  try {
    const response = await apiAuthenticationService.post(`/create`, dataTransformed);
    return response.data.product;
  } catch (error) {
    console.log('erro no middleware', error);
    throw error;
  }
};

export const ProductInfo = async data => {
  try {
    const response = await apiAuthenticationService.get(`/info/${data}`);
    return response.data.product;
  } catch (error) {
    throw error;
  }
};

export const Delete = async data => {
  try {
    const response = await apiAuthenticationService.post(`/delete/${data}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const DeleteImage = async data => {
  try {
    const response = await apiAuthenticationService.post(`/delete-image`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const response = await apiAuthenticationService.get(`/display-all`);
    return response.data.product;
  } catch (error) {
    throw error;
  }
};

export const editProduct = async data => {
  const productId = data._id;
  try {
    const response = await apiAuthenticationService.post(`/edit/${productId}`, data);
    return response.data.product;
  } catch (error) {
    throw error;
  }
};

export const addNewPicture = async data => {
  const productId = data.productId;
  const dataTransformed = new FormData();
  dataTransformed.append("image", data.image);
  const response = await apiAuthenticationService.post(`/uploadImage/${productId}`, dataTransformed);
  return response
};
