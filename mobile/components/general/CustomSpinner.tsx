import React from "react";
import { Spinner, HStack, Heading, Center } from "native-base";
import { purple } from "../../constants/Extras";

const CustomSpinner: React.FunctionComponent = () => {
  return (
    <Center flex={1} px="3">
      <HStack space={2} alignItems="center">
        <Spinner accessibilityLabel="Loading posts" color={purple} />
        <Heading color={purple} fontSize="md">
          Loading
        </Heading>
      </HStack>
    </Center>
  );
};

export default CustomSpinner;
