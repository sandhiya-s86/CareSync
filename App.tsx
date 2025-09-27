import React, { useState, useEffect, createContext, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { User, UserRole, Patient, Doctor, Appointment, AppointmentStatus } from './types';
import { DashboardLayout } from './layouts';
import { 
  LoginPage, 
  AdminDashboard, 
  DoctorDashboard, 
  PatientDashboard,
  ReceptionistDashboard,
  AppointmentsPage, 
  PatientsPage, 
  DoctorsPage,
  NotFoundPage 
} from './pages';
import { api } from './services';
import { PATIENTS, DOCTORS, APPOINTMENTS } from './data';

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  addDoctor: (doctor: Doctor) => void;
  deleteDoctor: (doctorId: string) => void;
  addPatient: (patient: Patient) => void;
  deletePatient: (patientId: string) => void;
  addAppointment: (appointmentData: { patientId: string; doctorId: string; date: string; time: string; reason: string; }) => void;
}

export const AppContext = createContext<AppContextType>({
  theme: 'light',
  toggleTheme: () => {},
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  patients: [],
  doctors: [],
  appointments: [],
  addDoctor: () => {},
  deleteDoctor: () => {},
  addPatient: () => {},
  deletePatient: () => {},
  addAppointment: () => {},
});

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // --- Centralized State Management ---
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Simulate fetching initial data from an API
    const fetchData = async () => {
        setLoading(true);
        try {
            const [patientData, doctorData, appointmentData] = await Promise.all([
                api.getPatients(),
                api.getDoctors(),
                api.getAppointments(),
            ]);
            setPatients(patientData);
            setDoctors(doctorData);
            setAppointments(appointmentData);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const login = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    navigate('/');
  }, [navigate]);

  const addDoctor = (doctor: Doctor) => {
    setDoctors(prevDoctors => [doctor, ...prevDoctors]);
  };

  const deleteDoctor = (doctorId: string) => {
    setDoctors(prevDoctors => prevDoctors.filter(d => d.id !== doctorId));
  };

  const addPatient = (patient: Patient) => {
    setPatients(prevPatients => [patient, ...prevPatients]);
  };

  const deletePatient = (patientId: string) => {
    setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
  };
  
  const addAppointment = (appointmentData: { patientId: string; doctorId: string; date: string; time: string; reason: string; }) => {
    const patient = patients.find(p => p.id === appointmentData.patientId);
    const doctor = doctors.find(d => d.id === appointmentData.doctorId);

    if (patient && doctor) {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: `app-${Date.now()}`,
        patientName: patient.name,
        doctorName: doctor.name,
        status: AppointmentStatus.Upcoming,
      };
      setAppointments(prev => [newAppointment, ...prev]);
    }
  };

  const getDashboardComponent = () => {
      if (!user) return <Navigate to="/" />;
      switch (user.role) {
          case UserRole.Admin:
              return <AdminDashboard />;
          case UserRole.Doctor:
              return <DoctorDashboard />;
          case UserRole.Patient:
              return <PatientDashboard />;
          case UserRole.Receptionist:
              return <ReceptionistDashboard />;
          default:
              return <NotFoundPage />;
      }
  };
  
  const contextValue = {
      theme,
      toggleTheme,
      user,
      login,
      logout,
      loading,
      patients,
      doctors,
      appointments,
      addDoctor,
      deleteDoctor,
      addPatient,
      deletePatient,
      addAppointment,
  };

  return (
    <AppContext.Provider value={contextValue}>
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            
            {user && (
                 <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={getDashboardComponent()} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/doctors" element={<DoctorsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            )}

            {!user && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>
    </AppContext.Provider>
  );
};

export default App;