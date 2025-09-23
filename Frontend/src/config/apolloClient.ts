import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { VITE_APP_API_URL } from "./env";

const link = new HttpLink({
  uri: VITE_APP_API_URL,
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
