import React, { useEffect, createRef, useState } from "react";
import { Box, VStack, Heading, Input, Text, FormControl } from "native-base";
import { TRegisterForm } from "../../../types";
import { _http } from "../../../api/config";
import KeyboardButton from "../../../components/form/KeyboardButton";
import { useDispatch, useSelector } from "react-redux";
import { formActionCreators, userActionCreators } from "../../../redux";
import { bindActionCreators } from "redux";
import { inputFocusColor, inputVariant } from "../../../constants/Extras";
import { State } from "../../../redux/reducers/rootReducer";

const usernameRef = createRef<any>();

const CreateLogin: React.FunctionComponent = ({}) => {
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [errorMessage, setError] = useState<string>("");

  const dispatch = useDispatch();
  const { LoginUser } = bindActionCreators(userActionCreators, dispatch);
  const { SetFormInfo } = bindActionCreators(formActionCreators, dispatch);
  const state = useSelector((state: State) => state.registerForm);

  const handleSubmit = async () => {
    try {
      const response = await _http.post("user/register", {
        ...state,
      });

      if (response.data?.error) {
        setError(response.data.error);
      } else {
        LoginUser(response.data);
      }
    } catch (error) {
      // this might be a network error or something along those lines
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
            create a login 🔒
          </Heading>
          <Text color="#A8A8A8" w="100%" my={2}>
            login to continue
          </Text>
          <FormControl>
            <Input
              ref={usernameRef}
              keyboardType="ascii-capable"
              placeholder="username"
              mt={3}
              variant="filled"
              autoCapitalize={"none"}
              autoCorrect={false}
              isInvalid={errorMessage !== ""}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => {
                SetFormInfo({ ...state, username: val } as TRegisterForm);
              }}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="password"
              mt={3}
              variant={inputVariant}
              secureTextEntry
              value={password}
              autoCapitalize={"none"}
              autoCorrect={false}
              isInvalid={errorMessage !== ""}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => {
                setPassword(val);
                SetFormInfo({ ...state, password: val } as TRegisterForm);
              }}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="confirm password"
              mt={3}
              variant={inputVariant}
              secureTextEntry
              value={password2}
              autoCapitalize={"none"}
              autoCorrect={false}
              isInvalid={errorMessage !== ""}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => {
                setPassword2(val);
                if (val !== password) {
                  setError("passwords do not match");
                } else {
                  setError("");
                }
              }}
            />
          </FormControl>
          <Text mt={4} color="#FF9494">
            {errorMessage ?? ""}
          </Text>
        </Box>
        <KeyboardButton
          disabledBool={
            state!?.username.length < 2 ||
            password.length < 2 ||
            password !== password2
          }
          handlePress={handleSubmit}
          buttonTitle="login"
        />
      </Box>
    </VStack>
  );
};

export default CreateLogin;
