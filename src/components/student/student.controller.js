import path from 'path';
import Config from '../../environment/index.js';
import HttpException from '../../utils/error.utils.js';
import { createNewStudent, findStudentById, studentFindByIdAndUpdate, deleteStudentById, getAll, addAttendanceData, findByDate } from './student.DAL.js';
import { STUDENT_ERROR_CODES } from './student.errors.js';
import { Student, StudentAttendance} from './student.model.js';
import mongoose from 'mongoose';


class StudentsController {

    /**
     * Add new student
     * @param {Request} req => Express Request
     * @param {Response} res => Express Repponse
     * @param {NextFunction} next => Express next function
     */
    async addStudent(req, res, next){
        try{
            // Getting data from body and creating new student
            const { name, emailId, mobileNo, department, batch } = req.body;
            const studentObject = {
                name,
                emailId,
                mobileNo,
                department,
                batch,
            };
            const student = await createNewStudent(studentObject);

            return res.status(200).json({ _id: student._id });
        }catch(err){
            return next(err);
        }
    }

    /**
     * update student data
     * @param {Request} req => Express Request
     * @param {Response} res => Express Repponse
     * @param {NextFunction} next => Express next function
     */
    async updateStudent(req, res, next){
        try{
            const student = await studentFindByIdAndUpdate(req.params.id, req.body)
            return res.status(200).json(student);
        }catch(err){
            return next(err);
        }
    }

    /**
     * delete student data
     * @param {Request} req => Express Request
     * @param {Response} res => Express Repponse
     * @param {NextFunction} next => Express next function
     */
    async deleteStudent(req, res, next){
        try{
            const student = await deleteStudentById(req.params.id)
            return res.status(200).json(student);
        }catch(err){
            return next(err);
        }
    }
    
    /**
     * Get student list
     * @param {Request} req => Express Request
     * @param {Response} res => Express Repponse
     * @param {NextFunction} next => Express next function
     */
    async getStudents(req, res, next){
        try{
            const students = await getAll();
            return res.status(200).send(students);
        }catch(err){
            return next(err);
        }
    }

    async addAttendance(req,res,next){
        if (!req.query.date || !req.query.id){
            throw new HttpException(400, STUDENT_ERROR_CODES.ADDATT_STUDENT_IN_BAD_REQUEST, 'ADDATT_STUDENT_IN_BAD_REQUEST', null);
        }

        const date_data = await findByDate(req.query.date)

        if(Object.keys(date_data).length !== 0){
            throw new HttpException(400, STUDENT_ERROR_CODES.ADDATT_STUDENT_DATE_EXISTS, 'ADDATT_STUDENT_DATE_EXISTS', null);
        }

        const att_data = {
            date: req.query.date,
            attendance : [{
                student_id : mongoose.Types.ObjectId(req.query.id),
                value : req.body.value
            }]
        }

        try{
            const attData = await addAttendanceData(att_data);
            return res.status(200).send(attData);

        }catch(err){
            return next(err);
        }
    }
}

export default StudentsController;