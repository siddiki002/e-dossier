import { userType } from "@app/authentication/authentication.const"

export type Officer = {
    id: string,
    name: string,
    fatherName: string,
    cnic: string,
    maritalStatus: 'single' | 'married' | 'divorced' | 'widow' | null,
    dateOfBirth: Date,
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null,
    contactNumber: string,
    classId: string[],
    courseMarks: 
        {
            courseId: string,
            marks: number
        }[]
    emergencyContact? : {
        name: string,
        relation: string,
        contactNumber: string
        cnic?: string
    }
    
}

export type Course = {
    id: string,
    name: string
}

export type Instructor = {
    id: string,
    courses: string[]
    name: string,
    fatherName: string
}

export type Class = {
    id: string,
    instructorId: string,
    numberOfStudents: number,
    name: string
}

export type User = {
    role: userType,
    email: string
    id?: string
}

export type Intent = 'positive' | 'negative' | 'warning' | 'info'