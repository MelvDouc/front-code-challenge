import { Observable } from "reactfree-jsx";
import { defaultChoice } from "../../../constants/misc.js";
import Company from "../../../models/company.model.js";
import Dropdown, { getCheckmarkFixer } from "../Dropdown.js";
import DropdownCheckbox from "../DropdownCheckbox.js";
import CompanyTag from "./CompanyTag.jsx";
import { getCompanyCheckboxes } from "./helpers.jsx";

function CompanyDropdown({ companies, startValue, $init, includeDefault, checkboxBehavior }: {
  companies: Company[];
  startValue: any;
  $init: (obs: Observable<Set<string>>) => void;
  includeDefault: boolean;
  checkboxBehavior: (set: Set<string>, companyName: string) => Set<string>;
}) {
  const companyObs = new Observable(new Set<string>());
  const fixCheckmark = getCheckmarkFixer<string>(companyObs);
  const deleteFromSet = (companyName: string) => {
    companyObs.updateValue((names) => {
      names.delete(companyName);
      return names;
    });
  };

  return (
    <Dropdown
      startValue={startValue}
      $init={() => $init(companyObs)}
      handleView={(element) => {
        companyObs.subscribe((companies) => {
          if (!companies.size) {
            element.innerHTML = "";
            return;
          }
          element.replaceChildren(...Array.from(companies, (name) => (
            <CompanyTag companyName={name} deleteCompanyFromSet={() => deleteFromSet(name)} />
          )));
        });
      }}
    >
      {includeDefault ?
        <DropdownCheckbox
          checked={true}
          value={defaultChoice}
          oninput={() => companyObs.updateValue((companies) => (companies.clear(), companies))}
          $init={fixCheckmark((companies) => !companies.size)}
        /> : null}
      {getCompanyCheckboxes(companies, companyObs, (companyName) => {
        companyObs.updateValue((set) => checkboxBehavior(set, companyName));
      })}
    </Dropdown>
  );
}

export default CompanyDropdown;

export {
  getCompanyDropdownFilterBehavior,
  getCompanyDropdownEditorBehavior,
  initAsCompanyEditor,
  initAsCompanyFilter,
} from "./helpers.jsx";