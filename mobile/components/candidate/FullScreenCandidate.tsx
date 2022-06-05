import React from "react";
import { VStack, Text, Center, Image, Heading, Divider } from "native-base";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { address } from "../../constants/Extras";

type FullScreenCandidateProps = NativeStackScreenProps<
  RootStackParamList,
  "FullScreenCandidate"
>;

const FullScreenCandidate: React.FunctionComponent<FullScreenCandidateProps> =
  ({ route }) => {
    const { description, id, imgUrl, name, party, category } = route.params!;

    return (
      <VStack h="100%" bg="#fff">
        <Center mt={3}>
          <Text marginTop={1} mb={4} fontSize="lg" bold textAlign="center">
            {name}
          </Text>
          <Image
            alt="book"
            size={210}
            borderRadius={10}
            resizeMode={"contain"}
            source={{
              uri: `${address}static/${imgUrl}`,
            }}
          />

          <Divider my="25px" />
        </Center>
        <Heading size="md" my={4} ml={3}>
          category
        </Heading>
        <Text px={3} fontWeight="400" mb={2}>
          {category.toLowerCase()}
        </Text>
        <Heading size="md" my={4} ml={3}>
          description
        </Heading>
        <Text px={3} fontWeight="400">
          {description.toLowerCase()}
        </Text>
      </VStack>
    );
  };

export default FullScreenCandidate;
