import NextLink from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { client } from "../../lib/wretch";
import { Heading, Box, List, ListItem } from "@chakra-ui/react";
import { CalendarIcon, StarIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";
import {
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

const Activities = ({ activities }) => {
  return activities.map((activity) => {
    const date = JSON.parse(activity.locations)?.[0]?.timestamp;
    // console.log(date ? JSON.parse(date) : ":(");
    return (
      <NextLink href={"/activities/" + activity.id} key={activity.id}>
        <a>
          <Stat my={4}>
            <StatLabel>
              {activity.user.name} {activity.user.surname}
            </StatLabel>
            <StatNumber>{activity.distance || "brak danych :("} km</StatNumber>
            <StatHelpText>
              w dniu: {date ? format(new Date(date), "dd.MM.yyyy") : " :("}
            </StatHelpText>
          </Stat>
        </a>
      </NextLink>
    );
  });
};

const ChallengeDetails = () => {
  const router = useRouter();
  const { id: challenge_id } = router.query;

  const { isLoading, error, data } = useQuery(challenge_id, async () => {
    const response = await client
      .post({
        query: `
          query MyQuery($challenge_id: uuid!) {
            challenges_by_pk(id: $challenge_id) {
              id
              name
              start_time
              end_time
              prize
              challenge_contestants {
                group {
                  name
                  id
                  group_members {
                    user {
                      name
                    }
                  }
                }
              }
              activities {
                id
                distance
                locations
                user {
                  group_members {
                    group_id
                  }
                  id
                  name
                  surname
                }
              }
            }
          }
        `,
        variables: { challenge_id },
      })
      .json();

    const scores = {};

    response.data.challenges_by_pk.activities.map((record) => {
      // console.log(record.user.group_members);
      scores[record.user.group_members.group_id] = scores[
        record.user.group_members.group_id
      ]
        ? scores[record.user.group_members.group_id] + (record.distance || 0)
        : record.distance || 0;
    });

    for (const value of response.data.challenges_by_pk.challenge_contestants) {
      value.group.score = scores[value.group.group_id];
    }

    return response.data.challenges_by_pk;
  });

  return isLoading ? (
    "Loading..."
  ) : (
    <Box as="main" p={8}>
      <Box
        zIndex="100"
        position="sticky"
        width="100%"
        top={0}
        py={4}
        backgroundColor="white"
      >
        <Heading>{data.name}</Heading>
      </Box>
      <List>
        <ListItem>
          <CalendarIcon mr={2} /> od{" "}
          {format(new Date(data.start_time), "dd.MM.yyyy")} do{" "}
          {format(new Date(data.end_time), "dd.MM.yyyy")}
        </ListItem>
        <ListItem>
          <StarIcon mr={2} /> nagroda: {data.prize}
        </ListItem>
      </List>
      <Accordion maxWidth="400px" my={4}>
        {data.challenge_contestants.map((group) => {
          // console.log(group);
          return (
            <AccordionItem key={group.group.group_id}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {group.group.name}{" "}
                  <Badge variant="solid" colorScheme="green">
                    {group.group.score}
                  </Badge>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Activities activities={data.activities} />
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default ChallengeDetails;
