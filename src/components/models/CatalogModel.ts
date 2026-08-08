import { Product } from "../../types";

export class CatalogModel {
  private products: Product[] = [];
  private selectedProductId: string | null = null;

  constructor() {}

  setProducts(newProducts: Product[]): void {
    this.products = newProducts;
  }

  getProducts(): Product[] {
    return this.products;
  }

  findProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedProduct(id: string): void {
    const product = this.findProductById(id);

    if (product) {
      this.selectedProductId = id;
    }
  }

  getSelectedProduct(): Product | null {
    if (!this.selectedProductId) {
      return null;
    }
    const product = this.findProductById(this.selectedProductId);
    return product ?? null;
  }
}
