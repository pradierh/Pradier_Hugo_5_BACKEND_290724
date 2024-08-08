const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//chargement des valeurs dotenv
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
	throw new Error("SECRET_KEY is not defined in the environment variables");
}

exports.signup = (req, res) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			user.save()
				.then(() =>
					res.status(201).json({ message: "Utilisateur créé !" })
				)
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res
					.status(401)
					.json({ message: "Paire login/mot de passe incorrecte" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({
							message: "Paire login/mot de passe incorrecte",
						});
					}
					return res.status(200).json({
						token: jwt.sign({ user_id: user._id }, secretKey),
						userId: user._id,
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
