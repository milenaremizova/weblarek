import { Product } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogModel {
  private products: Product[] = [];
  private selectedProduct: Product | null = null;

  constructor(private events: IEvents) {}

  setProducts(newProducts: Product[]): void {
    this.products = newProducts;
    this.events.emit("catalog:changed");
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
      this.selectedProduct = product;
      this.events.emit("preview:changed");
    }
  }

  getSelectedProduct(): Product | null {
    return this.selectedProduct;
  }
}
