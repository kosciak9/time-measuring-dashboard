import NextLink from "next/link";
import { useQuery } from "react-query";
import { client } from "../lib/wretch";
import { Stat, StatLabel, StatNumber, StatHelpText } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { useEffect } from "react";

const ChallengeList = ({ admin_id, forceRefresh }) => {
  const { isLoading, error, data: challenges, refetch } = useQuery("challengesList", async () => {
    const response = await client
      .post({
        query: `
          query ChallangesForUser($admin_id: String_comparison_exp) {
            challenges(where: { admin_id: $admin_id }) {
              id
              name
              start_time
              end_time
              prize
            }
          }
        `,
        variables: { admin_id: { _eq: admin_id } },
      })
      .json();
    return response.data.challenges;
  });

  useEffect(() => {
    if (forceRefresh) {
      refetch();
    }
  }, [forceRefresh]);

  return isLoading
    ? "Loading..."
    : challenges.map((challenge) => (
        <NextLink href={"/challenges/" + challenge.id} key={challenge.id}>
          <a>
            <Stat my={4}>
              <StatLabel>{challenge.name}</StatLabel>
              <StatNumber>12km</StatNumber>
              <StatHelpText>
                {challenge.end_time
                  ? `koniec za ${formatDistanceToNow(new Date(challenge.end_time), { locale: pl })}`
                  : null}
              </StatHelpText>
            </Stat>
          </a>
        </NextLink>
      ));
};

export { ChallengeList };
