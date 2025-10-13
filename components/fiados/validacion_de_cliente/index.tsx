import { Customer } from '@/services/pocketbaseServices';


export const validateDuplicateClient = (clients: Customer[], newName: string): boolean => {
  const normalizedNewName = newName.trim().toLowerCase();
  return clients.some(client => 
    client.name.toLowerCase() === normalizedNewName
  );
};