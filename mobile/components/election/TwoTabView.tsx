import React, { useEffect, useState } from "react";
import { Dimensions, StatusBar, Animated, Pressable } from "react-native";
import { TabView } from "react-native-tab-view";
import { Box } from "native-base";
import { purple } from "../../constants/Extras";
import { STUser, TElection } from "../../types";
import CustomSpinner from "../general/CustomSpinner";
import { _http } from "../../api/config";
import { useSelector } from "react-redux";
import { State } from "../../redux/reducers/rootReducer";

import AddElection from "./AddElection";
import ViewElections from "./ViewElections";
const initialLayout = { width: Dimensions.get("window").width };

const TwoTabView = () => {
  const [elections, setElections] = useState<TElection[]>([]);
  const { jwtToken } = useSelector((state: State) => state.user as STUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElections() {
      const response = await _http.get("/election/user", {
        headers: { authorization: `Token ${jwtToken}` },
      });
      setElections(response.data.elections);
      setLoading(false);
    }

    fetchElections();
  }, []);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "view", title: "view" },
    { key: "add", title: "add" },
  ]);

  const renderTabBar = (props: any) => {
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route: any, i: number) => {
          const color = index === i ? "#1f2937" : "#a1a1aa";
          const borderColor = index === i ? purple : "coolGray.200";

          return (
            <Box
              key={i}
              borderBottomWidth="3px"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              mt={2}
              p={3}
              bg="#fff"
            >
              <Pressable
                onPress={() => {
                  setIndex(i);
                }}
              >
                <Animated.Text style={{ color }}>{route.title}</Animated.Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  if (loading) {
    return <CustomSpinner />;
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={({ route }) => {
        switch (route.key) {
          case "view":
            return <ViewElections elections={elections} />;
          case "add":
            return (
              <AddElection elections={elections} setElections={setElections} />
            );
          default:
            return null;
        }
      }}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{ marginTop: StatusBar.currentHeight }}
    />
  );
};

export default TwoTabView;
