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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { auth, database, USER_DB } from "../utils/firebase";
import { loginState } from "../utils/provider";

export const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const loginInfo = useRecoilValue(loginState);

  const toast = useToast();

  const signUp = () => {
    setIsloading(true);
    // PKD userCredential?
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) =>
        setDoc(doc(database, USER_DB, userCredential.user.uid), {
          userId: userCredential.user.uid,
          userName: name,
          myRooms: [],
          // PKD end
        }).then(() =>
          toast({
            title: "Sign up Success",
            status: "success",
            isClosable: true,
            duration: 1000,
          })
        )
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
            Sign Up
          </Button>
          <Link to="/">
            <Text size={"xs"} color="cyan.600">
              Already have an account?
            </Text>
          </Link>
        </Stack>
      </Box>
    </Center>
  );
};
