import cssClasses from "src/constants/css-classes.js";
import UsersBodyRow from "./row/UsersBodyRow.jsx";

export default function UsersBody({ usersService }: {
  usersService: UsersService;
}) {
  const rows = usersService.users.reduce((acc, user) => {
    return acc.set(
      user.id,
      <UsersBodyRow user={user} usersService={usersService} />
    );
  }, new Map<string, HTMLElement>());

  usersService.onChange((users) => {
    users.forEach(({ id, isHidden, isDeleted }) => {
      const { classList } = rows.get(id)!;
      (isHidden || isDeleted)
        ? classList.add(cssClasses.HIDDEN)
        : classList.remove(cssClasses.HIDDEN);
    });
  });

  return (
    <section classNames={[cssClasses.TBODY, "users-tbody"]} $init={(element) => {
      usersService.onUsersSorted((ids) => {
        ids.forEach((id) => element.append(rows.get(id)!));
      });
    }}>
      {[...rows.values()]}
    </section>
  );
}