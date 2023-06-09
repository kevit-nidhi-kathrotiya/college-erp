import { Router } from "express";
import { authenticateMiddleware } from "../../middleware/authentication.middleware.js";
import StudentController from "./student.controller.js";

class StudentsRoute {
  path = "/students";

  router = Router();

  studentController = new StudentController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Auth Router

    // Add new student
    this.router.post(
      `${this.path}`,
      authenticateMiddleware.authorize,
      this.studentController.addStudent
    );

    // delete student
    this.router.delete(
      `${this.path}/:id`,
      authenticateMiddleware.authorize,
      this.studentController.deleteStudent
    );

    // update student
    this.router.patch(
      `${this.path}/:id`,
      authenticateMiddleware.authorize,
      this.studentController.updateStudent
    );

    // get batchwise, branchwise total no of students
    this.router.get(
      `${this.path}/batch/branch`,
      authenticateMiddleware.authorize,
      this.studentController.totalStudents
    );

    // get batchwise total vacanct seats
    this.router.get(
      `${this.path}/vacancy/:batchId`,
      authenticateMiddleware.authorize,
      this.studentController.studentsVacancy
    );

    // get Absent student lists for given batch, branch, semester and date values.
    this.router.get(
      `${this.path}/absent`,
      authenticateMiddleware.authorize,
      this.studentController.absentStudents
    );

    // get list of students whose attendance is less than 75% for given branch,batch and semester
    this.router.get(
      `${this.path}/attendance`,
      authenticateMiddleware.authorize,
      this.studentController.attendanceStudents
    );
  }
}

export default StudentsRoute;
