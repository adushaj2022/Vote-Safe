import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  HStack,
  VStack,
  Text,
  Button,
  Box,
  useToast,
  Center,
} from "native-base";
import React from "react";
import { useSelector } from "react-redux";
import { _http } from "../../api/config";
import { colorSchema } from "../../constants/Extras";
import { State } from "../../redux/reducers/rootReducer";
import { RootStackParamList } from "../../types";
import { formatCamelCase } from "../../utils/format";
import CustomSpinner from "../general/CustomSpinner";

type UserProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "InviteUserProfile"
>;

const UserProfileInvite: React.FunctionComponent<UserProfileProps> = ({
  route,
  navigation,
}) => {
  const info = route.params;
  const electionId = useSelector((state: State) => state.currentElection);
  const { jwtToken } = useSelector((state: State) => state.user!);
  const [inviteStatus, setInviteStatus] = React.useState<boolean | null>(null);

  const toast = useToast();

  React.useEffect(() => {
    if (electionId !== null) {
      fetchInviteStatus();
    }
  }, [electionId]);

  const fetchInviteStatus = async () => {
    try {
      const response = await _http.get(
        `invite/exists?electionId=${electionId}&invitee=${info?.id}`,
        { headers: { authorization: `Token ${jwtToken}` } }
      );
      setInviteStatus(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendInvite = async () => {
    try {
      const response = await _http.post(
        "invite/",
        { electionId, invitee: info?.id },
        { headers: { authorization: `Token ${jwtToken}` } }
      );
      if (response.status === 201) {
        toast.show({
          title: "sent",
          placement: "top",
          description: "successfully sent to user",
          status: "success",
        });
        navigation.pop();
      }
    } catch (error) {
      // error message
    }
  };

  if (electionId === null) {
    return (
      <Center flex={1} bg="#fff">
        <Text>choose an election before inviting</Text>
      </Center>
    );
  } else if (inviteStatus === null) {
    return <CustomSpinner />;
  }

  return (
    <VStack h="100%" bg="#fff" p={5} justifyContent="space-between">
      <Box>
        {Object.entries(info!).map(([key, val], i) => (
          <HStack
            key={i}
            bg="#fff"
            rounded="xl"
            mt={3}
            h={12}
            d="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text mr={2} color="gray.400">
              {formatCamelCase(key)}
            </Text>
            <Text ml={2} bold fontSize="sm">
              {val}
            </Text>
          </HStack>
        ))}
      </Box>
      <Box>
        {/* need to check to see if we invited already */}
        <Text mb={10} color="#A8A8A8">
          by clicking the button below, you are allowing {info?.firstName}{" "}
          {info?.lastName} to participate in your election
        </Text>
        <Button
          mb={45}
          colorScheme={colorSchema}
          onPress={sendInvite}
          disabled={inviteStatus}
        >
          {inviteStatus ? "user already invited" : "invite"}
        </Button>
      </Box>
    </VStack>
  );
};

export default UserProfileInvite;
