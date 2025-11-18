import { userType } from "@app/authentication/authentication.const"

export type Officer = {
    officerId: string,
    id: string,
    name: string,
    fatherName: string,
    cnic: string,
    maritalStatus: 'single' | 'married' | 'divorced' | 'widow' | null,
    dateOfBirth: Date,
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null,
    contactNumber: string,
    classId: string[],
    rate: string,
    permanentAddress: string,
    courseMarks: 
        {
            courseId: string,
            marks: number
        }[],
    compulsoryCourses? : CompulsoryCourses[],
    emergencyContact? : {
        name: string,
        relation: string,
        contactNumber: string
        cnic?: string
    }
    imageUrl?: string
    additionalFamilyInformation?: {
        name: string,
        relation: string,
        contactNumber: string,
        cnic?: string
    }[]
    marks? : number,
    percentage?: string
    pet?: {
        event: string,
        totalMarks: number,
        obtainedMarks: number
        remarks?: string
    }[]
    
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

export type Assessment = {
    id: string,
    assessmentName: string,
    courseId: string,
    totalMarks: number
}

export type Marks = {
    id: string,
    assessmentId: string,
    officerId: string,
    marks: number
}

export type CompulsoryCourses = {
    courseId: string,
    courseName: string,
    marksArray : Array<"P" | "F">
}

export type Courses = {
    id: string,
    courseName: string,
    category: string,
    type: "Optional" | "Compulsory"
    module?: string
}

export type Warnings = {
    id: string,
    awardedBy: string,
    date: Date,
    offense: string,
    officerId: string,
    punishment: string,
    type: "punishment" | "warningSlips" | "observations"
}

export type Medical = {
    id: string,
    date: Date,
    disease: string,
    officerId: string,
    remarks: string,
}

export type Sport = {
    game: string,
    performance: string,
    remarks: string
}

export type ExtraCurricular = {
    activity: string,
    performance: string,
    event: string
}