import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, Heading, VStack, Button, Text } from "native-base";
import React, { useState } from "react";
import { RootStackParamList, TRegisterForm } from "../../../types";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { formActionCreators } from "../../../redux";
import { State } from "../../../redux/reducers/rootReducer";
import { bindActionCreators } from "redux";
import { Platform } from "react-native";
import { colorSchema } from "../../../constants/Extras";
import { formatDate } from "../../../utils/format";

type EnterDobProps = NativeStackScreenProps<
  RootStackParamList,
  "EnterMoreInfoTwo"
>;

const EnterDob: React.FunctionComponent<EnterDobProps> = ({ navigation }) => {
  const [date, setDate] = useState<Date>(new Date(1598051730000));
  const [error, setError] = useState<string>("not old enough to vote");
  const dispatch = useDispatch();
  const { SetFormInfo } = bindActionCreators(formActionCreators, dispatch);
  const state = useSelector((state: State) => state.registerForm);

  const handleChange = (_: any, val: any) => {
    if (val === undefined) {
      // dismissedAction
      return;
    }

    if (2021 - val.getFullYear() < 18) {
      setError("not old enough to vote");
    } else {
      setError("");
    }

    setDate(val);
    let formattedDate = formatDate(val);
    SetFormInfo({
      ...state,
      dateOfBirth: formattedDate,
    } as TRegisterForm);
  };

  const handlePress = () => {
    navigation.push("BeginVerify");
  };

  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" h="100%">
        <Heading size="2xl" mb={3}>
          and your born date ?
        </Heading>
        <RNDateTimePicker
          themeVariant="light"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          value={date}
          mode="date"
          onChange={handleChange}
        />
        <Text mt={4} color="#FF9494">
          {error ?? ""}
        </Text>

        <Button
          colorScheme={colorSchema}
          w="100%"
          borderRadius="pill"
          position={"absolute"}
          bottom={"20px"}
          mb={5}
          onPress={handlePress}
          disabled={error !== ""}
        >
          continue, your almost done
        </Button>
      </Box>
    </VStack>
  );
};

export default EnterDob;
