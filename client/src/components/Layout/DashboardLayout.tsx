import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useToast } from '@/hooks/use-toast';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/me/', {
          method: 'GET',
          credentials: 'include', // ✅ sends cookies
        });

        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();

        setUser(data.user);
      } catch (err) {
        toast({
          title: 'Session expired',
          description: 'Please log in again.',
        });
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, toast]);

  const handleLogout = () => {
    fetch('http://localhost:8000/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });

    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        user={user}
        currentPath={location.pathname}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 lg:pl-64">
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
