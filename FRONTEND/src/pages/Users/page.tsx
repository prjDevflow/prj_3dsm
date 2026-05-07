import { UsersView } from './users.view';
import { useUsersModel } from './users.model';
import { UsersService } from '../../services/implementations/UsersService';

const Users = () => {
  const usersService = new UsersService();
  const methods = useUsersModel({ usersService });

  return <UsersView {...methods}/> 
};

export default Users;