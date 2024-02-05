export type JsonObject = {
  [key: string]: string | JsonObject | JsonObject[] | any;
};

export type LocaleDictionaryMap = {
  [key: string]: JsonObject;
};
