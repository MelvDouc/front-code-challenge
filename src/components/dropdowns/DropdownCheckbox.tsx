import cssClasses from "src/constants/css-classes.js";

export default function DropdownCheckbox<T>({ checked, value, indentation, oninput, $init }: {
  checked: boolean;
  value: T;
  indentation?: number;
  oninput: () => void;
  $init: (input: HTMLInputElement) => void;
}) {
  return (
    <label classNames={[cssClasses.CHECKBOX, `mis-${indentation ?? 0}`]}>
      <input
        type="checkbox"
        checked={checked}
        oninput={oninput}
        $init={$init}
      />
      <span>{value}</span>
    </label>
  );
}