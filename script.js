const API_KEY = "fca_live_G1ghkYZrd76RyFyFYZpFBO2DL8RHBrdbgqC39M49";

const amountFrom = document.getElementById("amountFrom");
const amountTo = document.getElementById("amountTo");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");

async function loadCurrencies() {
  let url = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=USD`;
  let response = await fetch(url);
  let data = await response.json();

  if (data && data.data) {
    const currencies = Object.keys(data.data);

    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";

    currencies.forEach((code) => {
      let optionFrom = document.createElement("option");
      optionFrom.value = code;
      optionFrom.textContent = code;
      if (code === "IDR") optionFrom.selected = true;
      fromCurrency.appendChild(optionFrom);

      let optionTo = document.createElement("option");
      optionTo.value = code;
      optionTo.textContent = code;
      if (code === "USD") optionTo.selected = true;
      toCurrency.appendChild(optionTo);
    });
  }
}

async function convert() {
  let amount = amountFrom.value;
  let from = fromCurrency.value;
  let to = toCurrency.value;

  if (!amount || amount <= 0) {
    result.innerText = "Please enter a valid amount!";
    amountTo.value = "";
    rateInfo.innerText = "";
    return;
  }

  try {
    let url = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${from}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data && data.data[to]) {
      let rate = data.data[to];
      let converted = amount * rate;

      amountTo.value = converted.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      result.innerText = `${Number(amount).toLocaleString(
        "id-ID"
      )} ${from} = ${converted.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
      })} ${to}`;
      rateInfo.innerText = `1 ${from} = ${rate.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
      })} ${to}`;
    } else {
      result.innerText = "Conversion failed!";
      rateInfo.innerText = "";
    }
  } catch (err) {
    result.innerText = "Error fetching API!";
    rateInfo.innerText = "";
  }
}

loadCurrencies();
amountFrom.addEventListener("input", convert);
fromCurrency.addEventListener("change", convert);
toCurrency.addEventListener("change", convert);
