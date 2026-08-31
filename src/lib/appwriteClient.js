import { Client, Databases, Realtime } from "appwrite";

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("6a8543610021d41bcd7b");

export const databases = new Databases(client);
export const realtime = new Realtime(client);
