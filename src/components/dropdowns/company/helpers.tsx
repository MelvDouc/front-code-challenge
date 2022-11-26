import { EditMode } from "src/constants/enums.js";
import Company from "src/models/company.model.js";
import { initializeAsFilter } from "src/components/dropdowns/Dropdown.jsx";
import DropdownCheckbox from "src/components/dropdowns/DropdownCheckbox.jsx";

export function getCompanyCheckboxes(
  companies: Company[],
  obs: Observable<Set<string>>,
  oninput: (companyName: string) => void,
  indentation = 0
): HTMLElement[] {
  return companies.reduce((acc, company) => {
    acc.push(
      <DropdownCheckbox
        checked={false}
        oninput={() => oninput(company.name)}
        $init={(input) => {
          obs.subscribe((set) => set.has(company.name) || (input.checked = false));
        }}
        value={company.name}
        indentation={indentation}
      /> as HTMLElement,
      ...getCompanyCheckboxes(company.children, obs, oninput, indentation + 1)
    );
    return acc;
  }, [] as HTMLElement[]);
}

export function initAsCompanyFilter(usersService: UsersService) {
  return initializeAsFilter<string>(usersService, (set) => {
    const companies = [...set];
    return (companies.length)
      ? (user) => companies.some((name) => Company.get(name)!.hasUser(user))
      : null;
  });
}

export function getCompanyDropdownFilterBehavior(set: Set<string>, companyName: string) {
  if (set.has(companyName)) {
    set.delete(companyName);
  } else {
    set.add(companyName);
    for (const parent of Company.get(companyName)!.allParents())
      set.delete(parent.name);
  }
  for (const child of Company.get(companyName)!.allChildren()) {
    set.delete(child.name);
  }
  return set;
}

export function getCompanyDropdownEditorBehavior(set: Set<string>, companyName: string) {
  if (set.has(companyName))
    return new Set<string>();
  return new Set([companyName]);
}

export function initAsCompanyEditor(userObs: Observable<User>, editModeObs: Observable<EditMode>) {
  const COMPANY_NAME = userObs.getValue().company;

  return (companyObs: Observable<Set<string>>) => {
    editModeObs.subscribe((value) => {
      switch (value) {
        case EditMode.VALIDATE:
          const [companyName] = [...companyObs.getValue()];
          if (typeof companyName !== "string")
            return;
          userObs.updateValue((user) => {
            user.company = companyName;
            return user;
          });
          break;
        case EditMode.CANCEL:
          companyObs.setValue(new Set(COMPANY_NAME));
      }
    });
  };
}