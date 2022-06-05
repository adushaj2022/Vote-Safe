import React from "react";
import { Box, Text, HStack, Image } from "native-base";
import { address } from "../../constants/Extras";
import { TCandidate } from "../../types";

interface ListItemCandidateProps {
  candidate: TCandidate;
}

const ListItemCandidate: React.FunctionComponent<ListItemCandidateProps> = ({
  candidate,
}) => {
  return (
    <HStack
      bg="#fff"
      rounded="xl"
      shadow={1}
      mt={5}
      h={16}
      justifyContent="space-between"
      alignItems="center"
    >
      <Box ml={3}>
        <Image
          size={50}
          resizeMode={"contain"}
          borderRadius={100}
          source={{
            uri: `${address}static/${candidate.imgUrl}`,
          }}
          alt="Alternate Text"
        />
      </Box>
      <Box mr={3}>
        <Text bold>{candidate.name}</Text>
      </Box>
    </HStack>
  );
};

export default ListItemCandidate;
