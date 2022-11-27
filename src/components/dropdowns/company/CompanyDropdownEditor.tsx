import { Observable } from "reactfree-jsx";
import { EditMode } from "../../../constants/enums.js";
import Dropdown from "../Dropdown.jsx";
import CompanyTag from "./CompanyTag.jsx";
import { getCompanyCheckboxes } from "./helpers.jsx";

export default function CompanyDropdownEditor({ userObs, editModeObs, companies }: {
  userObs: Observable<User>;
  editModeObs: Observable<EditMode>;
  companies: Company[];
}) {
  const startValue = userObs.getValue().company;
  const companyObs = new Observable<string | null>(startValue);

  const $init = (input: HTMLInputElement, companyName: string) => {
    companyObs.subscribe((value) => {
      const checked = value === companyName;
      if (input.checked !== checked)
        input.checked = checked;
    });
  };
  const handleInput = (companyName: string) => {
    companyObs.updateValue((value) => (value === companyName) ? null : companyName);
  };

  editModeObs.subscribe((value) => {
    switch (value) {
      case EditMode.VALIDATE:
        const companyName = companyObs.getValue();
        if (typeof companyName !== "string")
          return;
        userObs.updateValue((user) => {
          user.company = companyName;
          return user;
        });
        break;
      case EditMode.CANCEL:
        companyObs.setValue(startValue);
    }
  });

  return (
    <Dropdown
      $init={() => { }}
      handleView={(element) => {
        companyObs.subscribe((companyName) => {
          if (!companyName) {
            element.innerHTML = "";
            return;
          }
          element.appendChild(
            <CompanyTag companyName={companyName} removeFn={() => companyObs.setValue(null)} />
          );
        });
      }}
      startValue={startValue}
    >
      {getCompanyCheckboxes({ companies, $init, oninput: handleInput })}
    </Dropdown>
  );
}