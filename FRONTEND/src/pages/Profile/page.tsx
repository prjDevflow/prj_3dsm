import { AuthService } from "../../services/implementations/AuthService";
import { useProfileModel } from "./profile.model";
import { ProfileView } from "./profile.view";

const Profile = () => {
  const authService = new AuthService();

  const methods = useProfileModel({ authService });

  return <ProfileView {...methods} />;
};

export default Profile;
