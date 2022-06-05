import React, { useEffect, useLayoutEffect, createRef } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  Input,
  Icon,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { formActionCreators } from "../../../redux";
import { State } from "../../../redux/reducers/rootReducer";
import { RootStackParamList, TRegisterForm } from "../../../types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { IconButton } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import ExitModal from "../../../components/general/ExitModal";
import KeyboardButton from "../../../components/form/KeyboardButton";
import { inputFocusColor, inputVariant } from "../../../constants/Extras";

type EnterNameProps = NativeStackScreenProps<
  RootStackParamList,
  "EnterUserInfo"
>;

const firstName = createRef<any>();

const EnterName: React.FunctionComponent<EnterNameProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const dispatch = useDispatch();
  const { SetFormInfo, ClearFormInfo } = bindActionCreators(
    formActionCreators,
    dispatch
  );

  const state = useSelector((state: State) => state.registerForm);

  useEffect(() => {
    firstName.current.focus();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          onPress={() => setModalVisible(!modalVisible)}
          icon={<Icon as={AntDesign} name="close" />}
          borderRadius="full"
        />
      ),
    });
  }, [navigation]);

  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" display="flex" h="100%">
        <Box>
          <Heading size="2xl" mb={3}>
            tell us about yourself
          </Heading>
          <FormControl>
            <Input
              keyboardType="ascii-capable"
              placeholder="John"
              mt={3}
              ref={firstName}
              variant={inputVariant}
              autoCorrect={false}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) =>
                SetFormInfo({
                  ...state,
                  firstName: val,
                } as TRegisterForm)
              }
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Doe"
              mt={3}
              variant={inputVariant}
              autoCorrect={false}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) =>
                SetFormInfo({
                  ...state,
                  lastName: val,
                } as TRegisterForm)
              }
            />
          </FormControl>
          <Text color="#A8A8A8" w="100%" mt={3}>
            this name must match the name on your government issued id
          </Text>
          <ExitModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            clearState={ClearFormInfo}
            navigation={navigation}
          />
        </Box>
        <KeyboardButton
          disabledBool={
            state!?.firstName.length < 2 || state!?.lastName.length < 2
          }
          handlePress={() => navigation.push("EnterMoreInfo")}
        />
      </Box>
    </VStack>
  );
};

export default EnterName;
