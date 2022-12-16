import { Navigate } from "react-router-dom";
import { Flex, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { loginInfoState, userInfoState } from "../utils/providers";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { USER_DB } from "../utils/constants";
import { FA, FS, userConverter } from "../utils/firebase";
import { GoSignOut } from "react-icons/go";
import { signOut } from "firebase/auth";
import { NavContent } from "./NavContents";
import { ChannelModal } from "./ChannelModal";
import { ChatArea } from "./ChatArea";
import { SendContent } from "./SendContent";

export const Dashboard = () => {
  const loginInfo = useRecoilValue(loginInfoState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const logout = () => {
    signOut(FA);
  };

  useEffect(() => {
    if (loginInfo) {
      getDoc(doc(FS, USER_DB, loginInfo).withConverter(userConverter)).then(
        (res) => {
          if (res.exists()) {
            setUserInfo(res.data());
          }
        }
      );
    }
  }, []);
  return !loginInfo ? (
    <Navigate to="/" />
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
            <GoSignOut size={20} onClick={logout} color="white" />
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
      <ChannelModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
