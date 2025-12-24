import { account } from "./appwrite";


// user edit functions
type EditData = {
  image?: string;
  name?: string;
};
export async function editUser(data: EditData) {
    if(data?.name){
        const result = await account.updateName({
          name: data?.name
        })
        console.log("Update name successful")
    }
}
