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

  type getDataForQuakesChart {
    interval: String!
    count: Int!
  }

  type getCounts {
    total_count: Int!
    max_mag: Float!
    max_mag_place: String!
  }

  type Query {
    weatherStats: [WeatherStats!]!
    getDataForQuakesChart: [getDataForQuakesChart!]!
    getCounts: getCounts!
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
		weatherStats: catchAsync(async (_: any, args: any) => await weatherStatsRepo.list()),
		getDataForQuakesChart: catchAsync(async (_: any, args: any) => await weatherStatsRepo.getDataForQuakesChart()),
		getCounts: catchAsync(async (_: any, args: any) => await weatherStatsRepo.getCounts()),
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
