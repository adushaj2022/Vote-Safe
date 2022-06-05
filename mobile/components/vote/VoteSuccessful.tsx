import { Button, Center, Heading, Image } from "native-base";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { colorSchema } from "../../constants/Extras";
import { electionActionCreators } from "../../redux";
import { State } from "../../redux/reducers/rootReducer";
import { VoterTabScreenProps } from "../../types";

type VoteSuccessfulProps = VoterTabScreenProps<"PlaceVote">;

const VoteSuccessful: React.FunctionComponent<VoteSuccessfulProps> = ({
  navigation,
}) => {
  const { user } = useSelector((state: State) => state.user!);
  const electionId = useSelector((state: State) => state.currentElection);

  const { SetCurrentElection } = bindActionCreators(
    electionActionCreators,
    useDispatch()
  );

  React.useEffect(() => {
    let e = electionId;
    SetCurrentElection(null);
    SetCurrentElection(e); // refresh so we can get new data
  }, []);

  return (
    <Center flex={1} bg="#fff">
      <Image
        source={{
          uri: "https://cdn.dribbble.com/users/2330950/screenshots/6128967/media/f2fabefb372f36800c4ed92464cd8ba3.jpg?compress=1&resize=2400x1800",
        }}
        alt="success"
        size={320}
        resizeMode="contain"
      />
      <Heading size="sm" mt={3}>
        thanks for voting {user.username}
      </Heading>
      <Button
        size="sm"
        colorScheme={colorSchema}
        mt={5}
        variant="link"
        onPress={() => navigation.navigate("VoterResults")}
      >
        you can view the results here
      </Button>
    </Center>
  );
};

export default VoteSuccessful;
