import { Product } from "../../types";
import { IEvents } from "../base/Events";

export class CartModel {
  private items: Product[] = [];

  constructor(private events: IEvents) {}

  getItems(): Product[] {
    return this.items;
  }

  addItem(item: Product): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  removeItem(id: string): void {
    this.items = this.items.filter((product) => product.id !== id);
    this.events.emit("basket:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  getTotalPrice(): number {
    return this.items.reduce((total, product) => {
      const price = product.price ?? 0;
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
