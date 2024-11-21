# HealthCare Hub - Modern Healthcare Management System

A comprehensive healthcare management platform built with React, TypeScript, and Supabase, designed to streamline the interaction between patients and healthcare providers.

![HealthCare Hub](https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000)

## Features

### For Patients
- **Appointment Booking**: Schedule appointments with preferred doctors
- **Medical Records**: Secure access to personal medical history and documents
- **Appointment Management**: View, reschedule, or cancel appointments
- **Video Consultations**: Remote healthcare through integrated video calls
- **Profile Management**: Update personal information and preferences

### For Doctors
- **Dashboard**: Comprehensive view of daily appointments
- **Patient Management**: Access to patient records and appointment history
- **Schedule Management**: Handle appointment requests and manage availability
- **Video Consultations**: Conduct remote patient consultations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **Backend & Auth**: Supabase
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Custom components with Lucide icons
- **Date Handling**: date-fns
- **Notifications**: Sonner

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/healthcare-hub.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── lib/               # Utilities and configurations
├── pages/             # Main application pages
└── types/             # TypeScript type definitions
```

## Database Schema

### Tables
- `appointment_types`: Defines available appointment types and associated doctors
- `appointments`: Stores appointment bookings and details
- `medical_records`: Manages patient medical documents
- `auth.users`: Handles user authentication and profiles

## Security Features

- Row Level Security (RLS) policies for data protection
- Secure file storage for medical records
- Role-based access control (Patient/Doctor)
- Encrypted data transmission

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- UI inspiration from modern healthcare applications
- Built with [Vite](https://vitejs.dev) and [React](https://reactjs.org)
