const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./server/db");

require("dotenv/config");

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

/** Cross Platfrom **/
app.use(
  cors({
    origin: process.env.REACTSERVER,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json()); //returns middleware that only parses json.
app.use(methodOverride("_method")); //used for request like patch.
app.use(cookieParser()); //a middleware which parses cookies attached to the client request object.
app.use(express.json()); //returns middleware that only parses json but with buit in express.
app.use(express.urlencoded({ extended: true })); //TO GET FORM DATA
app.use(express.static(path.join(__dirname, "static")));
app.use(express.static("./public"));
app.use("/uploads/images", express.static(path.join("uploads", "images"))); //Multer directory for images
app.use("/uploads/files", express.static(path.join("uploads", "files"))); //Multer directory for files

app.use(require("./routes/auth"));
app.use(require("./routes/equipments"));
app.use(require("./routes/news_events"));
app.use(require("./routes/programs"));
app.use(require("./routes/users"));
app.use(require("./routes/aboutus"));
app.use(require("./routes/fileUploads"));
app.use(require("./routes/booking"));

connectDB();

app.listen(5000, () => {
  console.log(`Server Connected at Port 5000`);
});
