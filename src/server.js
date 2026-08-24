const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Temporary data storage
const expenses = [];

// Health / home route
app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is running",
  });
});

// Create an expense
app.post("/expenses", (req, res) => {
  const { title, amount } = req.body;

  // Validation
  if (!title || amount === undefined) {
    return res.status(400).json({
      error: "Title and amount are required",
    });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({
      error: "Amount must be a positive number",
    });
  }

  const expense = {
    id: expenses.length + 1,
    title,
    amount,
  };

  expenses.push(expense);

  res.status(201).json(expense);
});


app.delete("/expenses/:id", (req, res) => {
  const id = Number(req.params.id);

  const expenseIndex = expenses.findIndex(
    (expense) => expense.id === id
  );

  if (expenseIndex === -1) {
    return res.status(404).json({
      error: "Expense not found",
    });
  }

  const deletedExpense = expenses.splice(expenseIndex, 1);

  res.json({
    message: "Expense deleted successfully",
    expense: deletedExpense[0],
  });
});

// Get all expenses
app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});