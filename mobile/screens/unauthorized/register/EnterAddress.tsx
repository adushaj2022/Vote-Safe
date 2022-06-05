import { Box, Heading, Input, VStack, Text, Button } from "native-base";
import React, { useState } from "react";
import KeyboardButton from "../../../components/form/KeyboardButton";
import { RootStackParamList, TRegisterForm } from "../../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import GoogleInput from "../../../components/form/GoogleInput";
import {
  colorSchema,
  inputFocusColor,
  inputVariant,
  prod,
} from "../../../constants/Extras";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { formActionCreators } from "../../../redux";
import { SetFormInfo } from "../../../redux/actions/formAction";
import { State } from "../../../redux/reducers/rootReducer";

type EnterAddressProps = NativeStackScreenProps<
  RootStackParamList,
  "EnterMoreInfo"
>;

/**
 *
 * This screen will render the google input if we are in production, therefore a lot of this can be deleted
 */

const EnterAddress: React.FunctionComponent<EnterAddressProps> = ({
  navigation,
}) => {
  const [address, setAddress] = useState<string>("");
  const dispatch = useDispatch();
  const { SetFormInfo } = bindActionCreators(formActionCreators, dispatch);
  const state = useSelector((state: State) => state.registerForm);

  return (
    <>
      <Heading size="2xl" bg="#fff" px={4}>
        what is your address
      </Heading>
      <GoogleInput navigation={navigation} />
    </>
  );
};

export default EnterAddress;
