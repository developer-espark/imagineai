import axios from 'axios';
import db from '@/models';

// --- Helper: LLM generates SQL query ---
export async function generateSQLQuery(question: string) {
	const prompt = `
You are an AI that converts natural language questions into safe SQL queries for PostgreSQL.

The table 'earthquakes' has the following columns:
id (text), place (text), magnitude (float), time (timestamp), updated (timestamp), tz (int), url (text), detail (text), felt (int), cdi (float), mmi (float), alert (text), status (text), tsunami (int), sig (int), net (text), code (text), ids (text), sources (text), types (text), nst (int), dmin (float), rms (float), gap (float), magType (text), type (text), title (text), latitude (float), longitude (float), depth (float).

Constraints:
- Do NOT select any data outside this table or timeframe.
- Only return records from the last 1 hour only.
- Do NOT try to answer with logic; only generate SQL.
- Do NOT add filters for tsunami, felt, magnitude, etc. unless explicitly requested by the question.
- Do NOT include markdown, explanations, or comments.
- Return only a valid SQL SELECT statement.

### Few-shot examples:

User Question: Has a tsunami occurred at 16 km SSE of McCloud, CA?  
SQL Query: SELECT * FROM earthquakes WHERE place LIKE '16 km SSE of McCloud, CA' AND time >= NOW() - INTERVAL '1 hour';

User Question: What was the average magnitude of earthquakes in Alaska?  
SQL Query: SELECT AVG(magnitude) AS average_magnitude FROM earthquakes WHERE place LIKE '%Alaska%' AND time >= NOW() - INTERVAL '1 hour';

User Question: List all events in California with magnitude greater than 2.0.  
SQL Query: SELECT id, place, magnitude, time, depth FROM earthquakes WHERE place LIKE '%California%' AND magnitude > 2 AND time >= NOW() - INTERVAL '1 hour';

User Question: How many earthquakes were reported by at least 10 people?  
SQL Query: SELECT COUNT(*) AS reported_count FROM earthquakes WHERE felt >= 10 AND time >= NOW() - INTERVAL '1 hour';

User Question: Get the maximum depth of earthquakes in Mexico.  
SQL Query: SELECT MAX(depth) AS max_depth FROM earthquakes WHERE place LIKE '%Mexico%' AND time >= NOW() - INTERVAL '1 hour';

User Question: Find the sum of significance of all earthquakes in Japan.  
SQL Query: SELECT SUM(sig) AS total_significance FROM earthquakes WHERE place LIKE '%Japan%' AND time >= NOW() - INTERVAL '1 hour';

User Question: Show the ID, place, and magnitude of the last 5 earthquakes in Puerto Rico.  
SQL Query: SELECT id, place, magnitude, time FROM earthquakes WHERE place LIKE '%Puerto Rico%' AND time >= NOW() - INTERVAL '1 hour' ORDER BY time DESC LIMIT 5;

User Question: Retrieve the minimum and maximum depth of earthquakes in California.  
SQL Query: SELECT MIN(depth) AS min_depth, MAX(depth) AS max_depth FROM earthquakes WHERE place LIKE '%California%' AND time >= NOW() - INTERVAL '1 hour';

User Question: Give me the ID, place, and whether a tsunami occurred for all events near Anza, CA.  
SQL Query: SELECT id, place, tsunami FROM earthquakes WHERE place LIKE '%Anza, CA%' AND time >= NOW() - INTERVAL '1 hour';


---

Now, generate the SQL query for the following question:

Question: ${question}  
SQL Query:
`;
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
	return sql;
}

export async function executeSQLWithSequelize(sql: string) {
	const [results] = await db.query(sql, { raw: true });
	return results;
}
// --- LLM generates natural language answer ---
export async function generateAnswer(question: string, sqlResult: any[]) {
	if (!sqlResult.length) return 'I could not find any records matching your request.';

	const prompt = `
You are an AI assistant that ONLY answers questions based on the earthquake data provided below.
Each earthquake has a timestamp in ISO format.
Do NOT make up information.
Do NOT provide any source or reference that you using to generate answer like "in the given information","data provided shows" etc...
Answer naturally, in a clear and concise way, summarizing the relevant information. 
Do not include raw field names or numeric labels. 
If there is no relevant data TO ANSWER, respond with "No data found for the given question."

Earthquake Data:
${JSON.stringify(sqlResult)}

User Question:
${question}

Answer (include earthquake ID if reporting any specific earthquake):
`;
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

	return response.data.choices[0].message.content.trim();
}
