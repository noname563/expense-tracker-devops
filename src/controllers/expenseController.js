const pool = require("../config/database");

const getExpenses = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM expenses ORDER BY id ASC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting expenses:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const createExpense = async (req, res) => {
  try {
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

    const result = await pool.query(
      `INSERT INTO expenses (title, amount)
       VALUES ($1, $2)
       RETURNING *`,
      [title, amount]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating expense:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const id = Number(req.params.id);
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

    const result = await pool.query(
      `UPDATE expenses
       SET title = $1, amount = $2
       WHERE id = $3
       RETURNING *`,
      [title, amount, id]
    );

    // If no expense was found
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      expense: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating expense:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const result = await pool.query(
      `DELETE FROM expenses
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    // If no expense was found
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
      expense: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting expense:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};
module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};