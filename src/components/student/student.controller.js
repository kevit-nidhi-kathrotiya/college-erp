import HttpException from '../../utils/error.utils.js';
import mongoose from 'mongoose';
import { STUDENT_ERROR_CODES } from './student.errors.js';
import { createNewStudent, studentFindByIdAndUpdate, deleteStudentById, 
  batchAggregate, attandanceAggregate, countDocs} from './student.DAL.js';

class StudentsController {
    
    /** add new student
     * @param {Request} req => Express Request
     * @param {Response} res => Express Repponse
     * @param {NextFunction} next => Express next function
     */
    async addStudent(req, res, next){
        try{
            // Getting data from body and creating new student
            const { name, emailId, mobileNo, department, batch, currentSem} = req.body;
            const studentObject = {
                name,
                emailId,
                mobileNo,
                department,
                batch,
                currentSem
            };
            const student = await createNewStudent(studentObject);

            return res.status(200).json({ _id: student._id });
        }catch(err){
            return next(err);
        }
    }
  
    async updateStudent(req, res, next){
        try{
            const student = await studentFindByIdAndUpdate(req.params.id, req.body)
            return res.status(200).json(student);
        }catch(err){
            return next(err);
        }
    }

    async deleteStudent(req, res, next){
        try{
            const student = await deleteStudentById(req.params.id)
            return res.status(200).json(student);
        }catch(err){
            return next(err);
        }
    }

    /**
     * @returns - batchwise + branchwise total number of students for passed input values. 
     */
    async totalStudents(req,res,next){
        const agg = [
          {
            '$lookup': {
              'from': 'students',
              'let': {
                'batchid': '$_id', 
              }, 
              'pipeline': [
                  {
                      '$match': {
                        '$expr':{
                          '$eq' :['$batch', '$$batchid'],
                        },
                      },
                     
                  }, {
                  '$group': {
                    '_id': '$department', 
                    'v': {
                      '$sum': 1
                    }
                  }
                }, {
                  '$project': {
                    '_id': 0, 
                    'k': '$_id', 
                    'v': 1
                  }
                }, {
                  '$sort': {
                    'v': -1
                  }
                }
              ], 
              'as': 'branches'
            }
          }, {
            '$project': {
              '_id': 0, 
              'year': '$year', 
              'totalStudents': {
                '$sum': '$branches.v'
              }, 
              'branches': {
                '$arrayToObject': '$branches'
              }
            }
          }, {
            '$sort': {
              'totalStudents': -1
            }
          }
        ];
        try{
            const students = await batchAggregate(agg);
            return res.status(200).json(students);
        }catch(err){
            return next(err);
        }
    }

    /**
     return batchwise + branchwise totalStudents, totalIntake and totalavailableIntake
     */
    async studentsVacancy(req,res,next){
          
      if (!req.params.batchId){
        throw new HttpException(404, STUDENT_ERROR_CODES.BAD_REQUEST_STUDENTS, 'BAD_REQUEST_STUDENTS', null);
      }
      
      const agg = [
        {
          '$match': {
            '_id' : mongoose.Types.ObjectId(`${req.params.batchId}`)
          }
        }, {
          '$lookup': {
            'from': 'students', 
            'let': {
              'batchid': '$_id', 
              'branches': '$branches'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$batch', '$$batchid'
                    ]
                  }
                }
              }, {
                '$group': {
                  '_id': '$department', 
                  'totalStudents': {
                    '$sum': 1
                  }
                }
              }, {
                '$project': {
                  '_id': 0, 
                  'name': '$_id', 
                  'totalStudents': 1, 
                  'branches': 1
                }
              }, {
                '$sort': {
                  'totalStudents': -1
                }
              }
            ], 
            'as': 'result'
          }
        }, {
          '$project': {
            '_id': 0, 
            'batch': 1, 
            'branches': {
              '$map': {
                'input': '$result', 
                'as': 'one', 
                'in': {
                  '$mergeObjects': [
                    '$$one', {
                      '$arrayElemAt': [
                        {
                          '$filter': {
                            'input': '$branches', 
                            'as': 'two', 
                            'cond': {
                              '$eq': [
                                '$$two.name', '$$one.name'
                              ]
                            }
                          }
                        }, 0
                      ]
                    }
                  ]
                }
              }
            }
          }
        }, {
          '$project': {
            'batch': 1, 
            'totalStudents': {
              '$sum': '$branches.totalStudents'
            }, 
            'totalStudentsIntake': {
              '$sum': '$branches.totalStudentsIntake'
            }, 
            'branches': {
              '$map': {
                'input': '$branches', 
                'in': {
                  'k': '$$this.name', 
                  'v': {
                    'totalStudents': '$$this.totalStudents', 
                    'totalStudentsIntake': '$$this.totalStudentsIntake', 
                    'availableIntake': {
                      '$subtract': [
                        '$$this.totalStudentsIntake', '$$this.totalStudents'
                      ]
                    }
                  }
                }
              }
            }
          }
        }, {
          '$project': {
            'batch': 1, 
            'totalStudents': 1, 
            'totalStudentsIntake': 1, 
            'availableIntake': {
              '$subtract': [
                '$totalStudentsIntake', '$totalStudents'
              ]
            }, 
            'branches': {
              '$arrayToObject': '$branches'
            }
          }
        }
      ]

      try{
        
        const students = await batchAggregate(agg);
        return res.status(200).json(students);
      
      }catch(err){
        return next(err);
      }
    }

    /**
     * @returns year + branch + semester wise absant students list
     */
    async absentStudents(req,res,next){
      if(!req.query.year || !req.query.branch || !req.query.semester || !req.query.date){
        throw new HttpException(404, STUDENT_ERROR_CODES.BAD_REQUEST_STUDENTS, 'BAD_REQUEST_STUDENTS', null);
      }

      const inputData = {
        'year': Number(req.query.year),
        'branch': req.query.branch.toUpperCase(),
        'semester': Number(req.query.semester),
        'date': new Date(req.query.date)
      };

      const agg = [
        {
          '$match': inputData
        }, {
          '$project': {
            '_id': 0, 
            'students': 1
          }
        }, {
          '$unwind': {
            'path': '$students'
          }
        }, {
          '$match': {
            'students.isPresent': false
          }
        }, {
          '$lookup': {
            'from': 'students', 
            'let': {
              'sId': '$students.studentId'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$$sId', '$_id'
                    ]
                  }
                }
              }, {
                '$project': {
                  '_id': 0, 
                  'name': 1, 
                  'emailId': 1, 
                  'mobileNo': 1
                }
              }
            ], 
            'as': 'studentDetails'
          }
        }, {
          '$project': {
            '_id': 0, 
            'data': {
              '$arrayElemAt': [
                '$studentDetails', 0
              ]
            }
          }
        }, {
          '$project': {
            'name': '$data.name', 
            'emailId': '$data.emailId', 
            'mobileNo': '$data.mobileNo'
          }
        }
      ];

      try{
        const students = await attandanceAggregate(agg);
        return res.status(200).json({inputData, students});
      
      }catch(err){
        return next(err);
      }
    }

    /**
     * @returns year + branch + semester wise students list whose attandance is less than 75%
     */
    async attendanceStudents(req,res,next){
      
      if(!req.query.year || !req.query.branch || !req.query.semester){
        throw new HttpException(404, STUDENT_ERROR_CODES.BAD_REQUEST_STUDENTS, 'BAD_REQUEST_STUDENTS', null);
      }

      let inputData = {
        year: Number(req.query.year), 
        branch: req.query.branch.toUpperCase(), 
        semester: Number(req.query.semester)
      };
                     
      const totalDays = await countDocs(inputData);

      if(totalDays == 0)
      {
        throw new HttpException(404, STUDENT_ERROR_CODES.NO_ATTENDANCE_STUDENTS, 'NO_ATTENDANCE_STUDENTS', null);
      }

      const seventyFivePercent = totalDays * 0.75
      
      inputData = {
        'year': Number(req.query.year), 
        'branch': req.query.branch.toUpperCase(), 
        'semester': Number(req.query.semester)
      };
      
      const agg = [
        {
          '$match': inputData
        }, {
          '$unwind': {
            'path': '$students'
          }
        }, {
          '$group': {
            '_id': '$students.studentId', 
            'attendance': {
              '$addToSet': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$students.isPresent', true
                    ]
                  }, 
                  'then': {
                    'date': '$date', 
                    'isPresent': '$students.isPresent'
                  }, 
                  'else': '$$REMOVE'
                }
              }
            }
          }
        }, {
          '$project': {
            'totalPresence': {
              '$size': '$attendance'
            }
          }
        }, {
          '$match': {
            '$expr': {
              '$lt': [
                '$totalPresence', seventyFivePercent
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'students', 
            'let': {
              'id': '$_id'
            }, 
            'pipeline': [
              {
                '$match': {
                  '$expr': {
                    '$eq': [
                      '$_id', '$$id'
                    ]
                  }
                }
              }
            ], 
            'as': 'result'
          }
        }, {
          '$project': {
            '_id': 0, 
            'totalPresence': 1, 
            'data': {
              '$arrayElemAt': [
                '$result', 0
              ]
            }
          }
        }, {
          '$project': {
            'name': '$data.name',
            'branch': '$data.department',
            'attendanceDays': '$totalPresence',
            'branch': '$data.department',
            'emailId': '$data.emailId',
            'mobileNo': '$data.mobileNo'
          }
        }
      ];
      try{
        const students = await attandanceAggregate(agg);
        return res.status(200).json({
          inputData,
          totalDays : totalDays,
          seventyFivePercentofWorkingDays : seventyFivePercent,
          lowAttandanceStudents : students});
      }catch(err){
        return next(err);
      }
    }
}

export default StudentsController;