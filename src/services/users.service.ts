import { Observable } from "reactfree-jsx";
import { SortingOrder } from "../constants/enums.js";
import FiltersService from "./filters.service.js";

export default class UsersService {
  private readonly filtersService = new FiltersService();
  private readonly usersObs: Observable<User[]>;
  private readonly sortedIdsObs = new Observable<string[]>();
  private editedRowIdObs: Observable<string | null> = new Observable(null);
  public roles: Role[];
  public companies: Company[];

  constructor({ users, roles, companies }: {
    users: User[];
    roles: Role[];
    companies: Company[];
  }) {
    this.roles = roles;
    this.companies = companies;
    this.usersObs = new Observable(users);

    this.filtersService.onChange((filterMap) => {
      this.usersObs.getValue().forEach((user) => {
        for (const filter of filterMap.values()) {
          if (!filter(user)) {
            user.isHidden = true;
            return;
          }
        }
        user.isHidden = false;
      });
      this.usersObs.notify();
    });
  }

  public get users(): User[] {
    return this.usersObs.getValue();
  }

  public deleteUser(user: User): void {
    this.usersObs.updateValue((users) => {
      users[users.indexOf(user)].isDeleted = true;
      return users;
    });
  }

  public onChange(subscription: (users: User[]) => any): void {
    this.usersObs.subscribe(subscription);
  }

  public sortUsers(prop: keyof User, sortingOrder: SortingOrder): void {
    const values = this.usersObs.getValue();

    switch (sortingOrder) {
      case SortingOrder.NONE:
        values.sort((a, b) => a.serialNumber - b.serialNumber);
        break;
      case SortingOrder.ASCENDING:
        values.sort((a, b) => a.compare(b, prop));
        break;
      case SortingOrder.DESCENDING:
        values.sort((a, b) => b.compare(a, prop));
    }

    this.sortedIdsObs.setValue(values.map((user) => user.id));
  }

  public onUsersSorted(subscription: (ids: string[]) => void): void {
    this.sortedIdsObs.subscribe(subscription);
  }

  public setFilter(key: symbol, filter: UserFilter): void {
    this.filtersService.setFilter(key, filter);
  }

  public unsetFilter(key: symbol): void {
    this.filtersService.unsetFilter(key);
  }

  public unsetFilters(): void {
    this.filtersService.unsetFilters();
  }

  public onFiltersCleared(subscription: (filters: Map<symbol, UserFilter>) => void): void {
    this.filtersService.onChange((filters) => {
      if (!filters.size)
        subscription(filters);
    });
  }

  public onRowEditing(subscription: (id: string | null) => void): void {
    this.editedRowIdObs.subscribe(subscription);
  }

  public getEditedRowId(): string | null {
    return this.editedRowIdObs.getValue();
  }

  public setEditedRowId(id: string | null): void {
    this.editedRowIdObs.setValue(id);
  }
}