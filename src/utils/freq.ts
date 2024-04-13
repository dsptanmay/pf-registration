import { Bounce, ToastOptions } from "react-toastify";

export const toastOpts: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "colored",
  transition: Bounce,
};
