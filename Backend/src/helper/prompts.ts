

export function getSQLPrompt(question: string, schema: string) {
  return `You are an AI that converts natural language questions into safe SQL queries for PostgreSQL.

The table has the following schema:
${schema}

Constraints:
- Do NOT select any data outside this table or timeframe.
- Only return records from the last 1 hour only.
- Do NOT try to answer with logic; only generate SQL.
- Do NOT include markdown, explanations, or comments.
- Return only a valid sql query.

### Examples:

User Question: List all earthquakes in California.  
SQL Query: SELECT * FROM weather_stats WHERE place LIKE '%California%' AND time >= NOW() - INTERVAL '1 hour';

User Question: Show the top 5 strongest earthquakes in Japan.  
SQL Query: SELECT * FROM weather_stats WHERE place LIKE '%Japan%' AND time >= NOW() - INTERVAL '1 hour' ORDER BY magnitude DESC LIMIT 5;

User Question: Count the earthquakes reported by at least 10 people.  
SQL Query: SELECT COUNT(*) AS reported_count FROM weather_stats WHERE felt >= 10 AND time >= NOW() - INTERVAL '1 hour';

---

Now, generate the SQL query for the following question:

Question: ${question}  
SQL Query:
`}

export function generateSQLResponse(question: string, query: string, sqlResult: any, schema: string) {
  return `You are an AI assistant. Given the following user question, corresponding SQL query, 
        and SQL result, answer the user question.\n\n
        Answer naturally, in a clear and concise way, summarizing the relevant information. 
        Do not include raw field names or numeric labels. 
        must include earthquake external_id if reporting any specific earthquake.
        If the question is unrelated to the table or outside the context of the provided schema, respond with: "No data found for the given question."

        The table has the following schema:
        ${schema}

        Question: ${question}\n
        SQL Query: ${query}\n
        SQL Result: ${JSON.stringify(sqlResult)}

        Answer:`
      }
