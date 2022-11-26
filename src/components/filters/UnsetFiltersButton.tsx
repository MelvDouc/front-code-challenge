export default function UnsetFiltersButton({ usersService }: {
  usersService: UsersService;
}) {
  return (
    <span className="cursor-pointer" onclick={() => usersService.unsetFilters()}>
      <i className="fa-solid fa-x"></i>
    </span>
  );
}