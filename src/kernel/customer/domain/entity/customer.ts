import { Address } from './address'

export class Customer {
  constructor(
    private id: string | null,
    private userId: string | null,
    private firstName: string,
    private lastName: string,
    private email: string,
    private phone: string | null,
    private addresses: Address[] = [],
    private createdAt?: Date,
    private updatedAt?: Date
  ) {}

  getId(): string | null {
    return this.id
  }

  getUserId(): string | null {
    return this.userId
  }

  getFirstName(): string {
    return this.firstName
  }

  getLastName(): string {
    return this.lastName
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  getEmail(): string {
    return this.email
  }

  getPhone(): string | null {
    return this.phone
  }

  getAddresses(): Address[] {
    return this.addresses
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt
  }

  // Setters
  setFirstName(firstName: string): void {
    this.firstName = firstName
  }

  setLastName(lastName: string): void {
    this.lastName = lastName
  }

  setEmail(email: string | null): void {
    this.email = email ?? ''
  }

  setPhone(phone: string | null): void {
    this.phone = phone
  }
}
