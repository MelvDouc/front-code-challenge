import { Observable } from "reactfree-jsx";
import { EditMode } from "../../../constants/enums.js";
import Dropdown from "../Dropdown.jsx";
import DropdownCheckbox from "../DropdownCheckbox.jsx";

export default function RoleDropdownEditor({ userObs, editModeObs, roles }: {
  userObs: Observable<User>;
  editModeObs: Observable<EditMode>;
  roles: Role[];
}) {
  const startValue = Object.freeze(userObs.getValue().roles);
  const roleObs = new Observable<Role[]>([...startValue]);

  editModeObs.subscribe((value) => {
    switch (value) {
      case EditMode.VALIDATE:
        userObs.updateValue((user) => {
          user.roles = roleObs.getValue();
          return user;
        });
        break;
      case EditMode.CANCEL:
        roleObs.setValue([...startValue]);
    }
  });

  return (
    <Dropdown
      startValue={rolesToText([...startValue])}
      handleView={(element) => {
        roleObs.subscribe((roles) => {
          element.innerText = rolesToText(roles);
        });
      }}
      $init={() => { }}
    >
      {roles.map((role) => (
        <DropdownCheckbox
          value={role}
          checked={startValue.includes(role)}
          $init={(input) => {
            roleObs.subscribe((roles) => {
              input.checked = roles.includes(role);
            });
          }}
          oninput={() => {
            roleObs.updateValue((roles) => {
              if (roles.length === 1 && roles[0] === role)
                return roles;
              return (roles.includes(role))
                ? roles.filter((item) => item !== role)
                : roles.concat(role);
            });
          }}
        />
      ))}
    </Dropdown>
  );
}

function rolesToText(roles: Role[]) {
  return (roles.length === 1)
    ? roles[0]
    : roles.join(", ");
}