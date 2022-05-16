const User = require("../model/user");
const Booking = require("../model/booking");

exports.getProfile = async (req, res) => {
  const id = req.body.userID;
  const bookings = await Booking.find({ user: id });
  try {
    res.json({ bookings });
  } catch (e) {
    console.log(e);
  }
};

exports.getUsers = async (req, res) => {
  const user = await User.find({ role: { $ne: "admin" } });
  res.render("./adminpanel/viewusers/viewusers", { users: user });
};

exports.editUsers = async (req, res) => {
  const { id } = req.params;
  const users = await User.findById(id);
  res.render("./adminpanel/viewusers/edit", { user: users });
};

exports.patchUsers = async (req, res) => {
  const updatedUser = req.body;
  const { id } = req.params;
  await User.findByIdAndUpdate(id, updatedUser);
  res.redirect("/admin/users");
};

exports.patchApprove = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { isVerified: true });
  res.redirect("/admin/users");
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);

  res.redirect("/admin/users");
};

exports.getApproval = async (req, res) => {
  const approve = await User.find({ isVerified: false });
  res.render("./adminpanel/viewusers/approve", { approve });
};
