import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { generateAnswer, executeSQLWithSequelize,generateSQLQuery } from "./index";

const State = Annotation.Root({
  question: Annotation<string>(),
  sql: Annotation<string | null>(),
  sqlResult: Annotation<any[] | null>(),
  answer: Annotation<string | null>(),
});

const workflow = new StateGraph(State)
  .addNode("generateSQL", generateSQLQuery)
  .addNode("executeSQL", executeSQLWithSequelize)
  .addNode("generateAnswer", generateAnswer)
  .addEdge(START, "generateSQL")
  .addEdge("generateSQL", "executeSQL")
  .addEdge("executeSQL", "generateAnswer")
  .addEdge("generateAnswer", END);

export const graph = workflow.compile();
