/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ColorSchemeName, Text } from "react-native";

import EnterCode from "../screens/unauthorized/register/EnterCode";
import EnterPhoneNumber from "../screens/unauthorized/register/EnterPhoneNumber";
import ModalScreen from "../screens/unauthorized/verification/IdModalScreen";
import NotFoundScreen from "../screens/common/NotFoundScreen";
import EnterAddress from "../screens/unauthorized/register/EnterAddress";
import EnterName from "../screens/unauthorized/register/EnterName";
import {
  RootStackParamList,
  AdminTabParamList,
  VoteTabParamList,
  AdminTabScreenProps,
  VoterTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import EnterDob from "../screens/unauthorized/register/EnterDob";
import BeginVerifyScreen from "../screens/unauthorized/verification/BeginVerifyScreen";
import ThankYouScreen from "../screens/unauthorized/verification/ThankYouScreen";
import Welcome from "../screens/unauthorized/Welcome";
import Login from "../screens/unauthorized/Login";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import {
  electionActionCreators,
  roleActionCreators,
  userActionCreators,
} from "../redux";
import { State } from "../redux/reducers/rootReducer";
import * as SecureStore from "expo-secure-store";
import { _http } from "../api/config";
import CustomSpinner from "../components/general/CustomSpinner";
import CreateLogin from "../screens/unauthorized/register/CreateLogin";
import PickRole from "../screens/unauthorized/PickRole";
import Profile from "../screens/authorized/common/Profile";
import Candidates from "../screens/authorized/common/Candidates";
import Election from "../screens/authorized/admin/Election";
import AdminInvite from "../screens/authorized/admin/AdminInvite";
import { purple } from "../constants/Extras";
import VoterResults from "../screens/authorized/common/ElectionResults";
import VoterInvite from "../screens/authorized/voter/VoterInvite";
import PlaceVote from "../screens/authorized/voter/PlaceVote";
import { Heading, Pressable } from "native-base";
import AddCandidate from "../components/candidate/AddCandidate";
import FullScreenCandidate from "../components/candidate/FullScreenCandidate";
import UserProfileInvite from "../components/profile/UserProfileInvite";
import VoterPickElection from "../components/election/VoterPickElection";
import jwtDecode from "jwt-decode";
import VoteSuccessful from "../components/vote/VoteSuccessful";
import ManageInvites from "../components/election/ManageInvites";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const dispatch = useDispatch();
  const { LoginUser, LogoutUser } = bindActionCreators(
    userActionCreators,
    dispatch
  );
  const { SetRole } = bindActionCreators(roleActionCreators, dispatch);
  const { SetCurrentElection } = bindActionCreators(
    electionActionCreators,
    dispatch
  );
  const state = useSelector((state: State) => state.user);
  const role = useSelector((state: State) => state.role);
  const [loading, setLoading] = React.useState<boolean>(true);

  async function fetchUser() {
    // storing election id in local storage

    const token = await SecureStore.getItemAsync("jwtToken");
    if (token) {
      // token expired, lets log them out
      const decoded = jwtDecode(token) as any;
      if (decoded.exp * 1000 < Date.now()) {
        LogoutUser();
        setLoading(false);
        SetCurrentElection(null);
        return;
      }

      // get info on our user based on token
      const me = await _http.get("user/me", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // is our user a voter or admin
      const roleResponse = await _http.get("user/role", {
        headers: { Authorization: `Token ${token}` },
      });

      // set global state
      SetRole(roleResponse.data);
      LoginUser(me.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  //  while we wait to find out if we have a user, return a spinner, otherwise (potentially) wrong stack shows
  if (loading) {
    return <CustomSpinner />;
  }

  return (
    <Stack.Navigator>
      {/* Unauthorized Screens */}

      {!state?.jwtToken ? (
        <Stack.Group screenOptions={{ title: "", headerShadowVisible: false }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="EnterPhoneNumber" component={EnterPhoneNumber} />
          <Stack.Screen name="EnterCode" component={EnterCode} />
          <Stack.Screen name="EnterUserInfo" component={EnterName} />
          <Stack.Screen name="EnterMoreInfo" component={EnterAddress} />
          <Stack.Screen name="EnterMoreInfoTwo" component={EnterDob} />
          <Stack.Screen name="BeginVerify" component={BeginVerifyScreen} />
          <Stack.Screen
            name="ThankYou"
            component={ThankYouScreen}
            options={{
              title: "",
              headerShadowVisible: false,
              headerLeft: () => <Text>{""}</Text>,
            }}
          />
          <Stack.Screen name="CreateLogin" component={CreateLogin} />
        </Stack.Group>
      ) : // The below screens are authenticated screems, we will show either a voter or admin stack
      role ? (
        role === "voter" ? (
          <>
            <Stack.Screen
              name="Voter"
              component={VoterBottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name="VoterPickElection"
                component={VoterPickElection}
                options={{ headerTitle: "choose election to view" }}
              />
              <Stack.Screen
                name="VoteSuccessful"
                component={VoteSuccessful}
                options={{ headerTitle: "" }}
              />
            </Stack.Group>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Admin"
              component={AdminBottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Group screenOptions={{ presentation: "modal" }}>
              <Stack.Screen
                name="AddCandidate"
                component={AddCandidate}
                options={{ headerTitle: "add candidate" }}
              />

              <Stack.Screen
                name="InviteUserProfile"
                component={UserProfileInvite}
                options={{ headerTitle: "user profile" }}
              />

              <Stack.Screen
                name="ManageInvites"
                component={ManageInvites}
                options={{ headerTitle: "manage invites" }}
              />
            </Stack.Group>
          </>
        )
      ) : (
        <Stack.Screen
          name="PickRole"
          component={PickRole}
          options={{ headerShadowVisible: false, title: "" }}
        />
      )}

      {/* Common Screens */}
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="Modal"
          component={ModalScreen}
          options={{ title: "Verification" }}
        />
        <Stack.Screen
          name="FullScreenCandidate"
          component={FullScreenCandidate}
          options={{ headerTitle: "" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const AdminBottomTab = createBottomTabNavigator<AdminTabParamList>();

function AdminBottomTabNavigator() {
  return (
    <AdminBottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: purple,
        headerTitleAlign: "left",
        headerTitle: ({ children }) => <Heading>{children}</Heading>,
        headerStyle: { shadowOpacity: 0 },
      }}
      initialRouteName="Election"
    >
      <AdminBottomTab.Screen
        name="AdminVoteResults"
        component={VoterResults}
        options={{
          title: "results",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="pie-chart" color={color} />
          ),
        }}
      />
      <AdminBottomTab.Screen
        name="Election"
        component={Election}
        options={{
          title: "elections",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="envelope" color={color} />
          ),
        }}
      />
      <AdminBottomTab.Screen
        name="AdminInvite"
        component={AdminInvite}
        options={({ navigation }: AdminTabScreenProps<"AdminInvite">) => ({
          title: "invite",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="mail-reply" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("ManageInvites")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome name="link" size={25} style={{ marginRight: 15 }} />
            </Pressable>
          ),
        })}
      />
      <AdminBottomTab.Screen
        name="Candidates"
        component={Candidates}
        options={({ navigation }: AdminTabScreenProps<"Candidates">) => ({
          title: "candidates",
          tabBarIcon: ({ color }) => <TabBarIcon name="group" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("AddCandidate")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome name="plus" size={25} style={{ marginRight: 15 }} />
            </Pressable>
          ),
        })}
      />

      <AdminBottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </AdminBottomTab.Navigator>
  );
}

// Voter Tab
const VoterBottomTab = createBottomTabNavigator<VoteTabParamList>();

function VoterBottomTabNavigator() {
  return (
    <VoterBottomTab.Navigator
      initialRouteName="VoterInvite"
      screenOptions={{
        tabBarActiveTintColor: purple,
        headerTitleAlign: "left",
        headerTitle: ({ children }) => <Heading>{children}</Heading>,
        headerStyle: { shadowOpacity: 0 },
      }}
    >
      <VoterBottomTab.Screen
        name="VoterResults"
        component={VoterResults}
        options={{
          title: "results",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="pie-chart" color={color} />
          ),
        }}
      />
      <VoterBottomTab.Screen
        name="VoterInvite"
        component={VoterInvite}
        options={({ navigation }: VoterTabScreenProps<"VoterInvite">) => ({
          title: "invitations",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="envelope" color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("VoterPickElection")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="vcard-o"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <VoterBottomTab.Screen
        name="PlaceVote"
        component={PlaceVote}
        options={{
          title: "vote",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="plus-circle" color={color} />
          ),
        }}
      />
      <VoterBottomTab.Screen
        name="ViewCandidates"
        component={Candidates}
        options={{
          title: "candidates",
          tabBarIcon: ({ color }) => <TabBarIcon name="group" color={color} />,
        }}
      />
      <VoterBottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </VoterBottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}
