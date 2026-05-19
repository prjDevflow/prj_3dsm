import { ClientsView } from "./clients.view";
import { useClientsModel } from "./clients.model";
import { ClientsService } from "../../services/implementations/ClientsService";

const Clients = () => {
  const clientsService = new ClientsService(); // Instantiate ClientsService
  const methods = useClientsModel({ clientsService }); // Pass clientsService to the hook

  return <ClientsView {...methods} />;
};

export default Clients;
