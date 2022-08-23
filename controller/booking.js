const { sheets } = require("../middleware/uploadToSheets");
const { SendEmail, SendEmailHtml } = require("../middleware/mailer");
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
  const { id, userID } = req.body;
  const booking = await Booking.findOne({ userID: userID });
  const message = "The Booking has been Cancelled";
  const UserEmail = booking.UserEmail;
  const date = booking.date;
  const today = new Date().toJSON().substring(0, 10)
  if (today == date) {
    const message = "The Booking Cannot be cancelled on the date of booking";
    return res.json(false, message);   
  } else {
    try {
      await Booking.findByIdAndDelete({ _id: id });
      SendEmailHtml(UserEmail, message, "Booking Cancellation");
      return res.json(true);
    } catch (e) {
      res.json(false);
    }
  }
};

exports.cancelBooking = async (req, res) => {
  const {id,message} = req.body;
  const userinfo=await Booking.findById(id);
  await Booking.findByIdAndDelete(id);
  SendEmailHtml(userinfo.UserEmail,message,"Booking Cancellation")
  res.json("Cancellation Sucessful");
}

exports.cancelInductionBooking = async (req, res) => {
  const {id,message} = req.body;
  const userinfo=await bookingInduction.findById(id);
  await bookingInduction.findByIdAndDelete(id);
  SendEmailHtml(userinfo.UserEmail,message,"Booking Cancellation")
  res.json("Cancellation Sucessful");
}


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
             
               const subject = `Your Booking for ${EquipmentName} is Confrimed`;
              const message = `<head>
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		@media (max-width:660px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #1aa19c; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="divider_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad">
																	<div align="center" class="alignment">
																		<table border="0" cellpadding="0"
																			cellspacing="0" role="presentation"
																			style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																			width="100%">
																			<tbody>
																				<tr>
																					<td class="divider_inner"
																						style="font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;">
																						<span>&hairsp;</span></td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="width:100%;padding-right:0px;padding-left:0px;">
																	<div align="center" class="alignment"
																		style="line-height:10px"><a
																			href="https://jnwbhutansuperfablab.bt" style="outline:none"
																			tabindex="-1" target="_blank"><img
																				
																				src="https://superfablabbhutan.bt/images/favicon.png"
																				style="display: block; height: auto; border: 0; width: 160px; max-width: 100%;"
																				 width="160"></a>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="divider_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>

															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																	<div
																		style="font-family: Georgia, 'Times New Roman', serif">
																		<div class="txtTinyMce-wrapper"
																			style="font-size: 12px; font-family: Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">

																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																	<div
																		style="font-family: Georgia, 'Times New Roman', serif">
																		<div class="txtTinyMce-wrapper"
																			style="font-size: 12px; font-family: Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				<strong><span
																						style="font-size:22px;">Thank
																						you for booking our
																						machines.</span></strong> </p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				Your booking has been confirmed
																				for&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				Equipment ID:
																				<strong>${EquipmentId}</strong></p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 27px;">
																				<span style="font-size:18px;">Equipment
																					Name:
																					<strong>${EquipmentName}</strong></span>
																			</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 27px;">
																				Equipment Type:
																				<strong>${EquipmentType}</strong><br><span
																					style="font-size:18px;">Time:
																					<strong>${time}</strong></span></p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 27px;">
																				<span style="font-size:18px;">Date:
																					<strong>${date}</strong></span><br><br>
																			</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				<em>Please be mindful, you cannot cancel
																					your booking on the day of your
																					booking so please contact the lab
																					for any changes.&nbsp;</em></p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				<em><span style="font-size:17px;">For
																						further inquires, please contact
																						our team. <br>We will see you
																						soon.</span></em></p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #410125; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="divider_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;">
																	<div align="center" class="alignment">
																		<table border="0" cellpadding="0"
																			cellspacing="0" role="presentation"
																			style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																			width="100%">
																			<tbody>
																				<tr>
																					<td class="divider_inner"
																						style="font-size: 1px; line-height: 1px; border-top: 1px solid #555961;">
																						<span>&hairsp;</span></td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:30px;padding-left:40px;padding-right:40px;padding-top:20px;">
																	<div style="font-family: sans-serif">
																		<div class="txtTinyMce-wrapper"
																			style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
																			<p
																				style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21.6px; letter-spacing: 1px;">
																				<span
																					style="color:#95979c;font-size:12px;">JNW
																					SuperFabLab<br>Copyright ©
																					2021</span></p>
																			<p
																				style="margin: 0; font-size: 14px; text-align: center; letter-spacing: 1px; mso-line-height-alt: 21.6px;">
																				&nbsp;</p>
																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

				</td>
			</tr>
		</tbody>
	</table><!-- End -->

</body>`;
              SendEmailHtml(UserEmail, message, subject);
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
             
              const subject = `Your Booking for ${EquipmentName} is Confrimed`;
              const message = `<head>
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		@media (max-width:660px) {
			.desktop_hide table.icons-inner {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>

<body style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
		style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9;" width="100%">
		<tbody>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
						role="presentation"
						style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1aa19c;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #1aa19c; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="divider_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad">
																	<div align="center" class="alignment">
																		<table border="0" cellpadding="0"
																			cellspacing="0" role="presentation"
																			style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																			width="100%">
																			<tbody>
																				<tr>
																					<td class="divider_inner"
																						style="font-size: 1px; line-height: 1px; border-top: 4px solid #1AA19C;">
																						<span>&hairsp;</span></td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="image_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="width:100%;padding-right:0px;padding-left:0px;">
																	<div align="center" class="alignment"
																		style="line-height:10px"><a
																			href="https://jnwbhutansuperfablab.bt/" style="outline:none"
																			tabindex="-1" target="_blank"><img
	
																				src="https://superfablabbhutan.bt/images/favicon.png"
																				style="display: block; height: auto; border: 0; width: 160px; max-width: 100%;"
																			 width="160"></a>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="divider_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>

															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																	<div
																		style="font-family: Georgia, 'Times New Roman', serif">
																		<div class="txtTinyMce-wrapper"
																			style="font-size: 12px; font-family: Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">

																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-3" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
																	<div
																		style="font-family: Georgia, 'Times New Roman', serif">
																		<div class="txtTinyMce-wrapper"
																			style="font-size: 12px; font-family: Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				<strong><span
																						style="font-size:22px;">Thank
																						you for booking our
																						machines.</span></strong> </p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				Your booking has been confirmed
																				for&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				Equipment ID:
																				<strong>${EquipmentId}</strong></p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 27px;">
																				<span style="font-size:18px;">Equipment
																					Name:
																					<strong>${EquipmentName}</strong></span>
																			</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 27px;">
																				Equipment Type:
																				<strong>${EquipmentType}</strong><br><span
																					style="font-size:18px;">Time:
																					<strong>${time}</strong></span></p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 27px;">
																				<span style="font-size:18px;">Date:
																					<strong>${date}</strong></span><br><br>
																			</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				<em>Please be mindful, you cannot cancel
																					your booking on the day of your
																					booking so please contact the lab
																					for any changes.&nbsp;</em></p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center;">
																				<em><span style="font-size:17px;">For
																						further inquires, please contact
																						our team. <br>We will see you
																						soon.</span></em></p>
																			<p
																				style="margin: 0; font-size: 18px; text-align: center; mso-line-height-alt: 18px;">
																				&nbsp;</p>
																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4"
						role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
						<tbody>
							<tr>
								<td>
									<table align="center" border="0" cellpadding="0" cellspacing="0"
										class="row-content stack" role="presentation"
										style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; background-color: #410125; width: 640px;"
										width="640">
										<tbody>
											<tr>
												<td class="column column-1"
													style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
													width="100%">
													<table border="0" cellpadding="0" cellspacing="0"
														class="divider_block block-1" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:25px;">
																	<div align="center" class="alignment">
																		<table border="0" cellpadding="0"
																			cellspacing="0" role="presentation"
																			style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
																			width="100%">
																			<tbody>
																				<tr>
																					<td class="divider_inner"
																						style="font-size: 1px; line-height: 1px; border-top: 1px solid #555961;">
																						<span>&hairsp;</span></td>
																				</tr>
																			</tbody>
																		</table>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
													<table border="0" cellpadding="0" cellspacing="0"
														class="text_block block-2" role="presentation"
														style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
														width="100%">
														<tbody>
															<tr>
																<td class="pad"
																	style="padding-bottom:30px;padding-left:40px;padding-right:40px;padding-top:20px;">
																	<div style="font-family: sans-serif">
																		<div class="txtTinyMce-wrapper"
																			style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 21.6px; color: #555555; line-height: 1.8;">
																			<p
																				style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21.6px; letter-spacing: 1px;">
																				<span
																					style="color:#95979c;font-size:12px;">JNW
																					SuperFabLab<br>Copyright ©
																					2021</span></p>
																			<p
																				style="margin: 0; font-size: 14px; text-align: center; letter-spacing: 1px; mso-line-height-alt: 21.6px;">
																				&nbsp;</p>
																		</div>
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>

				</td>
			</tr>
		</tbody>
	</table><!-- End -->

</body>`;
              SendEmailHtml(UserEmail, message, subject);
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
  } catch (error) { }
};
