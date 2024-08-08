const Book = require("../models/bookModel");
const fs = require("fs");

exports.getAllBooks = (req, res) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }));
};

exports.createBook = (req, res, next) => {
	try {
		const bookData = JSON.parse(req.body.book);
		delete bookData._id;
		delete bookData._userId;
		const book = new Book({
			...bookData,
			userId: req.userId,
			imageUrl: `${req.protocol}://${req.get("host")}/images/${
				req.file.filename
			}`,
		});
		book.save()
			.then((result) => {
				res.status(201).json({
					message: "Book created successfully!",
					book: result,
				});
			})
			.catch((err) => {
				res.status(500).json({
					message: "Creating the book failed!",
					error: err,
				});
			});
	} catch (error) {
		res.status(400).json({
			message: "Invalid data format",
			error: error.message,
		});
	}
};

exports.getOneBook = (req, res) => {
	const bookId = req.params.id;
	Book.findById(bookId)
		.then((book) => {
			if (!book) {
				return res.status(404).json({ message: "Book not found!" });
			}
			res.status(200).json(book);
		})
		.catch((err) =>
			res
				.status(500)
				.json({ message: "Fetching the book failed!", error: err })
		);
};

exports.deleteBook = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.userId) {
				res.status(401).json({ message: "Not authorized" });
			} else {
				const filename = book.imageUrl.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({ _id: req.params.id })
						.then(() => {
							res.status(200).json({
								message: "Objet supprimé !",
							});
						})
						.catch((error) => res.status(401).json({ error }));
				});
			}
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

exports.modifyBook = (req, res) => {
	const bookObject = req.file
		? {
				...JSON.parse(req.body.book),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };

	delete bookObject._userId;
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId != req.userId) {
				res.status(401).json({ message: "Not authorized" });
			} else {
				Book.updateOne(
					{ _id: req.params.id },
					{ ...bookObject, _id: req.params.id }
				)
					.then(() =>
						res.status(200).json({ message: "Objet modifié!" })
					)
					.catch((error) => res.status(401).json({ error }));
			}
		})
		.catch((error) => {
			res.status(400).json({ error });
		});
};

exports.bestRating = (req, res) => {
	Book.getTopBooks()
		.then((books) => {
			if (!Array.isArray(books)) {
				throw new TypeError("Expected books to be an array");
			}
			res.status(200).json({
				message: "Top 3 books fetched successfully",
				books: books,
			});
		})
		.catch((err) => {
			console.error("Error fetching top-rated books:", err);
			res.status(500).json({
				message: "Fetching top books failed!",
				error: err,
			});
		});
};

exports.rateBook = (req, res) => {
	Book.findOne({ _id: req.params.id });
};
