import React, { useState } from "react";

import {
  Box,
  Text,
  VStack,
  Input,
  FormControl,
  Flex,
  TextArea,
  Button,
  useToast,
} from "native-base";
import {
  colorSchema,
  inputFocusColor,
  inputVariant,
} from "../../constants/Extras";

import { _http } from "../../api/config";

import RNDateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../../utils/format";
import { TElection } from "../../types";
import { useSelector } from "react-redux";
import { State } from "../../redux/reducers/rootReducer";
import { Keyboard } from "react-native";

interface ElectionProps {
  elections: Array<TElection>;
  setElections: (e: TElection[]) => void;
}

const AddElection = ({ elections, setElections }: ElectionProps) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [closeDate, setCloseDate] = useState<Date>(new Date());
  const [openDate, setOpenDate] = useState<Date>(new Date());
  const [error, setError] = useState<string>("");

  const user = useSelector((state: State) => state.user);
  const toast = useToast();

  const clearForm = () => {
    setName("");
    setDescription("");
    setOpenDate(new Date());
    setCloseDate(new Date());
  };

  const handlePress = async () => {
    const values = {
      name,
      description,
      openDate: formatDate(openDate),
      closeDate: formatDate(closeDate),
    };
    try {
      const response = await _http.post("/election", values, {
        headers: {
          authorization: `Token ${user!.jwtToken}`,
        },
      });

      if (response.data.error) {
        setError(response.data.error);
      } else if (response.status === 201) {
        setError("");
        setElections([...elections, { ...values, id: response.data.id }]);
        clearForm();
        toast.show({
          title: "created",
          placement: "top",
          description: "election was successfully registered",
          status: "success",
        });
        Keyboard.dismiss();
      }
    } catch (error) {
      toast.show({
        title: "problem",
        status: "error",
        description: "could not create election, check your connection",
      });
    }
  };

  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" display="flex" h="100%">
        <Box mt={4}>
          <FormControl>
            <Input
              keyboardType="ascii-capable"
              placeholder="election name"
              mt={3}
              isInvalid={error !== ""}
              value={name}
              variant={inputVariant}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => {
                setName(val);
              }}
            />
          </FormControl>
          <FormControl>
            <TextArea
              placeholder="description"
              mt={3}
              value={description}
              isInvalid={error !== ""}
              variant={inputVariant}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => {
                setDescription(val);
              }}
            />
          </FormControl>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            mt={3}
          >
            <Text color="gray.500" pl={4}>
              start date
            </Text>
            <RNDateTimePicker
              themeVariant="light"
              display={"compact"}
              value={openDate}
              mode="date"
              onChange={(e, val) => {
                setOpenDate(val!);
              }}
              style={{ width: 100 }}
            />
          </Flex>
          <Flex
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            mt={3}
          >
            <Text color="gray.500" pl={4}>
              end date
            </Text>
            <RNDateTimePicker
              themeVariant="light"
              display={"compact"}
              value={closeDate}
              mode="date"
              onChange={(e, val) => {
                setCloseDate(val!);
              }}
              style={{ width: 100 }}
            />
          </Flex>
        </Box>
        <Text mt={4} color="#FF9494">
          {error ?? ""}
        </Text>
        <Button mt={4} onPress={handlePress} colorScheme={colorSchema}>
          submit
        </Button>
      </Box>
    </VStack>
  );
};

export default AddElection;
