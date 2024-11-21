-- Add doctor_id column to appointment_types
ALTER TABLE public.appointment_types 
ADD COLUMN doctor_id uuid REFERENCES auth.users(id);

-- Update existing records with doctor IDs
UPDATE public.appointment_types
SET doctor_id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'dr.smith@example.com'
)
WHERE doctor_name = 'Dr. Smith';

UPDATE public.appointment_types
SET doctor_id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'dr.jones@example.com'
)
WHERE doctor_name = 'Dr. Jones';

-- Make doctor_id required for future inserts
ALTER TABLE public.appointment_types
ALTER COLUMN doctor_id SET NOT NULL;