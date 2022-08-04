const express = require("express");
const router = express.Router();

const { adminAuth, Auth } = require("../middleware/auth");
const {
  getBookedEq,
  bookInduction,
  equipmentBooking,
  getPrevBookings,
  deleteBooking,
  postBookedEq,
  getBookingInduction,
  viewBookingInduction,
  cancelBooking,
  cancelInductionBooking

} = require("../controller/booking");

/**Get for Booked Equipment**/
router.get("/admin/booking", adminAuth, getBookedEq);

router.post("/admin/booking", adminAuth, postBookedEq);

router.get("/viewBookingInduction", viewBookingInduction)


/**Client Booking**/
router.post("/user/bookingInduction", bookInduction);

router.post("/BookingInduction", getBookingInduction)

router.post("/user/addBooking", equipmentBooking);

router.post("/user/Bookings", getPrevBookings);

router.post("/delete/booking", deleteBooking);

router.post("/cancel/booking", cancelBooking);

router.post("/cancel/InductionBooking", cancelInductionBooking);

module.exports = router;
