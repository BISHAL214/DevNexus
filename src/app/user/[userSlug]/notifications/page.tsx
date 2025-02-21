import GeometricBackground from "@/components/app_components/app_background_pattern/app_geometric_background";
import UserNotificationsMain from "@/components/app_components/app_notifications/app_notifications_main";
import React from "react";

type Props = {};

const UserNotificationsPage = (props: Props) => {
  return (
    <GeometricBackground>
      <div className="min-h-screen bg-transparent py-16">
        <UserNotificationsMain />
      </div>
    </GeometricBackground>
  );
};

export default UserNotificationsPage;
