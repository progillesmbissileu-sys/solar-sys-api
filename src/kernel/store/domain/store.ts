export class Store {
  constructor(
    private id: any,
    private designation: string,
    private domainName: string,
    private createdAt: Date | null = null,
    private updatedAt: Date | null = null
  ) {}

  getId(): any {
    return this.id
  }

  getDomainName(): string {
    return this.domainName
  }

  getDesignation(): string {
    return this.designation
  }

  getCreatedAt(): any {
    return this.createdAt
  }
  getUpdatedAt(): any {
    return this.updatedAt
  }
}
