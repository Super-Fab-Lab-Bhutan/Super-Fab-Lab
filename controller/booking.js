const Booking = require("../model/booking");
const bookingInduction = require("../model/bookingInduction");
const Equipment = require("../model/equipment");
const User = require("../model/user");

exports.getBookedEq = async (req, res) => {
  res.render("./adminpanel/booking/viewbooking");
};

exports.postBookedEq = async (req, res) => {
  const {date} = req.body;
  const booking = await Booking.find({date});
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

    if (booking == null) {
      const timeSlot = await Booking.findOne({
        $and: [{ time: time }, { userID: userID }, { date: date }],
      });

      if (timeSlot == null) {
        const noofbooking = await Booking.findOne({
          $and: [
            { userID: userID },
            { EquipmentId: EquipmentId },
            { date: date },
          ],
        });
        if (noofbooking != null) {
          var bookingtimes = noofbooking.times;
        } else {
          var bookingtimes = 0;
        }
        if (bookingtimes < 3) {
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

              await Booking.updateMany({
                $and: [{ userID }, { EquipmentId }],
                times: newtimes,
              });
            }

            //const booking = await Booking.findOne({ userID: userID });
            //const bid = booking._id.valueOf();
            // mail.sendMail(time,date,userID,EquipmentId,EquipmentName,
            // EquipmentType,UserName,UserEmail,UserPhone,UserOrganization,bid)
            // .then((result) => console.log('Email sent...', result))
            // .catch((error) => console.log(error.message));
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
          });
        }
      } else {
        return res.json({
          message: "you already have a booking at this time",
          value: "true",
        });
      }
    } else {
      return res.json({
        message:
          "Booking for this Equipment at this time is already done.Please Try another time.",
      });
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

    let UserBooking = await Booking.find({ user: userId, date: date });

    let Data = [];
    let listTime = [
      "09:30-10:30",
      "10:30-11:30",
      "11:30-12:30",
      "01:30-02:30",
      "02:30-03:30",
      "03:30-04:30",
      "04:30-05:30",
      "05:30-06:30",
    ];

    for (let i of equipment) {
      let booking = await Booking.find({ date: date });
      let Time = [];

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
      for (let i of listTime) {
        for (let j of booking) {
          //check for general booking
          if (i == j.time && e == j.EquipmentId) {
            //check for user booking
            for (let l of UserBooking) {
              if ((i = l.time && date == l.date && e == l.EquipmentId)) {
                Time[k] = {
                  time: i,
                  booked: 1, //booked by user
                };
                break;
              } else {
                Time[k] = {
                  time: i,
                  booked: 0, //booked
                };
              }
            }

            break;
          } else {
            Time[k] = {
              time: i,
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
