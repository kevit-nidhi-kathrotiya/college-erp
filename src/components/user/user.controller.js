import HttpException from "../../utils/error.utils.js";
import {
  createNewUser,
  findUserById,
  userFindByIdAndUpdate,
  deleteUserById,
} from "./user.DAL.js";
import { USER_ERROR_CODES } from "./user.errors.js";
import { User } from "./user.model.js";

class UsersController {
  /** In all functions below paraeters are same
   * @param {Request} req => Express Request
   * @param {Response} res => Express Repponse
   * @param {NextFunction} next => Express next function
   */

  /** Sign up new user and send mail to them */
  async signUpUser(req, res, next) {
    try {
      // Getting data from body and creating new user
      const { firstName, lastName, emailId, role, mobileNo, password } =
        req.body;
      const userObject = {
        firstName,
        lastName,
        emailId,
        role,
        mobileNo,
        password,
      };
      const user = await createNewUser(userObject);

      return res.status(200).json({ _id: user._id });
    } catch (err) {
      return next(err);
    }
  }

  /** Sign in user with email and password - generate token for session */
  async signInUser(req, res, next) {
    try {
      // Validating body data
      const { email, password } = req.body;
      if (!email || !password) {
        throw new HttpException(
          400,
          USER_ERROR_CODES.SIGN_IN_BAD_REQUEST,
          "SIGN_IN_BAD_REQUEST",
          null
        );
      }

      // Finding user and validating data
      const userData = await User.findByCredentials(email, password);
      if (!userData) {
        throw new HttpException(
          404,
          USER_ERROR_CODES.SIGN_IN_FAIL,
          "SIGN_IN_FAIL",
          null
        );
      }

      const userToken = await userData.getAuthToken();
      return res.status(200).json({
        accessToken: userToken,
        userId: userData._id,
        userName: userData.firstName,
        email: userData.emailId,
      });
    } catch (err) {
      return next(err);
    }
  }

  /** Get user profile of logged in user */
  async getUsers(req, res, next) {
    try {
      // Get user data of logIn user
      const userId = req.user._id;
      const user = await findUserById(userId);

      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }

  /** only admin can delete user by _id */
  async deleteUser(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new HttpException(
          400,
          USER_ERROR_CODES.ADMIN_RIGHTS_ONLY,
          "ADMIN_RIGHTS_ONLY",
          null
        );
      }
      const user = await deleteUserById(req.params.id);
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }

  /** only admin can update user data by id */
  async updateUser(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new HttpException(
          400,
          USER_ERROR_CODES.ADMIN_RIGHTS_ONLY,
          "ADMIN_RIGHTS_ONLY",
          null
        );
      }
      const user = await userFindByIdAndUpdate(req.params.id, req.body);
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  }

  /** Signout current user - delete token */
  async signOutUser(req, res, next) {
    try {
      req.user.accessToken = "";
      await req.user.save();
      res.status(200).send({ message: "Logout successfully!"});
    } catch (err) {
      return next(err);
    }
  }
}

export default UsersController;
