import { Client, Databases, Account, ID } from "react-native-appwrite";
import { APPWRITE_CONFIG } from "../config/appwrite";

const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId)
  .setPlatform(APPWRITE_CONFIG.platform);

const databases = new Databases(client);
const account = new Account(client);

export { client, databases, account, ID };
