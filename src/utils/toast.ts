import { ToastContainer, ToastOptions, toast,  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const notifySuccess = (message: string) => {
  const options: ToastOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  toast.success(capitalizeFirstLetter(message), options);
};

const notifyError = (message: string) => {
  const options: ToastOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  toast.error(message, options);
};

const ToastContainerInstance: typeof ToastContainer = ToastContainer;

export { ToastContainerInstance as ToastContainer, notifySuccess, notifyError };
