import { UserRole } from "../../types";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId?: string;
  active?: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  teamId: string;
  password: string;
  active: boolean;
}