import { Center, Image } from "native-base";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { _http } from "../../../api/config";
import ViewCandidates from "../../../components/candidate/ViewCandidates";
import CustomSpinner from "../../../components/general/CustomSpinner";
import { address } from "../../../constants/Extras";
import { State } from "../../../redux/reducers/rootReducer";
import { AdminTabScreenProps, TCandidate } from "../../../types";

type CandidatesProps = AdminTabScreenProps<"Candidates">;

const Candidates: React.FunctionComponent<CandidatesProps> = (props) => {
  const electionId = useSelector((state: State) => state.currentElection);
  const user = useSelector((state: State) => state.user);
  const role = useSelector((state: State) => state.role);

  const [loading, setLoading] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<TCandidate[]>([]);

  async function fetchCandidates() {
    if (electionId === null) {
      setLoading(false);
      return;
    }
    const response = await _http.get(
      `${address}candidate?electionId=${electionId}`,
      { headers: { authorization: `Token ${user?.jwtToken}` } }
    );
    setCandidates(response.data.electionCandidates);
    setLoading(false);
  }

  useEffect(() => {
    fetchCandidates();
  }, [electionId]);

  if (electionId !== 0 && !electionId) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/10991265/media/f10858fef67504c0342a664ce136abef.jpg?compress=1&resize=1200x900",
          }}
          alt="guy waiting"
          size={350}
        />
        <Text>
          try {role === "admin" ? "creating or selecting " : "joining "}
          an election first
        </Text>
      </Center>
    );
  }

  if (loading) {
    return <CustomSpinner />;
  }

  return <ViewCandidates candidates={candidates} navigation={props} />;
};

export default Candidates;
