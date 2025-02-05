const TOTAL_HOURS_RESTAURANT_OPEN_DAILY = 7;
const today = new Date();
// const todayDateFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
//   2,
//   "0"
// )}-${String(today.getDate()).padStart(2, "0")}`;
const todayDateFormatted = new Date().toISOString().split("T")[0];
const reservations = getReservations();
let CURRENT_MONTH = new Date();
const DAY_OF_WEEK_NAME_ID_MAPPING = [6, 0, 1, 2, 3, 4, 5];
const ALL_RESTAURANT_OPEN_HOURS = [3, 4, 5, 6, 7, 8, 9];

async function getReservations() {
  try {
    const response = await fetch("http://localhost:8000/reservations");
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function highlightReservedTables(date) {
  const localReservations = await reservations;
  for (const [tableNumber, tableReservations] of localReservations.entries()) {
    const table = document.querySelector(`.table[data-table-id="${tableNumber + 1}"]`);

    if (tableReservations[date] && tableReservations[date].length) {
      if (tableReservations[date].length == TOTAL_HOURS_RESTAURANT_OPEN_DAILY) {
        // console.log("table is fully booked", table);
        table.classList.remove("some-availability");
        table.classList.add("reserved");
      } else if (tableReservations[date].length < TOTAL_HOURS_RESTAURANT_OPEN_DAILY) {
        table.classList.remove("reserved");
        table.classList.add("some-availability");
      }
    } else {
      // colour tables green or just leave as outline?
      table.classList.remove("reserved");
      table.classList.remove("some-availability");
    }
  }
}

async function addAvailableTableTimeslots(tableNumber) {
  const localReservations = await reservations;
  const timeslotsContainer = document.getElementById("timeslots-container");
  const currentDateHoursTableReserved =
    localReservations[tableNumber - 1]?.[CURRENT_MONTH.toISOString().split("T")[0]];

  deleteAllTimeslots();

  if (!currentDateHoursTableReserved || !currentDateHoursTableReserved.length) {
    //add all timeslots
    for (let i = 3; i <= 9; i++) {
      createTimeslot(i, timeslotsContainer);
    }
  } else {
    const availableHours = ALL_RESTAURANT_OPEN_HOURS.filter(
      (hour) => !currentDateHoursTableReserved.includes(hour)
    );
    for (const hour of availableHours.sort()) {
      createTimeslot(hour, timeslotsContainer);
    }
  }
}

function createTimeslot(hour, timeslotsContainer) {
  const timeslot = document.createElement("button");
  timeslot.classList.add("timeslot", "hide");
  timeslot.setAttribute("data-hour-id", hour);
  timeslot.textContent = `${hour}:00 PM`;
  timeslot.onclick = (event) => {
    openConfirmationWindow(event.target.dataset.hourId);
  };
  timeslotsContainer.appendChild(timeslot);

  void timeslot.offsetWidth;
  timeslot.classList.remove("hide");
}

function deleteAllTimeslots() {
  const allTimeslots = document.querySelectorAll(".timeslot");

  //FIXME event listener doesn't fire
  // allTimeslots.forEach((timeslot) => {
  //   timeslot.addEventListener("transitionend", (event) => {
  //     console.log("triggered transitionend");
  //     event.target.remove();
  //   });
  // });

  allTimeslots.forEach((timeslot) => {
    timeslot.remove();
  });
}

function openConfirmationWindow(hour) {
  const overlay = document.getElementById("overlay");
  const confirmReservation = document.getElementById("confirm-reservation");
  overlay.classList.add("active");
  confirmReservation.classList.add("active");

  document.querySelector("#date .info").textContent = CURRENT_MONTH.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  document.querySelector("#time .info").textContent = `${hour}:00 PM`;
  document.querySelector("#table-number .info").textContent = `No. 23`;
}

function closeConfirmationWindow() {
  const overlay = document.getElementById("overlay");
  const confirmReservation = document.getElementById("confirm-reservation");
  overlay.classList.remove("active");
  confirmReservation.classList.remove("active");
}

function setDatePickerMonth() {
  const datepickerCalendar = document.querySelector(".datepicker-calendar");
  const firstDayOfCurrentMonth_NameID = new Date(
    CURRENT_MONTH.getFullYear(),
    CURRENT_MONTH.getMonth(),
    1
  ).getDay();
  const lastDayOfPreviousMonth = new Date(
    CURRENT_MONTH.getFullYear(),
    CURRENT_MONTH.getMonth() + 1,
    0
  ).getDate();
  const daysInCurrentMonth = new Date(
    CURRENT_MONTH.getFullYear(),
    CURRENT_MONTH.getMonth() + 1,
    0
  ).getDate();
  const numOfPrevMonthDaysToCreate = DAY_OF_WEEK_NAME_ID_MAPPING[firstDayOfCurrentMonth_NameID];
  const totalDisplayedDays = 35 - daysInCurrentMonth - numOfPrevMonthDaysToCreate < 0 ? 42 : 35;

  //delete any days from previous month
  document.querySelectorAll(".day-number").forEach((day) => {
    day.remove();
  });

  //set month name displayed on calendar to current global variable month
  document.querySelector(".month-name").textContent = CURRENT_MONTH.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  //add faded days from the previous month (e.g. 29, 30, 31)
  for (
    let i = lastDayOfPreviousMonth - numOfPrevMonthDaysToCreate;
    i < lastDayOfPreviousMonth;
    i++
  ) {
    const dayNumber = createDayNumber(i);
    dayNumber.classList.add("faded");
    datepickerCalendar.appendChild(dayNumber);
  }
  //add normal days from current month
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    datepickerCalendar.appendChild(createDayNumber(i));
  }
  //add faded days from the next month (e.g. 1, 2, 3)
  for (let i = 1; i <= totalDisplayedDays - daysInCurrentMonth - numOfPrevMonthDaysToCreate; i++) {
    const dayNumber = createDayNumber(i);
    dayNumber.classList.add("faded");
    datepickerCalendar.appendChild(dayNumber);
  }
}

function createDayNumber(dataDayNummber) {
  const dayNumber = document.createElement("button");
  dayNumber.classList.add("day-number");
  dayNumber.textContent = dataDayNummber;
  dayNumber.setAttribute("data-day-number", dataDayNummber);
  dayNumber.onclick = (event) => {
    CURRENT_MONTH.setDate(event.target.textContent);
    highlightReservedTables(CURRENT_MONTH.toISOString().split("T")[0]);

    const clickedDay = document.querySelector(".clicked");
    clickedDay ? clickedDay.classList.remove("clicked") : console.log("no clicked day");
    event.target.classList.add("clicked");
  };
  return dayNumber;
}

function nextMonth() {
  CURRENT_MONTH.setMonth(CURRENT_MONTH.getMonth() + 1);
  setDatePickerMonth();
}

function previousMonth() {
  CURRENT_MONTH.setMonth(CURRENT_MONTH.getMonth() - 1);
  setDatePickerMonth();
}

function todayFocus() {
  CURRENT_MONTH.setMonth(today.getMonth());
  setDatePickerMonth();
  document
    .querySelector(`.day-number[data-day-number="${today.getDate()}"]`)
    .classList.add("clicked");
}

function tomorrowFocus() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  CURRENT_MONTH.setMonth(tomorrow.getMonth());
  setDatePickerMonth();
  document
    .querySelector(`.day-number[data-day-number="${tomorrow.getDate()}"]`)
    .classList.add("clicked");
}

function storeReservation(event) {
  const { name, email } = Object.fromEntries(new FormData(event.target).entries());
  console.log(name, email);

  showSuccessScreen(name, email);
  return false;
}

function showSuccessScreen() {}

setDatePickerMonth();
highlightReservedTables(todayDateFormatted);

document.querySelectorAll(".table").forEach((table) =>
  table.addEventListener("mouseenter", (event) => {
    // console.log("hovering over table", event.target);
    addAvailableTableTimeslots(event.target.dataset.tableId); //automatically converted to camel case from kebab case
  })
);
