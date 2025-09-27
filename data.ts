
import { User, UserRole, Doctor, Patient, Appointment, AppointmentStatus, MedicalRecord } from './types';

export const USERS: Record<UserRole, User> = {
  [UserRole.Admin]: { id: 'user-admin-01', name: 'Dr. Evelyn Reed', role: UserRole.Admin, avatar: 'https://i.pravatar.cc/150?u=admin' },
  [UserRole.Doctor]: { id: 'user-doc-01', name: 'Dr. James Carter', role: UserRole.Doctor, avatar: 'https://i.pravatar.cc/150?u=doctor' },
  [UserRole.Patient]: { id: 'user-patient-01', name: 'Liam Gallagher', role: UserRole.Patient, avatar: 'https://i.pravatar.cc/150?u=patient' },
  [UserRole.Receptionist]: { id: 'user-rec-01', name: 'Sarah Chen', role: UserRole.Receptionist, avatar: 'https://i.pravatar.cc/150?u=receptionist' }
};

export const DOCTORS: Doctor[] = [
  { id: 'doc-01', name: 'Dr. James Carter', specialty: 'Cardiology', avatar: 'https://i.pravatar.cc/150?u=doc1' },
  { id: 'doc-02', name: 'Dr. Maria Garcia', specialty: 'Pediatrics', avatar: 'https://i.pravatar.cc/150?u=doc2' },
  { id: 'doc-03', name: 'Dr. Chen Wei', specialty: 'Neurology', avatar: 'https://i.pravatar.cc/150?u=doc3' },
];

const medicalHistory1: MedicalRecord[] = [
    { id: 'rec-01', date: '2023-10-15', diagnosis: 'Common Cold', prescription: 'Rest and fluids', notes: 'Patient recovering well.' },
    { id: 'rec-02', date: '2024-01-20', diagnosis: 'Sprained Ankle', prescription: 'Ibuprofen and RICE method', notes: 'Follow up in 2 weeks.' },
];
const medicalHistory2: MedicalRecord[] = [
    { id: 'rec-03', date: '2024-03-10', diagnosis: 'Annual Checkup', prescription: 'N/A', notes: 'All vitals are normal. Good health.' },
];
const medicalHistory3: MedicalRecord[] = [
    { id: 'rec-04', date: '2023-11-05', diagnosis: 'Migraine', prescription: 'Sumatriptan', notes: 'Patient reports frequent headaches.' },
];

export const PATIENTS: Patient[] = [
  { id: 'pat-01', name: 'Liam Gallagher', age: 45, gender: 'Male', bloodType: 'O+', contact: 'liam.g@email.com', avatar: 'https://i.pravatar.cc/150?u=pat1', medicalHistory: medicalHistory1 },
  { id: 'pat-02', name: 'Olivia Chen', age: 32, gender: 'Female', bloodType: 'A-', contact: 'olivia.c@email.com', avatar: 'https://i.pravatar.cc/150?u=pat2', medicalHistory: medicalHistory2 },
  { id: 'pat-03', name: 'Noah Kim', age: 28, gender: 'Male', bloodType: 'B+', contact: 'noah.k@email.com', avatar: 'https://i.pravatar.cc/150?u=pat3', medicalHistory: medicalHistory3 },
  { id: 'pat-04', name: 'Emma Johnson', age: 67, gender: 'Female', bloodType: 'AB+', contact: 'emma.j@email.com', avatar: 'https://i.pravatar.cc/150?u=pat4', medicalHistory: [] },
];

export const APPOINTMENTS: Appointment[] = [
  { id: 'app-01', patientId: 'pat-01', patientName: 'Liam Gallagher', doctorId: 'doc-01', doctorName: 'Dr. James Carter', date: '2024-08-05', time: '10:00 AM', reason: 'Chest Pain', status: AppointmentStatus.Upcoming },
  { id: 'app-02', patientId: 'pat-02', patientName: 'Olivia Chen', doctorId: 'doc-02', doctorName: 'Dr. Maria Garcia', date: '2024-08-05', time: '11:30 AM', reason: 'Child Checkup', status: AppointmentStatus.Upcoming },
  { id: 'app-03', patientId: 'pat-03', patientName: 'Noah Kim', doctorId: 'doc-03', doctorName: 'Dr. Chen Wei', date: '2024-08-06', time: '02:00 PM', reason: 'Headache', status: AppointmentStatus.Upcoming },
  { id: 'app-04', patientId: 'pat-04', patientName: 'Emma Johnson', doctorId: 'doc-01', doctorName: 'Dr. James Carter', date: '2024-07-28', time: '09:00 AM', reason: 'Follow-up', status: AppointmentStatus.Completed },
  { id: 'app-05', patientId: 'pat-01', patientName: 'Liam Gallagher', doctorId: 'doc-02', doctorName: 'Dr. Maria Garcia', date: '2024-07-25', time: '03:00 PM', reason: 'Allergy consultation', status: AppointmentStatus.Cancelled },
];
