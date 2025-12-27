import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  LayoutDashboard,
  BookCopy,
  LogOut,
  Library,
  FolderOpen,
  ClipboardList,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

// Admin gets all navigation items
const adminNavItems: NavItem[] = [
  { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Books', path: '/responsable/books', icon: BookOpen },
  { label: 'Categories', path: '/responsable/categories', icon: FolderOpen },
  { label: 'Emprunts', path: '/responsable/emprunts', icon: ClipboardList },
];

const responsableNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/responsable', icon: LayoutDashboard },
  { label: 'Books', path: '/responsable/books', icon: BookOpen },
  { label: 'Categories', path: '/responsable/categories', icon: FolderOpen },
  { label: 'Emprunts', path: '/responsable/emprunts', icon: ClipboardList },
];

const clientNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/client', icon: LayoutDashboard },
  { label: 'Browse Books', path: '/client/books', icon: BookOpen },
  { label: 'My Emprunts', path: '/client/emprunts', icon: BookCopy },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = React.useMemo(() => {
    switch (user?.role) {
      case 'ADMIN':
        return adminNavItems;
      case 'RESPONSABLE':
        return responsableNavItems;
      case 'CLIENT':
        return clientNavItems;
      default:
        return [];
    }
  }, [user?.role]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Library className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-sidebar-foreground">
              Library
            </h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/responsable' || item.path === '/client'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-4 rounded-lg bg-sidebar-accent p-3">
            <p className="text-sm font-medium text-sidebar-foreground">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};
