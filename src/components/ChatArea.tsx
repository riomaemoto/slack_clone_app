import { Flex, Avatar, Box, Text } from "@chakra-ui/react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { CHANNEL_DB } from "../utils/constants";
import { channelConverter, FS } from "../utils/firebase";
import { channelInfoState } from "../utils/providers";

export const ChatArea = () => {
  const { cbd } = useParams();
  const [channelInfo, setChannelInfo] = useRecoilState(channelInfoState(cbd!));

  useEffect(() => {
    if (cbd) {
      const unsubscribe = onSnapshot(
        doc(FS, CHANNEL_DB, cbd!).withConverter(channelConverter),
        (res) => {
          if (res.exists()) {
            setChannelInfo(res.data());
          }
        }
      );
      return () => unsubscribe();
    }
  }, [cbd]);
  return (
    <>
      {channelInfo?.messages.map((item) => (
        <Box key={item.id} p={2}>
          <Flex alignItems="center" gap={2}>
            <Avatar name={item.messengerNm} size="sm" />
            <Text>{item.messengerNm}</Text>
          </Flex>
          <Text fontWeight="normal" ml={"40px"}>
            {item.content}
          </Text>
        </Box>
      ))}
    </>
  );
};
