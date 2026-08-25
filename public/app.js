const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const expenseList = document.getElementById("expense-list");
const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-button");
const expenseCount = document.getElementById("expense-count");

let editingExpenseId = null;

async function loadExpenses() {
  const response = await fetch("/expenses");
  const expenses = await response.json();
  
  expenseCount.textContent =
  `${expenses.length} expense${expenses.length !== 1 ? "s" : ""}`;
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    expenseList.innerHTML = "<p>No expenses yet.</p>";
    return;
  }

  expenses.forEach((expense) => {
    const expenseElement = document.createElement("div");

    expenseElement.classList.add("expense-item");

    expenseElement.innerHTML = `
  <div class="expense-info">
    <span class="expense-title">${expense.title}</span>
    <span class="expense-amount">₹${expense.amount}</span>
  </div>

  <div class="expense-actions">
    <button
      class="edit-button"
      onclick="editExpense(${expense.id}, '${expense.title}', ${expense.amount})"
    >
      Edit
    </button>

    <button
      class="delete-button"
      onclick="deleteExpense(${expense.id})"
    >
      Delete
    </button>
  </div>
`;

    expenseList.appendChild(expenseElement);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value;
  const amount = Number(amountInput.value);

  if (editingExpenseId) {
    await fetch(`/expenses/${editingExpenseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        amount,
      }),
    });

    editingExpenseId = null;
    submitButton.textContent = "Add Expense";
    cancelButton.hidden = true;
  } else {
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
  }

  form.reset();
  loadExpenses();
});

function editExpense(id, title, amount) {
  editingExpenseId = id;

  titleInput.value = title;
  amountInput.value = amount;

  submitButton.textContent = "Update Expense";
  cancelButton.hidden = false;
}

cancelButton.addEventListener("click", () => {
  editingExpenseId = null;

  form.reset();

  submitButton.textContent = "Add Expense";
  cancelButton.hidden = true;
});

async function deleteExpense(id) {
  await fetch(`/expenses/${id}`, {
    method: "DELETE",
  });

  loadExpenses();
}

loadExpenses();