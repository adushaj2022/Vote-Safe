import React, { useEffect } from "react";
import {
  VStack,
  Box,
  Heading,
  Radio,
  Center,
  useToast,
  Text,
  Stack,
  Divider,
  Button,
  ScrollView,
  Image,
} from "native-base";
import { colorSchema } from "../../../constants/Extras";
import { TCandidate, TVotePair, VoterTabScreenProps } from "../../../types";
import CustomSpinner from "../../../components/general/CustomSpinner";
import { _http } from "../../../api/config";
import { useSelector } from "react-redux";
import { State } from "../../../redux/reducers/rootReducer";

type PlaceVoteProps = VoterTabScreenProps<"PlaceVote">;

const PlaceVote: React.FunctionComponent<PlaceVoteProps> = ({ navigation }) => {
  const [pairs, setPairs] = React.useState<Object>({});
  const [categorys, setCategories] = React.useState<string[]>([]);
  const [candidates, setCandidates] = React.useState<TCandidate[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [voted, setVoted] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<any>();
  const electionId = useSelector((state: State) => state.currentElection);
  const { jwtToken } = useSelector((state: State) => state.user!);

  const toast = useToast();

  const fetchStatus = async () => {
    try {
      const res = await _http.get(`election/status?electionId=${electionId}`, {
        headers: { authorization: `Token ${jwtToken}` },
      });

      if (res.status === 200) {
        setStatus(res.data.message);
      }
    } catch (error) {
      toast.show({
        title: "problem getting election status",
        placement: "top",
      });
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await _http.get(`candidate?electionId=${electionId}`, {
        headers: { authorization: `Token ${jwtToken}` },
      });
      let electionCandidates = response.data?.electionCandidates;
      if (electionCandidates) {
        setCandidates(electionCandidates);
        setCategories(response.data?.allCategories);
      }
    } catch (error) {
      toast.show({ title: "problem fetching candidates", placement: "top" });
    }
  };

  const didUserVote = async () => {
    try {
      const response = await _http.get(`vote/election?id=${electionId}`, {
        headers: { authorization: `Token ${jwtToken}` },
      });
      setVoted(response.data);
    } catch (error) {
      toast.show({ title: "problem checking vote status" });
    }
  };

  const handleSubmit = async () => {
    let votes = Object.entries(pairs).map(([key, val]) => ({
      election: electionId,
      candidate: val?.cid,
    }));

    try {
      const response = await _http.post(
        "vote/election",
        { votes },
        { headers: { authorization: `Token ${jwtToken}` } }
      );

      if (response.status === 201) {
        setVoted(true);
        navigation.push("VoteSuccessful");
      }
    } catch (error) {
      toast.show({ title: "problem voting" });
    }
  };

  useEffect(() => {
    if (electionId !== null) {
      fetchCandidates();
      fetchStatus();
      didUserVote();
    }
    setLoading(false);
  }, [electionId]);

  if (loading) {
    return (
      <Center flex={1} bg="#fff">
        <CustomSpinner />
      </Center>
    );
  }

  // null checks
  if (electionId === null && !loading) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/11013944/media/55e62cf5e10123ae23a84c411b5d9b6d.jpg?compress=1&resize=1200x900",
          }}
          alt="choose"
          size={350}
        />
        <Text>choose or join an eletion first</Text>
      </Center>
    );
  }

  if (typeof status !== "undefined" && status !== false) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/11019186/media/e1ea72448fbfa0ea1fe335f164c4f764.jpg?compress=1&resize=1200x900",
          }}
          alt="calender"
          size={350}
        />
        <Text>{status}</Text>
      </Center>
    );
  }

  if (!loading && candidates?.length <= 0 && electionId !== null) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/11030107/media/25be2b86a12dbfd8da02db4cfcbfe50a.jpg?compress=1&resize=1200x900",
          }}
          alt="no candidates"
          size={350}
        />
        <Text>this election does not have candidates</Text>
      </Center>
    );
  }

  if (!loading && voted) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/11029924/media/2f128d8bd8ae35cdb720bea43ee19169.jpg?compress=1&resize=1200x900",
          }}
          alt="sorry"
          size={350}
        />
        <Text>you already voted, sorry</Text>
      </Center>
    );
  }

  return (
    <VStack h="100%" bg="#fff" alignItems="center">
      <Box
        w="85%"
        display="flex"
        h="100%"
        mt={1}
        justifyContent="space-between"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box mb={4}>
            {categorys?.map((c, i, u) => {
              return (
                <Stack key={i} space={1}>
                  <Heading size="sm" mb={3} mt={3}>
                    {c}
                  </Heading>
                  <Radio.Group
                    name="exampleGroup"
                    defaultValue="1"
                    accessibilityLabel={`pick a candidate for position ${c}`}
                    onChange={(v) => {
                      let p: TVotePair = { category: c, cid: v };
                      let result: any = { ...pairs };
                      result[c] = p;
                      setPairs(result);
                    }}
                  >
                    {candidates.map((cnd) => {
                      if (cnd["category"] === c) {
                        return (
                          <Radio
                            value={String(cnd.id)}
                            colorScheme={colorSchema}
                            size="md"
                            my={"6px"}
                            key={cnd.id}
                          >
                            {cnd.name}
                          </Radio>
                        );
                      }
                    })}
                  </Radio.Group>
                  {u.length - 1 !== i && <Divider my={1} />}
                </Stack>
              );
            })}
          </Box>
          <Button
            colorScheme={colorSchema}
            my={10}
            onPress={handleSubmit}
            disabled={Object.values(pairs).length === 0}
          >
            place vote
          </Button>
        </ScrollView>
      </Box>
    </VStack>
  );
};

export default PlaceVote;
