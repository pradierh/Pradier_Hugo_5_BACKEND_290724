const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
};

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images");
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(" ").join("_");
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + "." + extension);
	},
});

const upload = multer({ storage: storage }).single("image");

module.exports = (req, res, next) => {
	upload(req, res, function (err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		const filePath = req.file.path;
		const fileName = req.file.filename;

		const outputFilePath = path.join("images", "compressed_" + fileName);

		sharp(filePath)
			.resize({ width: 800 })
			.toFormat("webp")
			.toFile(outputFilePath, (err, info) => {
				if (err) {
					return res.status(500).json({ error: err.message });
				}
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(err);
					}
				});
				req.file.path = outputFilePath;
				req.file.filename = "compressed_" + fileName;

				next();
			});
	});
};
