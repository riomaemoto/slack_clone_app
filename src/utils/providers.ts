import { atom, atomFamily } from "recoil";
import { ChannelType, UserType } from "./constants";

export const loginInfoState = atom<string | null>({
  key: "loginInfoState",
  default: null,
});
export const userInfoState = atom<UserType | null>({
  key: "userInfoState",
  default: null,
});
export const channelInfoState = atomFamily<ChannelType | null, string>({
  key: "channelInfoState",
  default: null,
});

export const searchDataState = atom<ChannelType[]>({
  key: "searchDataState",
  default: [],
});
