import { VStack, Box, Input, Button, Stack, ScrollView } from "native-base";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import { bindActionCreators } from "redux";
import { _http } from "../../../api/config";
import CustomSpinner from "../../../components/general/CustomSpinner";
import { colorSchema, inputVariant } from "../../../constants/Extras";
import {
  electionActionCreators,
  roleActionCreators,
  userActionCreators,
} from "../../../redux";
import { State } from "../../../redux/reducers/rootReducer";
import { STUser, TProfile } from "../../../types";

interface ProfileProps {}

const Profile: React.FunctionComponent<ProfileProps> = (props) => {
  const [profile, setProfile] = useState<TProfile | null>(null);
  const dispatch = useDispatch();
  const { LogoutUser } = bindActionCreators(userActionCreators, dispatch);
  const { SetRole } = bindActionCreators(roleActionCreators, dispatch);
  const role = useSelector((state: State) => state.role);
  const { SetCurrentElection } = bindActionCreators(
    electionActionCreators,
    dispatch
  );

  const { jwtToken } = useSelector((state: State) => state.user as STUser);

  useEffect(() => {
    async function fetchUserProfile() {
      const response = await _http.get("/user/profile", {
        headers: { authorization: `Token ${jwtToken}` },
      });
      setProfile(response.data);
    }

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    SetCurrentElection(null);
    SetRole(null);
    LogoutUser();
  };

  async function switchRole() {
    try {
      let switchedValue = role === "voter" ? "admin" : "voter";

      await _http.post(
        "/user/role",
        { role: switchedValue },
        { headers: { Authorization: `Token ${jwtToken}` } }
      );
      SetCurrentElection(null);
      SetRole(switchedValue as any);
    } catch (error) {
      console.log(error);
    }
  }

  const handlePress = () => {
    let switchedValue = role === "voter" ? "admin" : "voter";

    Alert.alert(
      "are you sure",
      `you will be switching to the ${switchedValue} role`,
      [
        {
          text: "cancel",
          onPress: () => {},
          style: "destructive",
        },
        {
          text: "yes",
          onPress: switchRole,
        },
      ]
    );
  };

  if (profile === null) {
    return <CustomSpinner />;
  }

  return (
    <VStack h="100%" bg="#fff" alignItems="center">
      <Box
        w="85%"
        display="flex"
        h="100%"
        mt={5}
        justifyContent="space-between"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Stack space={"xl"}>
            <Input
              isDisabled={true}
              value={profile.username}
              variant={inputVariant}
            />

            <Input
              value={profile.firstName}
              isDisabled={true}
              variant={inputVariant}
            />

            <Input
              isDisabled={true}
              value={profile.lastName}
              variant={inputVariant}
            />

            <Input
              isDisabled={true}
              value={profile.dateOfBirth}
              variant={inputVariant}
            />

            <Input
              isDisabled={true}
              value={profile.state}
              variant={inputVariant}
            />

            <Input
              isDisabled={true}
              value={profile.city}
              variant={inputVariant}
            />

            <Input
              isDisabled={true}
              value={profile.address}
              variant={inputVariant}
            />
          </Stack>
          <Button
            colorScheme="info"
            my={5}
            variant="outline"
            onPress={handlePress}
          >
            switch role
          </Button>
          <Button colorScheme={colorSchema} mb={2} onPress={handleLogout}>
            logout
          </Button>
        </ScrollView>
      </Box>
    </VStack>
  );
};

export default Profile;
