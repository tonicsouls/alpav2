import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { WorkflowIcon } from './icons/WorkflowIcon';
import { Bars3Icon } from './icons/Bars3Icon';
import { CogIcon } from './icons/CogIcon';

type View = 'dashboard' | 'workflows' | 'logs' | 'settings';

interface SidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const activeClasses = 'bg-red-500/10 text-red-500';
    const inactiveClasses = 'text-gray-400 hover:text-white hover:bg-gray-700';

    return (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ${isActive ? activeClasses : inactiveClasses}`}
            >
                {icon}
                <span className="ml-3">{label}</span>
            </a>
        </li>
    );
};


export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
    const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
        { id: 'workflows', label: 'Workflows', icon: <WorkflowIcon className="w-5 h-5" /> },
        { id: 'logs', label: 'Logs', icon: <Bars3Icon className="w-5 h-5" /> },
        { id: 'settings', label: 'Settings', icon: <CogIcon className="w-5 h-5" /> },
    ];
    
    return (
        <aside className="w-64 flex-shrink-0 bg-gray-800 flex flex-col p-4">
            <div className="flex items-center h-16 flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-white">
                    alpa <span className="text-red-500">v2</span>
                </h1>
            </div>
            <nav className="flex-1 mt-5">
                <ul className="space-y-2">
                    {navItems.map(item => (
                        <NavItem
                            key={item.id}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeView === item.id}
                            onClick={() => onNavigate(item.id)}
                        />
                    ))}
                </ul>
            </nav>
        </aside>
    );
};