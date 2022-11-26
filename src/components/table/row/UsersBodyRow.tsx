import { Observable } from "reactfree-jsx";
import cssClasses from "src/constants/css-classes.js";
import { EditMode } from "src/constants/enums.js";
import EditRow from "./EditRow.jsx";
import RowButton from "./RowButton.jsx";

export default function UsersBodyRow({ user, usersService }: {
  user: User;
  usersService: UsersService;
}) {
  const editModeObs = new Observable<EditMode>();
  const userObs = new Observable(user);
  const userProp = (cb: (user: User) => string) => (element: HTMLElement) => {
    userObs.subscribe((user) => element.innerText = cb(user));
  };

  const row = (
    <div
      className={cssClasses.ROW}
      $init={getRowInitializer(editModeObs, userObs, usersService)}
    >
      <div className={cssClasses.CELL} $init={userProp((user) => user.name)}></div>
      <div classNames={[cssClasses.CELL, "font-size-small"]} $init={userProp((user) => user.email)}></div>
      <div className={cssClasses.CELL} $init={userProp((user) => user.gender)}></div>
      <div className={cssClasses.CELL} $init={userProp((user) => user.address)}></div>
      <div className={cssClasses.CELL} $init={userProp((user) => user.company)}></div>
      <div className={cssClasses.CELL} $init={userProp((user) => user.roles.join(", "))}></div>
      <div className={cssClasses.CELL}>
        <RowButton
          iconClass="fa-solid fa-pen"
          handleClick={() => {
            if (editModeObs.getValue() !== EditMode.EDIT)
              editModeObs.setValue(EditMode.EDIT);
          }}
        />
        <RowButton
          iconClass="fa-solid fa-trash"
          handleClick={() => usersService.deleteUser(user)}
        />
      </div>
    </div>
  );

  userObs.notify();
  return row;
}

function getRowInitializer(editModeObs: Observable<EditMode>, userObs: Observable<User>, usersService: UsersService) {
  let editRow: HTMLElement | null = null;

  return (row: HTMLElement) => {
    editModeObs.subscribe((editMode) => {
      switch (editMode) {
        case EditMode.EDIT:
          editRow = (<EditRow
            userObs={userObs}
            editModeObs={editModeObs}
            roles={usersService.roles}
            companies={usersService.companies}
          />);
          row.replaceWith(editRow!);
          break;
        case EditMode.VALIDATE:
        case EditMode.CANCEL:
          if (editRow) {
            editRow.replaceWith(row);
            editRow = null;
          }
      }
    });
  };
}