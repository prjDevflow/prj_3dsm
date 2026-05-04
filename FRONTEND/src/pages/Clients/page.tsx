import { ClientsView } from "./clients.view";
import { ClientsService } from "../../services/ClientsService";
import { useClientsModel } from "./clients.model";

const Clients = () => {
  const clientsService = new ClientsService(); // Instantiate ClientsService
  const methods = useClientsModel({ clientsService }); // Pass clientsService to the hook

  return <ClientsView {...methods} />;
};

export default Clients;
