"use client";
import { Badge } from "@/components/ui/badge";
import { TechTrend } from "@/interfaces/tech_trends";
import { Loader } from "../app_loader/__loader";
import { useEffect, useState } from "react";
import { generateTechTrends } from "../../../../actions/user_apis";
import { tech_trend_prompt } from "@/constants/gen_ai_prompts";

export const TechTrends = () => {
  const [trends, setTrends] = useState<TechTrend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await generateTechTrends(tech_trend_prompt);
        setTrends(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trends.length > 0 &&
        trends.map((trend) => (
          <div key={trend?.name} className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-white font-medium leading-none">
                {trend?.name}
              </p>
              <p className="text-sm text-muted-foreground">{trend?.type}</p>
            </div>
            <Badge variant={trend?.trend === "up" ? "default" : "secondary"}>
              {trend?.trend === "up" ? "Trending" : "Stable"}
            </Badge>
          </div>
        ))}
    </div>
  );
};
