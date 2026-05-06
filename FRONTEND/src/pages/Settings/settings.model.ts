import { Bell, Globe, Sun } from "lucide-react";
import {
  loadSettings,
  saveSettings,
  applySettings,
  AppSettings,
} from "../../services/settingsService";
import { useState } from "react";

export const useSettingsModel = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [cfg, setCfg] = useState<AppSettings>(loadSettings);

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setCfg((prev) => ({ ...prev, [key]: value }));

  const tabs = [
    { id: "general", name: "Geral", icon: Globe },
    { id: "appearance", name: "Aparência", icon: Sun },
    { id: "notifications", name: "Notificações", icon: Bell },
  ];

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      saveSettings(cfg);
      applySettings(cfg);
      setSuccess("Configurações salvas com sucesso!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Erro ao salvar as configurações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return {
    success,
    error,
    tabs,
    setActiveTab,
    activeTab,
    cfg,
    handleSave,
    saving,
    set
  };
};
