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
    const table = document.querySelector(
      `.table-chairs-group[data-table-number="${tableNumber + 1}"]`
    );

    if (tableReservations[date] && tableReservations[date].length) {
      if (tableReservations[date].length == TOTAL_HOURS_RESTAURANT_OPEN_DAILY) {
        table.classList.remove("some-availability");
        table.classList.add("fully-booked");
      } else if (tableReservations[date].length < TOTAL_HOURS_RESTAURANT_OPEN_DAILY) {
        table.classList.remove("fully-booked");
        table.classList.add("some-availability");
      }
    } else {
      // colour tables green or just leave as outline?
      table.classList.remove("fully-booked");
      table.classList.remove("some-availability");
    }
  }
}

async function showHoveredTableInfo(tableNumber) {
  const localReservations = await reservations;
  const currentDateHoursTableReserved =
    localReservations[tableNumber - 1][CURRENT_MONTH.toISOString().split("T")[0]];

  //reset timeslots
  document.querySelectorAll(".timeslot").forEach((timeslot) => {
    timeslot.classList.remove("reserved");
    timeslot.classList.add("open");
  });

  for (const hour of currentDateHoursTableReserved) {
    const timeslot = document.querySelector(`.timeslot[data-hour-id="${hour}"]`);
    timeslot.classList.remove("open");
    timeslot.classList.add("reserved");
  }
}

function createFadedDayNumber(dataDayNummber) {
  const dayNumber = document.createElement("button");
  dayNumber.classList.add("day-number", "faded");
  dayNumber.textContent = dataDayNummber;
  dayNumber.setAttribute("data-day-number", dataDayNummber);
  return dayNumber;
}

function createDayNumber(dataDayNummber) {
  const dayNumber = document.createElement("button");
  dayNumber.classList.add("day-number");
  dayNumber.textContent = dataDayNummber;
  dayNumber.setAttribute("data-day-number", dataDayNummber);
  return dayNumber;
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

  //delete any days from previous month
  document.querySelectorAll(".day-number").forEach((day) => {
    day.remove();
  });

  document.querySelector(".month-name").textContent = CURRENT_MONTH.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  for (
    let i = lastDayOfPreviousMonth - numOfPrevMonthDaysToCreate;
    i < lastDayOfPreviousMonth;
    i++
  ) {
    datepickerCalendar.appendChild(createFadedDayNumber(i));
  }
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    datepickerCalendar.appendChild(createDayNumber(i));
  }
  if (35 - daysInCurrentMonth - numOfPrevMonthDaysToCreate < 0) {
    for (let i = 1; i <= 42 - daysInCurrentMonth - numOfPrevMonthDaysToCreate; i++) {
      datepickerCalendar.appendChild(createFadedDayNumber(i));
    }
  } else {
    for (let i = 1; i <= 35 - daysInCurrentMonth - numOfPrevMonthDaysToCreate; i++) {
      datepickerCalendar.appendChild(createFadedDayNumber(i));
    }
  }

  //add event listeners back
  document.querySelectorAll(".day-number").forEach((day) =>
    day.addEventListener("focus", (event) => {
      console.log("focused on day", event.target.textContent);
      CURRENT_MONTH.setDate(event.target.textContent);
      highlightReservedTables(CURRENT_MONTH.toISOString().split("T")[0]);
    })
  );
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
  document.querySelector(`.day-number[data-day-number="${today.getDate()}"]`).focus();
}

function tomorrowFocus() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  CURRENT_MONTH.setMonth(tomorrow.getMonth());
  setDatePickerMonth();
  document.querySelector(`.day-number[data-day-number="${tomorrow.getDate()}"]`).focus();
}

setDatePickerMonth();
highlightReservedTables(todayDateFormatted);

document.querySelectorAll(".table-chairs-group").forEach((table) =>
  table.addEventListener("mouseenter", (event) => {
    console.log("hovering over table", event.target);
    showHoveredTableInfo(event.target.dataset.tableNumber); //automatically converted to camel case from kebab case
  })
);
