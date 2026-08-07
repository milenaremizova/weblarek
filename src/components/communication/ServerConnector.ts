// src/components/Communication/ServerConnector.ts

import { IApi } from '../../types/index';
import { Product, OrderRequest, OrderResponse, CatalogResponse } from '../../types/index';

export class ServerConnector {
  private api: IApi;

  constructor(apiInstance: IApi) {
    this.api = apiInstance;
  }

  async fetchCatalog(): Promise<Product[]> {
    try {
 const response: CatalogResponse = await this.api.get('/product');
      
      return response.items;
    } catch (error) {
      console.error('Ошибка загрузки каталога:', error);
      throw error;
    }
  }

  async sendOrder(orderData: OrderRequest): Promise<OrderResponse> {
    try {

      const payload = {
        payment: orderData.buyer.payment,
        email: orderData.buyer.email,
        phone: orderData.buyer.phone,
        address: orderData.buyer.address,
        items: orderData.items
      };


      const response: OrderResponse = await this.api.post('/order', payload);
      
      return response;
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      throw error;
    }
  }
}