const User = require("../models/UsersSchema");

module.exports = {
  /*** Add User to Database ***/ 
  add_user: async (req, res) => {
    try {
      // Validate and sanitize the request body
      const { email, password, image, name, image_id, role } = req.body;
 
      // Create a new user instance
      const newUser = new User({
        email,
        password,
        image,
        name,
        image_id,
        role,
      });

      // Save the user to the database
      const user = await newUser.save();

      // Respond with success
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (err) {
      err.name === "MongoServerError" && err.code === 11000
        ? res
            .status(400)
            .json({ status: "fail", message: "tag name already exists" })
        : res.status(400).json({ status: "fail", message: err.message });
    }
  },

  /*** Get Users from Database ***/
  get_users: async (req, res) => {
    try {
      let users = await User.find();
      res.status(200).json({
        status: "success",
        results: users.length,
        data: {
          users,
        },
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** Get a Single User ***/
  get_single_user: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** Update User ***/
  update_user: async (req, res) => {
    try {
      console.log(req.body);
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    }
  },

  /*** Remove a User ***/
  remove_user: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(204).json({ status: "success", data: null });
    } catch (err) {
      res.status(404).json({ status: "fail", message: err.message });
    }
  },
};
