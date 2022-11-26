import cssClasses from "src/constants/css-classes.js";
import UserTableHeader from "./UserTableHeader.jsx";

export default function FiltersBody({ usersService }: {
  usersService: UsersService;
}) {
  const sortUsers = usersService.sortUsers.bind(usersService);

  return (
    <section className="thead">
      <div className={cssClasses.ROW}>
        <UserTableHeader prop="name" sortUsers={sortUsers} />
        <UserTableHeader prop="email" sortUsers={sortUsers} />
        <UserTableHeader prop="gender" sortUsers={sortUsers} />
        <UserTableHeader prop="address" sortUsers={sortUsers} />
        <UserTableHeader prop="company" sortUsers={sortUsers} />
        <UserTableHeader prop="roles" sortUsers={sortUsers} />
        <UserTableHeader prop="actions" />
      </div>
    </section>
  );
}