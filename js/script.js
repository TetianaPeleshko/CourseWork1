"use strict";
const MILISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const MILISECONDS_IN_HOUR = 60 * 60 * 1000;
const MILISECONDS_IN_MINUTE = 60 * 1000;
const MILISECONDS_IN_SECOND = 1000;
const firstDate = document.getElementById("startdate");
const secondDate = document.getElementById("enddate");

firstDate.value = "2022-02-15";
secondDate.value = "2023-01-07";

const buttonWeek = document.getElementById("presetweek");
buttonWeek.addEventListener("click", function onClick(event) {
  let currentDate = new Date(firstDate.value);
  currentDate.setDate(currentDate.getDate() + 7);
  secondDate.value = formatDate(currentDate);
  //console.log(formatDate(currentDate));
});

const buttonMonth = document.getElementById("presetmonth");
buttonMonth.addEventListener("click", function onClick(event) {
  let currentDate = new Date(firstDate.value);
  currentDate.setMonth(currentDate.getMonth() + 1);
  secondDate.value = formatDate(currentDate);
  //console.log(formatDate(currentDate));
});

function formatDate(date) {
  let day = date.getDate();
  day = day < 10 ? `0${day}` : `${day}`;
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : `${month}`;
  let year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

const buttonSub = document.getElementById("btn");
buttonSub.addEventListener("click", function onClick(event) {
  let days = document.getElementById("days").value;
  let time = document.getElementById("time").value;

  // let numMiliseconds = getNumDays(firstDate.value, secondDate.value, days);
  // let resultСount = typeTime(numMiliseconds,time);

  let resultСount = typeTime(
    getNumDays(firstDate.value, secondDate.value, days),
    time
  );
  let resultRecord = {
    startDate: firstDate.value,
    endDate: secondDate.value,
    result: resultСount,
  };
  // console.log(resultRecord);
  //storeRecordInLocalStorage(resultRecord);
  //getRecords();
  storeRecordInLocalStorage(resultRecord);
  addRecord(resultRecord);
});

const isWeekend = (currentDate) =>
  currentDate.getDay() == 0 || currentDate.getDay() == 6;

function getNumDays(start, end, type) {
  let result;

  switch (type) {
    case "alldays":
      let startDate = Date.parse(start);
      let endDate = Date.parse(end);
      result = Math.abs(endDate - startDate);
      break;
    case "workdays":
      result = 0;
      let currentDate = new Date(start);
      while (currentDate < new Date(end)) {
        // Skips Sunday and Saturday
        if (!isWeekend(currentDate)) {
          result++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      result = result * MILISECONDS_IN_DAY;
      break;
    case "weekend":
      result =
        getNumDays(start, end, "alldays") - getNumDays(start, end, "workdays");
      break;
  }
  return result;
}

function typeTime(timeStamp, format = "days") {
  let formatDate;
  let result = timeStamp;
  switch (format) {
    case "days":
      formatDate = result / MILISECONDS_IN_DAY;
      break;
    case "hours":
      formatDate = result / MILISECONDS_IN_HOUR;
      break;
    case "minutes":
      formatDate = result / MILISECONDS_IN_MINUTE;
      break;
    case "seconds":
      formatDate = result / MILISECONDS_IN_SECOND;
      break;
  }
  return `${formatDate} ${format}`;
}

firstDate.addEventListener("change", function onChange(event) {
  secondDate.setAttribute("min", firstDate.value);
});
secondDate.addEventListener("change", function onChange(event) {
  firstDate.setAttribute("max", secondDate.value);
});

const STORAGE_KEY = "tasks";

const getRecordsFromLocalStorage = () => {
  const records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return records;
};

const storeRecordInLocalStorage = (record) => {
  const records = getRecordsFromLocalStorage();
  if (records.length == 10) {
    records.pop();
  }
  records.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

// const getRecords = () => {
//   const records = getRecordsFromLocalStorage();
//   let table = document.getElementById("data");
//   table.innerHTML = "";
//   let newTr = "";
//   records.forEach((record) => {
//     newTr += "<tr>";
//     newTr +=
//       "<td>" +
//       record.startDate +
//       "</td>" +
//       "<td>" +
//       record.endDate +
//       "</td>" +
//       "<td>" +
//       record.result +
//       "</td>";
//     newTr += "</tr>";
//   });
//   table.innerHTML += newTr;
// };
//getRecords();

const addRecord = (record) => {
  let table = document.getElementById("data");
  const tRow = document.createElement("tr");
  const tStartDate = document.createElement("td");
  const tEndDate = document.createElement("td");
  const tResult = document.createElement("td");
  tStartDate.textContent = record.startDate;
  tRow.append(tStartDate);
  tEndDate.textContent = record.endDate;
  tRow.append(tEndDate);
  tResult.textContent = record.result;
  tRow.append(tResult);
  table.prepend(tRow);
  const rowCount = table.rows.length;
  if (rowCount > 10) {
    table.deleteRow(rowCount - 1);
  }
};

const getRecords = () => {
  const records = getRecordsFromLocalStorage();
  records.forEach((record) => {
    addRecord(record);
  });
};
getRecords();
