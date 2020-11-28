import wretch from "wretch";

const client = wretch("https://totalizator.hasura.app/v1/graphql");

export { client };
