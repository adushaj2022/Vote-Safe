import React from "react";
import {
  VStack,
  Box,
  Text,
  ScrollView,
  Pressable,
  Center,
  Image,
} from "native-base";
import ListItemCandidate from "./ListItemCandidate";
import { AdminTabScreenProps, TCandidate } from "../../types";

interface ViewCandidatesProps {
  candidates: Array<TCandidate>;
  navigation: AdminTabScreenProps<"Candidates">;
}

const ViewCandidates: React.FunctionComponent<ViewCandidatesProps> = ({
  candidates,
  navigation,
}) => {
  const showCandidate = (c: TCandidate) => {
    navigation.navigation.push("FullScreenCandidate", { ...c });
  };

  if (candidates.length === 0) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/11030107/media/25be2b86a12dbfd8da02db4cfcbfe50a.jpg?compress=1&resize=1200x900",
          }}
          alt="no candidates"
          size={350}
        />
        <Text> no candidates added just yet</Text>
      </Center>
    );
  }

  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" display="flex" h="100%">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text color="#A8A8A8" w="100%" textAlign="left" my={3}>
            you may click a candidate to learn more about them
          </Text>
          {candidates.map((c, i) => (
            <Pressable onPress={() => showCandidate(c)} key={i}>
              <ListItemCandidate candidate={c} />
            </Pressable>
          ))}
        </ScrollView>
      </Box>
    </VStack>
  );
};

export default ViewCandidates;
