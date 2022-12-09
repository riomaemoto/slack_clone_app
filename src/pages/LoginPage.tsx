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
import { useState } from "react";
// PKD
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Link, Navigate } from "react-router-dom";
import { historyState, loginState } from "../utils/provider";
import { useRecoilValue } from "recoil";
// PKD end

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  // PKD
  const loginInfo = useRecoilValue(loginState);
  const historyValue = useRecoilValue(historyState);
  // PKD end
  const toast = useToast();

  const login = () => {
    setIsloading(true);
    // PKD
    signInWithEmailAndPassword(auth, email, password)
      // PKD end
      .then((_) =>
        toast({
          title: "Login success",
          status: "success",
          isClosable: true,
          duration: 1000,
        })
      )
      .catch((error) =>
        toast({
          title: error.message,
          status: "error",
          isClosable: true,
          duration: 1000,
        })
      )
      .finally(() => setIsloading(false));
  };

  return loginInfo ? (
    <Navigate to={`/dashboard/${historyValue || "home"}`} />
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
            isLoading={isLoading}
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
