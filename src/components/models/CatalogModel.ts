import { Product } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
  private products: Product[] = [];
  private selectedProductId: string | null = null;

  constructor(private events: IEvents) {}

  setProducts(newProducts: Product[]): void {
    this.products = newProducts;
    this.events.emit("catalog:changed", { products: this.products });
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
      this.events.emit("preview:changed", { product });
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
