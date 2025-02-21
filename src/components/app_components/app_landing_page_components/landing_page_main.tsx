"use client";

import GeometricBackground from "../app_background_pattern/app_geometric_background";
import { LandingPageCallToActionSection } from "./landing_calltoaction";
import { LandingPageCollaborationsSection } from "./landing_collaborations";
import LandingPageGlobalConnectionsSection from "./landing_connections";
import LandingPageFaqSection from "./landing_faqs";
import { LandingPageFeaturesSection } from "./landing_features";
import LandingPageHeroSection from "./landing_hero";
import LandingPageHowItworksSection from "./landing_howItWorks";
import { LandingPageTestimonialSection } from "./landing_tetimonials";

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  viewport: { once: true },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};
const LandingPageMain = () => {
  return (
    <GeometricBackground>
      <div>
        <LandingPageHeroSection />
        <LandingPageFeaturesSection />
        <LandingPageHowItworksSection />
        <LandingPageGlobalConnectionsSection />
        <LandingPageCollaborationsSection />
        <LandingPageTestimonialSection />
        <LandingPageFaqSection />
        <LandingPageCallToActionSection />
      </div>
    </GeometricBackground>
  );
};

export default LandingPageMain;
