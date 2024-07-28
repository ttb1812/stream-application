export namespace UserJoinedChannel {
  export interface IUser {
    uid: number;
    voice: boolean;
    video: boolean;
    streamType: string;
  }

  export interface IUserJoinedInitialState {
    users: IUser[];
  }
}
