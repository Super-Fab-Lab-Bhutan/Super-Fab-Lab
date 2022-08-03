const { sheets } = require("../middleware/uploadToSheets");
const { SendEmail } = require("../middleware/mailer");
const Booking = require("../model/booking");
const bookingInduction = require("../model/bookingInduction");
const Equipment = require("../model/equipment");
const User = require("../model/user");

exports.getBookedEq = async (req, res) => {
  res.render("./adminpanel/booking/viewbooking");
};

exports.postBookedEq = async (req, res) => {
  const { date } = req.body;
  const booking = await Booking.find({ date });
  res.json(booking);
};

exports.deleteBooking = async (req, res) => {
  try {
    const { id, userID } = req.body;
    const booking = await Booking.findOne({ userID: userID });
    const message = "The Booking has been canceled";
    const UserEmail = booking.UserEmail;
    await Booking.findByIdAndDelete({ _id: id });
    /*mail
          .sendMail(UserEmail, message)
          .then((result) => console.log("Email sent...", result))
          .catch((error) => console.log(error.message));*/
    res.json(true);
  } catch (e) {
    res.json(false);
  }
};

exports.getBookingInduction = async (req, res) => {
  const { date } = req.body;

  const data = await bookingInduction.find({ date });
  res.json(data);
};

exports.viewBookingInduction = async (req, res) => {
  res.render("./adminpanel/booking/inductionBooking");
};

exports.bookInduction = async (req, res) => {
  const { date, userID } = req.body;
  const userinfo = await User.findById(userID);
  const UserName = userinfo.username;
  const UserEmail = userinfo.email;
  const UserPhone = userinfo.phoneNumber;
  const UserOrganization = userinfo.organization;
  const time = "3:00-5:00";

  const booking_exist = await bookingInduction.findOne({ userID: userID });
  if (booking_exist == null) {
    try {
      await bookingInduction.create({
        time,
        date,
        userID,
        UserName,
        UserEmail,
        UserPhone,
        UserOrganization,
      });
      return res.json({
        message: "Done",
        value: "true",
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    return res.json({
      message: "You have already booked a slot",
      value: "false",
    });
  }
};

exports.equipmentBooking = async (req, res) => {
  const { date, EquipmentId, time, userID } = req.body;
  const userinfo = await User.findById(userID);
  const equipmentinfo = await Equipment.findById(EquipmentId);
  const EquipmentName = equipmentinfo.equipmentName;
  const EquipmentType = equipmentinfo.type;
  const UserName = userinfo.username;
  const UserEmail = userinfo.email;
  const UserPhone = userinfo.phoneNumber;
  const UserOrganization = userinfo.organization;

  const userInduction = await User.findOne({
    $and: [{ _id: userID }, { inductionTraning: true }],
  });

  if (userInduction == null) {
    return res.json({
      message: "Please Complete your induction booking before booking",
    });
  } else {
    const booking = await Booking.findOne({
      $and: [{ date: date }, { EquipmentId: EquipmentId }, { time: time }],
    });

    if (!EquipmentName.toLowerCase().includes("3d")) {
      //logic for normal booking [not 3d printers]

      if (booking == null) {
        //1. if there is booking available at this time

        const timeSlot = await Booking.findOne({
          $and: [{ time: time }, { userID: userID }, { date: date }],
        });

        if (timeSlot == null) {
          //2. if there is booking available and you have no other booking at same time slot
          const noofbooking = await Booking.findOne({
            $and: [
              { userID: userID },
              { EquipmentId: EquipmentId },
              { date: date },
            ],
          });
          let bookingtimes = 0;
          if (noofbooking != null) {
            bookingtimes = noofbooking.times;
          }

          if (bookingtimes < 3) {
            //3. if for same equipment you have less than 3 bookings at same day
            try {
              await Booking.create({
                time,
                date,
                EquipmentId,
                EquipmentName,
                userID,
                EquipmentType,
                UserName,
                UserEmail,
                UserPhone,
                UserOrganization,
              });
              if (noofbooking != null) {
                let newtimes = noofbooking.times + 1;

                //update by adding 1 of number of booking for same equipment in same day by same user
                await Booking.updateMany(
                  { userID, EquipmentId, date },
                  { $set: { times: newtimes } }
                );
              }
              const data = {
                time,
                date,
                EquipmentId,
                EquipmentName,
                userID,
                EquipmentType,
                UserName,
                UserEmail,
                UserPhone,
                UserOrganization,
              };
              // sheets({ data });
              const bid = "";
              const subject = "Your Booking is Confirmed. Booking ID: " + bid;
              const message = `Equipment: ${EquipmentName}<br>Equipment ID: ${EquipmentType}<br>TIme: ${time}</br>Date: ${date}`;
              // SendEmail(UserEmail, message, subject);
            } catch (e) {
              console.log(e);
            }
            return res.json({
              message: "Your Booking is Confirmed",
              value: "true",
            });
          } else {
            return res.json({
              message: "equipment already booked more than only",
              value: "false",
            });
          }
        } else {
          return res.json({
            message: "you already have a booking at this time",
            value: "false",
          });
        }
      } else {
        return res.json({
          message:
            "Booking for this Equipment at this time is already done.Please Try another time.",
          value: "false",
        });
      }
    } else {
      //logic for 3d printers
      const timeSlot = await Booking.findOne({
        $and: [
          { time: time },
          { userID: userID },
          { EquipmentId: EquipmentId },
          { date: date },
        ],
      });

      if (timeSlot == null) {
        //2. if there is booking available and you have no other booking at same time slot and same machine

        const noofbooking = await Booking.findOne({
          $and: [
            { userID: userID },
            { EquipmentId: EquipmentId },
            { date: date },
          ],
        });
        let bookingtimes = 0;
        if (noofbooking != null) {
          bookingtimes = noofbooking.times;
        }

        const totalbooking = await Booking.find({
          $and: [{ EquipmentId: EquipmentId }, { date: date }],
        });
        // console.log(totalbooking);
        //number of booking should not exceed certain number
        if (totalbooking.length < 3) {
          if (bookingtimes < 2) {
            // if for same equipment you have less than 6 bookings at same day for same equipment and time
            try {
              await Booking.create({
                time,
                date,
                EquipmentId,
                EquipmentName,
                userID,
                EquipmentType,
                UserName,
                UserEmail,
                UserPhone,
                UserOrganization,
              });
              if (noofbooking != null) {
                var newtimes = noofbooking.times + 1;

                //update by adding 1 of number of booking for same equipment in same day by same user
                await Booking.updateMany(
                  { userID, EquipmentId, date },
                  { $set: { times: newtimes } }
                );
              }
              const data = {
                time,
                date,
                EquipmentId,
                EquipmentName,
                userID,
                EquipmentType,
                UserName,
                UserEmail,
                UserPhone,
                UserOrganization,
              };
              // sheets({ data });
              const bid = "";
              const subject = "Your Booking is Confirmed. Booking ID: " + bid;
              const message = `Equipment: ${EquipmentName}<br>Equipment ID: ${EquipmentType}<br>TIme: ${time}</br>Date: ${date}`;
              // SendEmail(UserEmail, message, subject);
            } catch (e) {
              console.log(e);
            }
            return res.json({
              message: "Your Booking is Confirmed",
              value: "true",
            });
          } else {
            return res.json({
              message: "equipment already booked more than only",
              value: "false",
            });
          }
        } else {
          return res.json({
            message:
              "Total allocated number of booking for this slot is filled",
            value: "false",
          });
        }
      } else {
        return res.json({
          message: "you already have a booking at this time",
          value: "false",
        });
      }
    }
  }
};

exports.getPrevBookings = async (req, res) => {
  const { date, role, userId } = req.body;
  try {
    var equipment = null;

    if (role == "student") {
      equipment = await Equipment.find({
        $and: [{ student: true }, { isAvailable: true }],
      });
    } else if (role == "startup") {
      equipment = await Equipment.find({
        $and: [{ startup: true }, { isAvailable: true }],
      });
    } else if (role == "company") {
      equipment = await Equipment.find({
        $and: [{ company: true }, { isAvailable: true }],
      });
    } else if (role == "community") {
      equipment = await Equipment.find({
        $and: [{ community: true }, { isAvailable: true }],
      });
    } else {
      equipment = await Equipment.find({});
    }

    let Data = [];
    for (let i of equipment) {
      let booking = await Booking.find({ date: date });
      let Time = [];

      let listTime = [];
      let checkFor3DPrinter = false; //check if equipment is 3d printer or not
      if (i.equipmentName.toLowerCase().includes("3d")) {
        checkFor3DPrinter = true;
        listTime = ["09:30-12:30", "01:30-06:30"];
      } else {
        listTime = [
          "09:30-10:30",
          "10:30-11:30",
          "11:30-12:30",
          "01:30-02:30",
          "02:30-03:30",
          "03:30-04:30",
          "04:30-05:30",
          "05:30-06:30",
        ];
      }
      // construct a list
      for (let x of listTime) {
        Time.push({
          time: x,
          booked: 2, // not booked
        });
      }
      // populate the list
      let e = i.id;
      let k = 0;
      for (let time of listTime) {
        for (let j of booking) {
          //check for general booking
          if (time == j.time && e == j.EquipmentId) {
            //check for user booking
            if (!checkFor3DPrinter) {
              //normal equipments logic
              if (userId == j.userID) {
                Time[k] = {
                  time: time,
                  booked: 1, //booked by user
                };
              } else {
                Time[k] = {
                  time: time,
                  booked: 0, //booked
                };
              }
            } else {
              let totalAvailable = 3;
              let totalbooking;
              try {
                totalbooking = await Booking.find({
                  $and: [{ EquipmentId: e }, { date: date }],
                });
              } catch (error) {
                console.log(error.message);
              }
              if (userId == j.userID) {
                Time[k] = {
                  time: time,
                  booked: 1, //booked by user
                };
              } else if (totalbooking.length < totalAvailable) {
                Time[k] = {
                  time: time,
                  booked: 2, //available
                };
              } else {
                Time[k] = {
                  time: time,
                  booked: 0, //booked
                };
              }
            }
            break;
          } else {
            Time[k] = {
              time: time,
              booked: 2, //not booked
            };
          }
        }
        k++;
      }

      let data = {
        EquipmentName: i.equipmentName,
        EquipmentId: i._id,
        Booking: Time,
        Type: i.type,
      };
      Data.push(data);
    }
    return res.json(Data);
  } catch (error) {}
};
