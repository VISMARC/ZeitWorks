'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Header from '../components/Header';

interface FormData {
  name: string;
  email: string;
  role: string;
  department: string;
}

const roles = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Manager', value: 'manager' },
  { label: 'Analyst', value: 'analyst' },
  { label: 'Tester', value: 'tester' },
];

const departments = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Design', value: 'design' },
  { label: 'Business', value: 'business' },
  { label: 'Quality Assurance', value: 'quality assurance' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
];

export default function AddUser() {
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully!',
        });
        
        // Navigate back to home page after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        const error = await response.json();
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error.error || 'Failed to create user',
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

  const handleCancel = () => {
    router.push('/');
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast ref={toast} />
      
      <Header 
        title="Add New User"
        subtitle="Fill in the details to add a new user to the system."
        showAddButton={false}
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <InputText
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <InputText
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <Dropdown
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.value)}
                options={roles}
                placeholder="Select a role"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <Dropdown
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.value)}
                options={departments}
                placeholder="Select a department"
                className="w-full"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                label="Save User"
                icon="pi pi-check"
                loading={loading}
                style={{backgroundColor: 'var(--brand-color)', borderColor: 'var(--brand-color)'}}
                className="flex-1 hover:opacity-90 transition-opacity"
              />
              <Button
                type="button"
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                onClick={handleCancel}
                className="flex-1"
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
