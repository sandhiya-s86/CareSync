import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppContext } from './App';
import { UserRole, Appointment, Patient, Doctor, AppointmentStatus } from './types';
import { USERS } from './data';
import { StatCard, Card, Spinner, Modal, PlusIcon, PencilIcon, TrashIcon, HospitalLogoIcon } from './components';
import { CalendarIcon, UsersIcon, StethoscopeIcon } from './components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- HELPER FUNCTIONS ---
const getStatusColor = (status: AppointmentStatus) => {
    switch(status) {
        case AppointmentStatus.Upcoming: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case AppointmentStatus.Completed: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case AppointmentStatus.Cancelled: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case AppointmentStatus.Arrived: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case AppointmentStatus.Consulting: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
        case AppointmentStatus.Done: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
};

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// --- PAGE COMPONENTS ---

export const LoginPage: React.FC = () => {
  const { login } = useContext(AppContext);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://picsum.photos/seed/hospital/1920/1080')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="absolute top-8 right-8 text-white flex items-center space-x-3">
        <HospitalLogoIcon className="w-12 h-12"/>
        <span className="text-xl font-semibold">CareSync Hospital</span>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto p-8">
        <div className="text-white">
          <h1 className="text-7xl font-extrabold text-primary-400 drop-shadow-lg">CareSync</h1>
          <p className="mt-4 text-lg text-gray-200 max-w-xl">
            Welcome to CareSync, our state-of-the-art hospital management system. We provide seamless integration of patient care, staff coordination, and administrative tasks to deliver world-class healthcare services. Our commitment is to health, hope, and healing.
          </p>
        </div>

        <div className="w-full max-w-md p-8 space-y-6 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Select a role to sign in</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {(Object.keys(USERS) as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => login(USERS[role])}
                className="w-full px-4 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-transform duration-200 hover:scale-105"
              >
                Login as {role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
    const { patients, doctors, appointments, loading } = useContext(AppContext);
    const appointmentData = [
        { name: 'Jan', appointments: 120 }, { name: 'Feb', appointments: 150 },
        { name: 'Mar', appointments: 170 }, { name: 'Apr', appointments: 160 },
        { name: 'May', appointments: 210 }, { name: 'Jun', appointments: 190 }
    ];

    if(loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Patients" value={patients.length} icon={<UsersIcon className="w-8 h-8 text-white"/>} color="bg-blue-500" />
                <StatCard title="Total Doctors" value={doctors.length} icon={<StethoscopeIcon className="w-8 h-8 text-white"/>} color="bg-green-500" />
                <StatCard title="Total Appointments" value={appointments.length} icon={<CalendarIcon className="w-8 h-8 text-white"/>} color="bg-purple-500" />
            </div>
            <Card>
                <h3 className="text-xl font-semibold mb-4">Appointments Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={appointmentData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none' }}/>
                        <Legend />
                        <Line type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export const DoctorDashboard: React.FC = () => {
    const { user, appointments, loading } = useContext(AppContext);

    if (loading) return <Spinner />;

    const myAppointments = appointments.filter(a => a.doctorId === 'doc-01'); // Hardcoded for Dr. James Carter
    const todayAppointments = myAppointments.filter(a => a.date === '2024-08-05'); // Hardcoded today for demo data
    const upcomingAppointments = myAppointments.filter(a => a.date > '2024-08-05' && a.status === AppointmentStatus.Upcoming);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Doctor's Dashboard</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Welcome, {user?.name}!</p>
            
            <Card>
                <h3 className="text-xl font-semibold mb-4">Today's Appointments</h3>
                {todayAppointments.length > 0 ? (
                    <ul className="space-y-3">
                       {todayAppointments.map(app => (
                           <li key={app.id} className="p-4 rounded-lg bg-gray-50 flex justify-between items-center text-gray-900">
                               <div>
                                   <p className="font-semibold">{app.patientName} - <span className="text-primary-500">{app.time}</span></p>
                                   <p className="text-sm text-gray-500">{app.reason}</p>
                               </div>
                               <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                   {app.status}
                               </span>
                           </li>
                       ))}
                    </ul>
                ) : <p className="text-gray-900">No appointments scheduled for today.</p>}
            </Card>

            <Card>
                <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
                 {upcomingAppointments.length > 0 ? (
                    <ul className="space-y-2">
                       {upcomingAppointments.map(app => (
                           <li key={app.id} className="p-3 rounded-lg flex justify-between items-center text-gray-900">
                               <p>{app.patientName} on {app.date} at {app.time}</p>
                           </li>
                       ))}
                    </ul>
                ) : <p className="text-gray-900">No upcoming appointments.</p>}
            </Card>
        </div>
    );
};

export const PatientDashboard: React.FC = () => {
    const { user, appointments, patients, loading } = useContext(AppContext);

    if (loading) return <Spinner />;

    const myAppointments = appointments.filter(a => a.patientId === 'pat-01'); // Hardcoded for Liam Gallagher
    const me = patients.find(p => p.id === 'pat-01');

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Patient Dashboard</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Welcome, {user?.name}!</p>
            
            <Card>
                <h3 className="text-xl font-semibold mb-4">Upcoming Appointment</h3>
                {myAppointments.find(a => a.status === AppointmentStatus.Upcoming) ? (
                    myAppointments.filter(a => a.status === AppointmentStatus.Upcoming).map(app => (
                        <div key={app.id} className="p-4 rounded-lg bg-primary-50 border border-primary-200">
                           <p className="font-bold text-primary-800">
                             {app.date} at {app.time} with {app.doctorName}
                           </p>
                           <p className="text-gray-800">Reason: {app.reason}</p>
                        </div>
                    ))
                ) : <p className="text-gray-900">You have no upcoming appointments.</p>}
            </Card>
            
            <Card>
                <h3 className="text-xl font-semibold mb-4">Medical History</h3>
                <div className="space-y-4">
                    {me?.medicalHistory.map(record => (
                        <div key={record.id} className="p-3 border-l-4 border-gray-300 text-gray-900">
                            <p className="font-semibold">{record.date} - {record.diagnosis}</p>
                            <p className="text-sm">Prescription: {record.prescription}</p>
                            <p className="text-sm text-gray-500 italic">Notes: {record.notes}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export const ReceptionistDashboard: React.FC = () => {
    const { appointments, patients, doctors, loading, addPatient, addAppointment } = useContext(AppContext);
    
    // State for modals
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);

    // State for new patient form
    const initialPatientState = { name: '', age: 0, gender: 'Other' as Patient['gender'], bloodType: '', contact: '' };
    const [newPatient, setNewPatient] = useState(initialPatientState);

    // State for new appointment form
    const initialAppointmentState = { patientId: '', doctorId: '', date: '', time: '', reason: ''};
    const [newAppointment, setNewAppointment] = useState(initialAppointmentState);

    // Handlers for adding a patient
    const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPatient(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) : value }));
    };

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPatient.name && newPatient.age > 0 && newPatient.contact) {
            addPatient({
                ...newPatient,
                id: `pat-${Date.now()}`,
                avatar: `https://i.pravatar.cc/150?u=pat${Date.now()}`,
                medicalHistory: [],
            });
            setIsAddPatientModalOpen(false);
            setNewPatient(initialPatientState);
        }
    };

    // Handlers for booking an appointment
    const handleAppointmentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAppointment(prev => ({ ...prev, [name]: value }));
    };

    const handleBookAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        const { patientId, doctorId, date, time, reason } = newAppointment;
        if (patientId && doctorId && date && time && reason) {
            addAppointment({ patientId, doctorId, date, time, reason });
            setIsBookAppointmentModalOpen(false);
            setNewAppointment(initialAppointmentState);
        }
    };

    const todayAppointments = useMemo(() => 
        appointments
            .filter(a => a.date === '2024-08-05') // Hardcoded for demo
            .sort((a, b) => a.time.localeCompare(b.time)),
        [appointments]
    );

    if (loading) return <Spinner />;

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">Receptionist Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => setIsBookAppointmentModalOpen(true)} className="flex items-center justify-center p-6 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg text-xl transition">
                        <PlusIcon className="w-8 h-8 mr-2" /> Book Appointment
                    </button>
                    <button onClick={() => setIsAddPatientModalOpen(true)} className="flex items-center justify-center p-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-xl transition">
                        <UsersIcon className="w-8 h-8 mr-2" /> Register New Patient
                    </button>
                </div>
                <Card>
                    <h3 className="text-xl font-semibold mb-4">Live Appointment Queue (Today)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="p-3 text-left font-semibold text-gray-600">Time</th>
                                    <th className="p-3 text-left font-semibold text-gray-600">Patient</th>
                                    <th className="p-3 text-left font-semibold text-gray-600">Doctor</th>
                                    <th className="p-3 text-left font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayAppointments.map(app => (
                                    <tr key={app.id} className="border-b border-gray-200 text-gray-900">
                                        <td className="p-3 font-mono">{app.time}</td>
                                        <td className="p-3">{app.patientName}</td>
                                        <td className="p-3">{app.doctorName}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            
            {/* Add Patient Modal (reused from PatientsPage logic) */}
            <Modal isOpen={isAddPatientModalOpen} onClose={() => setIsAddPatientModalOpen(false)} title="Register New Patient">
                <form onSubmit={handleAddPatient}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input type="text" name="name" value={newPatient.name} onChange={handlePatientInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Age</label>
                            <input type="number" name="age" value={newPatient.age} onChange={handlePatientInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Gender</label>
                            <select name="gender" value={newPatient.gender} onChange={handlePatientInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Blood Type</label>
                            <input type="text" name="bloodType" value={newPatient.bloodType} onChange={handlePatientInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Contact</label>
                            <input type="tel" name="contact" placeholder="e.g., 555-123-4567" value={newPatient.contact} onChange={handlePatientInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsAddPatientModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Patient</button>
                    </div>
                </form>
            </Modal>

            {/* Book Appointment Modal */}
            <Modal isOpen={isBookAppointmentModalOpen} onClose={() => setIsBookAppointmentModalOpen(false)} title="Book New Appointment">
                <form onSubmit={handleBookAppointment}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Patient</label>
                            <select name="patientId" value={newAppointment.patientId} onChange={handleAppointmentInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900" required>
                                <option value="" disabled>Select a patient</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Doctor</label>
                            <select name="doctorId" value={newAppointment.doctorId} onChange={handleAppointmentInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900" required>
                                <option value="" disabled>Select a doctor</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Date</label>
                            <input type="date" name="date" value={newAppointment.date} onChange={handleAppointmentInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Time</label>
                            <input type="time" name="time" value={newAppointment.time} onChange={handleAppointmentInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Reason for Visit</label>
                            <input type="text" name="reason" value={newAppointment.reason} onChange={handleAppointmentInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsBookAppointmentModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Book Appointment</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export const AppointmentsPage: React.FC = () => {
    const { appointments, user, loading } = useContext(AppContext);

    const filteredAppointments = useMemo(() => {
        if (!user) return [];
        switch (user.role) {
            case UserRole.Admin:
            case UserRole.Receptionist:
                return appointments;
            case UserRole.Doctor:
                return appointments.filter(a => a.doctorId === 'doc-01'); // Hardcoded for demo
            case UserRole.Patient:
                return appointments.filter(a => a.patientId === 'pat-01'); // Hardcoded for demo
            default:
                return [];
        }
    }, [appointments, user]);
    
    if(loading) return <Spinner />;

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="p-4 text-left font-semibold text-gray-600">Patient</th>
                            <th className="p-4 text-left font-semibold text-gray-600">Doctor</th>
                            <th className="p-4 text-left font-semibold text-gray-600">Date & Time</th>
                            <th className="p-4 text-left font-semibold text-gray-600">Reason</th>
                            <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map(app => (
                            <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-100 text-gray-900">
                                <td className="p-4">{app.patientName}</td>
                                <td className="p-4">{app.doctorName}</td>
                                <td className="p-4">{app.date} at {app.time}</td>
                                <td className="p-4">{app.reason}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};


export const PatientsPage: React.FC = () => {
    const { patients, loading, addPatient, deletePatient } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

    const initialPatientState = { name: '', age: 0, gender: 'Other' as Patient['gender'], bloodType: '', contact: '' };
    const [newPatient, setNewPatient] = useState(initialPatientState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPatient(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) : value }));
    };

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPatient.name && newPatient.age > 0 && newPatient.contact) {
            addPatient({
                ...newPatient,
                id: `pat-${Date.now()}`,
                avatar: `https://i.pravatar.cc/150?u=pat${Date.now()}`,
                medicalHistory: [],
            });
            setIsAddModalOpen(false);
            setNewPatient(initialPatientState);
        }
    };
    
    const handleConfirmDelete = () => {
        if(patientToDelete) {
            deletePatient(patientToDelete.id);
            setPatientToDelete(null);
        }
    };

    const filteredPatients = useMemo(() => 
        patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [patients, searchTerm]
    );
    
    if(loading) return <Spinner />;

    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Patients</h2>
                    <div className="flex items-center space-x-4">
                        <input 
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                         <button onClick={() => setIsAddModalOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
                            <PlusIcon className="w-5 h-5 mr-2" /> Add Patient
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                         <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-4 text-left font-semibold text-gray-600">Name</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Age</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Gender</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Blood Type</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Contact</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map(p => (
                                <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-100 text-gray-900">
                                    <td className="p-4 flex items-center">
                                        <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full mr-4" />
                                        {p.name}
                                    </td>
                                    <td className="p-4">{p.age}</td>
                                    <td className="p-4">{p.gender}</td>
                                    <td className="p-4">{p.bloodType}</td>
                                    <td className="p-4">{p.contact}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-500 hover:text-blue-700"><PencilIcon /></button>
                                            <button onClick={() => setPatientToDelete(p)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Patient Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Patient">
                <form onSubmit={handleAddPatient}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input type="text" name="name" value={newPatient.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Age</label>
                            <input type="number" name="age" value={newPatient.age} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Gender</label>
                            <select name="gender" value={newPatient.gender} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Blood Type</label>
                            <input type="text" name="bloodType" value={newPatient.bloodType} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Contact</label>
                            <input type="tel" name="contact" placeholder="e.g., 555-123-4567" value={newPatient.contact} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Patient</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!patientToDelete} onClose={() => setPatientToDelete(null)} title="Confirm Deletion">
                <p>Are you sure you want to delete {patientToDelete?.name}?</p>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={() => setPatientToDelete(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                </div>
            </Modal>
        </>
    );
};

export const DoctorsPage: React.FC = () => {
    const { doctors, loading, addDoctor, deleteDoctor } = useContext(AppContext);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
    const initialDoctorState = { name: '', specialty: '' };
    const [newDoctor, setNewDoctor] = useState(initialDoctorState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDoctor(prev => ({ ...prev, [name]: value }));
    };

    const handleAddDoctor = (e: React.FormEvent) => {
        e.preventDefault();
        if(newDoctor.name && newDoctor.specialty) {
            addDoctor({
                ...newDoctor,
                id: `doc-${Date.now()}`,
                avatar: `https://i.pravatar.cc/150?u=doc${Date.now()}`,
            });
            setIsAddModalOpen(false);
            setNewDoctor(initialDoctorState);
        }
    };

    const handleConfirmDelete = () => {
        if(doctorToDelete) {
            deleteDoctor(doctorToDelete.id);
            setDoctorToDelete(null);
        }
    };
    
    if(loading) return <Spinner />;

    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Doctors</h2>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Doctor
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                         <thead>
                            <tr className="border-b border-gray-200">
                                <th className="p-4 text-left font-semibold text-gray-600">Name</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Specialty</th>
                                <th className="p-4 text-left font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(d => (
                                <tr key={d.id} className="border-b border-gray-200 hover:bg-gray-100 text-gray-900">
                                    <td className="p-4 flex items-center">
                                        <img src={d.avatar} alt={d.name} className="w-10 h-10 rounded-full mr-4" />
                                        {d.name}
                                    </td>
                                    <td className="p-4">{d.specialty}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-500 hover:text-blue-700"><PencilIcon /></button>
                                            <button onClick={() => setDoctorToDelete(d)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Doctor Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Doctor">
                <form onSubmit={handleAddDoctor}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input type="text" name="name" value={newDoctor.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Specialty</label>
                            <input type="text" name="specialty" value={newDoctor.specialty} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900" required />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Add Doctor</button>
                    </div>
                </form>
            </Modal>

             {/* Delete Confirmation Modal */}
             <Modal isOpen={!!doctorToDelete} onClose={() => setDoctorToDelete(null)} title="Confirm Deletion">
                <p>Are you sure you want to delete {doctorToDelete?.name}?</p>
                <div className="mt-6 flex justify-end space-x-2">
                    <button onClick={() => setDoctorToDelete(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                </div>
            </Modal>
        </>
    );
};

export const NotFoundPage: React.FC = () => (
    <div className="text-center py-20">
        <h1 className="text-6xl font-bold text-primary-500">404</h1>
        <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">The page you are looking for does not exist.</p>
    </div>
);