import UserTable from "./components/table/UserTable.js";
import apiService from "./services/api.service.js";

const users = await apiService.getUsers(),
  roles = await apiService.getRoles(),
  companies = await apiService.getCompanies();

document.getElementById("App")!.appendChild(
  UserTable({ users, roles, companies })
);