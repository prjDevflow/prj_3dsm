export interface AppSettings {
  systemName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  theme: 'light' | 'dark';
  primaryColor: string;
  compactMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  leadCreated: boolean;
  negotiationUpdated: boolean;
  dailyDigest: boolean;
}

const STORAGE_KEY = '@dashboard:settings';

export const defaultSettings: AppSettings = {
  systemName: 'AnalyticsPro',
  supportEmail: 'suporte@analyticspro.com',
  maintenanceMode: false,
  theme: 'light',
  primaryColor: '#0F3B5E',
  compactMode: false,
  emailNotifications: true,
  pushNotifications: false,
  leadCreated: true,
  negotiationUpdated: true,
  dailyDigest: false,
};

export const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {}
  return { ...defaultSettings };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const hexToChannels = (hex: string): [number, number, number] | null => {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
};

export const applySettings = (settings: AppSettings): void => {
  const root = document.documentElement;

  // Tema
  root.classList.toggle('dark', settings.theme === 'dark');

  // Modo compacto
  root.classList.toggle('compact', settings.compactMode);

  // Cor primária — atualiza todas as variáveis CSS derivadas
  const channels = hexToChannels(settings.primaryColor);
  if (channels) {
    const [r, g, b] = channels;
    root.style.setProperty('--color-primary',    settings.primaryColor);
    root.style.setProperty('--color-primary-5',  `rgba(${r},${g},${b},0.05)`);
    root.style.setProperty('--color-primary-10', `rgba(${r},${g},${b},0.10)`);
    root.style.setProperty('--color-primary-20', `rgba(${r},${g},${b},0.20)`);
  }
};
