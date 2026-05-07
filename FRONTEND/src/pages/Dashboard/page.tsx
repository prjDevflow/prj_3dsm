import { useDashboardModel } from "./dashboard.model";
import { DashboardView } from "./dashboard.view";
import { DashboardService } from "../../services/implementations/DashboardService";


const Dashboard = () => {
  const dashboardService = new DashboardService();
  const methods = useDashboardModel({
    dashboardService,
  });

  return <DashboardView {...methods} />
};

export default Dashboard;
