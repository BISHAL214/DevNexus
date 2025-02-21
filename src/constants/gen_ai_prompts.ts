// tech trends prompt
export const tech_trend_prompt = `
this is example of what type and what data i want as a json, provide most possibility real data, i'm looking for top 5 current real life tech trends in this type json format in array. the historical data and geographical distribution atleast contains previous 5 years(remove the current year and get previous 5 years data, like if the current year is 2025, get these years data - 2024, 2023, 2022, 2021, 2020) data and 5 geographic distribution, please provide the data in this format. 

the format is as follows:
  interface TechTrend { 
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
 provide only JSON no other texts.
`;
