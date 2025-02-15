const express = require("express");
const router = express.Router();
const catwaysController = require("../controllers/catwaysController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, catwaysController.getAllCatways);

router.get("/:id", authMiddleware, catwaysController.getCatwayById);

router.post("/", authMiddleware, catwaysController.createCatway);

router.put("/:id", authMiddleware, catwaysController.updateCatwayState);

router.delete("/:id", authMiddleware, catwaysController.deleteCatway);

module.exports = router;
