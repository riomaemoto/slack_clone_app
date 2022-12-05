import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FC, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ChannelModal: FC<Props> = ({ isOpen, onClose }) => {
  const [createNm, setCreateNm] = useState("");
  const [searchNm, setSearchNm] = useState("");

  const closeModal = () => {
    setCreateNm("");
    setSearchNm("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Channel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Search</Tab>
              <Tab>Create</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>aa</TabPanel>
              <TabPanel>bb</TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
