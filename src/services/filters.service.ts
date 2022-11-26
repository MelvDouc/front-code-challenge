import { Observable } from "reactfree-jsx";

export default class FiltersService {
  private readonly obs = new Observable(new Map<symbol, UserFilter>());

  public onChange(subscription: (value: Map<symbol, UserFilter>) => any) {
    this.obs.subscribe(subscription);
  }

  public setFilter(key: symbol, filter: UserFilter): void {
    this.obs.updateValue((map) => {
      map.set(key, filter);
      return map;
    });
  }

  public unsetFilter(key: symbol): void {
    this.obs.updateValue((map) => {
      map.delete(key);
      return map;
    });
  }

  public unsetFilters(): void {
    this.obs.updateValue((map) => {
      map.clear();
      return map;
    });
  }
}