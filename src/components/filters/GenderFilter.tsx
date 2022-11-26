import { Gender } from "src/constants/enums.js";
import { defaultChoice } from "src/constants/misc.js";

export default function GenderFilter({ usersService }: {
  usersService: UsersService;
}) {
  const key = Symbol();

  const handleInput = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;
    if (value === defaultChoice) {
      usersService.unsetFilter(key);
      return;
    }
    usersService.setFilter(key, (user) => user.gender === value);
  };

  return (
    <select
      oninput={handleInput}
      $init={(select) => {
        usersService.onFiltersCleared(() => select.value = defaultChoice);
      }}
    >
      {[defaultChoice, Gender.MALE, Gender.FEMALE].map((gender) => (
        <option value={gender}>{gender}</option>
      ))}
    </select>
  );
}