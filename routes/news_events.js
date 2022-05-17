const express = require("express");
const router = express.Router();

const { adminAuth } = require("../middleware/auth");
const { imageUpload } = require("../middleware/file-upload");

const {
  getNews_Events,
  getAdminNews_Events,
  addNews,
  editNews,
  newNews,
  updateNews,
  deleteNews,
} = require("../controller/news_events");

/** Client Side API **/

router.get("/news-and-events", getNews_Events);

/** Admin Side API **/

router.get("/admin/news-and-events", adminAuth, getAdminNews_Events);

router.get("/admin/news-and-events/new", adminAuth, newNews);

router.get("/admin/news-and-events/:id/edit", adminAuth, editNews);

router.post("/addnews", imageUpload.single("image"), adminAuth, addNews);

router.patch(
  "/admin/news-and-events/:id",
  imageUpload.single("image"),
  adminAuth,
  updateNews
);

router.delete("/admin/news-and-events/:id", adminAuth, deleteNews);

module.exports = router;
