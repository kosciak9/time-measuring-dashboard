import NextLink from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { client } from "../../lib/wretch";
import { Heading, Box, List, ListItem } from "@chakra-ui/react";
import { CalendarIcon, StarIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import {
  Stat,
  Text,
  Grid,
  GridItem,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

const RouteMap = ({ locations }) => {
  return <Image src="//placehold.it/400x200" />;
};

const ActivityImages = ({ photos }) => {
  return photos.map((photo) => (
    <Box
      bg={
        photo.verified == null
          ? "gray.200"
          : photo.verified
          ? "green.200"
          : "red.200"
      }
      width="400px"
      padding="5px"
    >
      <Heading as="h4" size="md">
        {photo.landmark.name}
      </Heading>
      <Text>
        Współrzędne: {photo.landmark.longitude} N , {photo.landmark.latitude} E
      </Text>
      <Text>
        {photo.verified == null
          ? "Oczekuje na weryfikację."
          : photo.verified
          ? "Zdjęcie zatwierdzone."
          : "Zdjęcie odrzucone."}
      </Text>
      <Image src={"data:image/jpeg;base64," + photo.photo} objectFit="cover" />
    </Box>
  ));
};

const ActivityDetails = () => {
  const router = useRouter();
  const { id: activity_id } = router.query;

  const { isLoading, error, data } = useQuery(activity_id, async () => {
    const response = await client
      .post({
        query: `
          query getActivity($id: uuid!) {
            activities_by_pk(id: $id) {
              id
              locations
              challenge {
                name
                id
              }
              distance
              user {
                id
                name
                surname
              }
              photos {
                id
                photo
                landmark_id
                verified
                landmark {
                  name
                  latitude
                  longitude
                }
              }
            }
          }
        `,
        variables: { id: activity_id },
      })
      .json();
    return response.data.activities_by_pk;
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
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Heading>Bieg w ramach {data.challenge.name}</Heading>
            <Heading as="h4" size="md">
              Zawodnik: {data.user.name} {data.user.surname}
            </Heading>
            <Heading as="h4" size="md">
              Data:{" "}
              {JSON.parse(data.locations)?.[0]?.timestamp
                ? format(
                    new Date(JSON.parse(data.locations)?.[0]?.timestamp),
                    "dd.MM.yyyy"
                  )
                : " :("}
            </Heading>
            <List>
              <ListItem>Pokonany dystans: {data.distance} km</ListItem>
              <ListItem>
                Trasa:
                <RouteMap />
              </ListItem>
            </List>
          </GridItem>
          <GridItem>
            <ActivityImages photos={data.photos} />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default ActivityDetails;
