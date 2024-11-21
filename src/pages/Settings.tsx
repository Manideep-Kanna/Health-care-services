import React from 'react';
import { useAtom } from 'jotai';
import { User, userAtom, updateUserProfile } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User as UserIcon, Bell, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const schema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email().optional(),
});

type SettingsForm = z.infer<typeof schema>;

export function Settings() {
  const [user] = useAtom(userAtom); 
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SettingsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: SettingsForm) => {
    try {
      if (user) {
        await updateUserProfile(user.id, { full_name: data.full_name });
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Manage your account preferences and settings.</p>

      <div className="mt-8 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="flex items-center">
              <UserIcon className="h-6 w-6 text-gray-400" />
              <h2 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  {...register('full_name')}
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  disabled
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>

        {/* Rest of the settings sections remain unchanged */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-gray-400" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Receive email updates about your appointments</p>
              </div>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-600"
                role="switch"
                aria-checked="true"
              >
                <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">SMS Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get text messages for appointment reminders</p>
              </div>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-gray-200"
                role="switch"
                aria-checked="false"
              >
                <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <Lock className="h-6 w-6 text-gray-400" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full sm:w-auto">
              Change Password
            </Button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <div className="flex items-center">
            <Globe className="h-6 w-6 text-gray-400" />
            <h2 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Language & Region</h2>
          </div>
          <div className="mt-6">
            <select className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}