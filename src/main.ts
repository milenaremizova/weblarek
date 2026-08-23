import "./scss/styles.scss";

import { IBuyer } from "./types";
import { apiProducts } from "./utils/data";
import { LarekApi } from "./components/base/LarekApi";
import { CatalogModel } from "./components/models/CatalogModel";
import { CartModel } from "./components/models/CartModel";
import { CustomerModel } from "./components/models/CustomerModel";

import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ServerConnector } from "./components/communication/ServerConnector";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { IEvents } from "./components/base/Events";

const catalog = new CatalogModel();
const cart = new CartModel();
const customer = new CustomerModel();

const larekApi = new LarekApi();

// -- CatalogModel --
const testData = larekApi.prepareProducts();
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

const productA = testData[0]; 
const productB = testData[1];

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
    const response = await server.fetchCatalog(); // response = { total: ..., items: [...] }
    
    console.log("Всего товаров на сервере (total):", response.total);

    // ✅ ГЛАВНОЕ ИЗМЕНЕНИЕ: Прогоняем данные через наш класс-упаковщик
    // Передаем response как аргумент, чтобы он взял оттуда items и добавил CDN
    const preparedItems = larekApi.prepareProducts(response);

    catalog.setProducts(preparedItems);
    console.log("Каталог товаров (с сервера):", catalog.getProducts());
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
}
loadCatalog();


const mockEvents: IEvents = {
    emit: (name, data) => console.log('[EVENT]', name, data),
    
   on: (name, cb) => {}, 
    
    trigger: (event, context) => {
        return (data) => {
            console.log('[TRIGGER]', event, context, data);
        };
    }
}; 

const realHeaderContainer = document.querySelector('.header') as HTMLElement | null;

if (!realHeaderContainer) {
    console.error('Ошибка: Не найден элемент .header в HTML!');
} else {
    console.log('Реальный хедер найден:', realHeaderContainer);

    // 2. Инициализируем Header, передавая ему РЕАЛЬНЫЙ контейнер
    // Конструктор сам внутри себя найдет .header__basket и .header__basket-counter
    const header = new Header(mockEvents, realHeaderContainer);

    // 3. ТЕСТ СЧЕТЧИКА
    console.log('🧺 Устанавливаем счетчик в 7...');
    header.counter = 7;

    // Проверяем визуально в консоли, что текст реально изменился в DOM
    const counterSpan = realHeaderContainer.querySelector('.header__basket-counter');
    if (counterSpan) {
        console.log(`✅ Успех! В спане теперь написано: "${counterSpan.textContent}"`);
        console.warn('👉 Теперь посмотри на страницу: в правом верхнем углу (в кнопке корзины) должна быть цифра 7!');
    }

    // 4. ТЕСТ КЛИКА
    console.log('🖱️ Симулируем клик по кнопке корзины...');
    const basketBtn = realHeaderContainer.querySelector('.header__basket') as HTMLButtonElement | null;
    
    if (basketBtn) {
        basketBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        console.log('✅ Клик отправлен. Проверь консоль на событие basket:open');
    } else {
        console.error('❌ Не найдена кнопка .header__basket внутри хедера');
    }
}

const containerList = document.getElementsByClassName('gallery');

// Проверяем, нашли ли хоть что-то
if (containerList.length === 0) {
    console.error('❌ Ошибка: В HTML нет элемента с классом "gallery"!');
} else {
    // ВАЖНО: Берем ПЕРВЫЙ элемент из списка [0] и приводим к HTMLElement
    const container = containerList[0] as HTMLElement;

    // Теперь тип совпадает, и конструктор примет этот элемент
    const gallery = new Gallery(mockEvents, container);
    
    // Передаем данные
    gallery.products = testData;
    
    console.log('✅ Галерея инициализирована внутри элемента .gallery');
} 