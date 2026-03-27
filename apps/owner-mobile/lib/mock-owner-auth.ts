export type MockOwner = {
  username: string;
  password: string;
  fullName: string;
  businessName: string;
};

export const mockOwners: MockOwner[] = [
  {
    username: 'owner01',
    password: '1234',
    fullName: 'Kelvin Mwangi',
    businessName: 'Swerise Energy Stores',
  },
];

export function authenticateOwner(username: string, password: string): MockOwner | null {
  const normalized = username.trim().toLowerCase();
  const owner = mockOwners.find(item => item.username.toLowerCase() === normalized);

  if (!owner) {
    return null;
  }

  if (owner.password === password) {
    return owner;
  }

  return null;
}
