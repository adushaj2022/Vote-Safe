import React from "react";
import { Box, Heading, VStack, Button, Image, Center } from "native-base";

interface VerifyFailureProps {
  navigation: any;
}

const VerifyFailure: React.FunctionComponent<VerifyFailureProps> = ({
  navigation,
}) => {
  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" h="100%" d="flex" justifyContent="space-between">
        <Heading size="2xl">something seems wrong</Heading>
        <Center>
          <Image
            source={{
              uri: "https://cdn.dribbble.com/users/1401265/screenshots/10990783/media/f66441c1876b287b38f5f74e157bca80.jpg?compress=1&resize=1200x900",
            }}
            alt="X mark"
            size={350}
          />
        </Center>
        <Button
          colorScheme="danger"
          mb={45}
          borderRadius="pill"
          onPress={() => navigation.replace("BeginVerify")}
        >
          try again
        </Button>
      </Box>
    </VStack>
  );
};

export default VerifyFailure;
