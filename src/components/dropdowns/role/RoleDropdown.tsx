import { Observable } from "reactfree-jsx";
import { defaultChoice } from "src/constants/misc.js";
import Dropdown, { getCheckmarkFixer } from "../Dropdown.js";
import DropdownCheckbox from "../DropdownCheckbox.js";

export default function RoleDropdown({ roles, startValue, includeDefault, $init, noSizeText }: {
  roles: Role[];
  noSizeText: string;
  startValue: Role[];
  $init: (roleObs: Observable<Set<Role>>) => void;
  includeDefault: boolean;
}) {
  const roleObs = new Observable(new Set<Role>());
  const clear = () => roleObs.updateValue((roles) => (roles.clear(), roles));
  const fixCheckmark = getCheckmarkFixer<Role>(roleObs);

  return (
    <Dropdown
      startValue={startValue.join(", ")}
      $init={() => $init(roleObs)}
      handleView={(element) => {
        roleObs.subscribe((roles) => {
          const { size } = roles;
          element.innerText = (size === 0) ? noSizeText
            : (size === 1) ? [...roles as Set<Role>][0]
              : `${size} roles selected`;
        });
      }}
    >
      {includeDefault ? <DropdownCheckbox
        checked={true}
        value={defaultChoice}
        oninput={clear}
        $init={fixCheckmark((roles) => !roles.size)}
      /> : null}
      {roles.map((role) => (
        <DropdownCheckbox
          checked={false}
          value={role}
          oninput={() => roleObs.updateValue((roles) => {
            roles.has(role) ? roles.delete(role) : roles.add(role);
            return roles;
          })}
          $init={fixCheckmark((roles) => roles.has(role))}
        />
      )) as any}
    </Dropdown>
  );
}

export { initAsRoleEditor, initializeAsRoleFilter } from "./helpers.jsx";