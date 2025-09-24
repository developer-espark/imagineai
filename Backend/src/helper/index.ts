import axios from 'axios';
import db from '@/models';
import { getSQLPrompt, generateSQLResponse } from './prompts';
import WeatherStats from "@/models/weather_stats.model";


// Get column definitions from Sequelize model
export function getTableSchemaFromModel(model: typeof WeatherStats) {
  const attributes = model.getAttributes();
  const columns = Object.entries(attributes).map(([name, attr]) => {
    const type = (attr.type as any).key || "UNKNOWN";
    return `${name} (${type})`;
  });

  return `Table '${model.tableName}' columns:\n${columns.join(", ")}`;
}
const schemaStr = getTableSchemaFromModel(WeatherStats);
// --- Helper: LLM generates SQL query ---
export async function generateSQLQuery(state: any) {

	const prompt = getSQLPrompt(state.question,schemaStr);
	const response = await axios.post(
		`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
		{
			messages: [{ role: 'user', content: prompt }],
			temperature: 0,
			max_tokens: 200,
		},
		{
			headers: {
				'api-key': process.env.AZURE_OPENAI_KEY!,
				'Content-Type': 'application/json',
			},
		},
	);
	// Clean SQL from any leftover markdown
	let sql = response.data.choices[0].message.content;
	sql = sql.replace(/```/g, '').replace(/sql/g, '').trim();
	console.log('Generated SQL:', sql);
  	return { ...state, sql };
}

export async function executeSQLWithSequelize(state: any) {
	const { sql } = state;
	const [results] = await db.query(sql, { raw: true });
	console.log('SQL Results:', results);
  	return { ...state, sqlResult: results };
}
// --- LLM generates natural language answer ---
export async function generateAnswer(state: any) {
	const { question, sql, sqlResult } = state;

	// if (!sqlResult.length) return 'I could not find any records matching your request.';

	const prompt = generateSQLResponse(question, sql, sqlResult,schemaStr);
	console.log('Prompt being sent to LLM:\n', prompt);

	const response = await axios.post(
		`${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
		{
			messages: [{ role: 'user', content: prompt }],
			temperature: 0,
			max_tokens: 500,
		},
		{
			headers: {
				'api-key': process.env.AZURE_OPENAI_KEY!,
				'Content-Type': 'application/json',
			},
		},
	);

	const answer = response.data.choices[0].message.content.trim();
	console.log('Generated Answer:', answer);
	return { ...state, answer };

}
