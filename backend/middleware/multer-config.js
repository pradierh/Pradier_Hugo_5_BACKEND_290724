const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_');
		callback(null, name);
	},
});

const upload = multer({ storage: storage }).single('image');

module.exports = (req, res, next) => {
	upload(req, res, function (err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		const filePath = req.file.path;
		const fileName = req.file.filename;
		const baseName = path.parse(fileName).name;
		const outputFileName = `compressed_${baseName}.webp`;
		const outputFilePath = path.join('images', outputFileName);

		sharp(filePath)
			.resize({ width: 800 })
			.webp({ quality: 75 })
			.toFile(outputFilePath, (err, info) => {
				if (err) {
					console.error('Error processing file:', err);
					fs.unlink(filePath, (unlinkError) => {
						if (unlinkError) {
							console.error('Failed to delete the original file:', unlinkError);
						}
					});
					return res.status(500).json({ error: err.message });
				}

				fs.unlink(filePath, (unlinkError) => {
					if (unlinkError) {
						console.error('Failed to delete the original file:', unlinkError);
					}
				});

				req.file.path = outputFilePath;
				req.file.filename = outputFileName;

				next();
			});
	});
};
