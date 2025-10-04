// Port - Repository interface
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
