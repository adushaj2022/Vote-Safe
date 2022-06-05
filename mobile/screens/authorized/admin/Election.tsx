import { VStack } from "native-base";
import React from "react";
import TwoTabView from "../../../components/election/TwoTabView";

interface ElectionProps {}

const Election: React.FunctionComponent<ElectionProps> = (props) => {
  return (
    <VStack h="100%" bg="#fff">
      <TwoTabView />
    </VStack>
  );
};

export default Election;
