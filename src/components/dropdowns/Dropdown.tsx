import { Observable } from "reactfree-jsx";
import cssClasses from "src/constants/css-classes.js";

export class _Dropdown extends HTMLElement {
  constructor({ displayObs }: {
    displayObs: Observable<string | Node | string[] | Node[]>;
  }) {
    super();
    const visibilityObs = new Observable(false);

    this.append(
      <section className={cssClasses.DROPDOWN_VALUE}>{displayObs}</section>,
      <section
        className={cssClasses.DROPDOWN_CHOICES}
        onclick={() => visibilityObs.updateValue((prev) => !prev)}
      ></section>
    );
  }

  get disabled() {
    return false;
  }

  // set disabled(value: boolean) { }
}

customElements.define("app-dropdown", _Dropdown);

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

export function makeDeactivable(dropdown: HTMLElement, usersService: UsersService): HTMLElement {
  const valueElement = dropdown.querySelector(`.${cssClasses.DROPDOWN_VALUE}`) as HTMLElement;
  const clickHandler = valueElement.onclick;
  usersService.onRowEditing((id) => {
    valueElement.onclick = (id !== null) ? null : clickHandler;
  });
  return dropdown;
} 