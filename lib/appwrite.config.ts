import * as sdk from 'node-appwrite';

// destructuring the environment variables
export const {
    PROJECT_ID, API_KEY, DATABASE_ID, PATIENTS_COLLECTION_ID, DOCTORS_COLLECTION_ID, APPOINTMENTS_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client();

client
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!)

// get access to appwrite sdk
export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
// for otp and sending sms to users
export const messaging = new sdk.Messaging(client);
// for user verification
export const users = new sdk.Users(client);