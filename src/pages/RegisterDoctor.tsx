import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { signUp } from '@/lib/auth';

// Validation schema using Zod for Doctor Registration
const doctorSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    specialization: z.string().min(3, 'Specialization must be at least 3 characters'),
    qualification: z.string().min(2, 'Qualification must be at least 2 characters'),
    yearsOfExperience: z.number().positive('Years of experience must be greater than 0'),
    adminPassword: z.string().min(1, 'You Need to provide admin Password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type DoctorRegisterForm = z.infer<typeof doctorSchema>;

export function RegisterDoctor() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DoctorRegisterForm>({
    resolver: zodResolver(doctorSchema),
  });

  const onSubmit = async (data: DoctorRegisterForm) => {
    try {
      // Call the signUp function to register the doctor
      await signUp(data.email, data.password, 'doctor', {
        full_name: data.fullName,
        specialization: data.specialization,
        qualification: data.qualification,
        years_of_experience: data.yearsOfExperience,
        adminPassword: data.adminPassword
      });

      // Show success toast
      toast.success(
        'Registration successful! Please check your email to verify your account.'
      );

      // Navigate to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error: any) {
      // Show error toast
      toast.error(error.message || 'Registration failed');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Register as a Doctor
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <input
                {...register('fullName')}
                type="text"
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Full Name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="adminPassword" className="sr-only">
                Admin Password
              </label>
              <input
                {...register('adminPassword')}
                type="adminPassword"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Admin Password"
              />
              {errors.adminPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.adminPassword.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="specialization" className="sr-only">
                Specialization
              </label>
              <input
                {...register('specialization')}
                type="text"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Specialization"
              />
              {errors.specialization && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.specialization.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="qualification" className="sr-only">
                Qualification
              </label>
              <input
                {...register('qualification')}
                type="text"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Qualification"
              />
              {errors.qualification && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.qualification.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="yearsOfExperience" className="sr-only">
                Years of Experience
              </label>
              <input
                {...register('yearsOfExperience', { valueAsNumber: true })}
                type="number"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Years of Experience"
              />
              {errors.yearsOfExperience && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.yearsOfExperience.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-800"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Register
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in here
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-medium text-primary hover:text-primary/80 pl-2"
              >
                Register as Patient
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
