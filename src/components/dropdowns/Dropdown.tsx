import { Observable } from "reactfree-jsx";
import cssClasses from "src/constants/css-classes.js";

export default function Dropdown({ children, $init, handleView, startValue }: {
  children?: (Node | string)[];
  startValue: any;
  $init: (element: HTMLElement) => any;
  handleView: (element: HTMLElement) => any;
}) {
  const visibleObs = new Observable(false);

  document.addEventListener("click", ({ target }) => {
    if (target instanceof HTMLElement && !target.closest(`.${cssClasses.DROPDOWN}`))
      visibleObs.setValue(false);
  });

  return (
    <div className={cssClasses.DROPDOWN} $init={$init}>
      <section
        className={cssClasses.DROPDOWN_VALUE}
        onclick={() => visibleObs.updateValue((prev) => !prev)}
        $init={handleView}
      >{startValue}</section>
      <section classObj={{
        [cssClasses.DROPDOWN_CHOICES]: true,
        [cssClasses.HIDDEN]: { obs: visibleObs, predicate: (value) => !value }
      }}>{children}</section>
    </div>
  );
}

export function getCheckmarkFixer<T>(obs: Observable<Set<T>>) {
  return (predicate: (items: Set<T>) => boolean) => {
    return (input: HTMLInputElement) => {
      obs.subscribe((items) => {
        const checked = predicate(items);
        if (input.checked !== checked)
          input.checked = checked;
      });
    };
  };
}

export function initializeAsFilter<T>(usersService: UsersService, getFilter: (set: Set<T>) => UserFilter | null) {
  const key = Symbol();

  return (obs: Observable<Set<T>>) => {
    usersService.onFiltersCleared(() => {
      if (obs.getValue().size)
        obs.updateValue((set) => (set.clear(), set));
    });
    obs.subscribe((set) => {
      const filter = getFilter(set);
      (filter)
        ? usersService.setFilter(key, filter)
        : usersService.unsetFilter(key);
    });
  };
}