import {
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { GiMechanicalArm } from "react-icons/gi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import { userInfoState } from "../utils/providers";

export const NavContent = ({ onOpen }: { onOpen: () => void }) => {
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
            チャンネル
          </Text>
        </Flex>

        <AiOutlinePlusCircle size={20} onClick={onOpen} />
      </Flex>
      <Box mt={3} ml={3}>
        {userInfo?.myRooms.map((item) => (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            key={item.id}
          >
            <Link to={`/dashboard/${item.id}`}>
              <Text my={2} fontSize="md">
                {`# ${item.name}`}
              </Text>
            </Link>
            <Menu>
              <MenuButton>
                <BsThreeDots />
              </MenuButton>
              <MenuList>
                <MenuItem color="blackAlpha.700" onClick={() => {}}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ))}
      </Box>
    </>
  );
};
