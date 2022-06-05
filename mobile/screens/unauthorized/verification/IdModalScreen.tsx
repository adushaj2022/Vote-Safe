import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as React from "react";
import { StyleSheet } from "react-native";
import { RootStackParamList } from "../../../types";
import { WebView } from "react-native-webview";
import { address } from "../../../constants/Extras";
import { io } from "socket.io-client";

type ModalSreenProps = NativeStackScreenProps<RootStackParamList, "Modal">;

export default function ModalScreen({ route, navigation }: ModalSreenProps) {
  const socketRef = React.useRef<any>();

  React.useEffect(() => {
    socketRef.current = io(address);
    socketRef.current.on("connection:sid", (socketId: string) => {
      socketRef.current.on("notification", (arg: any) => {
        if (socketId === arg.sid) {
          if (arg.notification.type !== "identity.verification_session.created")
            navigation.replace("ThankYou", {
              verOutcome: arg.notification.type,
            });
        }
      });
    });
    return () => {
      navigation.replace("ThankYou");
    };
  }, []);
  return (
    <WebView
      style={styles.container}
      source={{ uri: route.params.webvViewUri as string }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
