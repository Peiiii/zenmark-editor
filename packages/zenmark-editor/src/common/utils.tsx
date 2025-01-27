import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const MessageContainer = (
  <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
);
{
  /* Same as */
}
<ToastContainer />;
(window as any).toast = toast;
const makeMessage = () => {
  // if(!document.getElementById("message-container")){
  //     const dom=document.createElement("div");
  //     dom.id="message-container";
  //     if(document.body){
  //         document.body.appendChild(dom);
  //         createRoot(dom).render(MessageContainer);
  //     }
  // }
  const config: ToastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  (window as any).config = config;
  const success = (msg: string) => {
    toast.success(msg, config);
  };
  const warning = (msg: string) => {
    toast.warning(msg, config);
  };
  const error = (msg: string) => {
    toast.error(msg, config);
  };
  const info = (msg: string) => {
    toast.info(msg, config);
  };
  return {
    success,
    warning,
    error,
    info,
    toast: (method, msg) => {
      return toast[method](msg, config);
    },
  };
};
export const message = makeMessage();
