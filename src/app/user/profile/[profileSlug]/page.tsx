import GeometricBackground from "@/components/app_components/app_background_pattern/app_geometric_background";
import UserProfilePageMain from "@/components/app_components/app_profile/profile_page_main";

const UserProfilePage = () => {
  //   const { profileSlug } = useParams<{ profileSlug: string }>();
  //     console.log(profileSlug);
  return (
    <GeometricBackground>
      <UserProfilePageMain />
    </GeometricBackground>
  );
};

export default UserProfilePage;
