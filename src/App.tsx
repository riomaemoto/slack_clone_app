import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FA } from "./utils/firebase";
import { useSetRecoilState } from "recoil";
import { loginInfoState } from "./utils/providers";
import { Center, Spinner } from "@chakra-ui/react";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setLoginInfo = useSetRecoilState(loginInfoState);
  useEffect(() => {
    setIsLoading(true);
    const unsub = onAuthStateChanged(FA, (res) => {
      setIsLoading(false);
      if (res) {
        setLoginInfo(res.uid);
      } else {
        setLoginInfo(null);
      }
    });
    return () => unsub();
  }, []);
  return (
    <BrowserRouter>
      {isLoading ? (
        <Center h={"100vh"}>
          <Spinner />
        </Center>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/:channel_id" element={<Dashboard />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
