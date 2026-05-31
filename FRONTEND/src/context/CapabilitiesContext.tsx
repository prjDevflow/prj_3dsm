import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { Capabilities } from '../types';

// Capabilities padrão por role (fallback quando backend não retorna)
const DEFAULTS: Record<string, Capabilities> = {
  admin: {
    pages:   { dashboard: true,  leads: true, clients: true, logs: true,  admin: true,  settings: true,  users: true,  teams: true  },
    actions: { export_csv: true, import_csv: true, create_lead: true, delete_lead: true, view_all_leads: true, create_user: true, delete_user: true },
  },
  gerente_geral: {
    pages:   { dashboard: true,  leads: true, clients: true, logs: true,  admin: false, settings: true,  users: false, teams: true  },
    actions: { export_csv: true, import_csv: true, create_lead: true, delete_lead: false, view_all_leads: true, create_user: false, delete_user: false },
  },
  gerente: {
    pages:   { dashboard: true,  leads: true, clients: true, logs: false, admin: false, settings: false, users: false, teams: true  },
    actions: { export_csv: true, import_csv: true, create_lead: true, delete_lead: false, view_all_leads: false, create_user: false, delete_user: false },
  },
  atendente: {
    pages:   { dashboard: true,  leads: true, clients: true, logs: false, admin: false, settings: false, users: false, teams: false },
    actions: { export_csv: true, import_csv: false, create_lead: true, delete_lead: false, view_all_leads: false, create_user: false, delete_user: false },
  },
};

interface CapabilitiesContextType {
  capabilities: Capabilities;
  can:     (action: string) => boolean;
  canPage: (page: string)   => boolean;
}

const CapabilitiesContext = createContext<CapabilitiesContextType | null>(null);

export const CapabilitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const capabilities: Capabilities = user?.capabilities ?? DEFAULTS[user?.role ?? 'atendente'] ?? DEFAULTS.atendente;

  const can     = (action: string) => capabilities.actions[action] ?? false;
  const canPage = (page: string)   => capabilities.pages[page]     ?? false;

  return (
    <CapabilitiesContext.Provider value={{ capabilities, can, canPage }}>
      {children}
    </CapabilitiesContext.Provider>
  );
};

export const useCapabilities = () => {
  const ctx = useContext(CapabilitiesContext);
  if (!ctx) throw new Error('useCapabilities must be used within CapabilitiesProvider');
  return ctx;
};
