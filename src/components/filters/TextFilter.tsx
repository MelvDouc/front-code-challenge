export default function TextFilter({ prop, usersService }: {
  prop: keyof User;
  usersService: UsersService;
}) {
  const key = Symbol();

  return (
    <input
      type="search"
      oninput={(e) => {
        const value = (e.target as HTMLInputElement).value.trim().toLowerCase();
        if (value) {
          usersService.setFilter(key, (user) => (user[prop] as string).toLowerCase().includes(value));
          return;
        }
        usersService.unsetFilter(key);
      }}
      $init={(element) => {
        usersService.onFiltersCleared(() => element.value = "");
        usersService.onRowEditing((id) => element.disabled = (id !== null));
      }}
    />
  );
}