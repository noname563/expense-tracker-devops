const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const expenseList = document.getElementById("expense-list");

async function loadExpenses() {
  const response = await fetch("/expenses");

  const expenses = await response.json();

  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = "<p>No expenses yet.</p>";
    return;
  }

  expenses.forEach((expense) => {
    const expenseElement = document.createElement("div");

    expenseElement.classList.add("expense-item");

    expenseElement.innerHTML = `
      <span>
        ${expense.title} - ₹${expense.amount}
      </span>

      <button onclick="deleteExpense(${expense.id})">
        Delete
      </button>
    `;

    expenseList.appendChild(expenseElement);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value;
  const amount = Number(amountInput.value);

  await fetch("/expenses", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      title,
      amount,
    }),
  });

  form.reset();

  loadExpenses();
});

async function deleteExpense(id) {
  await fetch(`/expenses/${id}`, {
    method: "DELETE",
  });

  loadExpenses();
}

loadExpenses();