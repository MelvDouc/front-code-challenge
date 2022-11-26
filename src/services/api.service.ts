import Company from "../models/company.model.js";
import User from "../models/user.model.js";

const API_BASE_URL = `http://localhost:3004`;

async function fetchFromApi<T = any[]>(path: string): Promise<T> {
  try {
    const response = await fetch(API_BASE_URL + path);
    return await response.json() as T;
  } catch (error) {
    console.log(`%Couldn't fetch API data: %${error}`,
      "color: orange",
      "color: magenta"
    );
    return [] as T;
  }
}

export default {
  getUsers: async () => (await fetchFromApi<DbUser[]>("/users")).map((dbUser, i) => new User(dbUser, i)),
  getRoles: () => fetchFromApi<Role[]>("/roles"),
  getCompanies: async () => (await fetchFromApi<DbCompany[]>("/companies")).map((dbCompany) => new Company(dbCompany, null))
};