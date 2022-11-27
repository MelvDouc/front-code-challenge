import cssClasses from "src/constants/css-classes.js";
import "src/styles/CompanyTag.scss";

export default function CompanyTag({ companyName, removeFn }: {
  companyName: string;
  removeFn?: () => void;
}) {
  return (
    <span
      className={cssClasses.COMPANY_TAG}
      onclick={removeFn}
    >{companyName}</span>
  );
}