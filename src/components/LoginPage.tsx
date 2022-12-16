import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { FA } from "../utils/firebase";
import { loginInfoState } from "../utils/providers";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const loginInfo = useRecoilValue(loginInfoState);

  const login = () => {
    setLoading(true);
    signInWithEmailAndPassword(FA, email, password)
      .then(() => {
        toast({
          title: "success",
          duration: 1000,
          status: "success",
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: error.message,
          duration: 1000,
          status: "error",
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return loginInfo ? (
    <Navigate to={`/dashboard/home`} />
  ) : (
    <Center h="100vh" bg="purple.50">
      <Box bg={"white"} w={"sm"} p={4} borderRadius={"md"} shadow={"md"}>
        <Stack spacing={6} py={4} px={10}>
          <Heading as={"h1"} size={"lg"} textAlign={"center"}>
            Login
          </Heading>
          <Input
            type={"email"}
            placeholder={"email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type={"password"}
            placeholder={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            disabled={email === "" || password === ""}
            isLoading={loading}
            onClick={login}
          >
            Login
          </Button>
          <Link to="/signup">
            <Text size={"xs"} color={"cyan.600"}>
              Create account?
            </Text>
          </Link>
        </Stack>
      </Box>
    </Center>
  );
};
