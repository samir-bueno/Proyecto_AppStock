import PocketBase from 'pocketbase';

export async function loginTestUser() {
  const pb = new PocketBase('http://localhost:8090'); // Cambia la URL si tu servidor es diferente
  const authData = await pb.collection('users').authWithPassword('pep@gmail.com', '12345678');
  return authData.record;
}
