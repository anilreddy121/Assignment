export const API_URL = "https://react.eogresources.com";
export const DROPDOWN_QUERY = `{
      getMetrics
      __typename
}
`

export const GRAPH_QUERY = `query ($input: [MeasurementQuery]) {
      getMultipleMeasurements(input: $input) {
        metric
        measurements {
          at
          value
          metric
          unit
          __typename
    }
    __typename
  }
  __typename
}
`