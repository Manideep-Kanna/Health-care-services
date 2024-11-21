import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Video } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAtom } from 'jotai';
import { userAtom } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AppointmentType,
  getAppointmentTypes,
  bookAppointment,
  supabase
} from '@/lib/supabase';
import { format } from 'date-fns';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

export function BookAppointment() {
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [isVideoConsultation, setIsVideoConsultation] = useState(false);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);

  useEffect(() => {
    loadAppointmentTypes();
  }, []);

  useEffect(() => {
    if (selectedType && selectedDate) {
      loadBookedSlots();
    }
  }, [selectedType, selectedDate]);

  async function loadBookedSlots() {
    if (!selectedType) return;

    try {
      const startOfDay = new Date(`${selectedDate}T00:00:00`);
      const endOfDay = new Date(`${selectedDate}T23:59:59`);

      const { data: existingAppointments, error } = await supabase
        .from('appointments')
        .select('start_time')
        .eq('appointment_type_id', selectedType.id.toString())
        .eq('status', 'upcoming')
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString());

      if (error) throw error;

      const booked = existingAppointments.map(app => 
        format(new Date(app.start_time), 'HH:mm')
      );
      setBookedSlots(booked);
    } catch (error: any) {
      console.error('Failed to load booked slots:', error);
      toast.error('Failed to load booked time slots');
    }
  }

  async function loadAppointmentTypes() {
    try {
      const types = await getAppointmentTypes();
      setAppointmentTypes(types);
      if (types.length > 0) {
        setSelectedType(types[0]);
      }
    } catch (error: any) {
      console.error('Failed to load appointment types:', error);
      toast.error('Failed to load appointment types');
    } finally {
      setIsInitialLoading(false);
    }
  }

  async function handleBookAppointment() {
    if (!user || !selectedTime || !selectedType || !selectedDate) {
      toast.error('Please select all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime}`);
      
      await bookAppointment({
        patient_id: user.id,
        appointment_type_id: selectedType.id,
        start_time: appointmentDateTime.toISOString(),
        location: isVideoConsultation ? 'Video Consultation' : 'Main Clinic',
        notes,
      });
      
      toast.success('Appointment booked successfully!');
      navigate('/appointments');
    } catch (error: any) {
      console.error('Failed to book appointment:', error);
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  }

  if (isInitialLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
      <p className="mt-2 text-gray-600">Schedule your next visit with our healthcare professionals.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Select Date & Time</h2>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
              <select
                value={selectedType?.id || ''}
                onChange={(e) => {
                  const type = appointmentTypes.find(t => t.id === Number(e.target.value));
                  setSelectedType(type || null);
                }}
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {appointmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} - ${type.price} with {type.doctor_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Consultation Type</label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="consultationType"
                    checked={!isVideoConsultation}
                    onChange={() => setIsVideoConsultation(false)}
                  />
                  <span className="ml-2">In-person</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="consultationType"
                    checked={isVideoConsultation}
                    onChange={() => setIsVideoConsultation(true)}
                  />
                  <span className="ml-2">Video Consultation</span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Available Time Slots</label>
              <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
                {timeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => !isBooked && setSelectedTime(time)}
                      disabled={isBooked}
                      className={`flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                        isBooked 
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTime === time
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Any specific concerns or requirements..."
              />
            </div>

            <div className="mt-6">
              <Button
                size="lg"
                className="w-full"
                onClick={handleBookAppointment}
                isLoading={isLoading}
                disabled={!selectedTime || !selectedType}
              >
                Confirm Appointment
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Appointment Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-600">
                  Date: {selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy') : 'Not selected'}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-600">
                  Time: {selectedTime ? format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a') : 'Not selected'}
                </span>
              </div>
              {selectedType && (
                <>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-gray-600">
                      Doctor: {selectedType.doctor_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 text-gray-600">
                      Location: {isVideoConsultation ? 'Video Consultation' : 'Main Clinic'}
                    </span>
                  </div>
                  <div className="mt-4 rounded-md bg-primary/10 p-4">
                    <p className="text-lg font-semibold text-primary">
                      Price: ${selectedType.price}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}