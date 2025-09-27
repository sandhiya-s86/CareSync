
import { PATIENTS, DOCTORS, APPOINTMENTS } from './data';
import { Patient, Doctor, Appointment } from './types';

const SIMULATED_DELAY = 500;

export const api = {
  getPatients: (): Promise<Patient[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...PATIENTS]), SIMULATED_DELAY);
    });
  },
  getDoctors: (): Promise<Doctor[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...DOCTORS]), SIMULATED_DELAY);
    });
  },
  getAppointments: (): Promise<Appointment[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...APPOINTMENTS]), SIMULATED_DELAY);
    });
  },
};
