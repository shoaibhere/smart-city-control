
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Building, 
  MapPin, 
  User, 
  FileText, 
  BarChart3, 
  Vote, 
  MessageSquare,
  ClipboardList,
  Users,
  X
} from 'lucide-react';

interface SidebarProps {
  user: any;
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

const getNavigationItems = (role: string) => {
  switch (role) {
    case 'admin':
      return [
        { name: 'Overview', href: '/dashboard/admin', icon: BarChart3 },
        { name: 'Users', href: '/dashboard/admin/users', icon: Users },
        { name: 'Issues', href: '/dashboard/admin/issues', icon: ClipboardList },
        { name: 'Reports', href: '/dashboard/admin/reports', icon: FileText },
        { name: 'Polls', href: '/dashboard/admin/polls', icon: Vote },
        { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
      ];
    case 'department':
      return [
        { name: 'Overview', href: '/dashboard/department', icon: BarChart3 },
        { name: 'Assigned Issues', href: '/dashboard/department/issues', icon: ClipboardList },
        { name: 'Reports', href: '/dashboard/department/reports', icon: FileText },
        { name: 'Chat', href: '/dashboard/department/chat', icon: MessageSquare },
      ];
    case 'citizen':
      return [
        { name: 'Overview', href: '/dashboard/citizen', icon: BarChart3 },
        { name: 'Report Issue', href: '/dashboard/citizen/report', icon: ClipboardList },
        { name: 'My Issues', href: '/dashboard/citizen/issues', icon: FileText },
        { name: 'Vote in Polls', href: '/dashboard/citizen/polls', icon: Vote },
      ];
    default:
      return [];
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ user, currentPath, isOpen, onClose }) => {
  const navigationItems = getNavigationItems(user.role);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-blue-600" />
            <MapPin className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">Smart City</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-full pt-6 pb-4">
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Smart City Dashboard</p>
              <p>Version 1.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
