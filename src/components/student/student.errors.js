export const STUDENT_ERROR_CODES = {
    // STUDENT Controller error codes
    BAD_REQUEST_STUDENTS: 'Imported parameter missing from request',
    NO_ATTENDANCE_STUDENTS: 'no attendance data found for passed parameter values',
  
    // STUDENT DAL error codes
    CREATE_STUDENT_UNHANDLED_IN_DB: 'Something went wrong while creating new Student',
    UPDATE_STUDENT_UNHANDLED_IN_DB : 'something went wrong while updating Student data',
    DELETE_STUDENT_UNHANDLED_IN_DB : 'something went wrong while deleting Student data ',
    ADDATT_DATE_UNHANDLED_IN_DB : 'something went wrong while fetching datewise attendance.',
    STUDENT_AGG_UNHANDLED_IN_DB : 'something went wrong while fetching data using aggregation on students',
    ATT_STUDENT_AGG_UNHANDLED_IN_DB: 'something went wrong while fetching data using aggregation on attandances',
    STUDENT_COUNTDOC_UNHANDLED_IN_DB : 'something went wrong while fetching dcument cunts for students'
};