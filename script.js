const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".swap");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }

    if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  updateFlag(select);

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

// Update flag
function updateFlag(element) {
  let countryCode = countryList[element.value];

  let img = element.parentElement.querySelector("img");

  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Fetch exchange rate
async function updateExchangeRate() {
  let amount = document.querySelector(".amount input");

  let amountVal = amount.value;

  if (amountVal === "" || amountVal <= 0) {
    amountVal = 1;
    amount.value = 1;
  }

  msg.innerText = "Loading...";

  try {
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

    const response = await fetch(URL);

    const data = await response.json();

    const rate =
      data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    const finalAmount = (amountVal * rate).toFixed(2);

    msg.innerText = `${amountVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;

  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate.";
    console.log(error);
  }
}

// Button
btn.addEventListener("submit", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Swap currencies
swapBtn.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  updateExchangeRate();
});

// Load
window.addEventListener("load", () => {
  updateExchangeRate();
});
