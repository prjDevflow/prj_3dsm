import { TeamsService } from "../../services/TeamsService";
import { useTeamsModel } from "./teams.model";
import { TeamsView } from "./teams.view";

const Teams = () => {
  const teamsService = new TeamsService();
  const methods = useTeamsModel({
    teamsService,
  });

  return <TeamsView {...methods} />;
};

export default Teams;
