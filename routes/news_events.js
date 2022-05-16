const express = require("express");
const router = express.Router();

const {imageUpload} = require("../middleware/file-upload")

const {
  getNews_Events,
  getAdminNews_Events,
  addNews,
  editNews,
  newNews,
  updateNews,
  deleteNews
} = require("../controller/news_events");

/** Client Side API **/

router.get("/news-and-events", getNews_Events);

/** Admin Side API **/

router.get("/admin/news-and-events", getAdminNews_Events);

router.get("/admin/news-and-events/new", newNews);

router.get("/admin/news-and-events/:id/edit", editNews);

router.post("/addnews", imageUpload.single('image'),addNews);

router.patch("/admin/news-and-events/:id",imageUpload.single('image'), updateNews);

router.delete("/admin/news-and-events/:id", deleteNews);

module.exports = router;
