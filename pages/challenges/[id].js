import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { client } from "../../lib/wretch";
import { Heading, Box, List, ListItem } from "@chakra-ui/react";
import { CalendarIcon, StarIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import {
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

const ChallengeDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const { isLoading, error, data } = useQuery(id, () =>
    client.url(`/challenges/${id}`).get().json()
  );

  return isLoading ? (
    "Loading..."
  ) : (
    <Box as="main" p={8}>
      <Box zIndex="100" position="sticky" width="100%" top={0} py={4} backgroundColor="white">
        <Heading>{data.name}</Heading>
      </Box>
      <List>
        <ListItem>
          <CalendarIcon mr={2} /> od {format(new Date(data.start_time), "dd.MM.yyyy")} do{" "}
          {format(new Date(data.end_time), "dd.MM.yyyy")}
        </ListItem>
        <ListItem>
          <StarIcon mr={2} /> nagroda: {data.prize}
        </ListItem>
      </List>
      <Accordion maxWidth="400px" my={4}>
        {data.scores.map((score) => (
          <AccordionItem key={score.group_id}>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {score.group_name}{" "}
                <Badge variant="solid" colorScheme="green">
                  {score.score}km
                </Badge>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default ChallengeDetails;
