import mongoose from 'mongoose';

// Main schema for Scholarship Application
const scholarshipApplicationSchema = new mongoose.Schema({
    scholarshipProgram: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScholarshipProgram',
        required: true
    },
    applicationStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: 'Pending',
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
            type: String,
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