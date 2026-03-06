export class ProductImage {
  constructor(
    public id: string,
    public url: string | null = null,
    public alt: string | null = null,
    public title: string | null = null
  ) {}
}
