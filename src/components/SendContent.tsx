import { Flex, Input, Button } from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { GrSend } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { v4 } from "uuid";
import { ChannelType } from "../utils/constants";
import { CHANNEL_DB, FS } from "../utils/firebase";
import { channelInfoState, userInfoState } from "../utils/providers";

export const SendContent = () => {
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { channel_id } = useParams();
  const channelInfo = useRecoilValue(channelInfoState(channel_id ?? ""));
  const userInfo = useRecoilValue(userInfoState);

  const sendMessage = () => {
    if (channel_id && channelInfo && userInfo) {
      const uuid = v4();

      setIsLoading(true);
      const data: ChannelType = {
        ...channelInfo,
        messages: [
          ...channelInfo.messages,
          {
            messageid: uuid,
            messengerid: userInfo.userId,
            messengerNm: userInfo.userName,
            content: msg,
          },
        ],
      };
      setDoc(doc(FS, CHANNEL_DB, channel_id), data).finally(() => {
        setMsg("");
        setIsLoading(false);
      });
    }
  };
  return (
    <Flex gap={2}>
      <Input
        bg="gray.50"
        placeholder="message..."
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <Button
        bg="cyan.200"
        onClick={sendMessage}
        isLoading={isLoading}
        disabled={channelInfo === null}
      >
        <GrSend />
      </Button>
    </Flex>
  );
};
