import IGroup from "./Group";

interface IUser {
  _id: string;
  name: string;
  email: string;
  lastname: string;
  birthday?: string;
  location?: string;
  image?: string;
  preferable: string[];
  undesirable: string[];
  fcmToken?: string;
  groups?: IGroup[]; // FIXME:
  friends?: IUser[];
	myRequests?: string[],
  befriendRequests?: { from: string; to: string; state: string }[];
  [key: string]: any;
}

export interface IUserMin {
  _id: string;
  name: string;
  avatar: string;
  lastname: string;
  image?: string;
}

export default IUser;
