import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useAtom } from 'jotai';
import { userAtom } from '@/lib/auth';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Appointment = {
  id: number;
  type: {
    name: string;
    doctor_name: string;
    doctor_specialization: string;
  };
  start_time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  meeting_url: string;
};

export function MyAppointments() {
  const [user] = useAtom(userAtom);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  async function loadAppointments() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          start_time,
          location,
          status,
          meeting_url,
          type:appointment_type_id(
            name,
            doctor_name,
            doctor_specialization
          )
        `)
        .eq('patient_id', user?.id)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelAppointment(appointmentId: number) {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;
      toast.success('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  }

  function handleJoinVideoCall(meetingUrl: string) {
    window.open(meetingUrl, '_blank');
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
      <p className="mt-2 text-gray-600">View and manage your upcoming and past appointments.</p>

      {appointments.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-600">No appointments found.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {appointments.map((appointment) => {
            const showVideoButton = appointment.status === 'upcoming' && 
                                  appointment.location === 'Video Consultation' &&
                                  appointment.meeting_url;

            return (
              <div
                key={appointment.id}
                className="rounded-lg bg-white p-6 shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.type.doctor_name}
                    </h3>
                    <p className="text-gray-600">{appointment.type.name}</p>
                    <p className="text-sm text-gray-500">{appointment.type.doctor_specialization}</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        appointment.status === 'upcoming'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-gray-600">
                      {format(new Date(appointment.start_time), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-gray-600">
                      {format(new Date(appointment.start_time), 'h:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {appointment.location === 'Video Consultation' ? (
                      <Video className="h-5 w-5 text-gray-400" />
                    ) : (
                      <MapPin className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="ml-2 text-gray-600">{appointment.location}</span>
                  </div>
                </div>

                {appointment.status === 'upcoming' && (
                  <div className="mt-6 flex space-x-4">
                    {showVideoButton && (
                      <Button
                        variant="primary"
                        onClick={() => handleJoinVideoCall(appointment.meeting_url)}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join Video Call
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}