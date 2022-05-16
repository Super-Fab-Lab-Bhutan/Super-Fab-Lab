const express = require("express");
const router = express.Router();

const {
  getBookedEq,
  bookInduction,
  equipmentBooking,
  getPrevBookings,
  deleteBooking,
} = require("../controller/booking");

/**Get for Booked Equipment**/
router.get("/admin/booking", getBookedEq);

/**Client Booking**/
router.post("/user/bookingInduction", bookInduction);

router.post("/user/addBooking", equipmentBooking);

router.post("/user/Bookings", getPrevBookings);

/*this dosent work fix it */
router.delete("/delete/booking/:id", deleteBooking);

module.exports = router;

