import cssClasses from "src/constants/css-classes.js";
import { EditMode, Gender } from "src/constants/enums.js";
import RowButton from "./RowButton.jsx";
import CompanyDropdownEditor from "../../dropdowns/company/CompanyDropdownEditor.jsx";
import RoleDropdownEditor from "../../dropdowns/role/RoleDropdownEditor.jsx";

export default function EditRow({ userObs, editModeObs, roles, companies }: {
  roles: Role[];
  companies: Company[];
  userObs: Observable<User>;
  editModeObs: Observable<EditMode>;
}) {
  const editor = getEditor(editModeObs, userObs);
  const user = userObs.getValue();

  return (
    <div classNames={[cssClasses.ROW]}>
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
        <CompanyDropdownEditor
          companies={companies}
          editModeObs={editModeObs}
          userObs={userObs}
        />
      </div>
      <div className={cssClasses.CELL}>
        <RoleDropdownEditor
          editModeObs={editModeObs}
          userObs={userObs}
          roles={roles}
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