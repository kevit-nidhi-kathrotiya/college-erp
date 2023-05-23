export const STUDENT_ERROR_CODES = {
    // STUDENT Controller error codes
    BAD_REQUEST_GET_STUDENTS: 'Imported parameter missing from request',
    SIGN_IN_BAD_REQUEST: 'Imported parameter missing in sign In request',
    SIGN_IN_FAIL: 'Provided cred are not correct',
    STUDENT_NOT_FOUND: 'Student not found for email id',
    INCORRECT_PASSWORD: 'Password incorrect',
    STUDENT_SESSION_EXPIRED: 'Student login timeout',
    AUTH_FAILED: 'Auth failed',
    BAD_REQUEST_FOR_UPLOAD_PROFILE_PHOTO: 'Some imported parameter missing in upload request',
    UPDATE_STUDENT_UNHANDLED_IN_DB : 'something went wrong while updating Student data',
    DELETE_STUDENT_UNHANDLED_IN_DB : 'something went wrong while deleting Student data ',
    GETALL_STUDENT_UNHANDLED_IN_DB : 'somethong went wrong while fetching student data',
    ADDATT_STUDENT_UNHANDLED_IN_DB : 'somethong went wrong while add attendance data',
    ADDATT_STUDENT_IN_BAD_REQUEST : 'Imported parameter missing in add attendance request',
    ADDATT_STUDENT_DATE_EXISTS : 'passed date to add attendance is already exists',
    ADDATT_DATE_UNHANDLED_IN_DB : 'something went wrong while fetching datewise attendance.',

    // STUDENT DAL error codes
    CREATE_STUDENT_UNHANDLED_IN_DB: 'Something went wrong while creating new Student',
};
