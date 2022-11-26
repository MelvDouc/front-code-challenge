import cssClasses from "src/constants/css-classes.js";
import { EditMode, Gender } from "src/constants/enums.js";
import RoleDropdown, { initAsRoleEditor } from "src/components/dropdowns/role/RoleDropdown.jsx";
import RowButton from "./RowButton.jsx";
import CompanyDropdown, { initAsCompanyEditor, getCompanyDropdownEditorBehavior } from "src/components/dropdowns/company/CompanyDropdown.jsx";

export default function EditRow({ userObs, editModeObs, roles, companies }: {
  roles: Role[];
  companies: Company[];
  userObs: Observable<User>;
  editModeObs: Observable<EditMode>;
}) {
  const editor = getEditor(editModeObs, userObs);
  const user = userObs.getValue();

  return (
    <div classNames={[cssClasses.ROW, "edit-row"]}>
      <div className={cssClasses.CELL}>
        <input type="text" $init={editor("name")} />
      </div>
      <div className={cssClasses.CELL}>
        <input type="text" $init={editor("email")} />
      </div>
      <div className={cssClasses.CELL}>
        <select $init={editor("gender")}>
          {[Gender.MALE, Gender.FEMALE].map((gender) => (
            <option value={gender} selected={user.gender === gender}>{gender}</option>
          ))}
        </select>
      </div>
      <div className={cssClasses.CELL}>
        <input type="text" $init={editor("address")} />
      </div>
      <div className={cssClasses.CELL}>
        <CompanyDropdown
          includeDefault={false}
          startValue={user.company}
          companies={companies}
          checkboxBehavior={getCompanyDropdownEditorBehavior}
          $init={initAsCompanyEditor(userObs, editModeObs)}
        />
      </div>
      <div className={cssClasses.CELL}>
        <RoleDropdown
          includeDefault={false}
          noSizeText=""
          startValue={user.roles}
          roles={roles}
          $init={initAsRoleEditor(userObs, editModeObs)}
        />
      </div>
      <div className={cssClasses.CELL}>
        <RowButton
          iconClass="fa-solid fa-check"
          color="green"
          handleClick={() => editModeObs.setValue(EditMode.VALIDATE)}
        />
        <RowButton
          iconClass="fa-solid fa-x"
          color="red"
          handleClick={() => editModeObs.setValue(EditMode.CANCEL)}
        />
      </div>
    </div>
  );
}

function getEditor(editModeObs: Observable<EditMode>, userObs: Observable<User>) {
  const user = userObs.getValue();

  return (prop: EditableUserKey) => {
    let value = user[prop];
    return (element: { value: typeof value; }) => {
      element.value = value;
      editModeObs.subscribe((editMode) => {
        switch (editMode) {
          case EditMode.VALIDATE:
            userObs.updateValue((user) => {
              (user[prop] as typeof element.value) = element.value;
              return user;
            });
            break;
          case EditMode.CANCEL:
            element.value = value;
        }
      });
    };
  };
}