import React from "react";
import { Box, VStack, Heading, Button, Text, Image } from "native-base";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type WelcomeProps = NativeStackScreenProps<RootStackParamList, "Welcome">;

const Welcome: React.FunctionComponent<WelcomeProps> = ({ navigation }) => {
  const navigateRegister = () => {
    navigation.push("EnterPhoneNumber");
  };

  const navigateLogin = () => {
    navigation.push("Login");
  };

  return (
    <VStack h={"100%"} alignItems="center" bg="#fff">
      <Box
        w="85%"
        d="flex"
        flexDir="column"
        justifyContent="space-between"
        bg="#fff"
        h="100%"
      >
        <Box>
          <Heading size="xl">Welcome to VoteSafe</Heading>
          <Text color="#A8A8A8" w="100%" textAlign="left" mt={5}>
            existing users can login, new users can create a new account.
          </Text>
        </Box>
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/2879528/screenshots/10851119/media/0472040887aee2e3cd1dfee05c5b3d55.png",
          }}
          alt="Check mark"
          size={300}
        />
        <Box mb={45}>
          <Button
            variant="outline"
            colorScheme="blue"
            w="100%"
            borderRadius="pill"
            mb={5}
            onPress={navigateLogin}
          >
            Login
          </Button>
          <Button
            colorScheme="blue"
            w="100%"
            borderRadius="pill"
            onPress={navigateRegister}
          >
            Register
          </Button>
        </Box>
      </Box>
    </VStack>
  );
};

export default Welcome;
