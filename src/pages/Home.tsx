import React from 'react';
import { Activity, Users, Calendar, Clock } from 'lucide-react';

export function Home() {
  const stats = [
    { name: 'Active Patients', value: '2,345', icon: Users, change: '+4.75%' },
    { name: 'Total Appointments', value: '1,234', icon: Calendar, change: '+12.5%' },
    { name: 'Avg. Wait Time', value: '14 min', icon: Clock, change: '-2.3%' },
    { name: 'Patient Satisfaction', value: '98%', icon: Activity, change: '+1.2%' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-900">Welcome back! Here's what's happening with your practice.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="overflow-hidden rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <div className="rounded-md bg-blue-100 p-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-gray-600">{stat.name}</p>
              <div className="flex items-baseline justify-between">
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                <span className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                  stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
          <div className="mt-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Patient {i + 1}</p>
                  <p className="text-sm text-gray-600">General Checkup</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">09:00 AM</p>
                  <p className="text-sm text-gray-600">Today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                <div className="rounded-full bg-blue-100 p-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Medical Record Updated</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}