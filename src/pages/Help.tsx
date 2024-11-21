import React from 'react';
import { HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Help() {
  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by navigating to the "Book Appointments" section, selecting your preferred date and time, and choosing the type of consultation you need.',
    },
    {
      question: 'What should I do if I need to cancel my appointment?',
      answer: 'To cancel an appointment, go to "My Appointments", find the appointment you wish to cancel, and click the "Cancel" button. Please note that cancellations should be made at least 24 hours in advance.',
    },
    {
      question: 'How can I access my medical records?',
      answer: 'Your medical records can be accessed through the "Medical Records" section. You can view and download your records securely through our platform.',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Find answers to common questions or get in touch with our support team.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0 dark:border-gray-700">
                  <h3 className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                    <HelpCircle className="mr-2 h-5 w-5 text-blue-500" />
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Support</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">1-800-HEALTH</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">support@healthcare.com</span>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Live Chat
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">Need Emergency Help?</h3>
            <p className="mt-2 text-blue-800 dark:text-blue-200">
              If you're experiencing a medical emergency, please dial 911 immediately or visit your nearest emergency room.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}