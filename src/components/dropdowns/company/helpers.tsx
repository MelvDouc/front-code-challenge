import Company from "src/models/company.model.js";
import DropdownCheckbox from "src/components/dropdowns/DropdownCheckbox.jsx";

export function getCompanyCheckboxes({ companies, $init, oninput, indentation = 0 }: {
  companies: Company[];
  $init: (input: HTMLInputElement, companyName: string) => void;
  oninput: (companyName: string) => void;
  indentation?: number;
}): HTMLElement[] {
  return companies.reduce((acc, company) => {
    acc.push(
      <DropdownCheckbox
        checked={false}
        oninput={() => oninput(company.name)}
        $init={(input) => $init(input, company.name)}
        value={company.name}
        indentation={indentation}
      /> as HTMLElement,
      ...getCompanyCheckboxes({ companies: company.children, $init, oninput, indentation: indentation + 1 })
    );
    return acc;
  }, [] as HTMLElement[]);
}