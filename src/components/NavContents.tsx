import {
  Text,
  Box,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Avatar,
} from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { GiMechanicalArm } from "react-icons/gi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { UserType } from "../utils/constants";
import { userInfoState } from "../utils/providers";

export const NavContent: FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const userInfo = useRecoilValue(userInfoState);

  return (
    <>
      <Flex alignItems="center" gap={2}>
        <Avatar name={userInfo?.userName} size="sm" />
        <Text fontSize="lg" fontWeight="bold" color="whiteAlpha.900">
          {userInfo?.userName}
        </Text>
      </Flex>
      <Flex mt={3} alignItems="center" justifyContent="space-between">
        <Flex>
          <GiMechanicalArm size={20} />
          <Text ml={2} fontSize="md">
            channel
          </Text>
        </Flex>

        <AiOutlinePlusCircle onClick={onOpen} size={20} />
      </Flex>
      <Box mt={3} ml={3}>
        {userInfo?.myChannels.map((item) => (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            key={item.channelId}
          >
            <Link to={`/dashboard/${item.channelId}`}>
              <Text my={2} fontSize="md">
                {item.channelName}
              </Text>
            </Link>
            <Menu>
              <MenuButton>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem color="blackAlpha.700">Delete</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ))}
      </Box>
    </>
  );
};
