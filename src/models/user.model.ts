import { Gender } from "../../../front-code-challenge/src/constants/enums.js";

export default class User implements _User {
  public readonly id: string;
  public readonly serialNumber: number;
  public name: string;
  public email: string;
  public gender: Gender;
  public address: string;
  public roles: Role[];
  public company: string;
  public isHidden: boolean;
  public isDeleted: boolean;

  constructor({ id, address, company, email, male, name, roles }: DbUser, serialNumber: number) {
    this.id = id;
    this.serialNumber = serialNumber;
    this.name = name;
    this.email = email;
    this.gender = male ? Gender.MALE : Gender.FEMALE;
    this.address = address;
    this.company = company;
    this.roles = roles;
    this.isHidden = false;
    this.isDeleted = false;
  }

  public compare(userB: User, prop: keyof User): number {
    const valueA = this[prop],
      valueB = userB[prop];
    if (typeof valueA === "string")
      return valueA.localeCompare(valueB as string);
    if (Array.isArray(valueA))
      return valueA.join().localeCompare((valueB as string[]).join());
    return 0;
  }
}