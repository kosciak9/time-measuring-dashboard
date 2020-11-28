import NextLink from "next/link";
import { useQuery } from "react-query";
import { client } from "../lib/wretch";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { useEffect } from "react";

const ChallengeList = ({ admin_id, forceRefresh }) => {
  const { isLoading, error, data, refetch } = useQuery("challengesList", () =>
    client.url(`/users/${admin_id}/admin_challenges`).get().json()
  );

  useEffect(() => {
    if (forceRefresh) {
      refetch();
    }
  }, [forceRefresh]);

  return isLoading
    ? "Loading..."
    : data.map((challenge) => (
        <NextLink href={"/challenges/" + challenge.id} key={challenge.id}>
          <a>
            <Stat my={4}>
              <StatLabel>{challenge.name}</StatLabel>
              <StatNumber>12km</StatNumber>
              <StatHelpText>
                koniec za {formatDistanceToNow(new Date(challenge.end_time), { locale: pl })}
              </StatHelpText>
            </Stat>
          </a>
        </NextLink>
      ));
};

export { ChallengeList };
