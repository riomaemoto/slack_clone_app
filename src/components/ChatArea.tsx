import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { channelConverter, CHANNEL_DB, FS } from "../utils/firebase";
import { channelInfoState } from "../utils/providers";

export const ChatArea = () => {
  const { channel_id } = useParams();
  const [channelInfo, setChannelInfo] = useRecoilState(
    channelInfoState(channel_id ?? "")
  );

  useEffect(() => {
    if (channel_id) {
      const unsub = onSnapshot(
        doc(FS, CHANNEL_DB, channel_id).withConverter(channelConverter),
        (res) => {
          if (res.exists()) {
            setChannelInfo(res.data());
          }
        }
      );

      return () => unsub();
    }
  }, [channel_id]);

  return (
    <Box h="680px" overflow="scroll">
      {channelInfo && (
        <>
          {channelInfo.messages.map((item) => (
            <Box p={2} key={item.messageid}>
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
      )}
    </Box>
  );
};
