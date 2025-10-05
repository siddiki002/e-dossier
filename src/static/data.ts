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
    {id: 'CLS1003', instructorId: 'INS1002', numberOfStudents: 25, name: 'Class C'},
    {id: 'CLS1004', instructorId: 'INS1003', numberOfStudents: 15, name: 'Class D'},
    {id: 'CLS1005', instructorId: 'INS1004', numberOfStudents: 10, name: 'Class E'},
    {id: 'CLS1006', instructorId: 'INS1005', numberOfStudents: 18, name: 'Class F'},
    {id: 'CLS1007', instructorId: 'INS1006', numberOfStudents: 22, name: 'Class G'},
    {id: 'CLS1008', instructorId: 'INS1007', numberOfStudents: 28, name: 'Class H'},
    {id: 'CLS1009', instructorId: 'INS1008', numberOfStudents: 12, name: 'Class I'},
    {id: 'CLS1010', instructorId: 'INS1009', numberOfStudents: 16, name: 'Class J'},
    {id: 'CLS1011', instructorId: 'INS1010', numberOfStudents: 14, name: 'Class K'},
    {id: 'CLS1012', instructorId: 'INS1011', numberOfStudents: 19, name: 'Class L'},
    {id: 'CLS1013', instructorId: 'INS1012', numberOfStudents: 21, name: 'Class M'},
    {id: 'CLS1014', instructorId: 'INS1013', numberOfStudents: 17, name: 'Class N'},
    {id: 'CLS1015', instructorId: 'INS1014', numberOfStudents: 13, name: 'Class O'}
]

export const instructors: Instructor[] = [
    {id: 'INS1001', firstName: 'Ahmed', lastName: 'Khan', courses: ['CRS1001']},
]