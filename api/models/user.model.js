import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs'; 

// Sub-schema for Applicant
const applicantSchema = new mongoose.Schema({
  profileComplete: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: false,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  nameExtension: {
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
    region: {
      type: String,
      required: false,
    },
    province: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    barangay: {
      type: String,
      required: false,
    },
    addressDetails: {
      type: String,
      required: false,
    },
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
  studentIdFile: {
    type: String,
    default: '',
  },
  certificateOfRegistrationFile: {
    type: String,
    default: '',
  },

}, { _id: false });

// Sub-schema for Scholarship Provider
const scholarshipProviderSchema = new mongoose.Schema({
  registrationComplete: {
    type: Boolean,
    default: false,
  },
  organizationName: {
    type: String,
    required: false,
  },
  organizationType: {
    type: String,
    required: false,
  },
  registrationNumber: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  contactPersonName: {
    type: String,
    required: false,
  },
  contactPersonPosition: {
    type: String,
    required: false,
  },
  contactPersonNumber: {
    type: String,
    required: false,
  },
  addressDetails: {
    type: String,
    required: false,
  },
  region: {
    type: String,
    required: false,
  },
  province: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  barangay: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  agreePrivacy: {
    type: Boolean,
    required: false,
  },
  documents: {
    registrationCertificate: {
      type: String,
      default: '',
    },
    tin: {
      type: String,
      default: '',
    },
    proofOfAddress: {
      type: String,
      default: '',
    },
    authorizationLetter: {
      type: String,
      default: '',
    },
    idProofContactPerson: {
      type: String,
      default: '',
    }
  }
}, { _id: false }); // Disable automatic _id generation for embedded sub-schema

const adminSchema = new mongoose.Schema({
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
  contactNumber: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin', 'manager', 'editor'], // Example roles
    default: 'admin',
  },
}, { _id: false }); // Disable automatic _id generation for embedded sub-schema

// Base schema (User schema)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s",
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  newEmail: {
    type: String,
    required: false,
  },
  emailVerificationToken: {
    type: String,
    required: false,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  authProvider: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['applicant', 'scholarship_provider', 'admin'],
    default: 'applicant',
  },
  status: {
    type: String,
    enum: [
      'Verify Account',
      'Pending Verification',
      'Verified',
      'Rejected',
      'Active',
      'Inactive',
      'Suspended',
      'Pending Approval'
    ],
    default: 'Verify Account',
  },
  rejectReason: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  applicantDetails: applicantSchema, // Embedded schema for applicant details
  scholarshipProviderDetails: scholarshipProviderSchema, // Embedded schema for scholarship provider details
  adminDetails: adminSchema, // Embedded schema for admin details
}, { timestamps: true });

// Function to create a default admin account
userSchema.statics.createDefaultAdmin = async function() {
  const User = this;
  const defaultAdmin = {
    email: 'admin@example.com',
    username: 'HubIsko',
    password: 'Admin123@',
    profilePicture: 'https://firebasestorage.googleapis.com/v0/b/hubisko-21f8a.appspot.com/o/System%2FNewLogo.png?alt=media&token=9bcfb221-c954-44ef-9d4f-130f1d880a8e',
    role: 'admin',
    adminDetails: {
      firstName: 'Aian Louise',
      lastName: 'Alfaro',
      contactNumber: '09958765432',
    },
    emailVerified: true,
    status: 'Active',
  };

  // Check if an admin account already exists
  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    // Hash the password before saving
    const salt = await bcryptjs.genSalt(10);
    defaultAdmin.password = await bcryptjs.hash(defaultAdmin.password, salt);

    // Create the default admin account
    await User.create(defaultAdmin);
    console.log('Default admin account created');
  } else {
    console.log('Admin account already exists');
  }
};

const User = mongoose.model('User', userSchema);

export default User;
