import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { useTeams } from '../hooks/useTeams';
import { User, UserRole } from '../types';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UsersView } from './users.view';
import { useUsersModel } from './users.model';

const Users = () => {

  const methods = useUsersModel()

  return <UsersView {...methods}/> 
};

export default Users;