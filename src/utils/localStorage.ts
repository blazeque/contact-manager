import { User } from "../hooks/useAuth";
import { Contact } from "../hooks/useContacts";

export const getAuthUserId = (): string | null => {
  return localStorage.getItem("authUserId");
};

export const getStoredUsers = (): User[] => {
  return JSON.parse(localStorage.getItem("users") ?? "[]");
};

export const setStoredUsers = (users: User[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const removeAuthUserId = (): void => {
  localStorage.removeItem("authUserId");
};

export const getStoredContacts = (): Contact[] => {
  return JSON.parse(localStorage.getItem("contacts") ?? "[]");
};

export const setStoredContacts = (contacts: Contact[]): void => {
  localStorage.setItem("contacts", JSON.stringify(contacts));
};
