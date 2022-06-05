import React, { useEffect, createRef, useState } from "react";
import { Box, VStack, Heading, Input, Text, FormControl } from "native-base";
import { RootStackParamList } from "../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { _http } from "../../api/config";
import KeyboardButton from "../../components/form/KeyboardButton";
import { useDispatch } from "react-redux";
import { userActionCreators } from "../../redux";
import { bindActionCreators } from "redux";
import { inputFocusColor } from "../../constants/Extras";

type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;

const usernameRef = createRef<any>();

const Login: React.FunctionComponent<LoginProps> = ({ navigation }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setError] = useState<string>("");

  const dispatch = useDispatch();
  const { LoginUser } = bindActionCreators(userActionCreators, dispatch);

  const handleSubmit = async () => {
    try {
      const response = await _http.post("user/login", {
        username,
        password,
      });
      if (response.data?.error) {
        setError(response.data.error);
      } else {
        LoginUser(response.data);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    usernameRef.current.focus();
  }, []);
  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" display="flex" h="100%">
        <Box>
          <Heading size="2xl" mb={3}>
            welcome back 👋
          </Heading>
          <FormControl>
            <Input
              ref={usernameRef}
              keyboardType="ascii-capable"
              placeholder="username"
              mt={3}
              variant="filled"
              value={username}
              isInvalid={errorMessage !== ""}
              autoCapitalize={"none"}
              autoCorrect={false}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => setUsername(val)}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="password"
              mt={3}
              variant="filled"
              secureTextEntry
              value={password}
              isInvalid={errorMessage !== ""}
              autoCapitalize={"none"}
              autoCorrect={false}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => setPassword(val)}
            />
          </FormControl>
          <Text
            color="#A8A8A8"
            w="100%"
            mt={3}
            onPress={() => navigation.push("EnterPhoneNumber")}
          >
            if you do not have an account you can register{" "}
            <Text color="#0000EE">here</Text>
          </Text>
          <Text mt={4} color="#FF9494">
            {errorMessage ?? ""}
          </Text>
        </Box>
        <KeyboardButton
          disabledBool={username.length < 2 || password.length < 2}
          handlePress={handleSubmit}
          buttonTitle="login"
        />
      </Box>
    </VStack>
  );
};

export default Login;
