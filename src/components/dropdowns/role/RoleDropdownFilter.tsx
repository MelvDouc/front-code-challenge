import { Observable } from "reactfree-jsx";
import { defaultChoice } from "../../../constants/misc.js";
import Dropdown, { makeDeactivable } from "../Dropdown.jsx";
import DropdownCheckbox from "../DropdownCheckbox.jsx";

export default function RoleDropdownFilter({ usersService }: {
  usersService: UsersService;
}) {
  const key = Symbol();
  const roles = usersService.roles;
  const roleObs = new Observable(new Set<Role>());

  usersService.onFiltersCleared(() => {
    if (roleObs.getValue().size)
      roleObs.updateValue((roles) => (roles.clear(), roles));
  });

  roleObs.subscribe((roles) => {
    if (roles.size)
      usersService.setFilter(key, (user) => user.roles.some(role => roles.has(role)));
    else
      usersService.unsetFilter(key);
  });

  const dropdown = (
    <Dropdown
      startValue={defaultChoice}
      $init={() => { }}
      handleView={(element) => {
        roleObs.subscribe((roles) => {
          element.innerText = (roles.size === 0) ? defaultChoice
            : (roles.size === 1) ? [...roles][0]
              : `${roles.size} roles selected`;
        });
      }}
    >
      <DropdownCheckbox
        value={defaultChoice}
        checked={true}
        oninput={() => roleObs.updateValue((roles) => (roles.clear(), roles))}
        $init={(input) => roleObs.subscribe((roles) => input.checked = !roles.size)}
      />
      {roles.map((role) => (
        <DropdownCheckbox
          value={role}
          checked={false}
          oninput={() => {
            roleObs.updateValue((roles) => {
              roles.has(role) ? roles.delete(role) : roles.add(role);
              return roles;
            });
          }}
          $init={(input) => {
            roleObs.subscribe((roles) => {
              input.checked = roles.has(role);
            });
          }}
        />
      ))}
    </Dropdown>
  );

  return makeDeactivable(dropdown, usersService);
}