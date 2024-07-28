import {createAction, createReducer, current} from '@reduxjs/toolkit';
import {UserJoinedChannel} from '../../utils/global-types';

const defaultUsers = [
  {
    uid: 0,
    voice: true,
    video: true,
    streamType: 'low',
  },
];

const initialState: UserJoinedChannel.IUserJoinedInitialState = {
  users: defaultUsers,
};

export const UserJoinedReducerName = 'userJoinedReducerName';

export class UserCase {
  static readonly setInitialUser = createAction<{
    users: UserJoinedChannel.IUser[];
  }>(UserJoinedReducerName + '/setInitialUser');
  static readonly setUserJoinedChanel = createAction<{
    user: UserJoinedChannel.IUser;
  }>(UserJoinedReducerName + '/setUserJoinedChanel');
}

export const UserJoinedReducerReducer = createReducer(initialState, builder => {
  builder
    .addCase(UserCase.setInitialUser, (state, action) => {
      const currentState = current(state);
      return {
        ...currentState,
        users: action.payload?.users,
      };
    })
    .addCase(UserCase.setUserJoinedChanel, (state, action) => {
      const currentState = current(state);
      const usersId = currentState?.users?.map(value => value.uid);
      if (usersId.includes(action.payload?.user?.uid)) {
        return;
      }
      return {
        ...currentState,
        users: [...currentState.users, action.payload?.user],
      };
    });
});

export const getUsersJoinedChannel = (state: {
  [UserJoinedReducerName]: UserJoinedChannel.IUserJoinedInitialState;
}) => state[UserJoinedReducerName].users;
