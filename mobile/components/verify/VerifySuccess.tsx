import { Box, Heading, VStack, Button, Image, Center } from "native-base";
import React from "react";
import { colorSchema } from "../../constants/Extras";

interface VerifySuccessProps {
  navigation: any; // Still need to get proper types for this
}

const VerifySuccess: React.FunctionComponent<VerifySuccessProps> = ({
  navigation,
}) => {
  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" h="100%" d="flex" justifyContent="space-between">
        <Heading size="2xl">congratulations, you are now verified</Heading>
        <Center>
          <Image
            source={{
              uri: "https://cdn.dribbble.com/users/77121/screenshots/4803058/media/bb27e8ee905f52ecb51930f198f0682f.png?compress=1&resize=800x600",
            }}
            alt="Check mark"
            size={350}
          />
        </Center>
        <Button
          colorScheme={colorSchema}
          mb={45}
          borderRadius="pill"
          onPress={() => navigation.push("CreateLogin")}
        >
          create a login
        </Button>
      </Box>
    </VStack>
  );
};

export default VerifySuccess;
