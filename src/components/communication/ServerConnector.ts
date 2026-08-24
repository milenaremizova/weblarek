import { IApi } from "../../types/index";
import {
  OrderRequest,
  OrderResponse,
  CatalogResponse,
} from "../../types/index";

export class ServerConnector {
  private api: IApi;

  constructor(apiInstance: IApi) {
    this.api = apiInstance;
  }

  async fetchCatalog(): Promise<CatalogResponse> {
    return this.api.get("/product");
  }

  async sendOrder(orderData: OrderRequest): Promise<OrderResponse> {
    return this.api.post("/order", orderData);
  }
}
