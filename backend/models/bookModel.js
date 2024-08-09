const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ratingSchema = new mongoose.Schema({
	userId: { type: String, required: true, unique: true },
	grade: { type: Number, required: true },
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

ratingSchema.plugin(uniqueValidator);

bookSchema.statics.getTopBooks = async function () {
	try {
		const books = await this.find()
			.sort({ averageRating: -1 })
			.limit(3)
			.exec();
		if (!Array.isArray(books)) {
			throw new TypeError("Expected books to be an array");
		}
		return books;
	} catch (error) {
		console.error("Error fetching top books:", error);
		throw error;
	}
};

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
