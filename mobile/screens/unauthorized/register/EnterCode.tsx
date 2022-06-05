import React from "react";
import { Box, VStack, Heading, Text } from "native-base";
import XCodeField from "../../../components/form/XCodeField";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";

type props = NativeStackScreenProps<RootStackParamList, "EnterCode">;

const EnterCode: React.FunctionComponent<props> = ({ navigation }) => {
  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%">
        <Heading size="2xl" mb={3}>
          enter the code
        </Heading>
        <Text color="#A8A8A8" w="100%" mt={2}>
          a text message has been sent
        </Text>
        <XCodeField navigation={navigation} />
      </Box>
    </VStack>
  );
};

export default EnterCode;
