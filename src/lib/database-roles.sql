-- Add role enum type
CREATE TYPE user_role AS ENUM ('patient', 'doctor');

-- Add role column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role;

-- Create doctors profile table
CREATE TABLE public.doctor_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    specialization TEXT NOT NULL,
    qualification TEXT NOT NULL,
    years_of_experience INTEGER NOT NULL,
    license_number TEXT NOT NULL UNIQUE,
    consultation_fee DECIMAL(10,2) NOT NULL,
    available_days TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create patients profile table
CREATE TABLE public.patient_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    date_of_birth DATE NOT NULL,
    blood_group TEXT,
    allergies TEXT[],
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

-- Doctors can view their own profile
CREATE POLICY "Doctors can view own profile" ON public.doctor_profiles
    FOR SELECT USING (auth.uid() = id);

-- Doctors can update their own profile
CREATE POLICY "Doctors can update own profile" ON public.doctor_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Patients can view their own profile
CREATE POLICY "Patients can view own profile" ON public.patient_profiles
    FOR SELECT USING (auth.uid() = id);

-- Patients can update their own profile
CREATE POLICY "Patients can update own profile" ON public.patient_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Doctors can view all patients
CREATE POLICY "Doctors can view patients" ON public.patient_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.role = 'doctor'
        )
    );

-- Update appointments table to link with doctor profiles
ALTER TABLE public.appointments 
    ADD CONSTRAINT appointments_doctor_id_fkey 
    FOREIGN KEY (doctor_id) 
    REFERENCES auth.users(id);