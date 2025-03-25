import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  getAuthUserId,
  getStoredUsers,
  setStoredUsers,
  removeAuthUserId,
} from "../utils/localStorage";
import { Contact } from "./useContacts";

export interface User {
  userId: string;
  email: string;
  password: string;
}

interface AuthState {
  users: User[];
  authUserId: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string) => boolean;
  deleteAccount: (
    password: string,
    getContactsStore: () => {
      deleteContact: (id: string) => void;
      contacts: Contact[];
    }
  ) => void;
}

export const useAuth = create<AuthState>((set) => {
  const storedUsers = getStoredUsers();
  const authUserId = getAuthUserId();

  return {
    users: storedUsers,
    authUserId: authUserId,
    isAuthenticated: !!authUserId,

    login: (email, password) => {
      const storedUsers = getStoredUsers();

      const foundUser = storedUsers.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        localStorage.setItem("authUserId", foundUser.userId);
        set({ authUserId: foundUser.userId, isAuthenticated: true });
        return true;
      }

      return false;
    },

    register: (email, password) => {
      const storedUsers = getStoredUsers();

      if (storedUsers.some((user) => user.email === email)) {
        return false;
      }

      const newUser: User = {
        userId: uuidv4(),
        email,
        password,
      };

      const updatedUsers = [...storedUsers, newUser];
      setStoredUsers(updatedUsers);

      set({
        authUserId: newUser.userId,
        users: updatedUsers,
        isAuthenticated: true,
      });
      return true;
    },

    logout: () => {
      removeAuthUserId();
      set({ authUserId: null, isAuthenticated: false });
    },

    deleteAccount: (password, getContactsStore) => {
      const authUserId = getAuthUserId();

      const storedUsers = getStoredUsers();
      const foundUser = storedUsers.find((user) => user.userId === authUserId);

      if (!foundUser || foundUser.password !== password) {
        throw new Error("Senha incorreta");
      }

      const updatedUsers = storedUsers.filter(
        (user) => user.userId !== authUserId
      );

      const { deleteContact, contacts } = getContactsStore();
      contacts
        .filter((contact) => contact.createdBy === authUserId)
        .forEach((contact) => deleteContact(contact.id));

      setStoredUsers(updatedUsers);
      removeAuthUserId();

      set({ authUserId: null, isAuthenticated: false, users: updatedUsers });
    },
  };
});
