export const SUBMIT_QUESTION = `mutation {
  askQuestion(question:$question)
}`;
export const EARTHQUAKE_STATS = `
  query {
  getCounts {
    total_count
    max_mag
    max_mag_place
  }
}
`;

export const QUAKES_CHART = `
query {
  getDataForQuakesChart {
    interval
    count
  }
}`;

export const QUAKES_BY_SIZE = `
    query {
      weatherStats {
        id
        external_id
        place
        updated
        mag
      }
    }
  `;
