import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ggkowuvfntdtqzdsgehe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdna293dXZmbnRkdHF6ZHNnZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MjM5NDgsImV4cCI6MjA0NzA5OTk0OH0.Fe3cRZPUY6zgG36S1SQwfWcDGC8lCABkVzxEGggK-Xg';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Appointment Types
export type AppointmentType = {
  id: number;
  name: string;
  duration: number;
  price: number;
  doctor_name: string;
  doctor_specialization: string;
};

export type Appointment = {
  id: number;
  patient_id: string;
  appointment_type_id: number;
  start_time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes: string;
  meeting_url?: string;
  location: string;
};

// Appointment Functions
export async function getAppointmentTypes(): Promise<AppointmentType[]> {
  const { data, error } = await supabase
    .from('appointment_types')
    .select('*')
    .order('id');
  
  if (error) throw error;
  return data || [];
}

function generateJitsiMeetUrl(): string {
  const roomId = Math.random().toString(36).substring(2, 12);
  return `https://meet.jit.si/${roomId}`;
}

export async function bookAppointment(appointment: Omit<Appointment, 'id' | 'status'>) {
  // Check if the time slot is available
  const startTime = new Date(appointment.start_time);
  const endTime = new Date(startTime.getTime() + 30 * 60000); // Add 30 minutes

  // Check for existing appointments in the same time slot
  const { data: existingAppointments, error: checkError } = await supabase
    .from('appointments')
    .select('id')
    .eq('appointment_type_id', appointment.appointment_type_id)
    .eq('status', 'upcoming')
    .gte('start_time', startTime.toISOString())
    .lt('start_time', endTime.toISOString());

  if (checkError) throw checkError;

  if (existingAppointments && existingAppointments.length > 0) {
    throw new Error('This time slot is already booked');
  }

  // Create appointment with meeting URL for video consultations
  const appointmentData = {
    ...appointment,
    status: 'upcoming',
    meeting_url: appointment.location === 'Video Consultation' 
      ? generateJitsiMeetUrl()
      : null
  };

  // Create appointment
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Medical Records Types and Functions
export type MedicalRecord = {
  id: string;
  patient_id: string;
  doctor_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  type: string;
  description: string;
  uploaded_at: string;
};

export async function getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('patient_id', patientId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function uploadMedicalRecord(
  file: File,
  patientId: string,
  doctorId: string
): Promise<MedicalRecord> {
  // Upload file to storage
  const filePath = `${patientId}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('medical-records')
    .upload(filePath, file);

  // console.log("This is upload error",uploadError)
  if (uploadError) throw uploadError;

  // Create record in database
  const { data, error: dbError } = await supabase
    .from('medical_records')
    .insert([
      {
        patient_id: patientId,
        doctor_id: doctorId,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      },
    ])
    .select()
    .single();
    console.log("This is the ",dbError)
  if (dbError) throw dbError;
  return data;
}

export async function downloadMedicalRecord(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('medical-records')
    .createSignedUrl(filePath, 60); // URL expires in 60 seconds

  if (error) throw error;
  return data.signedUrl;
}