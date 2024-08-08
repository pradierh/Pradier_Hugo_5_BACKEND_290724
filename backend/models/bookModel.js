const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
	userId: String,
	grade: Number,
});

const bookSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	title: { type: String, required: true },
	author: { type: String, required: true },
	imageUrl: { type: String, required: true },
	year: { type: Number, required: true },
	genre: { type: String, required: true },
	ratings: [ratingSchema],
	averageRating: { type: Number, required: true },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
