const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://sfl:admin1234@cluster0.zrvc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Database Connected!");
};

module.exports = connectDB;