import {
  HStack,
  VStack,
  Text,
  Box,
  Button,
  useToast,
  Center,
  Image,
} from "native-base";
import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { _http } from "../../../api/config";
import CustomSpinner from "../../../components/general/CustomSpinner";
import { address, colorSchema } from "../../../constants/Extras";
import { State } from "../../../redux/reducers/rootReducer";
import { TInvite } from "../../../types";

interface VoterInviteProps {}

const VoterInvite: React.FunctionComponent<VoterInviteProps> = (props) => {
  const { jwtToken, user } = useSelector((state: State) => state.user!);
  const [myInvites, setMyInvites] = useState<TInvite[] | null>(null);
  //const [sid, setSid] = useState<string>("");
  const socketRef = React.useRef<Socket<any, any>>();
  const toast = useToast();

  const fetchInvites = async () => {
    const response = await _http.get("invite/", {
      headers: { authorization: `Token ${jwtToken}` },
    });

    let invites = response.data?.myInvites;
    if (invites) {
      setMyInvites(invites);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await _http.post(
        "invite/reject",
        { id },
        { headers: { authorization: `Token ${jwtToken}` } }
      );
      if (!response.data.error) {
        setMyInvites(myInvites!.filter((inv) => inv.id !== id));
        toast.show({ title: response.data?.message });
      } else {
        toast.show({ title: response.data.error });
      }
    } catch (error) {
      toast.show({ title: "problem rejectng invite" });
    }
  };

  const handleAccept = (iid: number, eid: number) => {
    Alert.alert(
      "are you positive",
      "by accepting you are agreeing to register and join this election",
      [
        {
          text: "cancel",
          onPress: () => {},
          style: "destructive",
        },
        {
          text: "yes",
          onPress: async () => {
            const res = await _http.post(
              "invite/accept",
              { inviteId: iid, electionId: eid },
              { headers: { authorization: `Token ${jwtToken}` } }
            );

            if (!res.data.error) {
              toast.show({
                title: "successfully joined election",
                placement: "bottom-left",
              });
              setMyInvites(myInvites!.filter((inv) => inv.id !== iid));
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchInvites();
    // lets test on wednesday I only have 1 phone :/
    socketRef.current = io(address);

    socketRef.current.on("connect", () => {
      console.log("you just connected to server via a websocket");
    });

    socketRef.current.emit("join_group", user.id);

    socketRef.current.on("invite_notification", (arg: any) => {
      console.log(arg); // should be an invite object that we want, then we add to state
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // data is loading return spinner
  if (myInvites === null) {
    return <CustomSpinner />;
  }

  // server told us we have no invites, return this text
  if (Array.isArray(myInvites) && myInvites.length === 0) {
    return (
      <Center flex={1} bg="#fff">
        <Image
          alt="no invites"
          source={{
            uri: "https://cdn.dribbble.com/users/1121009/screenshots/11030107/media/25be2b86a12dbfd8da02db4cfcbfe50a.jpg?compress=1&resize=1200x900",
          }}
          size={350}
        />
        <Text> you have no invites at the moment</Text>
      </Center>
    );
  }

  // render invites
  return (
    <VStack h="100%" bg="#fff" alignItems="center">
      <Box w="85%" h="100%" mt={3}>
        {myInvites.map((inv, i) => (
          <VStack
            key={i}
            h={"115px"}
            mt={1}
            rounded="xl"
            shadow={1}
            bg="#fff"
            justifyContent="space-around"
            p={2}
            space={3}
          >
            <Text
              bold
              fontSize="lg"
            >{`${inv.inviter.firstName} ${inv.inviter.lastName}`}</Text>
            <Text fontSize="xs" color="gray.700">
              invited you to the{" "}
              <Text italic fontSize="xs" color="gray.700">
                {inv.election.name}
              </Text>
            </Text>
            <HStack>
              <Button
                size="sm"
                mr={2}
                colorScheme={colorSchema}
                onPress={() => handleAccept(inv.id, inv.election.id)}
              >
                accept
              </Button>
              <Button
                size="sm"
                colorScheme="secondary"
                onPress={() => handleReject(inv.id)}
              >
                reject
              </Button>
            </HStack>
          </VStack>
        ))}
      </Box>
    </VStack>
  );
};

export default VoterInvite;
