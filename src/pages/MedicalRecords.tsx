import React, { useEffect, useState } from 'react';
import { FileText, Download, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { useAtom } from 'jotai';
import { userAtom } from '@/lib/auth';
import { MedicalRecord, getMedicalRecords, uploadMedicalRecord, downloadMedicalRecord } from '@/lib/supabase';
import { toast } from 'sonner';

export function MedicalRecords() {
  const [user] = useAtom(userAtom);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecords();
    }
  }, [user]);

  async function loadRecords() {
    try {
      const data = await getMedicalRecords(user!.id);
      setRecords(data);
    } catch (error: any) {
      toast.error('Failed to load medical records');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }


  async function handleDownload(record: MedicalRecord) {
    try {
      const url = await downloadMedicalRecord(record.file_path);
      window.open(url, '_blank');
    } catch (error: any) {
      toast.error('Failed to download file');
      console.error(error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Medical Records</h1>
          <p className="mt-2 text-black">Access and manage your medical documents securely.</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {records.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow text-center">
            <p className="text-gray-600">No medical records found.</p>
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.id}
              className="rounded-lg bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {record.type}
                    </h3>
                    <p className="text-sm text-gray-600">{record.description}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost"
                  onClick={() => handleDownload(record)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600 sm:grid-cols-4">
                <div>
                  <span className="font-medium">Date:</span>
                  <br />
                  {formatDate(new Date(record.uploaded_at))}
                </div>
                <div>
                  <span className="font-medium">File Name:</span>
                  <br />
                  {record.file_name}
                </div>
                <div>
                  <span className="font-medium">File Size:</span>
                  <br />
                  {(record.file_size / 1024 / 1024).toFixed(2)} MB
                </div>
                <div>
                  <span className="font-medium">File Type:</span>
                  <br />
                  {record.file_type}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}