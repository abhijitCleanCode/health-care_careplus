"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointmentModal from "../AppointmentModal";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

// This is not neccessarily a component, just an array
export const columns: ColumnDef<Payment>[] = [
    {
        header: "ID",
        // cell is typically a fn that extract data about row and return smoething
        cell: ({row}) => <p className="text-14-medium">{row.index + 1}</p>
    },
    {
        accessorKey: "patient",
        cell: ({row}) => {
            // how does row.original know what we want is it a appointment/patient it knows based on accessorKey
            const appointment = row.original;

            return (
                <p className="text-14-medium">{appointment.patient.name}</p>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => (
            <div className="min-w-[115px]">
                <StatusBadge status={row.original.status} />
            </div>
        )
    },
    {
        accessorKey: "schedule",
        header: "Appointment",
        cell: ({row}) => (
            <p className="text-14-regular min-w-[100px]">
                {formatDateTime(row.original.schedule).dateTime}
            </p>
        )
    },
    {
        accessorKey: "primaryPhysician",
        header: () => 'Doctor',
        cell: ({ row }) => {
            // find the doctor belonging to an appointment
            const doctor = Doctors.find((doc) => doc.name === row.original.primaryPhysician)

            return (
                <div className="flex items-center gap-3">
                    <Image 
                        src={doctor?.image!}
                        alt={doctor?.name!}
                        width={100}
                        height={100}
                        className="size-8"
                    />
                    <p className="whitespace-nowrap">
                        Dr. {doctor?.name}
                    </p>
                </div>
            )
        },
    },
    {
        // each row will have actions when this is included
        id: "actions",
        header: () => <div className="pl-4">Actions</div>,
        cell: ({ row }) => {
            return (
                <div className="flex gap-1">
                    <AppointmentModal type="schedule" />
                    <AppointmentModal type="cancel" />
                </div>
            )
        },
    },
];
