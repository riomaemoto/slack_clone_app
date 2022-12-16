import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import { FC, useState } from "react";
import { FA, FS } from "../utils/firebase";
import { v4 } from "uuid";
import { ChannelType, CHANNEL_DB, UserType, USER_DB } from "../utils/constants";
import { useRecoilState } from "recoil";
import { userInfoState } from "../utils/providers";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ChannelModal: FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              <TabPanel>
                <SearchPannel />
              </TabPanel>
              <TabPanel>
                <CreatePanel onClose={onClose} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const CreatePanel: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [channelNm, setChannelNm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const createChannel = () => {
    const uniqueId = v4();
    if (userInfo) {
      setIsLoading(true);
      const channelData: ChannelType = {
        channelId: uniqueId,
        channelNm,
        members: [{ name: userInfo.userName, userId: userInfo.userId }],
        messages: [],
      };
      const userData: UserType = {
        ...userInfo,
        myChannels: [
          ...userInfo.myChannels,
          { channelId: uniqueId, channelName: channelNm },
        ],
      };
      setDoc(doc(FS, CHANNEL_DB, uniqueId), channelData);
      setDoc(doc(FS, USER_DB, userInfo.userId), userData)
        .then((_) => {
          setUserInfo(userData);
        })
        .finally(() => {
          setIsLoading(false);
          onClose();
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

const SearchPannel = () => {
  const [searchTxt, setSearchTxt] = useState("");
  return (
    <>
      <Flex gap={4} flexDirection={"column"}>
        <Input
          placeholder="Search Name"
          value={searchTxt}
          onChange={(e) => setSearchTxt(e.target.value)}
        />
        <Box textAlign="right">
          <Button bg="cyan.200" mr={3} disabled={searchTxt === ""} w="30%">
            Search
          </Button>
        </Box>
      </Flex>
    </>
  );
};
