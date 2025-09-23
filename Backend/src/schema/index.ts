import { executeSQLWithSequelize, generateAnswer, generateSQLQuery } from '@/helper';
import WeatherStatsRepo from '@/repository/weather_stats.respository';
import { catchAsync } from '@/utils/catchAsync';

export const typeDef = `#graphql
  type WeatherStats {
    id: ID!
    external_id: String!
    place: String!
    mag: Float
    time: String!
    updated: String!
    tz: Int
    url: String!
    detail: String
    felt: Int
    cdi: Float
    mmi: Float
    alert: String
    status: String
    tsunami: Int!
    sig: Int
    net: String
    code: String
    sources: String
    types: String
    nst: Int
    dmin: Float
    rms: Float
    gap: Float
    magType: String
    type: String
    title: String!
    geometry_type: String!
    geometry_coordinates: [Float!]!
    created_at: String
    updated_at: String
  }

  type Query {
    weatherStats: [WeatherStats!]!
  }

  type Mutation {
    askQuestion(
      question: String!
    ): String!
  }
`;

const weatherStatsRepo = new WeatherStatsRepo();

export const resolvers = {
	Query: {
		weatherStats: catchAsync(async (_: any, args: any) => weatherStatsRepo.list()),
	},
	Mutation: {
		askQuestion: catchAsync(async (_: any, args: any) => {
			const sqlQuery = await generateSQLQuery(args.question);
			const sqlResult = await executeSQLWithSequelize(sqlQuery);
			const answer = await generateAnswer(args.question, sqlResult);
			return answer;
		}),
	},
};

module.exports = {
	resolvers,
	typeDef,
};
