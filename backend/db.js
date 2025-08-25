const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://food:prasu27@food.euezxsr.mongodb.net/food?retryWrites=true&w=majority&appName=food';

mongoose.set('strictQuery', true); 
module.exports = function (callback) {
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, async (err) => {
        if (err) {
            console.log("---" + err);
        } else {
            console.log("✅ Connected to MongoDB Atlas");
            const foodCollection = await mongoose.connection.db.collection("food_items");
            foodCollection.find({}).toArray(async function (err, data) {
                const categoryCollection = await mongoose.connection.db.collection("foodCategory");
                categoryCollection.find({}).toArray(async function (err, Catdata) {
                    callback(err, data, Catdata);
                });
            });
        }
    });
};
