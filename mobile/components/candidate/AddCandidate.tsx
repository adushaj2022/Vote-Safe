import React, { useState, useEffect } from "react";
import { Keyboard, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { _http } from "../../api/config";
import * as SecureStore from "expo-secure-store";

import {
  Box,
  VStack,
  Input,
  FormControl,
  TextArea,
  Button,
  Icon,
  useToast,
  Text,
  Center,
} from "native-base";
import {
  colorSchema,
  inputFocusColor,
  inputVariant,
} from "../../constants/Extras";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../redux/reducers/rootReducer";
import { bindActionCreators } from "redux";
import { electionActionCreators } from "../../redux";
import { AdminTabScreenProps } from "../../types";

export default function AddCandidate({
  navigation,
}: AdminTabScreenProps<"Candidates">) {
  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const electionId = useSelector((state: State) => state.currentElection);
  const dispatch = useDispatch();
  const { SetCurrentElection } = bindActionCreators(
    electionActionCreators,
    dispatch
  );

  const toast = useToast();
  useEffect(() => {
    requestAccess();
  }, []);

  const handlePress = async () => {
    setButtonLoading(true);
    const formData = new FormData();
    if (image) {
      formData.append("candidatePhoto", {
        name: name.replace(/\s/g, "_"),
        type: image?.type,
        uri:
          Platform.OS === "ios"
            ? image?.uri?.replace("file://", "")
            : image?.uri,
      } as any);
    }

    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("electionId", String(electionId));
    let token = await SecureStore.getItemAsync("jwtToken");

    try {
      const response = await _http.post("candidate/", formData, {
        headers: {
          "content-type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        // success
        toast.show({
          description: "candidate added",
          placement: "top",
        });
        clearForm();
        Keyboard.dismiss();
        navigation.pop();
      } else {
        setError(response.data.error);
        setButtonLoading(false);
      }
    } catch (error) {
      toast.show({
        title: "problem",
        status: "error",
        description: "could not remove election, check your connection",
      });
    }
  };

  const requestAccess = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const clearForm = () => {
    let e = electionId;
    setError("");
    SetCurrentElection(null); // make server refresh
    SetCurrentElection(e);
    setButtonLoading(false);
    setName("");
    setCategory("");
    setDescription("");
  };

  if (electionId === null) {
    return (
      <Center flex={1} bg="#fff">
        <Text>choose an election first</Text>
      </Center>
    );
  }

  return (
    <VStack h={"100%"} bg="#fff" alignItems="center">
      <Box w="85%" display="flex" h="100%">
        <Box mt={4}>
          <FormControl>
            <Input
              keyboardType="ascii-capable"
              placeholder="name"
              mt={3}
              value={name}
              isInvalid={error !== ""}
              autoCorrect={false}
              variant={inputVariant}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => {
                setName(val);
              }}
            />
          </FormControl>
          <FormControl>
            <Input
              keyboardType="ascii-capable"
              placeholder="position"
              mt={3}
              value={category}
              isInvalid={error !== ""}
              autoCorrect={false}
              variant={inputVariant}
              _focus={{ borderColor: inputFocusColor }}
              onChangeText={(val) => {
                setCategory(val);
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
          <FormControl>
            <Button
              mt={3}
              variant="ghost"
              colorScheme={colorSchema}
              endIcon={
                <Icon as={Ionicons} name="cloud-upload-outline" size="sm" />
              }
              onPress={pickImage}
            >
              upload an image
            </Button>
          </FormControl>
        </Box>
        <Text mt={4} color="#FF9494">
          {error ?? ""}
        </Text>
        <Button
          mt={8}
          onPress={handlePress}
          colorScheme={colorSchema}
          isLoading={buttonLoading}
        >
          add
        </Button>
      </Box>
    </VStack>
  );
}
