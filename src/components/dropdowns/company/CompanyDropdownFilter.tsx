import { Observable } from "reactfree-jsx";
import { defaultChoice } from "src/constants/misc.js";
import Company from "src/models/company.model.js";
import Dropdown, { makeDeactivable } from "../Dropdown.jsx";
import DropdownCheckbox from "../DropdownCheckbox.jsx";
import CompanyTag from "./CompanyTag.jsx";
import { getCompanyCheckboxes } from "./helpers.jsx";

export default function CompanyDropdownFilter({ usersService }: {
  usersService: UsersService;
}) {
  const key = Symbol();
  const companiesObs = new Observable<Set<string>>(new Set());
  const toggler = getToggler(companiesObs);
  const allTag = (
    <CompanyTag
      companyName={defaultChoice}
      removeFn={() => companiesObs.updateValue((set) => (set.clear(), set))}
    />
  );

  usersService.onFiltersCleared(() => {
    if (companiesObs.getValue().size)
      companiesObs.updateValue((set) => (set.clear(), set));
  });

  companiesObs.subscribe((set) => {
    if (set.size)
      usersService.setFilter(key, (user) => {
        for (const name of set)
          if (Company.get(name)!.hasUser(user))
            return true;
        return false;
      });
    else
      usersService.unsetFilter(key);
  });

  const dropdown = (
    <Dropdown
      startValue={allTag}
      $init={() => { }}
      handleView={(element) => {
        companiesObs.subscribe((companies) => {
          if (!companies.size)
            return element.replaceChildren(allTag);
          element.replaceChildren(...Array.from(companies, (companyName) => (
            <CompanyTag
              companyName={companyName}
              removeFn={() => companiesObs.updateValue((companies) => (companies.delete(companyName), companies))}
            />
          )));
        });
      }}
    >
      <DropdownCheckbox
        value={defaultChoice}
        checked={true}
        oninput={() => companiesObs.updateValue((set) => (set.clear(), set))}
      />
      {getCompanyCheckboxes({
        companies: usersService.companies,
        $init: (input, name) => {
          companiesObs.subscribe((set) => {
            input.checked = set.has(name);
          });
        },
        oninput: toggler
      })}
    </Dropdown>
  );

  return makeDeactivable(dropdown, usersService);
}

function getToggler(companiesObs: Observable<Set<string>>) {
  return (companyName: string) => {
    companiesObs.updateValue((set) => {
      if (set.has(companyName)) {
        set.delete(companyName);
      } else {
        set.add(companyName);
        for (const child of Company.get(companyName)!.allChildren())
          set.delete(child.name);
      }
      for (const parent of Company.get(companyName)!.allParents())
        set.delete(parent.name);
      return set;
    });
  };
}