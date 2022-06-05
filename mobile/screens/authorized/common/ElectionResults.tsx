import {
  VStack,
  Box,
  Center,
  Text,
  CheckIcon,
  Select,
  Image,
} from "native-base";
import React from "react";
import { useSelector } from "react-redux";
import { _http } from "../../../api/config";
import CustomSpinner from "../../../components/general/CustomSpinner";
import ChartResults from "../../../components/vote/ChartResults";
import { inputVariant, purple } from "../../../constants/Extras";
import { State } from "../../../redux/reducers/rootReducer";
import { TResultVote } from "../../../types";

interface VoterResultsProps {}

const VoterResults: React.FunctionComponent<VoterResultsProps> = (props) => {
  const electionId = useSelector((state: State) => state.currentElection);
  const { jwtToken } = useSelector((state: State) => state.user!);
  const [electionData, setElectionData] = React.useState<any>(null);
  const [results, setResults] = React.useState<TResultVote[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [categories, setCategories] = React.useState<Array<string>>([]);
  const [chosenCategory, setChosenCategory] = React.useState<string | null>(
    null
  );

  function getWinner(): string[] {
    const res = [...results];
    res.sort((b, a) => a.votes - b.votes);
    let ans: any[] = [];
    let current;
    let max = res[0].votes;
    while ((current = res.shift())) {
      if (current.votes == max) {
        ans.push(current.name);
      }
    }

    return ans;
  }

  async function fetchElection() {
    try {
      const response = await _http.get(`/election?electionId=${electionId}`, {
        headers: { authorization: `Token ${jwtToken}` },
      });

      if (response.data) {
        setElectionData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getCategories(): Promise<void> {
    try {
      const response = await _http.get(`candidate?electionId=${electionId}`, {
        headers: { authorization: `Token ${jwtToken}` },
      });

      if (response.status === 200) {
        setCategories(response.data.allCategories);
        setChosenCategory(response.data.allCategories[0] ?? "");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getResults(): Promise<void> {
    try {
      const response = await _http.get(
        `election/results?id=${electionId}&category=${
          chosenCategory || categories[0]
        }`,
        {
          headers: { authorization: `Token ${jwtToken}` },
        }
      );

      if (response.status === 200) {
        setResults(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (electionId !== null) {
      getResults();
      setLoading(false);
    }
  }, [electionId, chosenCategory]);

  React.useEffect(() => {
    if (electionId !== null) {
      getCategories();
      fetchElection();
    }
  }, [electionId]);

  // null checks
  if (electionId === null) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/10991204/media/46dcb7c63a19f9ea29e548f7275dde04.jpg?compress=1&resize=1200x900",
          }}
          alt="choose"
          size={350}
        />
        <Text>sorry please choose an election first</Text>
      </Center>
    );
  }

  if (loading) {
    return <CustomSpinner />;
  }

  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" h="100%" mt={7}>
        <Select
          selectedValue={chosenCategory as any}
          minWidth="200px"
          accessibilityLabel="Choose Category"
          placeholder="Choose Result Category"
          variant={inputVariant}
          _selectedItem={{
            bg: purple,
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          mb={4}
          onValueChange={(itemValue) => setChosenCategory(itemValue)}
        >
          {categories.map((cat, i) => (
            <Select.Item key={i} label={cat} value={cat} />
          ))}
        </Select>
        {results.length === 0 && !loading ? (
          <Center flex={1} bg="#fff" mb={20}>
            <Image
              source={{
                uri: "https://cdn.dribbble.com/users/1121009/screenshots/11019180/media/3577d041d282b7d0e9ba85236c65e540.jpg?compress=1&resize=1200x900",
              }}
              alt="sorry"
              size={350}
            />
            <Text>no one has voted in this election yet</Text>
          </Center>
        ) : (
          <Center w="100%">
            <ChartResults chartData={results} />
            {electionData &&
            Date.parse(electionData?.closeDate) >
              new Date().valueOf() ? null : (
              <Box>
                the winner is ..
                <Box mt={4}>
                  {getWinner().map((winner, i) => (
                    <Text bold key={i}>
                      {winner + "  \n"}
                    </Text>
                  ))}
                </Box>
              </Box>
            )}
          </Center>
        )}
      </Box>
    </VStack>
  );
};

export default VoterResults;
