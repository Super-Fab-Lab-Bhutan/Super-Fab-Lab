const fs = require("fs");
const newsandevents = require("../model/newsandevents");

exports.getNews_Events = async (req, res) => {
  const login = req.login;
  try {
    const news = await newsandevents.find({});
    res.json({ news, login });
  } catch (e) {
    console.log(e);
  }
};

exports.getAdminNews_Events = async (req, res) => {
  try {
    const news = await newsandevents.find({});
    res.render("./adminpanel/news-and-events/show", { news });
  } catch (e) {
    console.log(e);
  }
};

exports.addNews = async (req, res) => {
  var image = null;
  if (req.file) {
    image = req.file.path;
  }
  try {
    const newNews = {
      ...req.body,
      image: image,
    };
    await newsandevents.create(newNews);
    res.redirect("/admin/news-and-events");
  } catch (e) {
    console.log(e);
  }
};

exports.editNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await newsandevents.findById(id);

    res.render("./adminpanel/news-and-events/edit", { news });
  } catch (e) {
    res.redirect(e);
  }
};

exports.newNews = (req, res) => {
  res.render("./adminpanel/news-and-events/new");
};

exports.updateNews = async (req, res) => {
  var { image } = req.body;

  if (req.file) {
    fs.unlink(image, (err) => {
      if (err == null) {
        image = req.file.path;
      }
    });
    image = req.file.path;
  }
  try {
    const updatednews = { ...req.body, image: image };
    const { id } = req.params;

    await newsandevents.findByIdAndUpdate(id, updatednews);

    res.redirect(`/admin/news-and-events`);
  } catch (e) {
    res.redirect("/error");
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const img_path = await newsandevents.findById(id);
    if (img_path.image != null) {
      fs.unlink(img_path.image, async (err) => {
        if (err == null) {
          await newsandevents.findByIdAndDelete(id);
        }
      });
    } else {
      await newsandevents.findByIdAndDelete(id);
    }
    res.redirect("/admin/news-and-events");
  } catch (e) {
    res.redirect("/error");
  }
};
