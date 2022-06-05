/*
  CREDITS FOR THIS COMPONENT, used an example provided and alteered it to my liking 
  https://www.npmjs.com/package/react-native-confirmation-code-field
*/

import React, { useEffect, useState, createRef } from "react";
import { InteractionManager, SafeAreaView, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { Keyboard } from "react-native";
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useSelector } from "react-redux";
import { _http } from "../../api/config";
import { State } from "../../redux/reducers/rootReducer";

const CELL_COUNT = 6;

const inputRef = createRef<any>();

const XCodeField = ({ navigation }: any) => {
  const state = useSelector((state: State) => state.registerForm);
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => inputRef.current.focus(), 150);
    });
  }, []);

  const handleChangeText = async (val: string) => {
    setValue(val);
    setError(""); // reset error
    if (val.length === 6) {
      // advance page, send post request here
      const response = await _http.post("/sms/verify-code", {
        code: val,
        phoneNumber: state?.phoneNumber,
      });
      if (response.status === 200 && response.data === "approved") {
        navigation.push("EnterUserInfo");
      } else {
        setError("invalid code, try again");
        setValue("");
      }
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        ref={inputRef}
        {...props}
        value={value}
        autoFocus={true}
        onChangeText={(val) => handleChangeText(val)}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFiledRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <Text style={styles.errorText}>{error ?? ""}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { minHeight: 300 },
  title: { textAlign: "center", fontSize: 30 },
  codeFiledRoot: {
    marginTop: 20,
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: 35,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#6366f1",
    borderBottomWidth: 2,
  },
  errorText: {
    color: "#FF9494",
    marginTop: 15,
    marginLeft: 4,
  },
});

export default XCodeField;
