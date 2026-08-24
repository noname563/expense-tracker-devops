const expenses = [];

const getExpenses = (req, res) => {
  res.json(expenses);
};

const createExpense = (req, res) => {
  const { title, amount } = req.body;

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
};

const updateExpense = (req, res) => {
  const id = Number(req.params.id);
  const { title, amount } = req.body;

  const expense = expenses.find((expense) => expense.id === id);

  if (!expense) {
    return res.status(404).json({
      error: "Expense not found",
    });
  }

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

  expense.title = title;
  expense.amount = amount;

  res.json({
    message: "Expense updated successfully",
    expense,
  });
};

const deleteExpense = (req, res) => {
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
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};