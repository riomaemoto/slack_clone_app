export type UserType = {
  userId: string;
  userName: string;
  myChannels: ass[];
};
type ass = { channelId: string; channelName: string };

export type ChannelType = {
  channelId: string;
  channelNm: string;
  members: { name: string; userId: string }[];
  messages: mesgType[];
};

type mesgType = {
  id: string;
  messengerId: string;
  messengerNm: string;
  content: string;
};

export const USER_DB = "users";
export const CHANNEL_DB = "channels";
