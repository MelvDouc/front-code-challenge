import { EditMode } from "src/constants/enums.js";
import { initializeAsFilter } from "../Dropdown.jsx";

export function initializeAsRoleFilter(usersService: UsersService) {
  return initializeAsFilter<Role>(usersService, (set) => {
    return (set.size)
      ? (user) => user.roles.some((role) => set.has(role))
      : null;
  });
}

export function initAsRoleEditor(userObs: Observable<User>, editModeObs: Observable<EditMode>) {
  const ROLES = userObs.getValue().roles;

  return (roleObs: Observable<Set<Role>>) => {
    editModeObs.subscribe((value) => {
      switch (value) {
        case EditMode.VALIDATE:
          const newRoles = roleObs.getValue();
          if (!newRoles.size)
            return;
          userObs.updateValue((user) => {
            user.roles = [...newRoles];
            return user;
          });
          break;
        case EditMode.CANCEL:
          roleObs.setValue(new Set(ROLES));
      }
    });
  };
}