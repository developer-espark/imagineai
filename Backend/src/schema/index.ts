import AuthRepo from '@/repository/auth.repository';
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
const authRepo = new AuthRepo();

export const resolvers = {
	Query: {
		users: catchAsync(async () => authRepo.list()),
	},
	Mutation: {
		register: catchAsync(async (_: any, args: any) => authRepo.register(args)),
	},
};

module.exports = {
	resolvers,
	typeDef,
};
