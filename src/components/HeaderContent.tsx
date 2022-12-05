import { Flex } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { GoSignOut } from "react-icons/go";
import { useSetRecoilState } from "recoil";
import { auth } from "../utils/firebase";
import { userInfoState } from "../utils/provider";

export const HeaderContent = () => {
  const resetUserInfo = useSetRecoilState(userInfoState);
  const logout = () => {
    resetUserInfo(null);
    signOut(auth);
  };
  return (
    <Flex alignItems="center" h="100%" pl={3}>
      <GoSignOut size={20} onClick={logout} color="white" />
    </Flex>
  );
};
