// src/api/LarekApi.ts
import { CDN_URL } from "../../utils/constants";
import { apiProducts } from "../../utils/data";

export class LarekApi {
  /**
   * Этот метод универсален:
   * 1. Если передать данные (например, ответ от сервера) — обработает их.
   * 2. Если не передать — возьмет заглушку.
   */
  prepareProducts(data?: { total: number; items: any[] }) {
    // Если данные переданы (например, из fetch), используем их. Иначе берем заглушку.
    const sourceData = data || apiProducts;

    // ВАЖНО: Берем именно массив items
    const items = sourceData.items;

    return items.map((product: any) => {
      // Если у товара есть имя файла картинки, склеиваем с CDN
      if (product.image) {
        return {
          ...product,
          image: `${CDN_URL}/${product.image}`,
        };
      }
      return product;
    });
  }
}
