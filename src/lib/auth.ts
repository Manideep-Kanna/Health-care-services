import { atom } from 'jotai';
import { supabase } from './supabase';
import { toast } from 'sonner';

export type UserRole = 'patient' | 'doctor';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  user_metadata?: {
    full_name?: string;
  };
};

export const userAtom = atom<User | null | undefined>(undefined);
export const isLoadingAtom = atom(true);

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("This is error from the Login",error);
  console.log("This is the data",data)
  
  if (error) throw error;
  return data;
}

export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  profileData: {
    full_name: string;
    age?: number; // Only for patients
    specialization?: string; // Only for doctors
    qualification?: string; // Only for doctors
    years_of_experience?: number; // Only for doctors
    adminPassword:string; // Only for Admins and doctors
  }
) {
  try {
    // Step 1: Register the user in auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role, // Assign role
          full_name: profileData.full_name, // Add full_name to user_metadata
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    // Step 2: Insert the user data into the appropriate table based on the role
    if (role === 'patient') {
      const { error: patientError } = await supabase.from('patients').insert([
        {
          id: authData.user.id, // Use the user's ID as a foreign key
          name: profileData.full_name,
          email: email,
          age: profileData.age, // Specific to patients
        },
      ]);

      if (patientError) throw patientError;
    } else if (role === 'doctor') {
      if(profileData.adminPassword != 'admin123') throw new Error("Admin Password is wrong please check again")
      const { error: doctorError } = await supabase.from('doctors').insert([
        {
          id: authData.user.id, // Use the user's ID as a foreign key
          name: profileData.full_name,
          email: email,
          specialization: profileData.specialization, // Specific to doctors
          qualification: profileData.qualification, // Specific to doctors
          years_of_experience: profileData.years_of_experience, // Specific to doctors
        },
      ]);

      if (doctorError) throw doctorError;

      const cost = calculateCost(profileData.specialization, profileData.years_of_experience);
      const duration = calculateDuration(profileData.specialization);

      const { error: appointmentError } = await supabase.from('appointment_types').insert([
        {
          doctor_id: authData.user.id, // Use the doctor's ID
          doctor_name: profileData.full_name,
          doctor_specialization: profileData.specialization,
          name: `${profileData.specialization} Appointment`,
          price: cost,
          duration: duration,
          created_at: new Date(),
        },
      ]);

      if (appointmentError) throw appointmentError;
    }

    return authData;
  } catch (error: any) {
    console.error('SignUp error:', error);
    throw error;
  }
}


export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: { full_name: string }) {
  const { error } = await supabase.auth.updateUser({
    data: { full_name: data.full_name }
  });
  
  if (error) throw error;
  return getCurrentUser();
}

export async function initializeAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Initialize auth error:', error);
    return null;
  }
}

// Cost calculation function
function calculateCost(specialization?: string, years_of_experience?: number): number {
  const baseRate = 500; // Base cost
  const specializationRate: Record<string, number> = {
    Cardiologist: 1.5,
    Neurologist: 1.4,
    Dentist: 1.2,
    General: 1.0,
  };

  const multiplier = specializationRate[specialization || 'General'] || 1.0;
  const experienceBonus = (years_of_experience || 0) * 50;

  return baseRate * multiplier + experienceBonus;
}

// Duration calculation function
function calculateDuration(specialization?: string): number {
  const durationMap: Record<string, number> = {
    Cardiologist: 60,
    Neurologist: 50,
    Dentist: 30,
    General: 20,
  };

  return durationMap[specialization || 'General'] || 30; // Default to 30 minutes
}

// Remove the auth state listener from here as we'll handle it in the AuthGuard