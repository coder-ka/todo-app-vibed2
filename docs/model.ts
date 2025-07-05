export type UUIDv7 = string;
export type DateTime = Date;
export type Email = string;

export interface Account {
  id: UUIDv7;
  email: Email;
}

export interface Login {
  id: UUIDv7;
  expiredAt: DateTime;
  token: string; // hidden
  accountId: Account["id"];
}

export interface Todo {
  id: UUIDv7;
  title: string;
  note: string;
  accountId: Account["id"];
}
