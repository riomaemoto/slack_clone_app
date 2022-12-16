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
  Text,
  Tabs,
} from "@chakra-ui/react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { channelConverter, FA, FS } from "../utils/firebase";
import { v4 } from "uuid";
import { ChannelType, CHANNEL_DB, UserType, USER_DB } from "../utils/constants";
import { useRecoilState } from "recoil";
import { searchInfoState, userInfoState } from "../utils/providers";

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
                <SearchPannel onClose={onClose} />
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

const SearchPannel: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [searchTxt, setSearchTxt] = useState("");
  const [filterArr, setFilterArr] = useState<ChannelType[]>([]);
  const [searchInfo, setSearchInfo] = useRecoilState(searchInfoState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  useEffect(() => {
    getDocs(collection(FS, CHANNEL_DB).withConverter(channelConverter)).then(
      (res) => {
        const items = res.docs.map((item) => item.data());
        setSearchInfo(items);
      }
    );
  }, []);

  const searchChannel = () => {
    const searching = searchInfo.filter((item) => item.channelNm === searchTxt);
    setFilterArr(searching);
  };

  const joinChannel = (channel: ChannelType) => {
    if (userInfo) {
      const userData: UserType = {
        ...userInfo,
        myChannels: [
          ...userInfo.myChannels,
          {
            channelId: channel.channelId,
            channelName: channel.channelNm,
          },
        ],
      };

      const channelData: ChannelType = {
        ...channel,
        members: [
          ...channel.members,
          { name: userInfo.userName, userId: userInfo.userId },
        ],
      };

      setDoc(doc(FS, CHANNEL_DB, channel.channelId), channelData);
      setDoc(doc(FS, USER_DB, userInfo.userId), userData).then((_) => {
        setUserInfo(userData);
        onClose();
      });
    }
  };

  const isSameChannel = (id: string) => {
    if (userInfo) {
      const isSame = userInfo.myChannels.find((item) => item.channelId === id);
      return isSame ? true : false;
    }
    return true;
  };

  return (
    <>
      <Flex gap={4} flexDirection={"column"}>
        <Input
          placeholder="Search Name"
          value={searchTxt}
          onChange={(e) => setSearchTxt(e.target.value)}
        />
        <Box textAlign="right">
          <Button
            onClick={searchChannel}
            bg="cyan.200"
            mr={3}
            disabled={searchTxt === ""}
            w="30%"
          >
            Search
          </Button>
        </Box>
        {filterArr.map((item) => (
          <Flex align={"center"} gap={3}>
            <Text>{item.channelNm}</Text>
            <Button
              disabled={isSameChannel(item.channelId)}
              onClick={() => joinChannel(item)}
            >
              Join
            </Button>
          </Flex>
        ))}
      </Flex>
    </>
  );
};
