const { google } = require("googleapis");


exports.sheets = async (data) => {
   
    const auth = new google.auth.GoogleAuth({
        keyFile: "./crednpm.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1Wuz1MEi9Gti22ZRY5fk1SF1uoc5PcvGa5CVdzF1OFKY";

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });


    /* Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1",
    });
    console.log(getRows.data)*/

    // Write row(s) to spreadsheet

    const p = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:L",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[data._id, data.EquipmentId, data.EquipmentName, data.EquipmentType, data.userID, data.UserName, data.UserEmail, data.UserOrganization, data.UserPhone, data.createdAt, data.date, data.time]],
        },
    })
 
}