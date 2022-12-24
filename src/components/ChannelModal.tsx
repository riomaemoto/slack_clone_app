import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Box,
  Button,
  Input,
} from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 } from "uuid";
import { ChannelType, UserType } from "../utils/constants";
import { CHANNEL_DB, FS, USER_DB } from "../utils/firebase";
import { loginInfoState, userInfoState } from "../utils/providers";

type Props = {
  isOpen: boolean;
  ss: () => void;
};

export const ChannelModal = ({ isOpen, ss }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={ss}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Channel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Search</Tab>
              <Tab>Create</Tab>
            </TabList>
            <TabPanels>
              <TabPanel></TabPanel>
              <TabPanel>
                <AddModal ggg={ss} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type AddModalProps = {
  ggg: () => void;
};

const AddModal = ({ ggg }: AddModalProps) => {
  const [isLoading, setIsloading] = useState(false);
  const [channelNm, setChannelNm] = useState("");
  const loginInfo = useRecoilValue(loginInfoState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const createChannel = () => {
    if (loginInfo && userInfo) {
      setIsloading(true);
      const uuid = v4();
      const userData: UserType = {
        ...userInfo,
        myRooms: [...userInfo.myRooms, { id: uuid, name: channelNm }],
      };
      const channelData: ChannelType = {
        channelId: uuid,
        channelNm,
        messages: [],
        members: [{ id: userInfo.userId, name: userInfo.userName }],
      };
      setDoc(doc(FS, CHANNEL_DB, uuid), channelData);
      setDoc(doc(FS, USER_DB, loginInfo), userData)
        .then(() => {
          setUserInfo(userData);
          ggg();
        })
        .finally(() => {
          setIsloading(false);
        });
    }
  };
  return (
    <Flex gap={4} flexDirection={"column"}>
      <Input
        placeholder="Channel Name"
        value={channelNm}
        onChange={(e) => setChannelNm(e.target.value)}
      />
      <Box textAlign="right">
        <Button
          bg="cyan.200"
          mr={3}
          onClick={createChannel}
          disabled={channelNm === ""}
          isLoading={isLoading}
          w="30%"
        >
          Create
        </Button>
      </Box>
    </Flex>
  );
};
