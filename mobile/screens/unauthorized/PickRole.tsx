import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Box, VStack, Heading, Text, Pressable } from "native-base";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { _http } from "../../api/config";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { roleActionCreators } from "../../redux";
import { State } from "../../redux/reducers/rootReducer";
import CustomSpinner from "../../components/general/CustomSpinner";

type PickRoleProps = NativeStackScreenProps<RootStackParamList, "PickRole">;

const PickRole: React.FunctionComponent<PickRoleProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { SetRole } = bindActionCreators(roleActionCreators, dispatch);

  const user = useSelector((state: State) => state.user);

  async function fetchRole(token: string) {
    const roleResponse = await _http.get("user/role", {
      headers: { Authorization: `Token ${token}` },
    });
    SetRole(roleResponse.data);
    setLoading(false);
  }

  // check if role is assigned already
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      fetchRole(user!.jwtToken);
    }
    return () => {
      mounted = false;
    };
  }, []);

  const handlePress = (role: string) => {
    Alert.alert("are you sure", `you will be picking the ${role} role`, [
      {
        text: "cancel",
        onPress: () => {},
        style: "destructive",
      },
      {
        text: "yes",
        onPress: async () => {
          const res = await _http.post(
            "user/role",
            { role },
            { headers: { authorization: `token ${user?.jwtToken}` } }
          );
          if (res) {
            SetRole(role as any);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <CustomSpinner />;
  }

  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" d="flex">
        <Heading size="2xl" mb={3}>
          pick your role
        </Heading>
        <Text color="#A8A8A8" w="100%" mt={2}>
          we will only ask this once, this may be changed down the line however
        </Text>
        <Box d="flex" justifyContent="center" h="80%">
          <Pressable
            bg="#fff"
            rounded="xl"
            shadow={1}
            d="flex"
            justifyContent="center"
            alignItems="center"
            flexDir="column"
            h="220px"
            mb={2}
            onPress={() => handlePress("voter")}
          >
            <Text fontSize="4xl" my={2}>
              📩
            </Text>
            <Text mt={3} bold fontSize="2xl">
              vote
            </Text>
            <Text fontSize="xs" my={4}>
              join and participate in elections
            </Text>
          </Pressable>
          <Pressable
            mt={5}
            bg={"#6366f1"}
            rounded="xl"
            h="220px"
            shadow={1}
            d="flex"
            justifyContent="center"
            alignItems="center"
            flexDir="column"
            onPress={() => handlePress("admin")}
          >
            <Text fontSize="4xl" my={2}>
              👤
            </Text>
            <Text mt={3} color="#fff" bold fontSize="2xl">
              administrate
            </Text>
            <Text fontSize="xs" my={4} color="#fff">
              create elections and invite people
            </Text>
          </Pressable>
        </Box>
      </Box>
    </VStack>
  );
};

export default PickRole;
