import {
  Box,
  Divider,
  useToast,
  VStack,
  Text,
  ScrollView,
  Pressable,
  HStack,
  Center,
  Image,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { _http } from "../../api/config";
import { purple } from "../../constants/Extras";
import { electionActionCreators } from "../../redux";
import { State } from "../../redux/reducers/rootReducer";
import { TElection } from "../../types";
import { formatDate } from "../../utils/format";
import CustomSpinner from "../general/CustomSpinner";

interface VoterPickElectionProps {}

const VoterPickElection: React.FunctionComponent<VoterPickElectionProps> = (
  props
) => {
  const { jwtToken } = useSelector((state: State) => state.user!);
  const electionId = useSelector((state: State) => state.currentElection);
  const { SetCurrentElection } = bindActionCreators(
    electionActionCreators,
    useDispatch()
  );
  const [elections, setElections] = useState<TElection[] | null>(null);
  const toast = useToast();
  const fetchMyElections = async () => {
    try {
      const response = await _http.get("election/registered", {
        headers: { authorization: `Token ${jwtToken}` },
      });
      if (!response.data.error) {
        setElections(response.data.registredElections);
      }
    } catch (error) {
      toast.show({ status: "error", title: "something went wrong" });
    }
  };

  useEffect(() => {
    fetchMyElections();
  }, []);

  if (elections === null) {
    return <CustomSpinner />;
  }

  if (elections.length === 0) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/11006674/media/e38173dbafa13c5a39a6ca2082b1d260.jpg?compress=1&resize=1200x900",
          }}
          alt="no elections"
          size={350}
        />
        <Text mb={20}>you currently arent a part of any elections </Text>
      </Center>
    );
  }

  return (
    <VStack bg="#fff" h="100%" alignItems="center">
      <Box w="85%">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text my={4} color="#A8A8A8">
            here are the list of the elections you are registered for, by
            clicking one one of them you are setting this to your active
            election, meaning all data on the app will be reflecting that
            election.
          </Text>
          {elections.map((e, i) => (
            <Pressable
              border={e.id === electionId ? 3 : 1}
              borderRadius="md"
              borderColor={e.id === electionId ? purple : "#A8A8A8"}
              mt={2}
              key={i}
              onPress={() => SetCurrentElection(e.id)}
            >
              <VStack space={4} divider={<Divider />}>
                <Box px={4} pt={4}>
                  <Text fontSize="lg" bold>
                    {e.name}
                  </Text>
                </Box>
                <Box px={4}>{e.description}</Box>
                <HStack px={4} pb={4}>
                  <Text>
                    {formatDate(new Date(e.openDate))} -{" "}
                    {formatDate(new Date(e.closeDate))}
                  </Text>
                </HStack>
              </VStack>
            </Pressable>
          ))}
        </ScrollView>
      </Box>
    </VStack>
  );
};

export default VoterPickElection;
