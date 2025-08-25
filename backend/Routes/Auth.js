const express = require('express');
const User = require('../models/User');
const Order = require('../models/Orders');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fetch = require('../middleware/fetchdetails');

const jwtSecret = "HaHa";

// ✅ Create a new user
router.post('/createuser', [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('name').isLength({ min: 3 })
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    let securePass = await bcrypt.hash(req.body.password, salt);

    let user = await User.create({
      name: req.body.name,
      password: securePass,
      email: req.body.email,
      location: req.body.location
    });

    const data = {
      user: {
        id: user.id
      }
    };

    const authToken = jwt.sign(data, jwtSecret);
    success = true;
    res.json({ success, authToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error. Possibly duplicate email." });
  }
});

// ✅ Login user
router.post('/login', [
  body('email', "Enter a valid Email").isEmail(),
  body('password', "Password cannot be blank").exists(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "Invalid credentials" });
    }

    const pwdCompare = await bcrypt.compare(password, user.password);
    if (!pwdCompare) {
      return res.status(400).json({ success, error: "Invalid credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    };

    success = true;
    const authToken = jwt.sign(data, jwtSecret);
    res.json({ success, authToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get user details (Protected Route)
router.post('/getuser', fetch, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Get location from lat/long
router.post('/getlocation', async (req, res) => {
  try {
    let lat = req.body.latlong.lat;
    let long = req.body.latlong.long;

    let location = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`
    );

    let response = location.data.results[0].components;
    let { village, county, state_district, state, postcode } = response;

    res.send({ location: `${village || ''}, ${county || ''}, ${state_district || ''}, ${state || ''}, ${postcode || ''}` });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Send food data (from global)
router.get('/foodData', async (req, res) => {
  try {
    res.send([global.foodData, global.foodCategory]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ✅ Place order
// ✅ Place order
router.post('/orderData', async (req, res) => {
  let data = req.body.order_data;
  data.unshift({ Order_date: req.body.order_date });

  try {
    let existingOrder = await Order.findOne({ email: req.body.email });

    if (!existingOrder) {
      await Order.create({
        email: req.body.email,
        order_data: [data]
      });
    } else {
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: { $each: [data], $position: 0 } } } // 🔥 insert at top
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// ✅ Get my orders
// ✅ Get my orders
router.post('/myOrderData', async (req, res) => {
  try {
    let order = await Order.findOne({ email: req.body.email });

    if (!order) {
      return res.json({ success: false, orderData: [] });
    }

    res.json({ success: true, orderData: order.order_data }); // recent orders already on top
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});



module.exports = router;
