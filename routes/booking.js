const express = require("express");
const router = express.Router();

const { adminAuth, Auth } = require("../middleware/auth");
const {
  getBookedEq,
  bookInduction,
  equipmentBooking,
  getPrevBookings,
  deleteBooking,
} = require("../controller/booking");

/**Get for Booked Equipment**/
router.get("/admin/booking", adminAuth, getBookedEq);

/**Client Booking**/
router.post("/user/bookingInduction", bookInduction);

router.post("/user/addBooking", equipmentBooking);

router.post("/user/Bookings", getPrevBookings);

router.post("/delete/booking", deleteBooking);

module.exports = router;
