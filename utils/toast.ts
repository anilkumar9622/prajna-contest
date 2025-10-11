// utils/toast.ts
import Swal from "sweetalert2";
// import "sweetalert2/src/sweetalert2.scss"; // make sure SweetAlert2 styles are loaded

export const showToast = (
  type: "success" | "error" | "warning" | "info" | "question",
  message: string,
  duration: number = 3000
) => {
  const toast = Swal.mixin({
    toast: true,
    position: "top", // top-right corner
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true, // optional: shows a progress bar
    customClass: {
         container: 'toast', popup: 'small-toast', // add your CSS class for font/size
    },
  });

  toast.fire({
    icon: type,
    title: message,
    padding: "10px 20px",
  });
};
