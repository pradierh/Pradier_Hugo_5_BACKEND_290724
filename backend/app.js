const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//connection à mongoDB
mongoose
	.connect(
		"mongodb+srv://tezzosyris:YLOPN7rbx3ZD0sFv@hugodb.xl2gcbi.mongodb.net/?retryWrites=true&w=majority&appName=hugodb"
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
