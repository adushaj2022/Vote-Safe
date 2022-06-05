import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, Heading, VStack, Image, Center, Button } from "native-base";
import React from "react";
import { _http } from "../../../api/config";
import { RootStackParamList } from "../../../types";

type BeginVerifyScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "BeginVerify"
>;

const BeginVerifyScreen: React.FunctionComponent<BeginVerifyScreenProps> = ({
  navigation,
}) => {
  const handlePress = async () => {
    const response = await _http.post("/verify/session");
    navigation.push("Modal", { webvViewUri: response.data });
  };
  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" h="100%" d="flex" justifyContent="space-between">
        <Heading size="2xl">lets begin the verification process</Heading>
        <Center>
          <Image
            source={{
              uri: "https://cdn.dribbble.com/users/1641270/screenshots/9715226/media/cce7e1de839ae647be307b521341ad2e.png?compress=1&resize=1200x900",
            }}
            alt="Picture of cartoon person"
            size={350}
          />
        </Center>
        <Button
          colorScheme="info"
          mb={45}
          borderRadius="pill"
          onPress={handlePress}
        >
          start
        </Button>
      </Box>
    </VStack>
  );
};

export default BeginVerifyScreen;
