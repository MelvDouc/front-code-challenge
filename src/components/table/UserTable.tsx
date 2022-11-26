import UsersService from "src/services/users.service.js";
import FiltersBody from "./FiltersBody.js";
import UsersBody from "./UsersBody.js";
import UserTableHead from "./UserTableHead.jsx";
import "src/styles/UserTable.scss";
import "src/styles/Dropdown.scss";


export default function UserTable({ users, roles, companies }: {
  users: User[];
  roles: Role[];
  companies: Company[];
}) {

  const usersService = new UsersService({ users, roles, companies });

  return (
    <div className="users-table">
      <UserTableHead usersService={usersService} />
      <FiltersBody usersService={usersService} />
      <UsersBody usersService={usersService} />
    </div>
  );
}