const connectDB = require("./config/db");
const express = require("express");
const PORT = process.env.PORT || 5000;

const app = express();

//connet to DB
connectDB();

//Init middleware
app.use(express.json({ extended: false })); //allow us to use data in req.body

//test route
app.get("/", (req, res) => res.send("API running"));

//Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/books", require("./routes/api/books"));

app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));
