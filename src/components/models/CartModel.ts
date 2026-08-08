import { Product } from "../../types";

export class CartModel {
  private items: Product[] = [];

  constructor() {}

  getItems(): Product[] {
    return this.items;
  }

  addItem(item: Product): void {
    this.items.push(item);
  }

  removeItem(id: string): void {
    this.items = this.items.filter((product) => product.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, product) => {
      const price = product.price ?? 0; // ?? 0 означает: если null, то 0
      return total + price;
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((product) => product.id === id);
  }
}
