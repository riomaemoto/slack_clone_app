export type UserType = {
  userId: string;
  userName: string;
  myRooms: { id: string; name: string }[];
};
export type ChannelType = {
  channelId: string;
  channelNm: string;
  messages: MessageType[];
  members: { id: string; name: string }[];
};

export type MessageType = {
  messageid: string;
  messengerid: string;
  messengerNm: string;
  content: string;
};
