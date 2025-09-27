import React, { useState, useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AppContext } from './App';
import { UserRole } from './types';
import { CalendarIcon, UsersIcon, ChartBarIcon, StethoscopeIcon } from './components';

const navLinks = {
    [UserRole.Admin]: [
        { to: '/dashboard', label: 'Dashboard', icon: <ChartBarIcon /> },
        { to: '/appointments', label: 'Appointments', icon: <CalendarIcon /> },
        { to: '/patients', label: 'Patients', icon: <UsersIcon /> },
        { to: '/doctors', label: 'Doctors', icon: <StethoscopeIcon /> },
    ],
    [UserRole.Doctor]: [
        { to: '/dashboard', label: 'Dashboard', icon: <ChartBarIcon /> },
        { to: '/appointments', label: 'My Appointments', icon: <CalendarIcon /> },
        { to: '/patients', label: 'My Patients', icon: <UsersIcon /> },
    ],
    [UserRole.Patient]: [
        { to: '/dashboard', label: 'Dashboard', icon: <ChartBarIcon /> },
        { to: '/appointments', label: 'My Appointments', icon: <CalendarIcon /> },
    ],
    [UserRole.Receptionist]: [
        { to: '/dashboard', label: 'Dashboard', icon: <ChartBarIcon /> },
        { to: '/appointments', label: 'All Appointments', icon: <CalendarIcon /> },
        { to: '/patients', label: 'Manage Patients', icon: <UsersIcon /> },
    ],
};

const Sidebar: React.FC<{ isSidebarOpen: boolean, setSidebarOpen: (isOpen: boolean) => void }> = ({ isSidebarOpen, setSidebarOpen }) => {
    const { user } = useContext(AppContext);
    const links = user ? navLinks[user.role] : [];
    
    return (
        <>
            <aside className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-lg z-30 w-64 transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">CareSync</h1>
                </div>
                <nav className="mt-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) => 
                                `flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                                isActive ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-300 border-r-4 border-primary-500' : ''
                            }`}
                        >
                            <span className="mr-4">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
        </>
    );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { user, theme, toggleTheme, logout } = useContext(AppContext);

    if (!user) return null;

    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm z-10">
            <div className="flex items-center justify-between h-20 px-6">
                <button onClick={onMenuClick} className="text-gray-600 dark:text-gray-300 md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex-1 md:flex-none">
                    {/* Search bar could go here */}
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
                        {theme === 'dark' ? 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        }
                    </button>
                    <div className="relative">
                        <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full" />
                    </div>
                    <div>
                         <p className="font-semibold text-sm text-gray-800 dark:text-white">{user.name}</p>
                         <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                    </div>
                    <button onClick={logout} className="text-gray-600 dark:text-gray-300 hover:text-primary-500">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export const DashboardLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="md:ml-64 flex flex-col">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-grow p-6 pt-24">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
