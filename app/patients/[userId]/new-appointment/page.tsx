import React from "react";
import AppointmentForm from "@/components/forms/AppointmentForm";
import Image from "next/image";
import Link from "next/link";
import { getPatient } from "@/lib/actions/patients.actions";

export default async function NewAppointment({params: {userId}}: SearchParamProps) {
  // get the patient based on its user ID
  const patient = await getPatient(userId);

  return (
    <div className="flex h-screen max-h-screen">

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px]">
          <Image 
            src="/assets/icons/logo-full.svg"
            alt="doctor"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id} // to know which user is booking
          />

          <p className="copyright mt-10 py-12">@ 2024 Care Plus</p>
        </div>
      </section>

      <Image 
        src="/assets/images/appointment-img.png"
        alt="appointment"
        height={1000}
        width={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
