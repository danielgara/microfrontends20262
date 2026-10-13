import "./style.css";

const COP_PER_USD = 3200;

function format(value, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function mount(el) {
  el.innerHTML = `
    <section class="currency">
      <h2>Peso / dollar converter</h2>
      <p class="tag">JavaScript</p>
      <p class="rate">Fixed demo rate: 1 USD = ${COP_PER_USD.toLocaleString("en-US")} COP</p>
      <form>
        <label>
          Amount
          <input name="amount" type="number" min="0" step="0.01" value="3200" required />
        </label>
        <label>
          From
          <select name="from">
            <option value="COP">COP</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <button type="submit">Convert</button>
      </form>
      <p class="result">Result: —</p>
    </section>
  `;

  const form = el.querySelector("form");
  const result = el.querySelector(".result");

  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const amount = Number(data.get("amount"));
    const from = data.get("from");
    if (!Number.isFinite(amount)) return;

    if (from === "COP") {
      result.textContent = `Result: ${format(amount / COP_PER_USD, "USD")}`;
    } else {
      result.textContent = `Result: ${format(amount * COP_PER_USD, "COP")}`;
    }
  };

  form.addEventListener("submit", onSubmit);

  return () => {
    form.removeEventListener("submit", onSubmit);
    el.innerHTML = "";
  };
}

const standalone = document.querySelector("#app");
if (standalone) mount(standalone);
