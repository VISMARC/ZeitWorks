'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Header from './components/Header';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  created_at: string;
}

export default function Home() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch users',
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Network error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    router.push('/add-user');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const UserCard = ({ user }: { user: User }) => {
    const cardHeader = (
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{background: `linear-gradient(135deg, var(--brand-color), rgb(165, 16, 37))`}}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 m-0">{user.name}</h3>
            <p className="text-sm text-gray-600 m-0">{user.email}</p>
          </div>
        </div>
      </div>
    );

    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 h-full">
        {cardHeader}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Role:</span>
            <Badge 
              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
              severity={((role: string) => {
                // Using a settled grey color for all role badges
                return 'secondary';
              })(user.role) as any}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Department:</span>
            <span className="text-sm text-gray-900 capitalize">{user.department}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">Added:</span>
            <span className="text-xs text-gray-500">{formatDate(user.created_at)}</span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      
      <Header 
        title="ZeitWorks"
        subtitle="Time that Works For You"
        showAddButton={true}
        onAddClick={handleAddUser}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <i className="pi pi-spinner pi-spin text-4xl" style={{color: 'var(--brand-color)'}}></i>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <i className="pi pi-users text-6xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No users found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first team member</p>
            <Button
              label="Add"
              icon="pi pi-plus"
              onClick={handleAddUser}
              style={{backgroundColor: 'var(--brand-color)', borderColor: 'var(--brand-color)'}}
              className="hover:opacity-90 transition-opacity"
            />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Team Members ({users.length})
              </h2>
              <p className="text-gray-600">Overview of all registered participants</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
