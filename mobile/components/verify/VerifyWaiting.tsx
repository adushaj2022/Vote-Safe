import React from "react";
import { Box, Heading, VStack, Button, Image, Center } from "native-base";
interface VerifyWaitingProps {}

const VerifyWaiting: React.FunctionComponent<VerifyWaitingProps> = (props) => {
  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" h="100%" d="flex" justifyContent="space-between">
        <Heading size="2xl">waiting for the results, stay patient</Heading>
        <Center>
          <Image
            source={{
              uri: "https://cdn.dribbble.com/users/542205/screenshots/6132257/media/fcd67469a0ee0a51706f4b153d9b8060.jpg?compress=1&resize=1200x900",
            }}
            alt="Check mark"
            size={350}
          />
        </Center>
      </Box>
    </VStack>
  );
};

export default VerifyWaiting;
