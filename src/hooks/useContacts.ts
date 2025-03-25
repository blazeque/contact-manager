import { useEffect } from "react";
import { create } from "zustand";
import { getStoredContacts, setStoredContacts } from "../utils/localStorage";

export interface Contact {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  createdBy: string;
  cep: string;
}

interface ContactState {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updatedContact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  loadContacts: () => void;
}

export const useContact = create<ContactState>((set) => ({
  contacts: getStoredContacts(),

  addContact: (contact) => {
    const existingContact = getStoredContacts().find((c) => c.cpf === contact.cpf);
    if (existingContact) {
      throw new Error("CPF já cadastrado");
    }

    set((state) => {
      const updatedContacts = [...state.contacts, contact];
      setStoredContacts(updatedContacts);
      return { contacts: updatedContacts };
    });
  },

  updateContact: (id, updatedContact) => {
    if (updatedContact.cpf) {
      const existingContact = getStoredContacts().find(
        (c) => c.cpf === updatedContact.cpf && c.id !== id
      );
      if (existingContact) {
        throw new Error("CPF já cadastrado");
      }
    }

    set((state) => {
      const updatedContacts = state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...updatedContact } : contact
      );
      setStoredContacts(updatedContacts);
      return { contacts: updatedContacts };
    });
  },

  deleteContact: (id) => {
    set((state) => {
      const updatedContacts = state.contacts.filter(
        (contact) => contact.id !== id
      );
      setStoredContacts(updatedContacts);
      return { contacts: updatedContacts };
    });
  },

  loadContacts: () => {
    const storedContacts = getStoredContacts();
    set({ contacts: storedContacts });
  },
}));

export const useContacts = () => {
  const { contacts, addContact, updateContact, deleteContact, loadContacts } =
    useContact();

  useEffect(() => {
    loadContacts();
  }, []);

  return { contacts, addContact, updateContact, deleteContact };
};
