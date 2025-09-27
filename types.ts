export enum UserRole {
  Admin = 'Admin',
  Doctor = 'Doctor',
  Patient = 'Patient',
  Receptionist = 'Receptionist'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

export enum AppointmentStatus {
    Upcoming = 'Upcoming',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
    Arrived = 'Arrived',
    Consulting = 'Consulting',
    Done = 'Done',
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
}

export interface MedicalRecord {
    id: string;
    date: string;
    diagnosis: string;
    prescription: string;
    notes: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  contact: string;
  avatar: string;
  medicalHistory: MedicalRecord[];
}
