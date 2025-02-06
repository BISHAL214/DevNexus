import GeometricBackground from "@/components/app_components/app_background_pattern/app_geometric_background";
import ExplorePageMain from "@/components/app_components/app_explore/app_explore_main";
import React from "react";

type Props = {};

const ExplorePage = (props: Props) => {
  return (
    <GeometricBackground>
      <ExplorePageMain />
    </GeometricBackground>
  );
};

export default ExplorePage;
