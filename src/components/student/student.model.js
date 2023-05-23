import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// ===============================================================================
// APIs schema to validate requests
// ===============================================================================

// ----------------------------------------------------------------------------
// Student Schema for store in DB
// ----------------------------------------------------------------------------
const studentSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    emailId: Schema.Types.String,

    mobileNo: {
        type:Schema.Types.String,
        require : true,
    },

    department : {
        type: Schema.Types.String,
        require: true,
    },

    batch: {
        type: Schema.Types.Number,
        require: true,
    },
    accessToken: Schema.Types.String,
});

const attendanceSchema = new Schema({
    date:{
        type: Date,
        require: true,
    },
        
    attendance:[{
        student_id:{
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref: 'Student'
        },
        value:{
            type:String,
            enum: ['A','P'],
            required: true,
            default: 'A'
        }
    }],
});

studentSchema.index({ emailId: 1 }, { unique: true });
export const Student = model('student', studentSchema);
export const StudentAttendance = model('student-attendance', attendanceSchema);
