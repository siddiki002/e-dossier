import { Class, Course, Instructor, Officer } from "src/common/common.types";

export const officers : Officer[] = [
    {
        id: "OFF1001",
        name: "Ali Raza",
        fatherName: "Mohammad Raza",
        cnic: "35202-1234567-1",
        dateOfBirth: new Date('1990-05-15'),
        bloodGroup: 'B+',
        contactNumber: '03001234567',
        maritalStatus: 'married',
        classId: ['CLS1001'],
        courseMarks: [
            { courseId: 'CRS1001', marks: 85 },
            { courseId: 'CRS1002', marks: 90 },
            { courseId: 'CRS1003', marks: 95 }
        ]
    },
    {
        id: "OFF1002",
        name: "Sara Ahmed",
        fatherName: "Ahmed Khan",
        cnic: "35202-7654321-0",
        dateOfBirth: new Date('1992-08-22'),
        bloodGroup: 'A+',
        contactNumber: '03007654321',
        maritalStatus: 'single',
        classId: ['CLS1001', 'CLS1002'],
        courseMarks: [
            { courseId: 'CRS1001', marks: 88 },
            { courseId: 'CRS1002', marks: 92 }
        ]
    },
    {
        id: "OFF1003",
        name: "Hassan Ali",
        fatherName: "Ali Hassan",
        cnic: "35202-1122334-5",
        dateOfBirth: new Date('1988-12-05'),
        bloodGroup: 'O+',
        contactNumber:  '03001122334',
        maritalStatus: 'divorced',
        classId: ['CLS1002'],
        courseMarks: [
            { courseId: 'CRS1002', marks: 78 },
            { courseId: 'CRS1003', marks: 82 }
        ]
    },
    {
        id: "OFF1004",
        name: "Ayesha Siddiqui",
        fatherName: "Siddiqui Khan",
        cnic: "35202-9988776-3",
        dateOfBirth: new Date('1995-03-30'),
        bloodGroup: 'AB+',
        contactNumber: '03009988776',
        maritalStatus: 'single',
        classId: ['CLS1001'],
        courseMarks: [
            { courseId: 'CRS1001', marks: 91 },
            { courseId: 'CRS1003', marks: 89 }
        ]
    }
]

export const courses : Course[] = [
    {id: 'CRS1001', name: 'Navigation Basics'},
    {id: 'CRS1002', name: 'Advanced Navigation'},
    {id: 'CRS1003', name: 'Maritime Law'},
]

export const classes: Class[] = [
    {id: 'CLS1001', instructorId: 'INS1001', numberOfStudents: 20, name: 'Class A'},
    {id: 'CLS1002', instructorId: 'INS1001', numberOfStudents: 30, name: 'Class B'},
]

export const instructors: Instructor[] = [
    {id: 'INS1001', firstName: 'Ahmed', lastName: 'Khan', courses: ['CRS1001']},
]