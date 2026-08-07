import "./scss/styles.scss";

import { Buyer } from "./types";
import { apiProducts } from "./utils/data";
import { CatalogModel } from "./components/base/models/CatalogModel";
import { CartModel } from "./components/base/models/CartModel";
import { CustomerModel } from "./components/base/models/CustomerModel";

import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ServerConnector } from "./components/communication/ServerConnector";

const catalog = new CatalogModel();
const cart = new CartModel();
const customer = new CustomerModel();

// данные взяты для теста методов CatalogModel
const testData = apiProducts.items;
catalog.setProducts(testData);
console.log("Каталог товаров:", catalog.getProducts());

const targetId = testData[0].id;
const foundItem = catalog.findProductById(targetId);
console.log("Найденный товар:", foundItem);

catalog.setSelectedProduct(targetId);
const selected = catalog.getSelectedProduct();
console.log("Выбранный товар:", selected);

// тест методов CartModel
const testProduct = apiProducts.items[2];
cart.addItem(testProduct);
console.log(cart.getItems(), cart.getTotalPrice());

const productToCheck = testProduct; // это apiProducts.items[2], который мы только что добавили
const isInCart = cart.hasItem(productToCheck.id);

console.log(`Товар с ID ${productToCheck.id} в корзине? ${isInCart}`);

const idToRemove = testProduct.id;
cart.removeItem(idToRemove);

const isStillInCart = cart.hasItem(idToRemove);
console.log(
  `После удаления товар с ID ${idToRemove} всё ещё в корзине? ${isStillInCart}`,
);

const productA = apiProducts.items[0];
const productB = apiProducts.items[1];

cart.addItem(productA);
cart.addItem(productB);

console.log(`Перед очисткой в корзине товаров: ${cart.getCount()}`);

cart.clear();

console.log(`После очистки в корзине товаров: ${cart.getCount()}`);

console.log(`Общая цена после очистки: ${cart.getTotalPrice()}`);

// тест методов CustomerModel
const testUser: Partial<Buyer> = {
  payment: "card",
  address: "Капилэнд",
  email: "capy@example.com",
  phone: "+799999999",
};
customer.updateData(
  testUser.payment,
  testUser.address,
  testUser.email,
  testUser.phone,
);
console.log(customer.getData());

const errors = customer.validate();
console.log("Ошибки валидации", errors);

const currentData = customer.getData();
console.log("Данные пользователя:", currentData);

const errorsEmpty = customer.validate();
console.log("Ошибки при полных данных:", errorsEmpty);

customer.clear();
customer.updateData(undefined, undefined, "only-email@test.com", undefined);

const partialData = customer.getData();
console.log("Данные после частичного обновления:", partialData);

const errorsPartial = customer.validate();
console.log("Ошибки при частичных данных:", errorsPartial);

customer.clear();
const afterClear = customer.getData();
console.log("Данные после очистки:", afterClear);

const errorsAfterClear = customer.validate();
console.log("Ошибки после clear():", errorsAfterClear);

customer.updateData("cash", "Старый адрес", "old@mail.com", "111");
customer.updateData(undefined, "Новый адрес", undefined, undefined);

const overwrittenData = customer.getData();
console.log("Данные после перезаписи:", overwrittenData);

const apiInstance = new Api(API_URL);
const server = new ServerConnector(apiInstance);

async function loadCatalog() {
  try {
    const products = await server.fetchCatalog();
    catalog.setProducts(products);
    console.log(catalog.getProducts());
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
}
loadCatalog();

const result = loadCatalog();
console.log(result);
