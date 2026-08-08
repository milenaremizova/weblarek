import "./scss/styles.scss";

import { IBuyer } from "./types";
import { apiProducts } from "./utils/data";
import { CatalogModel } from "./components/models/CatalogModel";
import { CartModel } from "./components/models/CartModel";
import { CustomerModel } from "./components/models/CustomerModel";

import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ServerConnector } from "./components/communication/ServerConnector";

const catalog = new CatalogModel();
const cart = new CartModel();
const customer = new CustomerModel();

// -- CatalogModel --
const testData = apiProducts.items;
catalog.setProducts(testData);
console.log("Каталог товаров:", catalog.getProducts());

const targetId = testData[0].id;
const foundItem = catalog.findProductById(targetId);
console.log("Найденный товар:", foundItem);

catalog.setSelectedProduct(targetId);
const selected = catalog.getSelectedProduct();
console.log("Выбранный товар:", selected);

// -- CartModel --
const testProduct = apiProducts.items[2];
cart.addItem(testProduct);
console.log(
  "Товары в корзине:",
  cart.getItems(),
  "Сумма корзины:",
  cart.getTotalPrice(),
);

const isInCart = cart.hasItem(testProduct.id);
console.log(`Товар с ID ${testProduct.id} в корзине? ${isInCart}`);

cart.removeItem(testProduct.id);
const isStillInCart = cart.hasItem(testProduct.id);
console.log(
  `После удаления товар с ID ${testProduct.id} всё ещё в корзине? ${isStillInCart}`,
);

const productA = apiProducts.items[0];
const productB = apiProducts.items[1];

cart.addItem(productA);
cart.addItem(productB);

console.log(`Перед очисткой в корзине товаров: ${cart.getCount()}`);

cart.clear();

console.log(`После очистки в корзине товаров: ${cart.getCount()}`);
console.log(`Общая цена после очистки: ${cart.getTotalPrice()}`);

// -- CustomerModel --
const fullData: Partial<IBuyer> = {
  payment: "card",
  address: "Капилэнд",
  email: "capy@example.com",
  phone: "+799999999",
};
customer.updateData(fullData);

console.log("Данные пользователя после полной записи:", customer.getData());

const errorsFull = customer.validate();
console.log("Ошибки валидации при полных данных:", errorsFull);

// Частичное обновление - email
customer.updateData({ email: "capybara@example.com" });
const partialData = customer.getData();
console.log("Данные после частичного обновления (email):", partialData);

const errorsPartial = customer.validate();
console.log("Ошибки при частичных данных:", errorsPartial);

// Очистка и проверка валидации на пустых данных
customer.clear();
const afterClear = customer.getData();
console.log("Данные после очистки:", afterClear);

const errorsAfterClear = customer.validate();
console.log("Ошибки после очистки (все поля):", errorsAfterClear);

// Перезапись отдельных полей
customer.updateData({
  payment: "cash",
  address: "Старый адрес",
  email: "old@example.com",
  phone: "111",
});

customer.updateData({ address: "Новый адрес" });

const overwrittenData = customer.getData();
console.log(
  "Данные после перезаписи и частичного обновления:",
  overwrittenData,
);

const errorsOverwritten = customer.validate();
console.log("Ошибки после частичных обновлений:", errorsOverwritten);

const apiInstance = new Api(API_URL);
const server = new ServerConnector(apiInstance);

async function loadCatalog() {
  try {
    const response = await server.fetchCatalog();
    console.log("Всего товаров на сервере (total):", response.total);
    catalog.setProducts(response.items);
    console.log(catalog.getProducts());
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
}
loadCatalog();
