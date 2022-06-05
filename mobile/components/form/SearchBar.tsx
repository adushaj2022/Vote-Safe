import React from "react";
import { Box, Icon, Input, VStack } from "native-base";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { inputVariant, purple } from "../../constants/Extras";
import { TInviteUserProfile } from "../../types";

interface SearchBarProps {
  users: TInviteUserProfile[];
  setFilteredUsers: (u: TInviteUserProfile[]) => void;
}

const SearchBar: React.FunctionComponent<SearchBarProps> = ({
  users,
  setFilteredUsers,
}) => {
  const [value, setValue] = React.useState("");

  return (
    <Input
      placeholder="Search"
      bg="#fff"
      width="100%"
      borderRadius={4}
      py={3}
      px={1}
      value={value}
      fontSize={14}
      _focus={{ borderColor: purple }}
      onChangeText={(val) => {
        setValue(val);
        const filteredUsers = users.filter(
          (user) =>
            (user.firstName.toLowerCase().includes(val.toLowerCase()) ||
              user.lastName.toLowerCase().includes(val.toLowerCase()) ||
              user.username.toLowerCase().includes(val.toLowerCase())) &&
            val
        );
        setFilteredUsers(filteredUsers);
      }}
      InputLeftElement={
        <Icon
          size="xs"
          m={2}
          color="gray.400"
          as={<FontAwesome name="search" />}
        />
      }
      InputRightElement={
        <Icon
          size="xs"
          m={2}
          color="gray.400"
          as={<FontAwesome name="microphone" />}
        />
      }
    />
  );
};

export default SearchBar;
