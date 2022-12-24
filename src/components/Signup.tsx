import {
  Center,
  Box,
  Stack,
  Heading,
  Input,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FA, FS, USER_DB } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { UserType } from "../utils/constants";
import { useRecoilValue } from "recoil";
import { loginInfoState } from "../utils/providers";

export const Signup = () => {
  const loginInfo = useRecoilValue(loginInfoState);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const signUp = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(FA, email, password)
      .then((res) => {
        toast({
          status: "success",
          duration: 1000,
          title: "success",
          isClosable: true,
        });
        const userData: UserType = {
          userId: res.user.uid,
          userName: name,
          myRooms: [],
        };
        setDoc(doc(FS, USER_DB, res.user.uid), userData);
      })
      .catch((error) => {
        toast({
          status: "error",
          duration: 1000,
          title: error.message,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return loginInfo ? (
    <Navigate to={"/dashboard"} />
  ) : (
    <Center h="100vh" bg="purple.50">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Stack spacing={6} py={4} px={10}>
          <Heading as="h1" size="lg" textAlign="center">
            Sign Up
          </Heading>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            disabled={email === "" || password === "" || name === ""}
            isLoading={isLoading}
            onClick={signUp}
          >
            サインアップ
          </Button>
          <Link to="/">
            <Text size={"xs"} color="cyan.600">
              既にアカウントをお持ちの方
            </Text>
          </Link>
        </Stack>
      </Box>
    </Center>
  );
};
