import { useSettingsModel } from "./settings.model";
import { SettingsView } from "./settings.view";

const Settings = () => {
  const methods = useSettingsModel();

  return <SettingsView {...methods} />;
};

export default Settings;
