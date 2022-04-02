import { FetchWrapper } from "./fetch-wrapper";
import snackbar from "snackbar";
import "snackbar/dist/snackbar.min.css";
import Chart from "chart.js/auto";

const fatInput = document.querySelector("#fat");
const proteinInput = document.querySelector("#protein");
const carbsInput = document.querySelector("#carbs");
const foodNameInput = document.querySelector("#foodName");
const form = document.querySelector("#submitForm");
const displayCard = document.querySelector(".card");
const totalCalElement = document.querySelector("#totalCalTxt");
const cardContainer = document.querySelector(".card-container");
const hideLogBtn = document.querySelector(".hideLog");

let cal = carbs * 4 + protein * 4 + fat * 9;
let totalCal = 0;

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);

// to post the data to API
const postData = () => {
  API.post("Rachel123", {
    fields: {
      fat: {
        integerValue: fatInput.value,
      },
      protein: {
        integerValue: proteinInput.value,
      },
      carbs: {
        integerValue: carbsInput.value,
      },
      name: {
        stringValue: foodNameInput.value,
      },
    },
  });
};

//submit form data

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (
    foodNameInput.value === "" ||
    carbsInput.Value === "" ||
    proteinInput.Value === "" ||
    fatInput.value === ""
  ) {
    alert("please complete the data");
  } else {
    postData(foodName, carbs, protein, fat);
    snackbar.show("Food added successfully");

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(API.get("Rachel123")), 50);
    });
    promise.then((data) => {
      // console.log("after post", data);
      fetchData(data.documents);
    });

    const ctx = document.getElementById("myChart");
    const myChart = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: ["Carbs", "Protein", "Fat"],
        datasets: [
          {
            label: "Macro nutrients",
            data: [carbsInput.value, proteinInput.value, fatInput.value],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(75, 192, 192)",
              "rgb(255, 205, 86)",
              "rgb(201, 203, 207)",
              "rgb(54, 162, 235)",
            ],
          },
        ],
      },
    });
  }
});

const fetchData = (data) => {
  cardContainer.innerHTML = "";
  data.forEach((element) => {
    let cal =
      element.fields.carbs.integerValue * 4 +
      element.fields.protein.integerValue * 4 +
      element.fields.fat.integerValue * 9;
    totalCal += cal;

    let div = document.createElement("div");
    div.classList.add("food-card");
    let p = document.createElement("p");
    p.textContent = `Food name: ${element.fields.name.stringValue}`;
    div.appendChild(p);
    let ul = document.createElement("ul");
    div.appendChild(ul);
    let li = document.createElement("li");
    li.textContent = `Carbs: ${element.fields.carbs.integerValue}`;
    ul.appendChild(li);
    li = document.createElement("li");
    li.textContent = `Protein: ${element.fields.protein.integerValue}`;
    ul.appendChild(li);
    li = document.createElement("li");
    li.textContent = `Fat: ${element.fields.fat.integerValue}`;
    ul.appendChild(li);
    li = document.createElement("li");
    li.textContent = `Cal: ${cal}`;
    ul.appendChild(li);
    cardContainer.appendChild(div);
  });
  totalCalElement.textContent = `Total Cal Logged: ${totalCal}`;
};

function hideLog() {
  if (cardContainer.style.display === "none") {
    cardContainer.style.display = "block";
    hideLogBtn.textContent = "Hide log";
  } else {
    cardContainer.style.display = "none";
    hideLogBtn.textContent = "Show log";
  }
}
hideLogBtn.addEventListener("click", hideLog);

const getData = () => {
  API.get("Rachel123").then((data) => fetchData(data.documents));
};

getData();
