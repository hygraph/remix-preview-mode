import { GraphQLClient } from "graphql-request";

const endpoint = process.env.GRAPHCMS_ENDPOINT || ``;

export const graphcms = new GraphQLClient(endpoint);
