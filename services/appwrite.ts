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


// track searches made by users
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID!,
      tableId: APPWRITE_TABLE_ID_1,
      queries: [Query.equal("movie_id", movie.id)],
    });
    
    if (result.rows.length > 0) {
      const existing = result.rows[0];

      await tablesDB.updateRow(
        APPWRITE_DATABASE_ID!,
        APPWRITE_TABLE_ID_1,
        existing.$id,
        {
          count: existing.count + 1,
          searchTerm: query.trim(), // optional but useful
        }
      );

      console.log(`Updated count for ${existing.title}`);
    } else {
      await tablesDB.createRow({
        databaseId: APPWRITE_DATABASE_ID!,
        tableId: APPWRITE_TABLE_ID_1,
        rowId: ID.unique(),
        data: {
          movie_id: movie.id,
          title: movie.title,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          count: 1,
          searchTerm: query.trim(),
        },
      });

      console.log(`Created metric for ${movie.title}`);
    }
  } catch (error) {
    console.error("updateSearchCount error", error);
}
};


export const getTrendingMovies = async(): Promise<TrendingMovie[] | undefined>=>{
    try {
      const result = await tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID!,
      tableId: APPWRITE_TABLE_ID_1,
      queries: [
        Query.limit(8),
        Query.orderDesc("count")
        // this can be used on integered fields specified in Query.orderDesc() to get them in descending order and  Query.limit(5) only picks the first FIVE
      ],
    });
    // console.log("resullts for trending movies",result)
    return result.rows as unknown as TrendingMovie[]

  } catch (error) {
    console.error("updateSearchCount error", error);
    return undefined
  }
}

export const saveMovieInfo = async(movie:MovieDetails,userId:string)=>{
  try {
    // check if movie exists in DB first off
    const existing = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID!,
      tableId: APPWRITE_TABLE_ID_2,
      queries: [Query.equal("movie_id", movie.id)],
    })
      if(existing.rows[0]){
        console.log("Movie has been saved already")
        return false
      }else{
        const result = await tablesDB.createRow({
              databaseId: APPWRITE_DATABASE_ID!,
              tableId: APPWRITE_TABLE_ID_2,
              rowId: ID.unique(),
              data: {
                userId,
                movie_id: movie.id,
                movie_title: movie.title,
                genres: movie.genres.map((m)=> m.name),
                poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              },
              permissions: [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
              ]
            })
              if(!result) return false
              console.log("Movie saved")
              return true
      }
  } catch (error) {
    console.error("Unexpected error occured",error)
  }
}

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