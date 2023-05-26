import HttpException from '../../utils/error.utils.js';
import { STUDENT_ERROR_CODES } from './student.errors.js';
import { Student, StudentAttendance, Batch } from './student.model.js';

export async function createNewStudent(studentBody) {
    try {
        return await Student.create(studentBody);
    } catch (err) {
        throw new HttpException(500, STUDENT_ERROR_CODES.CREATE_STUDENT_UNHANDLED_IN_DB, 'CREATE_STUDENT_UNHANDLED_IN_DB', err);
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

export async function batchAggregate(agg){
    try{
        return await Batch.aggregate(agg);
    }catch(err){
        throw new HttpException(500,STUDENT_ERROR_CODES.STUDENT_AGG_UNHANDLED_IN_DB,'STUDENT_AGG_UNHANDLED_IN_DB',err);
    }
}

export async function attandanceAggregate(agg){
    try{
        return await StudentAttendance.aggregate(agg);
    }catch(err){
        throw new HttpException(500,STUDENT_ERROR_CODES.ATT_STUDENT_AGG_UNHANDLED_IN_DB,'ATT_STUDENT_AGG_UNHANDLED_IN_DB',err);
    }
}

export async function countDocs(filterData){
    try{
        return await StudentAttendance.countDocuments(filterData)
    }catch(err){
        throw new HttpException(500,STUDENT_ERROR_CODES.STUDENT_COUNTDOC_UNHANDLED_IN_DB,'STUDENT_COUNTDOC_UNHANDLED_IN_DB',err);
    }
}