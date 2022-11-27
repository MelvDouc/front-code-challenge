import cssClasses from "src/constants/css-classes.js";
import RoleDropdown, { initializeAsRoleFilter } from "../dropdowns/role/RoleDropdown.jsx";
import GenderFilter from "../filters/GenderFilter.jsx";
import TextFilter from "../filters/TextFilter.jsx";
import UnsetFiltersButton from "../filters/UnsetFiltersButton.jsx";
import { defaultChoice } from "../../constants/misc.js";
import { makeDeactivable } from "../dropdowns/Dropdown.jsx";
import CompanyDropdownFilter from "../dropdowns/company/CompanyDropdownFilter.jsx";

export default function FiltersBody({ usersService }: {
  usersService: UsersService;
}) {
  return (
    <section classNames={[cssClasses.TBODY, "filters-tbody"]}>
      <div className={cssClasses.ROW}>
        <div className={cssClasses.CELL}>
          <TextFilter prop="name" usersService={usersService} />
        </div>
        <div className={cssClasses.CELL}>
          <TextFilter prop="email" usersService={usersService} />
        </div>
        <div className={cssClasses.CELL}>
          <GenderFilter usersService={usersService} />
        </div>
        <div className={cssClasses.CELL}>
          <TextFilter prop="address" usersService={usersService} />
        </div>
        <div className={cssClasses.CELL}>
          <CompanyDropdownFilter usersService={usersService} />
        </div>
        <div className={cssClasses.CELL}>
          {makeDeactivable(
            <RoleDropdown
              noSizeText={defaultChoice}
              roles={usersService.roles}
              startValue={[defaultChoice]}
              includeDefault={true}
              $init={initializeAsRoleFilter(usersService)}
            />,
            usersService
          )}
        </div>
        <div className={cssClasses.CELL}>
          <UnsetFiltersButton usersService={usersService} />
        </div>
      </div>
    </section>
  );
}