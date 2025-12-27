import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { DataTable } from '@/components/common/DataTable';
import { RoleBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockUsers } from '@/data/mockData';
import { Users, UserPlus, Shield, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Admins',
      value: mockUsers.filter((u) => u.role === 'ADMIN').length,
      icon: Shield,
    },
    {
      title: 'Librarians',
      value: mockUsers.filter((u) => u.role === 'RESPONSABLE').length,
      icon: UserCheck,
    },
    {
      title: 'Clients',
      value: mockUsers.filter((u) => u.role === 'CLIENT').length,
      icon: Users,
    },
  ];

  const recentUsers = mockUsers.slice(0, 5);

  const columns = [
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => <RoleBadge role={user.role} />,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Admin Dashboard"
        description="Manage users and system settings"
        action={
          <Button onClick={() => navigate('/admin/users/create')}>
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-semibold">Recent Users</h2>
          <Button variant="outline" onClick={() => navigate('/admin/users')}>
            View All
          </Button>
        </div>
        <DataTable data={recentUsers} columns={columns} pageSize={5} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
