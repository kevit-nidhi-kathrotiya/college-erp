import HttpException from '../../utils/error.utils.js';
import { STUDENT_ERROR_CODES } from './student.errors.js';
import { Student, StudentAttendance } from './student.model.js';

export async function createNewStudent(studentBody) {
    try {
        return await Student.create(studentBody);
    } catch (err) {
        throw new HttpException(500, STUDENT_ERROR_CODES.CREATE_STUDENT_UNHANDLED_IN_DB, 'CREATE_STUDENT_UNHANDLED_IN_DB', err);
    }
}

export async function findStudentById(studentId) {
    try {
        return await Student.findById(studentId).lean();
    } catch (err) {
        throw new HttpException(500, STUDENT_ERROR_CODES.STUDENT_NOT_FOUND, 'STUDENT_NOT_FOUND', err);
    }
}

export async function studentFindByIdAndUpdate(studentId, updateObj) {
    try {
        return await Student.findByIdAndUpdate(studentId, updateObj, { new: true }).lean();
    } catch (err) {
        throw new HttpException(500, STUDENT_ERROR_CODES.UPDATE_STUDENT_UNHANDLED_IN_DB, 'UPDATE_STUDENT_UNHANDLED_IN_DB', err);
    }
}

export async function deleteStudentById(studentId) {
    try {
        return await Student.deleteOne({_id:studentId}, { new: true }).lean();
    } catch (err) {
        throw new HttpException(500, STUDENT_ERROR_CODES.DELETE_STUDENT_UNHANDLED_IN_DB, 'DELETE_STUDENT_UNHANDLED_IN_DB', err);
    }
}

export async function getAll(){
    try{
        return await Student.find({}).lean();
    }catch(err){
        throw new HttpException(500,STUDENT_ERROR_CODES.GETALL_STUDENT_UNHANDLED_IN_DB,'GETALL_STUDENT_UNHANDLED_IN_DB',err);
    }
}

export async function addAttendanceData(attendanceData){
    try{
        return await StudentAttendance.create(attendanceData);
    }catch(err){
        throw new HttpException(500,STUDENT_ERROR_CODES.ADDATT_STUDENT_UNHANDLED_IN_DB,'ADDATT_STUDENT_UNHANDLED_IN_DB',err);
    }
}

export async function findByDate(date){
    try{
        return await StudentAttendance.find({date});
    }catch(err){
        throw new HttpException(500,STUDENT_ERROR_CODES.ADDATT_DATE_UNHANDLED_IN_DB,'ADDATT_DATE_UNHANDLED_IN_DB',err);
    }
}