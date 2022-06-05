import {
  Box,
  Input,
  VStack,
  Text,
  Pressable,
  HStack,
  Image,
  Center,
  ScrollView,
} from "native-base";
import React from "react";
import { useSelector } from "react-redux";
import { _http } from "../../../api/config";
import SearchBar from "../../../components/form/SearchBar";
import { State } from "../../../redux/reducers/rootReducer";
import { AdminTabScreenProps, TInviteUserProfile } from "../../../types";

type AdminInviteProps = AdminTabScreenProps<"AdminInvite">;

const AdminInvite: React.FunctionComponent<AdminInviteProps> = ({
  navigation,
}) => {
  const [users, setUsers] = React.useState<Array<TInviteUserProfile>>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<
    Array<TInviteUserProfile>
  >([]);
  const currentUser = useSelector((state: State) => state.user);

  async function fetchUsers() {
    const response = await _http.get("user/profiles", {
      headers: { authorization: `Token ${currentUser?.jwtToken}` },
    });
    setUsers(response.data?.users);
  }

  const handlePress = (selectedUser: TInviteUserProfile) => {
    navigation.push("InviteUserProfile", {
      ...selectedUser,
    });
  };
  React.useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <VStack h="100%" bg="#fff" alignItems="center">
      <Box w="85%" display="flex" h="100%" mt={3}>
        <SearchBar users={users} setFilteredUsers={setFilteredUsers} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredUsers.map((fuser, i) => (
            <Pressable onPress={() => handlePress(fuser)} key={i}>
              <HStack
                bg="#fff"
                rounded="xl"
                shadow={1}
                mt={3}
                h={12}
                d="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text ml={2} bold fontSize="sm">
                  {`${fuser.lastName}, ${fuser.firstName}`}
                </Text>
                <Text mr={2} color="gray.400">
                  {fuser.username}
                </Text>
              </HStack>
            </Pressable>
          ))}
          {filteredUsers.length === 0 && (
            <Center flex={1}>
              <Image
                mt={10}
                alt="search bar image"
                size={300}
                source={{
                  uri: "https://cdn.dribbble.com/users/415089/screenshots/14359077/media/12e60e1d4f5556b56310908bc9e6c2ea.jpg?compress=1&resize=1600x1200",
                }}
              />
              <Text>try searching for a user to invite</Text>
            </Center>
          )}
        </ScrollView>
      </Box>
    </VStack>
  );
};

export default AdminInvite;
