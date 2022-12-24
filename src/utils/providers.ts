import { atom } from "recoil";
import { UserType } from "./constants";

export const loginInfoState = atom<string | null>({
  key: "loginInfoState",
  default: null,
});
export const userInfoState = atom<UserType | null>({
  key: "userInfoState",
  default: null,
});
