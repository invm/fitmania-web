interface IUser {
  _id: string;
  name: string;
  email: string;
  lastname: string;
  birthday?: string;
  location?: string;
  avatar?: string;
  preferable: string[];
  undesirable: string[];
  fcmToken?: string;
  groups?: any[]; // FIXME:
  friends?: IUser[];
  befriendRequests?: { from: string; to: string; state: string }[];
  [key: string]: any;
}

export interface IUserMin {
  _id: string;
  name: string;
  avatar: string;
  lastname: string;
}

export default IUser;
