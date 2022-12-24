import { Flex, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginInfoState, userInfoState } from "../utils/providers";
import { GoSignOut } from "react-icons/go";
import { FA, FS, userConverter, USER_DB } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { NavContent } from "./NavContents";
import { ChannelModal } from "./ChannelModal";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { SendContent } from "./SendContent";
import { ChatArea } from "./ChatArea";
export const Dashboard = () => {
  const loginInfo = useRecoilValue(loginInfoState);
  const setUserInfo = useSetRecoilState(userInfoState);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (loginInfo) {
      getDoc(doc(FS, USER_DB, loginInfo).withConverter(userConverter)).then(
        (res) => {
          if (res.exists()) setUserInfo(res.data());
        }
      );
    }
  }, []);

  const logout = () => {
    signOut(FA);
  };
  return !loginInfo ? (
    <Navigate to={"/"} />
  ) : (
    <>
      <Grid
        templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
        gridTemplateRows={"40px 1fr 64px"}
        gridTemplateColumns={"400px 1fr"}
        h="100vh"
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem bg="pink.900" area={"header"}>
          <Flex alignItems="center" h="100%" pl={3}>
            <GoSignOut
              cursor={"pointer"}
              size={20}
              onClick={logout}
              color="white"
            />
          </Flex>
        </GridItem>

        <GridItem p="4" bg="pink.800" area={"nav"} color="gray.300">
          <NavContent onOpen={onOpen} />
        </GridItem>

        <GridItem pl="2" bg="white" area={"main"}>
          <ChatArea />
        </GridItem>

        <GridItem p="3" bg="gray.200" area={"footer"}>
          <SendContent />
        </GridItem>
      </Grid>
      <ChannelModal isOpen={isOpen} ss={onClose} />
    </>
  );
};
