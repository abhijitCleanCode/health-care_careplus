'use server'

import { ID, Query } from "node-appwrite"
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENTS_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config"
import { parseStringify } from "../utils";

import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);

        console.log("newUser: ", newUser);

        return parseStringify(newUser);
    } catch (error: any) {
        // user already exist
        if (error && error.code === 409) {
            // Get a list of all the project's users. Use the query params to filter your results
            const documents = await users.list([
                Query.equal('email', [user.email])// return document if attribute is equal to any value in the provided array
            ])

            return documents?.users[0]
        }
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId);

        return parseStringify(user);
    } catch (error) {
        console.log("patients actions :: getUser :: error while fetching user: ", error);
    }
}

export const registerPatient = async ({identificationDocument, ...patient}: RegisterUserParams) => {
    try {
        // upload the file to appwrite storage to be able to access via URL
        let file

        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string,
            )
            // add the file to storage
            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENTS_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient,
            }
        )

        return parseStringify(newPatient);
    } catch (error) {
        console.log('patients actions :: registerPatient :: error: ', error);
    }
}

export const getPatient = async (userId: string) => {
    try {
        const patient = await databases.listDocuments(
            DATABASE_ID!,
            PATIENTS_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        )

        return parseStringify(patient.documents[0])
    } catch (error) {
        console.log("patients actions :: getPatient :: error while fetching patient: ", error);
    }
}