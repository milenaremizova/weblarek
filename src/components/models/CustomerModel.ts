import { IBuyer, TPayment, TBuyerErrors } from "../../types";

export class CustomerModel {
  private data: IBuyer = {
    payment: null,
    address: "",
    email: "",
    phone: "",
  };

  constructor() {}

  updateData(data: Partial<IBuyer>): void {
    // Обновляем только те поля, которые передали в объекте
    if (data.payment !== undefined) {
      this.data.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.data.address = data.address;
    }
    if (data.email !== undefined) {
      this.data.email = data.email;
    }
    if (data.phone !== undefined) {
      this.data.phone = data.phone;
    }
  }

  getData(): IBuyer {
    return this.data;
  }

  clear(): void {
    this.data = {
      payment: null,
      address: "",
      email: "",
      phone: "",
    };
  }

  /**
   Задание: "Поле является валидным, если оно не пустое".
   Возвращаем объект ошибок: { поле: "текст ошибки" }
   **/
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.data.payment) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }
    if (!this.data.address || this.data.address.trim() === "") {
      errors.address = "Адрес не может быть пустым";
    }
    if (!this.data.email || this.data.email.trim() === "") {
      errors.email = "Email не может быть пустым";
    }
    if (!this.data.phone || this.data.phone.trim() === "") {
      errors.phone = "Телефон не может быть пустым";
    }

    return errors;
  }
}
