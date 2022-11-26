import "src/styles/RowButton.scss";

export default function RowButton({ iconClass, handleClick, color }: {
  iconClass: string;
  color?: string;
  handleClick: (e: Event) => void;
}) {
  return (
    <span classNames={["row-button", color ?? ""]} onclick={handleClick}>
      <i className={iconClass}></i>
    </span>
  );
}