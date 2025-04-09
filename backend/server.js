require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");

const branchRoutes = require("./routes/BranchRoutes");
const roleRoutes = require("./routes/RoleRoutes");
const employeeRoutes = require("./routes/EmployeeRoutes");
const loanRoutes = require("./routes/LoanRoutes");
const conditionRoutes = require("./routes/ConditionRoutes");
const categoryRoutes = require("./routes/CategoryRoutes");
const requirementRoutes = require("./routes/RequirementRoutes");
const customerRoutes = require("./routes/CustomerRoutes");

const app = express();

app.use(express.json({ limit: "Infinity" }));
app.use(express.urlencoded({ limit: "Infinity", extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/branch", branchRoutes);
app.use("/role", roleRoutes);
app.use("/employee", employeeRoutes);
app.use("/loan", loanRoutes);
app.use("/condition", conditionRoutes);
app.use("/category", categoryRoutes);
app.use("/requirement", requirementRoutes);
app.use("/customer", customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
