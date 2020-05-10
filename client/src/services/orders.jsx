import axios from 'axios';

const apiOrdernService = axios.create({
  baseURL: '/api/orders'
});

export const createOrder = async data => {
  console.log('in service, data', data);
  try {
    const response = await apiOrdernService.post(`/create-order`, data);
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.log('service', error);
    throw error;
  }
};


export const getOrder = async data => {
  try {
    const response = await apiOrdernService.get(`/get-order-details/${data}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getAllOrdersPerUser = async userId => {
  try {
    const response = await apiOrdernService.get(`/get-all-orders/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getAllOrders = async () => {
  try {
    const response = await apiOrdernService.get(`/get-all-orders`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateOrder = async data => {
  try {
    const response = await apiOrdernService.post(`/update-order/${data.order_id}`, {data});
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addCommentToOrder = async data => {
  try {
    const response = await apiOrdernService.post(`/add-comment-order/${data.order_id}`, {data});
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const uploadFile = async data => {
  const fileInForm = new FormData();
  fileInForm.append("file", data.selectedFile);
  try {
    const response = await apiOrdernService.post(`/uploadInvoice/${data.order_id}`, fileInForm);
    return response.data;
  } catch (error) {
    console.log('service error', error);
    throw error;
  }
}

export const deleteFile = async data => {
  console.log(data)
  try {
    const response = await apiOrdernService.post(`/deleteInvoice/${data.order_id}`, {'key': data.file_key});
    return response.data;
  } catch (error) {
    console.log('service error', error);
    throw error;
  }
}



