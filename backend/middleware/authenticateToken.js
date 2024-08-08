const jwt = require("jsonwebtoken");

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
		const decodedToken = jwt.verify(token, "Tezzosyris@99");
		req.userId = decodedToken.user_id;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Token invalide ou expiré" });
	}
}

module.exports = authMiddleware;
