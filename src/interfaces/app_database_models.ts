import { JsonValue } from "@prisma/client/runtime/library";

export enum ConnectionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface User {
  id?: string;
  firebase_uid: string | null;
  name: string | null;
  email: string | null;
  githubId: string | null;
  cover_image: string | null;
  headline: string | null;
  avatar?: string | null;
  bio?: string | null;
  skills?: Skill[] | null;
  projects?: Project[];
  experience?: number | null;
  interests?: string[] | null;

  followers?: User[] | null;
  following?: User[]  | null;

  sentConnections?: Connection[] | null;
  receivedConnections?: Connection[] ;

  sentMessages?: Message[] | null;
  receivedMessages?: Message[] | null;

  notifications?: Notification[] | null;
  location?: Location | null;
  locationId?: string | null;

  createdAt: Date | null;
  updatedAt: Date | null;
  embedding: JsonValue | null;
}

export interface Project {
  id?: string;
  name: string;
  description?: string;
  projectLink?: string;
  ownerId: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Connection {
  id?: string;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  status: ConnectionStatus;
  createdAt: Date;
}

export interface Message {
  id?: string;
  senderid: string;
  receiverid: string;
  content: string;
  timestamp: Date;
  sender: User;
  receiver: User;
}

export interface Notification {
  id: string;
  userid: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  user?: User;
}

export interface Location {
  id?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  country?: string;
  users: User[];
}

export interface Skill {
  id?: string;
  name: string;
  users: User[];
}
