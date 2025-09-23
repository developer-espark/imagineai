import { catchAsync } from '@/utils/catchAsync';

export const typeDef = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    mobile_no: String!
  }

  type Query {
    users: [User!]!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!,mobile_no: String!): User!
  }
`;

export const resolvers = {
	Query: {
		users: catchAsync(async () => console.log('first')),
	},
	Mutation: {
		register: catchAsync(async (_: any, args: any) => console.log('first')),
	},
};

module.exports = {
	resolvers,
	typeDef,
};
