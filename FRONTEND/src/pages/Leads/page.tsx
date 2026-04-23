import { GetLeadService } from "../../services/implementations/GetLeadService";
import { useLeadsModel } from "./leads.model";
import { LeadsView } from "./leads.view";

const Leads = () => {
  const getLeadsService = new GetLeadService();
  const methods = useLeadsModel({
    getLeadsService,
  });

  return <LeadsView {...methods} />;
};

export default Leads;
