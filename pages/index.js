import { ChallengeForm } from "../components/ChallengeForm";
import { ChallengeList } from "../components/ChallengeList";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [admin_id] = useState("2");
  const [forceRefresh, setForceRefresh] = useState(false);

  return (
    <Box as="main" p={8}>
      <Box zIndex="100" position="sticky" width="100%" top={0} py={4} backgroundColor="white">
        <Heading>Twoje zawody</Heading>
      </Box>
      <ChallengeList forceRefresh={forceRefresh} admin_id={admin_id} />
      <Tooltip label="Dodaj nowe zawody" placement="left">
        <IconButton
          colorScheme="green"
          onClick={onOpen}
          icon={<AddIcon />}
          position="fixed"
          bottom={8}
          right={8}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nowe zawody</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ChallengeForm
              setForceRefresh={setForceRefresh}
              admin_id={admin_id}
              onClose={onClose}
            />{" "}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
