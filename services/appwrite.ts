import { useAuth } from "@/Contexts/AuthContext";
import { Account, Avatars, Client, ID, Permission, Query, Realtime, Role, Storage, TablesDB,} from "appwrite";
import Constants from "expo-constants";


// Configuration from app.config.js
const APPWRITE_ENDPOINT = Constants.expoConfig?.extra?.appwriteEndpoint;
const APPWRITE_PROJECT_ID = Constants.expoConfig?.extra?.appwriteProjectId;
export const APPWRITE_DATABASE_ID = Constants.expoConfig?.extra?.appwriteDatabaseId;
export const APPWRITE_TABLE_ID_1 = "metrics"
export const APPWRITE_TABLE_ID_2 = "savedmovies"


const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT!)     // Appwrite Cloud endpoint
  .setProject(APPWRITE_PROJECT_ID!)
 

export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const tablesDB = new TablesDB(client);
export const realtime = new Realtime(client)


export { client };


export const fetchSavedMovies = async(): Promise<SavedMovie[] | undefined>=>{
  try {
    const results = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID!,
      tableId: APPWRITE_TABLE_ID_2,
    })
    return results.rows as unknown as SavedMovie[]
  } catch (error) {
    
  }
}