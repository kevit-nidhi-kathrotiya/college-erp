import { Router } from 'express';
import { authenticateMiddleware } from '../../middleware/authentication.middleware.js';
import { validateRequestMiddleware } from '../../middleware/error.middleware.js';
import UserController from './user.controller.js';
import { signInUserSchema, signUpUserSchema } from './user.model.js';

class UsersRoute {
    path = '/users';

    router = Router();

    userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        // No Auth router
        // this.router.post(`${this.path}`, validateRequestMiddleware(signUpUserSchema), this.userController.signUpUser);
        this.router.post(`${this.path}`, this.userController.signUpUser);

        this.router.post(
            `${this.path}/signIn`,
            this.userController.signInUser,
        );

        // Auth Router
        this.router.get(`${this.path}/me`, authenticateMiddleware.authorize, this.userController.getUsers);

        this.router.delete(`${this.path}/:id`, authenticateMiddleware.authorize, this.userController.deleteUser);
        
        this.router.patch(`${this.path}/:id`, authenticateMiddleware.authorize, this.userController.updateUser);
        
        this.router.post(`${this.path}/signOut`, authenticateMiddleware.authorize, this.userController.signOutUser);
    }
}

export default UsersRoute;
