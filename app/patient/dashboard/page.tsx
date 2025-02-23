"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  status: "Pending" | "Completed";
}

export default function PatientDashboard() {
//   const { data: session } = useSession();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    async function fetchPrescriptions() {
      const res = await fetch("/api/patient/prescription");
      const data = await res.json();
      setPrescriptions(data);
    }
    fetchPrescriptions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Prescriptions</h1>
      {prescriptions.length === 0 ? (
        <p className="text-gray-600">No prescriptions found.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{prescription.doctorName}</p>
                <p className="text-gray-500 text-sm">{prescription.date}</p>
                <p
                  className={`text-sm font-medium ${
                    prescription.status === "Completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {prescription.status}
                </p>
              </div>
              <Link
                href={`/patient/prescription/${prescription.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Prescription
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
