const allIds = new Set<string>();

export default function getUniqueId(): string {
  let id: string;
  do {
    id = getId(10);
  } while (allIds.has(id));
  allIds.add(id);
  return id;
}

function getId(length: number): string {
  let id = "";
  while (id.length < length)
    id += randomLowerCase();
  return id;
}

function randomLowerCase() {
  return String.fromCharCode(
    Math.floor(Math.random() * (122 - 97 - 1)) + 97
  );
}