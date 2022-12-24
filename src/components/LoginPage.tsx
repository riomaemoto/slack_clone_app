import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Text,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FA } from "../utils/firebase";
import { useRecoilValue } from "recoil";
import { loginInfoState } from "../utils/providers";

export const LoginPage = () => {
  const loginInfo = useRecoilValue(loginInfoState);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const login = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(FA, email, password)
      .then((_) => {
        toast({
          status: "success",
          duration: 1000,
          title: "success",
          isClosable: true,
        });
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
            Login
          </Heading>
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
            disabled={email === "" || password === ""}
            isLoading={isLoading}
            onClick={login}
          >
            ログイン
          </Button>
          <Link to={"/signup"}>
            <Text size={"xs"} color="cyan.600">
              アカウントをお持ちでない方
            </Text>
          </Link>
        </Stack>
      </Box>
    </Center>
  );
};
