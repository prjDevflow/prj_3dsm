import { LeadsService } from "../../services/implementations/LeadsService";
import { useLeadsModel } from "./leads.model";
import { LeadsView } from "./leads.view";

const Leads = () => {
  const leadsService = new LeadsService();
  const methods = useLeadsModel({
    leadsService,
  });

  return <LeadsView {...methods} />;
};

export default Leads;
