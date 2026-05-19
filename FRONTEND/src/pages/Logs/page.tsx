import { LogsService } from "../../services/LogsService";
import { useLogsModel } from "./logs.model";
import { LogsView } from "./logs.view";

const Logs = () => {
  const logsService = new LogsService();
  const methods = useLogsModel({ logsService });

  return <LogsView {...methods} />;
};

export default Logs;
