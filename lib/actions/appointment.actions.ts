'use server';

import { ID, Query } from "node-appwrite";
import { APPOINTMENTS_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            ID.unique(),
            appointment,
        );

        return parseStringify(newAppointment);
    } catch (error) {
        console.log("appointment actions :: create appointment :: error: ", error);
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            appointmentId
        )

        return parseStringify(appointment);
    } catch (error) {
        console.log("appointment actions :: get Appointment :: error: ", error);
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENTS_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        )

        // get the count of different appointment
        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        // iterate over the appointments and get specific count
        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduledCount += 1
            } else if (appointment.status === 'pending') {
                acc.pendingCount += 1
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount += 1
            }

            return acc
        }, initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        }

        return parseStringify(data);        
    } catch (error) {
        console.log("appointment actions :: get Recent Appointment :: error: ", error);
    }
}

/*
    This is a server component that means it will be executed on the server.
    Without 'use server' it will be executed on the client. Then, it will not access to DATABASE_ID and APPOINTMENTS_COLLECTION_ID.
*/