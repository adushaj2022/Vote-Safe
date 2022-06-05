import React, { useState, useEffect } from "react";

import io from "socket.io-client";
import VerifyFailure from "../../../components/verify/VerifyFailure";
import VerifySuccess from "../../../components/verify/VerifySuccess";
import { address } from "../../../constants/Extras";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import VerifyWaiting from "../../../components/verify/VerifyWaiting";

type ThankYouScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ThankYou"
>;

const ThankYouScreen: React.FunctionComponent<ThankYouScreenProps> = ({
  navigation,
  route,
}) => {
  const [outcome, setOutcome] = useState<string>(
    route.params?.verOutcome || ""
  );
  const socketRef = React.useRef<any>();

  useEffect(() => {
    socketRef.current = io(address);
    socketRef.current.on("connection:sid", async (socketId: string) => {
      socketRef.current.on("notification", (arg: any) => {
        if (socketId === arg.sid) {
          setOutcome(arg.notification.type);
        }
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  if (outcome === "identity.verification_session.verified") {
    return <VerifySuccess navigation={navigation} />;
  } else if (outcome === "identity.verification_session.requires_input") {
    return <VerifyFailure navigation={navigation} />;
  } else {
    return <VerifyWaiting />;
  }
};

export default ThankYouScreen;
