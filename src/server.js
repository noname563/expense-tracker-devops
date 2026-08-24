const express = require("express");

const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/expenses", expenseRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});