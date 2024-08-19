const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

function authMiddleware(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ message: "Authentification nécessaire" });
	}
	const token = authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Token manquant" });
	}

	try {
		const decodedToken = jwt.verify(token, "secretKey");
		req.userId = decodedToken.user_id;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Token invalide ou expiré" });
	}
}

module.exports = authMiddleware;
