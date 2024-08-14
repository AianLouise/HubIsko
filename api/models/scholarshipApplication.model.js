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
    contactNumber: {
        type: String,
        required: false,
    },
    address: {
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
            type: Date,
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
            type: Date,
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
            type: Date,
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
            type: Date,
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
            type: Date,
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
        identificationCard: {
            type: String,
            required: false,
        },
        proofOfAddress: {
            type: String,
            required: false,
        },
        academicTranscripts: {
            type: String,
            required: false,
        },
        passportPhoto: {
            type: String,
            required: false,
        }
    },
    termsAndConditions: {
        agreed: {
            type: Boolean,
            required: false,
        }
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
    }
}, { timestamps: true });

const ScholarshipApplication = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);

export default ScholarshipApplication;