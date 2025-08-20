import { cookies } from "next/headers";
import { Client, Account, Databases, Storage } from "appwrite";

export async function createAppwriteServerClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("appwrite-session")?.value;

  if (sessionCookie) {
    client.setJWT(sessionCookie);
  }

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
}
