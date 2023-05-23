import { Router } from 'express';
import { authenticateMiddleware } from '../../middleware/authentication.middleware.js';
import StudentController from './student.controller.js';

class StudentsRoute {
    path = '/students';

    router = Router();

    studentController = new StudentController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {

        // Auth Router
        this.router.post(`${this.path}`, authenticateMiddleware.authorize, this.studentController.addStudent);

        this.router.delete(`${this.path}/:id`, authenticateMiddleware.authorize, this.studentController.deleteStudent);

        this.router.patch(`${this.path}/:id`, authenticateMiddleware.authorize, this.studentController.updateStudent);

        this.router.get(`${this.path}`, authenticateMiddleware.authorize, this.studentController.getStudents);

        this.router.post(`${this.path}/attendance`,authenticateMiddleware.authorize, this.studentController.addAttendance);
    }
}

export default StudentsRoute;
