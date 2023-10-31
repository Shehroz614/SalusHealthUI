import axios from "axios";
import Swal from "sweetalert2";

export const axiosInstance = axios.create();

const APIBASEURL = import.meta.env.VITE_API_BASE_URL;

//Adding A Request Interceptor
axiosInstance.interceptors.request.use(
  async function (config) {
    if (!config?.url?.includes(APIBASEURL)) return config;
    const token = localStorage.getItem("token");

    if (token != null && token !== "") {
      config.headers.Authorization = `${token}`;
      config.headers["accessToken"] = `${token}`;
    }
    config.headers["X-API-KEY"] = import.meta.env.VITE_API_SECRET_KEY;
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

//Adding A Response Interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // //
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    try {
      if (error.response.status == 401) {
        //Logout();
        localStorage.clear();
        window.location.href("/");

        Swal.fire({
          icon: "info",
          text: "Session Expired! Please login again.",
          allowOutsideClick: false,
          confirmButtonText: 'Ok'
        });
      }
    } catch (ex) {
      //Logout("apid");
      //   Common.LogError(ex, "Api Call in api.js file", "Intercepter");
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export async function getRequest(url) {
    return await axiosInstance.get(APIBASEURL + url);
}

export async function getRequestById(url, id) {
  return await axiosInstance.get(APIBASEURL + url + "?id=" + id);
}

export async function getRequestByStringQuery(url, stringQuery) {
  return await axiosInstance.get(APIBASEURL + url + stringQuery);
}

export async function getRequestWithTypeBlob(url) {
  return await axiosInstance.get(APIBASEURL + url, {
    responseType: "blob",
  });
}

export async function postRequest(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload);
}

export async function postRequestWithFile(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "*/*",
    },
  });
}

export async function postRequestWithTypeBlob(url, payload) {
  return await axiosInstance.post(APIBASEURL + url, payload, {
    responseType: "blob",
  });
}

export async function putRequest(url, payload) {
  return await axiosInstance.put(APIBASEURL + url, payload);
}

export async function putRequestWithFile(url, payload) {
  return await axiosInstance.put(APIBASEURL + url, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "*/*",
    },
  });
}

export async function deleteRequestByUrl(url) {
  return await axiosInstance.delete(APIBASEURL + url);
}

export async function deleteRequestById(url, id) {
  return await axiosInstance.delete(APIBASEURL + url + id);
}

export async function deleteRequestByPayload(url, payload) {
  return await axiosInstance.delete(APIBASEURL + url, payload);
}

