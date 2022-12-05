import { atom } from "recoil";

export const loginState = atom<string | null>({
  key: "loginState",
  default: null,
});

export const userInfoState = atom<UserTyp | null>({
  key: "userInfoState",
  default: null,
});
