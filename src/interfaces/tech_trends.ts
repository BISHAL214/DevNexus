export interface TechTrend {
  name: string;
  type: string;
  trend: "up" | "down" | "neutral";
  summary: string;
  description: string;
  market_size: string; // Most Possible Researched data in format like this - $ 40 million or billion.
  investment_funding: {
    total: string; // Most Possible Researched data in format like this - $ 40 million or billion.
    recent_rounds: { company: string; amount: string; date: string }[]; // Most Possible Researched data in format like this - $ 40 million or billion.
  };
  historical_data: { year: number; market_size: string }[]; // Most Possible Researched data in format like this - year: 2022, amount: $ 40 million or billion
  geographic_distribution: { [key: string]: number }; // % of market share - Most Possible Researched data
}
