const jwt = require("jsonwebtoken");

const jwtSecret = process.env.secret;

exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role !== "admin") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

exports.Auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role === "student") {
          next();
        } else if (decodedToken.role === "community") {
          next();
        } else if (decodedToken.role === "startup") {
          next();
        } else if (decodedToken.role === "company") {
          next();
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Not authorized" });
      } else {
        if (decodedToken.role === "student") {
          return res.redirect("/student");
        } else if (decodedToken.role === "community") {
          return res.render("./community");
        } else if (decodedToken.role === "startup") {
          return res.render("./startup");
        } else if (decodedToken.role === "company") {
          return res.render("./company");
        } else {
          next();
        }
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

exports.userId = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      req.userId = decodedToken.id;
      req.role = decodedToken.role;
    });
    req.login = true;
    next();
  } else {
    req.login = false;
    next();
  }
};
