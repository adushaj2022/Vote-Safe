import React from "react";
import { Button, Text, Center, Image } from "native-base";
import { Share } from "react-native";
import { _http } from "../../api/config";
import { APP_URL, colorSchema } from "../../constants/Extras";

interface ManageInvitesProps {}

const ManageInvites: React.FunctionComponent<ManageInvitesProps> = (props) => {
  const onShare = async () => {
    try {
      await Share.share({
        url: APP_URL,
        message: "try out votesafe, you can join and participate in elections",
      });
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Center flex={1} bg="#fff">
      <Image
        source={{
          uri: "https://cdn.dribbble.com/users/1553954/screenshots/4743676/media/3eb18c098fdb3fb06eb20e075efcab90.png?compress=1&resize=800x600",
        }}
        alt={"invite user"}
        size={300}
      />
      <Text mt={3}>share the experience with a friend</Text>
      <Button onPress={onShare} my={5} size="sm" colorScheme={colorSchema}>
        share
      </Button>
    </Center>
  );
};

export default ManageInvites;
