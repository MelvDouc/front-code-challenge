export default class Company {
  private static all = new Map<string, Company>();

  public static get(name: string) {
    return this.all.get(name);
  }

  public readonly name!: string;
  public readonly children!: Company[];
  public readonly parent!: Company | null;

  constructor({ name, companies }: DbCompany, parent: Company | null) {
    if (Company.all.has(name))
      return Company.all.get(name)!;

    this.name = name;
    this.children = (companies ?? []).map((childCompany) => new Company(childCompany, this));
    this.parent = parent;
    Company.all.set(name, this);
  }

  public isParentOf(company: Company): boolean {
    for (const parent of company.allParents())
      if (parent === this)
        return true;
    return false;
  }

  public isChildOf(company: Company): boolean {
    return company.isParentOf(this);
  }

  public *allParents(): Generator<Company, void> {
    if (!this.parent)
      return;
    yield this.parent;
    yield* this.parent.allParents();
  }

  public *allChildren(): Generator<Company, void> {
    for (const child of this.children) {
      yield child;
      yield* child.allChildren();
    }
  }

  public hasUser(user: User): boolean {
    const company = Company.all.get(user.company);
    return company === this
      || !!company && this.isParentOf(company);
  }
}