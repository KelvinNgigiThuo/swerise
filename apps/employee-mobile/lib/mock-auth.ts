export type MockEmployee = {
  username: string;
  password: string;
  fullName: string;
  shopName: string;
};

export const mockEmployees: MockEmployee[] = [
  {
    username: 'attendant_01',
    password: '1234',
    fullName: 'Faith Njeri',
    shopName: 'Shop A - Nairobi'
  },
  {
    username: 'attendant_02',
    password: '1234',
    fullName: 'Peter Maina',
    shopName: 'Shop B - Kiambu Road'
  },
  {
    username: 'attendant_03',
    password: '1234',
    fullName: 'Brian Mwangi',
    shopName: 'Shop C - Ngong Road'
  }
];

export function authenticateEmployee(username: string, password: string): MockEmployee | null {
  const normalized = username.trim().toLowerCase();
  const user = mockEmployees.find(item => item.username.toLowerCase() === normalized);

  if (user === undefined) {
    return null;
  }

  if (user.password === password) {
    return user;
  }

  return null;
}
