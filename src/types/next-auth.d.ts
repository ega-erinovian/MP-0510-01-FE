import { DefaultSession } from "next-auth";
import { UserType } from "./user";

interface Payload extends UserType {
  token: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: Payload;
  }
}
