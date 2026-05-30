import { Bell, Globe, Sun, Store } from "lucide-react";
import {
  loadSettings,
  saveSettings,
  applySettings,
  AppSettings,
} from "../../services/settingsService";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/instanceApi";

type StoreItem = { id: string; nome: string };
type OrigemItem = { id: string; nome: string };

export const useSettingsModel = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [cfg, setCfg] = useState<AppSettings>(loadSettings);

  const set = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setCfg((prev) => ({ ...prev, [key]: value }));

  // Lojas e Origens
  const [lojas, setLojas] = useState<StoreItem[]>([]);
  const [origens, setOrigens] = useState<OrigemItem[]>([]);
  const [newLoja, setNewLoja] = useState("");
  const [newOrigem, setNewOrigem] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");

  const fetchLojas = async () => {
    const { data } = await api.get<StoreItem[]>("/lojas");
    setLojas(data);
  };

  const fetchOrigens = async () => {
    const { data } = await api.get<OrigemItem[]>("/origens");
    setOrigens(data);
  };

  useEffect(() => {
    if (activeTab === "data") {
      setLoadingData(true);
      setDataError("");
      Promise.all([fetchLojas(), fetchOrigens()])
        .catch(() => setDataError("Erro ao carregar lojas e origens."))
        .finally(() => setLoadingData(false));
    }
  }, [activeTab]);

  const handleAddLoja = async () => {
    if (!newLoja.trim()) return;
    try {
      await api.post("/lojas", { nome: newLoja.trim() });
      setNewLoja("");
      await fetchLojas();
    } catch (e: any) {
      setDataError(e?.response?.data?.error ?? "Erro ao criar loja.");
    }
  };

  const handleDeleteLoja = async (id: string) => {
    try {
      await api.delete(`/lojas/${id}`);
      await fetchLojas();
    } catch {
      setDataError("Erro ao remover loja.");
    }
  };

  const handleAddOrigem = async () => {
    if (!newOrigem.trim()) return;
    try {
      await api.post("/origens", { nome: newOrigem.trim() });
      setNewOrigem("");
      await fetchOrigens();
    } catch (e: any) {
      setDataError(e?.response?.data?.error ?? "Erro ao criar origem.");
    }
  };

  const handleDeleteOrigem = async (id: string) => {
    try {
      await api.delete(`/origens/${id}`);
      await fetchOrigens();
    } catch {
      setDataError("Erro ao remover origem.");
    }
  };

  const tabs = [
    { id: "general", name: "Geral", icon: Globe },
    { id: "appearance", name: "Aparência", icon: Sun },
    { id: "notifications", name: "Notificações", icon: Bell },
    ...(isAdmin ? [{ id: "data", name: "Lojas & Origens", icon: Store }] : []),
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
    set,
    isAdmin,
    lojas,
    origens,
    newLoja,
    setNewLoja,
    newOrigem,
    setNewOrigem,
    loadingData,
    dataError,
    handleAddLoja,
    handleDeleteLoja,
    handleAddOrigem,
    handleDeleteOrigem,
  };
};
