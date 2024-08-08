const Book = require("./models/book");
const fs = require("fs");
const mongoose = require("mongoose");

mongoose
	.connect(
		"mongodb+srv://tezzosyris:YLOPN7rbx3ZD0sFv@hugodb.xl2gcbi.mongodb.net/?retryWrites=true&w=majority&appName=hugodb"
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

// Données à insérer
const booksData = JSON.parse(fs.readFileSync("booksData.json", "utf8"));

// Fonction d'insertion des données
const insertBooks = async () => {
	try {
		for (let bookData of booksData) {
			let existingBook = await Book.findOne({ id: bookData.id });
			if (existingBook) {
				// Si le livre existe, le mettre à jour
				await Book.updateOne({ id: bookData.id }, bookData);
				console.log(`Livre avec l'id ${bookData.id} mis à jour`);
			} else {
				// Sinon insérer un nouveau livre
				const book = new Book(bookData);
				await book.save();
				console.log(`Livre avec l'id ${bookData.id} inséré`);
			}
		}

		// Fermer la connexion après insertion/mise à jour
		mongoose.connection.close();
	} catch (error) {
		console.error(
			"Erreur lors de l'insertion/mise à jour des données:",
			error
		);
		mongoose.connection.close();
	}
};

insertBooks();
