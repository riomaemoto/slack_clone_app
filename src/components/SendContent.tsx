import { Button, Flex, Input } from "@chakra-ui/react";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { GrSend } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { v4 } from "uuid";
import { ChannelType, CHANNEL_DB } from "../utils/constants";
import { FS } from "../utils/firebase";
import { channelInfoState, userInfoState } from "../utils/providers";

export const SendContent = () => {
  const [sendTxt, setSendtxt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { cbd } = useParams();
  const channelInfo = useRecoilValue(channelInfoState(cbd!));
  const userInfo = useRecoilValue(userInfoState);
  const send = () => {
    if (userInfo && channelInfo) {
      setIsLoading(true);
      const channelData: ChannelType = {
        ...channelInfo,
        messages: [
          ...channelInfo.messages,
          {
            id: v4(),
            messengerId: userInfo.userId,
            messengerNm: userInfo.userName,
            content: sendTxt,
          },
        ],
      };
      setSendtxt("");
      setDoc(doc(FS, CHANNEL_DB, cbd!), channelData).finally(() => {
        setIsLoading(false);
      });
    }
  };
  return (
    <Flex gap={2}>
      <Input
        bg="gray.50"
        placeholder="message..."
        value={sendTxt}
        onChange={(e) => setSendtxt(e.target.value)}
      />
      <Button
        disabled={channelInfo === null || sendTxt === ""}
        bg="cyan.200"
        onClick={send}
        isLoading={isLoading}
      >
        <GrSend />
      </Button>
    </Flex>
  );
};
