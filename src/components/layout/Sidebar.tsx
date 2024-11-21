import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  ClipboardList,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { userAtom } from '@/lib/auth';

const patientNavigation = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Book Appointments', to: '/book', icon: Calendar },
  { name: 'My Appointments', to: '/appointments', icon: ClipboardList },
  { name: 'Medical Records', to: '/records', icon: FolderOpen },
  { name: 'Settings', to: '/settings', icon: Settings },
  { name: 'Help & Support', to: '/help', icon: HelpCircle },
];

const doctorNavigation = [
  { name: 'Dashboard', to: '/', icon: Home },
  { name: 'Medical Records', to: '/records', icon: FolderOpen },
  { name: 'Settings', to: '/settings', icon: Settings },
  { name: 'Help & Support', to: '/help', icon: HelpCircle },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user] = useAtom(userAtom);

  const navigation = user?.role === 'doctor' ? doctorNavigation : patientNavigation;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-md bg-primary p-2 text-primary-foreground lg:hidden"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
      
      <div className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 transform bg-card shadow-xl transition-transform duration-200 ease-in-out lg:translate-x-0',
        {
          'translate-x-0': isOpen,
          '-translate-x-full': !isOpen,
        }
      )}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b border-border/10 px-4">
            <h1 className="text-xl font-bold text-primary">
              HealthCare Hub
            </h1>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      {
                        'bg-primary text-primary-foreground': isActive,
                        'text-muted-foreground hover:bg-accent hover:text-accent-foreground': !isActive,
                      }
                    )
                  }
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-border/10 p-4">
            <button
              onClick={handleSignOut}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}