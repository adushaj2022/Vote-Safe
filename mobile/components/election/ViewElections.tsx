import React, { useEffect, useState } from "react";
import {
  Center,
  Stack,
  Select,
  CheckIcon,
  Text,
  Box,
  Image,
  VStack,
} from "native-base";
import { inputVariant, purple } from "../../constants/Extras";
import moment from "moment";
import { _http } from "../../api/config";
import { TElection } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { electionActionCreators } from "../../redux";
import { bindActionCreators } from "redux";
import { State } from "../../redux/reducers/rootReducer";

interface ElectionProps {
  elections: Array<TElection>;
}

const ViewElections = ({ elections }: ElectionProps) => {
  const [current, setCurrent] = useState<any>("");
  const [myElection, setMyElection] = useState<any>({});
  const electionId = useSelector((state: State) => state.currentElection);
  const dispatch = useDispatch();
  const { SetCurrentElection } = bindActionCreators(
    electionActionCreators,
    dispatch
  );

  useEffect(() => {
    setCurrent(electionId + "");
  }, []);

  if (!elections || elections.length === 0) {
    return (
      <Center flex={1}>
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/11006669/media/56f2f709fc3a26495ad78f9248defae4.jpg?compress=1&resize=1200x900",
          }}
          size={350}
          alt="create"
        />
        <Text mb={20}>no elections try creating one</Text>
      </Center>
    );
  }

  function getElectionDetails(id: string) {
    let currDetails;
    for (let election of elections) {
      if (String(election.id) === id) {
        currDetails = election;
      }
    }
    setMyElection({ ...currDetails });
  }

  return (
    <Stack flex={1}>
      <Select
        mx={3}
        mt={5}
        selectedValue={current}
        minWidth="200px"
        accessibilityLabel="Choose Service"
        placeholder="Choose Election"
        variant={inputVariant}
        _selectedItem={{
          bg: purple,
          endIcon: <CheckIcon size="5" />,
        }}
        onValueChange={async (itemValue) => {
          setCurrent(itemValue);
          SetCurrentElection(Number(itemValue));
          getElectionDetails(itemValue);
        }}
      >
        {elections.map((election) => (
          <Select.Item
            label={election.name}
            value={String(election.id)}
            key={election.id}
          />
        ))}
      </Select>
      {JSON.stringify(myElection) !== "{}" && (
        <Center>
          <VStack
            w="95%"
            mt={5}
            rounded="xl"
            shadow={1}
            bg="#fff"
            justifyContent="space-around"
            p={5}
            space={3}
          >
            <Text my={1}>
              <Text bold>open date: </Text> {myElection["openDate"]}
            </Text>
            <Text my={1}>
              <Text bold>close date:</Text> {myElection["closeDate"]}
            </Text>
            <Text my={1}>
              <Text bold>description:</Text> {myElection["description"]}
            </Text>
          </VStack>
        </Center>
      )}
    </Stack>
  );
};

export default ViewElections;
