import React, { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

import { Button } from "native-base";
import { colorSchema } from "../../constants/Extras";

interface KeyboardButtonProps {
  handlePress: () => void;
  disabledBool: boolean;
  buttonTitle?: string;
}

const KeyboardButton: React.FunctionComponent<KeyboardButtonProps> = ({
  handlePress,
  disabledBool,
  buttonTitle,
}) => {
  const [keyboardHeight, setKeyboardHeight] = useState<string>("20px");

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      ({ endCoordinates }) => {
        if (Platform.OS === "ios") {
          setKeyboardHeight(Math.ceil(endCoordinates.height) + "px");
        }
      }
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", (e) => {
      setKeyboardHeight("20px");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <Button
      borderRadius="pill"
      mt={7}
      mb={5}
      colorScheme={colorSchema}
      disabled={disabledBool}
      onPress={handlePress}
      position={"absolute"}
      bottom={keyboardHeight}
      w="100%"
    >
      {buttonTitle ?? "continue"}
    </Button>
  );
};

export default KeyboardButton;
