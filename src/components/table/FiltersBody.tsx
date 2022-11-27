import cssClasses from "src/constants/css-classes.js";
import GenderFilter from "../filters/GenderFilter.jsx";
import TextFilter from "../filters/TextFilter.jsx";
import UnsetFiltersButton from "../filters/UnsetFiltersButton.jsx";
import CompanyDropdownFilter from "../dropdowns/company/CompanyDropdownFilter.jsx";
import RoleDropdownFilter from "../dropdowns/role/RoleDropdownFilter.jsx";

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
          <RoleDropdownFilter usersService={usersService} />
        </div>
        <div className={cssClasses.CELL}>
          <UnsetFiltersButton usersService={usersService} />
        </div>
      </div>
    </section>
  );
}