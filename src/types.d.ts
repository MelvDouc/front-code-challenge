import("reactfree-jsx");

type Updater<T> = (value: T) => T;
type UserFilter = (user: User) => boolean;
type Role = string;
type Company = import("./models/company.model.js").default;
type User = import("./models/user.model.js").default;
type Observable<T> = import("reactfree-jsx").Observable<T>;
type Gender = import("./constants/enums.js").Gender;
type EditMode = import("./constants/enums.js").EditMode;
type SortingOrder = import("./constants/enums.js").SortingOrder;
type UsersService = import("./services/users.service.js").default;
type EditableUserKey = "name" | "address" | "email" | "gender" | "company" | "roles";
type ColumnKey = EditableUserKey | "actions";
type Columns = Record<ColumnKey, {
  header: string;
  getRow: (user: User) => Node | string;
  getFilter: (usersService: UsersService) => HTMLElement;
}>;

interface DbCompany {
  name: string;
  companies?: DbCompany[];
}

interface _User {
  id: string;
  name: string;
  email: string;
  address: string;
  roles: Role[];
  company: string;
}

interface DbUser extends _User {
  male: boolean;
}

interface User extends _User {
  serialNumber: number;
  gender: Gender;
  isHidden: boolean;
  isDeleted: boolean;
}