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
  Text,
} from "@chakra-ui/react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 } from "uuid";
import { ChannelType, UserType } from "../utils/constants";
import { channelConverter, CHANNEL_DB, FS, USER_DB } from "../utils/firebase";
import {
  channelInfoState,
  loginInfoState,
  searchDataState,
  userInfoState,
} from "../utils/providers";

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
              <TabPanel>
                <SearchPanel onClose={ss} />
              </TabPanel>
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

type SearchPanelType = {
  onClose: () => void;
};

const SearchPanel = ({ onClose }: SearchPanelType) => {
  const [searchText, setSearchText] = useState("");
  const [searchData, setSearchData] = useRecoilState(searchDataState);
  const [isSearch, setIsSearch] = useState(false);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [searchResult, setSearchResult] = useState<ChannelType[]>([]);

  useEffect(() => {
    if (searchData.length === 0) {
      getDocs(collection(FS, CHANNEL_DB).withConverter(channelConverter)).then(
        (res) => {
          const arr = res.docs.map((item) => item.data());
          setSearchData(arr);
        }
      );
    }
  }, []);

  const searchChannel = () => {
    setIsSearch(true);
    if (userInfo) {
      const myRoomId = userInfo.myRooms.map((item) => item.id);
      const result = searchData.filter(
        (item) =>
          item.channelNm === searchText && !myRoomId.includes(item.channelId)
      );
      setSearchResult(result);
    }
  };

  const joinChannel = (target: ChannelType) => {
    if (userInfo) {
      const userData: UserType = {
        ...userInfo,
        myRooms: [
          ...userInfo.myRooms,
          { id: target.channelId, name: target.channelNm },
        ],
      };

      const channelData: ChannelType = {
        ...target,
        members: [
          ...target.members,
          { id: userInfo.userId, name: userInfo.userName },
        ],
      };

      setDoc(doc(FS, CHANNEL_DB, target.channelId), channelData);
      setDoc(doc(FS, USER_DB, userInfo.userId), userData).then(() => {
        setUserInfo(userData);
        onClose();
      });
    }
  };

  return (
    <Flex gap={4} flexDirection={"column"}>
      <Input
        placeholder="Channel Name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Box textAlign="right">
        <Button
          bg="cyan.200"
          mr={3}
          onClick={searchChannel}
          disabled={searchText === ""}
          w="30%"
        >
          Search
        </Button>
      </Box>

      {isSearch &&
        searchResult.length > 0 &&
        searchResult.map((item) => (
          <Flex gap={2} alignItems={"center"} key={item.channelId}>
            <Text>{item.channelNm}</Text>
            <Button onClick={() => joinChannel(item)}>JOIN</Button>
          </Flex>
        ))}

      {isSearch && searchResult.length === 0 && <Text>Not Found</Text>}
    </Flex>
  );
};
