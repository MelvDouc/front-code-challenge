import { Observable } from "reactfree-jsx";
import { defaultChoice } from "src/constants/misc.js";
import Company from "../../../models/company.model.js";
import Dropdown, { makeDeactivable } from "../Dropdown.jsx";
import DropdownCheckbox from "../DropdownCheckbox.jsx";
import CompanyTag from "./CompanyTag.jsx";

export default function CompanyDropdownFilter({ usersService }: {
  usersService: UsersService;
}) {
  const key = Symbol();
  const companiesObs = new Observable<Set<string>>();

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

  return (
    <Dropdown
      startValue={defaultChoice}
      $init={(dropdown) => makeDeactivable(dropdown, usersService)}
      handleView={(element) => {
        companiesObs.subscribe((companies) => {
          if (!companies.size) {
            element.replaceChildren(
              <CompanyTag companyName={defaultChoice} />
            );
            return;
          }
          element.replaceChildren(...Array.from(companies, (companyName) => (
            <CompanyTag
              companyName={companyName}
              removeFn={() => companiesObs.updateValue((set) => (set.clear(), set))}
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
      {usersService.companies.map((company) => (
        <DropdownCheckbox
          checked={false}
          value={company.name}
          oninput={() => {
            companiesObs.updateValue((set) => {
              if (set.has(company.name)) {
                set.delete(company.name);
              } else {
                set.add(company.name);
                for (const parent of Company.get(company.name)!.allParents())
                  set.delete(parent.name);
              }
              for (const child of Company.get(company.name)!.allChildren()) {
                set.delete(child.name);
              }
              return set;
            });
          }}
        />
      ))}
    </Dropdown>
  );
}