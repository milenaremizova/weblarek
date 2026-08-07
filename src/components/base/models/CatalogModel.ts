import { Product } from "../../../types";

export class CatalogModel {
  private products: Product[] = [];
  private selectedProductId: string | null = null;

  constructor(initialProducts?: Product[]) {
    if (initialProducts) {
      this.products = initialProducts;
    }
  }

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
    } else {
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
