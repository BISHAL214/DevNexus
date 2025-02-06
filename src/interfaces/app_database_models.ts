import { JsonValue } from "@prisma/client/runtime/library";

export enum ConnectionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface User {
  id?: string;
  name: string;
  email: string;
  githubId: string;
  avatar?: string;
  bio?: string;
  skills?: Skill[];
  projects?: Project[];
  experience?: number;
  interests?: string[];

  followers?: User[];
  following?: User[];

  sentConnections?: Connection[];
  receivedConnections?: Connection[];

  sentMessages?: Message[];
  receivedMessages?: Message[];

  notifications?: Notification[];
  location?: Location;
  locationId?: string;

  createdAt: Date;
  updatedAt: Date;
  embedding: JsonValue;
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
  id?: string;
  userid: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  user: User;
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
