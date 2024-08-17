const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/bookController");
const multer = require("../middleware/multer-config");

const authMiddleware = require("../middleware/authenticateToken.js");

router.get("/bestrating", bookCtrl.bestRating);
router.post("/", authMiddleware, multer, bookCtrl.createBook);
router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.delete("/:id", authMiddleware, bookCtrl.deleteBook);
router.put("/:id", authMiddleware, multer, bookCtrl.modifyBook);
router.post("/:id/rating", authMiddleware, bookCtrl.rateBook);

module.exports = router;
