import moment from "moment";
import { AllEnums } from "../constants/enums";
import { siteInfo } from "@src/constants";

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num;

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/* EXTRACTS FILENAME FROM CONTENT DISPOSITION HEADER */
export function extractFilename(contentDisposition) {
  const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = regex.exec(contentDisposition);
  let filename = "unknown";
  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, "");
  }
  return filename;
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

export const formatDateToCustomString = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  };

  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Add the "rd" for the day
  const day = date.getDate();
  const dayString =
    day +
    (day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th");

  // Replace the day in the formatted date string
  return formattedDate.replace(date.getDate(), dayString);
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem("user");
export const getUserData = () => JSON.parse(localStorage.getItem("user"));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole == AllEnums.userRole.Admin) return siteInfo.admin.defaultRoute;
  if (userRole == AllEnums.userRole.Patient)
    return siteInfo.client.defaultRoute;
  return "/login";
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});

// Returns token expiry time

export const tokenExpiryTime = (time) => {
  if (time) {
    return moment.utc(time).format();
  } else {
    return null;
  }
};

// Returns current time

export const currentDateTime = () => {
  return moment().utc().format();
};

// Returns if tokenExpiryTime is Reached

export const hasTokenExpired = (time) => {
  if (moment.utc().isSameOrAfter(moment.utc(time))) {
    return true;
  } else {
    return false;
  }
};

// Prevent Input field to accept minus value

export const preventMinus = (e) => {
  if (e.code === "Minus" || e.code === "KeyE") {
    e.preventDefault();
  }
};

// Prevent Input field to accept pasted minus value

export const preventPasteNegative = (e) => {
  const clipboardData = e.clipboardData || window.clipboardData;
  const pastedData = parseFloat(clipboardData.getData("text"));

  if (pastedData < 0) {
    e.preventDefault();
  }
};

// Format date

export const customFormatDate = (date) => {
  const formatType = "USA";

  if (formatType == "USA") {
    return date ? moment(date).format("MM-DD-YYYY") : "mm-dd-yyyy";
  } else if (formatType == "UK") {
    return date ? moment(date).format("DD-MM-YYYY") : "dd-mm-yyyy";
  } else {
    return date ? moment(date).format("YYYY-MM-DD") : "yyyy-mm-dd";
  }
};

// Format date for sending in request

export const customFormatDateForSendingInRequest = (date) => {
  return date ? moment(date).format("YYYY-MM-DD") : "";
};

// Format time

export const customFormatTime = (time) => {
  const formatType = "USA";

  if (formatType == "USA") {
    return time ? moment(time, "HH:mm").format("hh:mm a") : "hh:mm a";
  } else if (formatType == "UK") {
    return time ? moment(time, "HH:mm").format("hh:mm a") : "hh:mm a";
  } else {
    return time ? moment(time, "HH:mm").format("hh:mm a") : "hh:mm a";
  }
};

// Format date time

export const customFormatDateTime = (dateTime) => {
  const formatType = "USA";

  if (formatType == "USA") {
    return dateTime
      ? moment(dateTime).format("MM-DD-YYYY hh:mm a")
      : "mm-dd-yyyy hh:mm a";
  } else if (formatType == "UK") {
    return dateTime
      ? moment(dateTime).format("DD-MM-YYYY hh:mm a")
      : "dd-mm-yyyy hh:mm a";
  } else {
    return dateTime
      ? moment(dateTime).format("YYYY-MM-DD hh:mm a")
      : "yyyy-mm-dd hh:mm a";
  }
};

// Format today date

export const todayDate = () => {
  const formatType = "USA";

  if (formatType == "USA") {
    return moment().format("MM-DD-YYYY");
  } else if (formatType == "UK") {
    return moment().format("DD-MM-YYYY");
  } else {
    return moment().format("YYYY-MM-DD");
  }
};

// Format today date time

export const todayDateTime = () => {
  const formatType = "USA";

  if (formatType == "USA") {
    return moment().format("MM-DD-YYYY hh:mm a");
  } else if (formatType == "UK") {
    return moment().format("DD-MM-YYYY hh:mm a");
  } else {
    return moment().format("YYYY-MM-DD hh:mm a");
  }
};

// Format date in text form

export const customFormatDateInTextForm = (date) => {
  return date ? moment(date).format("MMM D, YYYY") : "";
};


export function hasTimePassed(dateTimeString) {
  const inputDate = new Date(dateTimeString);
  const currentDate = new Date();
  return inputDate <= currentDate;
}


export function getMonthNameFromDate(inputDate) {
  if (!(inputDate instanceof Date)) {
    throw new Error('Input is not a valid Date object');
  }
  var monthNames = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  var monthNumber = inputDate.getMonth();
  var monthName = monthNames[monthNumber];
  return monthName;
}



// Function to format a Date object as "YYYY-MM-DD"
export function formatDateToYYYYMMDD(value = Date.now()) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}



// Function to format the date
export function formatDatetoTime(value = Date.now()) {
  const date = new Date(value);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}


// Get time slot 
export function addMinutesToTimeSlot(timeSlot, minutesToAdd) {
  const [time, ampm] = timeSlot.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes + minutesToAdd;
  // Handle AM/PM
  if (ampm === 'PM' || ampm === 'pm') {
    totalMinutes += 12 * 60; // Add 12 hours for PM
  }
  const endHours = Math.floor(totalMinutes / 60) % 12 || 12; // Use 12 instead of 0 for 12:00 PM/AM
  const endMinutes = totalMinutes % 60;
  const formattedStartTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  const formattedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')} ${totalMinutes >= 720 ? 'PM' : 'AM'}`;
  return `${formattedStartTime} - ${formattedEndTime}`;
}



export function isDateInCurrentWeek(date) {
  const currentDate = new Date();
  const currentWeekMonday = new Date(currentDate);
  currentWeekMonday.setHours(0, 0, 0, 0);
  currentWeekMonday.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  const currentWeekSunday = new Date(currentWeekMonday);
  currentWeekSunday.setDate(currentWeekMonday.getDate() + 6);

  return date >= currentWeekMonday && date <= currentWeekSunday;
}



export function getCurrentWeekDateRange() {
  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);
  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
  const startFormatted = currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endFormatted = currentWeekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startFormatted} - ${endFormatted}`;
}


export function isDateToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
