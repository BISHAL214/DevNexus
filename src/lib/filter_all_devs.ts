import { Developer } from "@/hooks/use-all-devs";
import { RecommendDevsType } from "@/hooks/use-recommend_devs";

export const filter_all_devs = (
  all_devs: Developer[],
  recommend_devs: RecommendDevsType[],
  user_id: string
) => {
  return all_devs.filter(
    (dev) =>
      dev.id !== user_id &&
      !recommend_devs.some((recommended) => recommended.id === dev.id)
  );
};
