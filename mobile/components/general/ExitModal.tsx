import React from "react";
import { Button, Modal, ScrollView, Text } from "native-base";

interface ExitModalProps {
  setModalVisible: (s: boolean) => void;
  modalVisible: boolean;
  clearState: () => void;
  navigation: any;
}

const ExitModal: React.FunctionComponent<ExitModalProps> = ({
  setModalVisible,
  modalVisible,
  navigation,
  clearState,
}) => {
  return (
    <Modal isOpen={modalVisible} onClose={setModalVisible} size={"md"}>
      <Modal.Content maxH="212px">
        <Modal.CloseButton />
        <Modal.Header>are you sure?</Modal.Header>
        <Modal.Body>
          <ScrollView>
            <Text>all information will be forgotten if you exit :/</Text>
          </ScrollView>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setModalVisible(false);
              }}
            >
              no
            </Button>
            <Button
              colorScheme="danger"
              variant="outline"
              onPress={() => {
                clearState();
                setModalVisible(false);
                navigation.navigate("Welcome");
              }}
            >
              yes
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ExitModal;
