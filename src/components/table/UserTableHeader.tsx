import { SortingOrder } from "src/constants/enums.js";

export default function UserBodyHeader({ prop, sortUsers }: {
  prop: ColumnKey;
  sortUsers?: (prop: keyof User, sortingOrder: SortingOrder) => void;
}) {
  let sortingOrder = SortingOrder.NONE;

  const header = (
    <div className="header">{prop}</div>
  ) as HTMLDivElement;

  if (sortUsers) {
    header.addEventListener("click", () => {
      sortingOrder = ++sortingOrder % 3;
      sortUsers(prop as keyof User, sortingOrder);
    });
  }

  return header;
}