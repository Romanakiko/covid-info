export interface Covid {
  "infected": number,
  "tested": number,
  "recovered": number,
  "deceased": number,
  "country": string,
  "moreData": string,
  "historyData": string,
  "lastUpdatedApify": Date
}

export interface CovidDetails {
  "infected": number,
  "deceased": number,
  "recovered": number,
  "activeCases": number,
  "tested": number,
  "critical": number,
  "sourceUrl": string,
  "lastUpdatedAtApify": Date,
  "readMe": string
}
