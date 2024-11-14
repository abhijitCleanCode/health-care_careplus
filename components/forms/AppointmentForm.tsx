"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { getAppointmentSchema } from "@/lib/validation"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import { createAppointment } from "@/lib/actions/appointment.actions"

const AppointmentForm = (
  { userId, patientId, type = "create" }: { userId: string, patientId: string, type: 'create' | 'cancel' | 'schedule' }
) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // getAppointmentSchema depends on appointment type
  const AppointmentFormValidation = getAppointmentSchema(type);

  // 1. Define your form, which is of type formSchema
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    let status; // there are three different appointment status
    switch (type) {
      case "cancel":
        status = "cancelled"
        break;
      case "schedule":
        status = "scheduled"
        break;
      default :
        status = "pending"
        break;
    }

    try {
      if (type === "create" && patientId) {
        // create the data
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date (values.schedule),
          reason: values.reason!,
          note: values.note!,
          status: status as Status, 
        }

        console.log(appointmentData);
        // send it to backend
        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
        }
      }
    } catch (error) {
      console.log("PatientForm :: onSubmit :: Error while submitting a form: ", error);
    }

    setIsLoading(false);
  }

  let buttonLabel;
  switch (type) {
    case 'cancel' :
      buttonLabel = "Cancel Appointment"
      break;
    case 'create' :
      buttonLabel = 'Create Appointment'
      break;
    case 'schedule' :
      buttonLabel = 'Schedule Appointment'
      break;
    default :
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section>
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Book an appointment within seconds</p>
        </section>

        {type !== 'cancel' && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField 
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="reason"
                label="Reason for an appointment"
                placeholder="Enter reason for appointment"
              />
              <CustomFormField 
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="note"
                label="Notes"
                placeholder="Prefer afternoon appointment"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField 
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        {/* isLoading is pass just to get know when to stop loading */}
        <SubmitButton isLoading={isLoading}
          className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm

// zod is use for validating