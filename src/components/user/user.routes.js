import { Router } from "express";
import { authenticateMiddleware } from "../../middleware/authentication.middleware.js";
import { validateRequestMiddleware } from "../../middleware/error.middleware.js";
import UserController from "./user.controller.js";
import { signInUserSchema, signUpUserSchema } from "./user.model.js";

class UsersRoute {
  path = "/users";

  router = Router();

  userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // No Auth router
    
    // Signup User
    this.router.post(`${this.path}`,validateRequestMiddleware(signUpUserSchema),this.userController.signUpUser);

    // Signin user
    this.router.post(`${this.path}/signIn`, validateRequestMiddleware(signInUserSchema),this.userController.signInUser);

    // Auth Router

    // get user information
    this.router.get(
      `${this.path}/me`,
      authenticateMiddleware.authorize,
      this.userController.getUsers
    );

    // delete user
    this.router.delete(
      `${this.path}/:id`,
      authenticateMiddleware.authorize,
      this.userController.deleteUser
    );

    // update user
    this.router.patch(
      `${this.path}/:id`,
      authenticateMiddleware.authorize,
      this.userController.updateUser
    );

    // signOut user
    this.router.post(
      `${this.path}/signOut`,
      authenticateMiddleware.authorize,
      this.userController.signOutUser
    );
  }
}

export default UsersRoute;
