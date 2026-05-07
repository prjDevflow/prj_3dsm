import { useLogsModel } from "./logs.model";
import { LogsView } from "./logs.view";

const Logs = () => {
  const methods = new useLogsModel()

  return <LogsView {...methods} />
};

export default Logs;
