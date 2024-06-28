import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";


export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.js.appro",
  projectId: "667bf86900002bda9c4c",
  databaseId: "667bf9fe000037bfd723",
  userCollectionId: "667c0b9a0034090900eb",
  videoCollentionId: "667bfa3e00210aa881c4",
  storageId: "667bfbf6002b180f3e79",
};

const client = new Client();

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollentionId,
  storageId,
} = config;

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databeses = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databeses.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databeses.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databeses.listDocuments(
      databaseId,
      videoCollentionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databeses.listDocuments(
      databaseId,
      videoCollentionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  console.log("appwite'e gelen query :", query)
  try {
    const posts = await databeses.listDocuments(
      databaseId,
      videoCollentionId,
      [Query.search("title", query)]
    );

    return posts.documents;
  } catch (error) {
    console.log("searchPosts hata :",error)
    throw new Error(error);
  }
};