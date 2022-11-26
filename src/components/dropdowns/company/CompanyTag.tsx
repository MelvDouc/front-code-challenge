import cssClasses from "src/constants/css-classes.js";
import "src/styles/CompanyTag.scss";

export default function CompanyTag({ companyName, deleteCompanyFromSet }: {
  companyName: string;
  deleteCompanyFromSet?: () => void;
}) {
  return (
    <span
      className={cssClasses.COMPANY_TAG}
      onclick={deleteCompanyFromSet}
    >{companyName}</span>
  );
}