import mongoose from 'mongoose';

// Main schema for Scholarship Application
const scholarshipApplicationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    middleName: {
        type: String,
        required: false,
    },
    birthdate: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    bloodType: {
        type: String,
        required: false,
    },
    civilStatus: {
        type: String,
        required: false,
    },
    maidenName: {
        type: String,
        required: false,
    },
    spouseName: {
        type: String,
        required: false,
    },
    spouseOccupation: {
        type: String,
        required: false,
    },
    religion: {
        type: String,
        required: false,
    },
    height: {
        type: Number,
        required: false,
    },
    weight: {
        type: Number,
        required: false,
    },
    birthplace: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    contactNumber: {
        type: String,
        required: false,
    },
    addressDetails: {
        type: String,
        required: false,
    },
    town: {
        type: String,
        required: false,
    },
    barangay: {
        type: String,
        required: false,
    },
    province: {
        type: String,
        required: false,
    },
    father: {
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        middleName: {
            type: String,
            required: false,
        },
        birthdate: {
            type: String,
            required: false,
        },
        occupation: {
            type: String,
            required: false,
        },
        yearlyIncome: {
            type: String,
            required: false,
        },
        contactNo: {
            type: String,
            required: false,
        }
    },
    mother: {
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        middleName: {
            type: String,
            required: false,
        },
        birthdate: {
            type: String,
            required: false,
        },
        occupation: {
            type: String,
            required: false,
        },
        yearlyIncome: {
            type: String,
            required: false,
        },
        contactNo: {
            type: String,
            required: false,
        }
    },
    guardian: {
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        middleName: {
            type: String,
            required: false,
        },
        birthdate: {
            type: String,
            required: false,
        },
        occupation: {
            type: String,
            required: false,
        },
        yearlyIncome: {
            type: String,
            required: false,
        },
        contactNo: {
            type: String,
            required: false,
        }
    },
    education: {
        elementary: {
            school: {
                type: String,
                required: false,
            },
            award: {
                type: String,
                required: false,
            },
            yearGraduated: {
                type: Number,
                required: false,
            }
        },
        juniorHighSchool: {
            school: {
                type: String,
                required: false,
            },
            award: {
                type: String,
                required: false,
            },
            yearGraduated: {
                type: Number,
                required: false,
            }
        },
        seniorHighSchool: {
            school: {
                type: String,
                required: false,
            },
            award: {
                type: String,
                required: false,
            },
            yearGraduated: {
                type: Number,
                required: false,
            }
        },
        college: {
            school: {
                type: String,
                required: false,
            },
            course: {
                type: String,
                required: false,
            },
            yearGraduated: {
                type: Number,
                required: false,
            }
        }
    },
    relatives: [{
        name: {
            type: String,
            required: false,
        },
        birthdate: {
            type: String,
            required: false,
        },
        relationship: {
            type: String,
            required: false,
        }
    }],
    workExperience: [{
        companyName: {
            type: String,
            required: false,
        },
        startDate: {
            type: String,
            required: false,
        },
        position: {
            type: String,
            required: false,
        },
        monthlySalary: {
            type: Number,
            required: false,
        },
        statusOfAppointment: {
            type: String,
            required: false,
        }
    }],
    skillsAndQualifications: [{
        skills: {
            type: String,
            required: false,
        },
        qualifications: {
            type: String,
            required: false,
        }
    }],
    documents: {
        type: Map,
        of: String,
        required: false,
    },
    scholarshipProgram: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScholarshipProgram',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true
    },
    applicationStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'], // Updated to sentence case
        default: 'Pending', // Updated to sentence case
    },
    submissionDate: {
        type: Date, default: Date.now
    },
    rejectionNote: {
        type: String
    }, // Field to store rejection note
    allowResubmission: {
        type: Boolean, default: false
    }, // Field to allow resubmission
}, { timestamps: true });

const ScholarshipApplication = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);

export default ScholarshipApplication;