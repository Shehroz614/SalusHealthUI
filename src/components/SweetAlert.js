import Swal from "sweetalert2";

export const SweetAlert = (icon, message) => {
  Swal.fire({
    icon: icon,
    text: message,
    allowOutsideClick: false,
    confirmButtonText: 'Ok'
  });
};

export const SweetAlertWithValidation = (obj) => {
  Swal.fire({
    icon: "error",
    html: `<h4>Please fix following errors</h4>
    <ul class="list-group text-left">${Object.keys(obj).reduce(
      (prev, key) =>
        prev + `<li class="list-group-item py-0" >${obj[key]}</li>`,
      ""
    )}</ul>`,
    allowOutsideClick: false,
  });
};

export const SweetAlertWithConfirmation = (warningMessage, successFn) => {
  Swal.fire({
    title: "Are you sure?",
    text: warningMessage,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      successFn();
    }
  });
};

export const SweetAlertForDelete = (confirmMessage) => {
  Swal.fire({
    title: "Are you sure you want to delete it?",
    showDenyButton: true,
    confirmButtonText: "Delete",
    denyButtonText: `Cancel`,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        text: confirmMessage,
      });
    }
  });
};