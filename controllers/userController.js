import userModel from "../models/userModel.js";

export const getInfoController = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select("-password")
      .sort({ createdAt: -1 });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting infos",
    });
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.status(200).send({
      success: true,
      message: "Successfully fetched all users",
      users: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while getting all users",
      error,
    });
  }
};

export const makeUserAdminController = async (req, res) => {
  try {
    const userId = req.params.id;
    // Fetch the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).send({ success: true, error: "User not found" });
    }

    // Update the user's role to admin
    if (user.role === 1) {
      user.role = 0;
    } else {
      user.role = 1;
    }
    await user.save();

    res.status(200).send({
      success: true,
      message: "User has been made admin successfully.",
    });
  } catch (error) {
    console.error("Error making user admin:", error);
    res.status(500).send({
      success: false,
      error: "An error occurred while making the user admin.",
    });
  }
};
