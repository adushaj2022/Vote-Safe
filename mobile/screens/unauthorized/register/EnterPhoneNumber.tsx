import React, { useEffect, createRef, useState } from "react";
import { Box, VStack, Heading, Input, Text } from "native-base";
import { InteractionManager } from "react-native";
import { RootStackParamList, TRegisterForm } from "../../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { _http } from "../../../api/config";
import KeyboardButton from "../../../components/form/KeyboardButton";
import { useDispatch, useSelector } from "react-redux";
import { formActionCreators } from "../../../redux";
import { bindActionCreators } from "redux";
import { State } from "../../../redux/reducers/rootReducer";

type props = NativeStackScreenProps<RootStackParamList, "EnterPhoneNumber">;

const inputRef = createRef<any>();

const EnterPhoneNumber: React.FunctionComponent<props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { SetFormInfo } = bindActionCreators(formActionCreators, dispatch);
  const state = useSelector((state: State) => state.registerForm);
  const [pNumber, setPNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      inputRef.current.focus();
    });
  }, []);

  const handlePress = async () => {
    // TODO: Wrap in try catch, maybe even move api logic into a new folder
    let formatted =
      pNumber[0] === "+" ? pNumber.substring(2).trim() : pNumber.trim();
    const response = await _http.post("/sms/send-code", {
      phoneNumber: formatted,
    });

    if (response.status === 201) {
      SetFormInfo({ ...state, phoneNumber: formatted } as TRegisterForm);
      navigation.push("EnterCode");
    } else {
      setErrorMessage("invalid input");
    }
  };
  return (
    <VStack h={"100%"} bg={"#fff"} alignItems="center">
      <Box w="85%" d="flex" flexDir="column" h="100%">
        <Box>
          <Heading size="2xl">my number is</Heading>
          <Input
            mt={4}
            ref={inputRef}
            variant="underlined"
            placeholder="(XXX)-XXX-XXXX"
            textContentType="telephoneNumber"
            borderBottomWidth="2px"
            dataDetectorTypes="phoneNumber"
            keyboardType="numeric"
            onChangeText={(val) => {
              setPNumber(val); // local state
            }}
            _light={{
              placeholderTextColor: "blueGray.400",
              borderBottomColor: "#6366f1",
            }}
            _dark={{
              placeholderTextColor: "blueGray.50",
            }}
          />
          <Text color="#A8A8A8" w="100%" textAlign="left" mt={7}>
            a verification text will be sent, by continuing you agree to receive
            message and data rates from the operator
          </Text>
          <Text mt={4} color="#FF9494">
            {errorMessage ?? ""}
          </Text>
        </Box>

        <KeyboardButton
          disabledBool={pNumber.length !== 10 && pNumber[0] !== "+"}
          handlePress={handlePress}
        />
      </Box>
    </VStack>
  );
};

export default EnterPhoneNumber;
