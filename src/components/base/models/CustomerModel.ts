interface Buyer {
  payment: "card" | "cash";
  address: string;
  email: string;
  phone: string;
}

export class CustomerModel {
  private data: Buyer | null = null;

  constructor() {}

  updateData(
    payment?: "card" | "cash",
    address?: string,
    email?: string,
    phone?: string,
  ): void {
    // Если данных еще нет, создаем базовый объект
    if (!this.data) {
      this.data = {
        payment: "cash", // Значение по умолчанию, чтобы объект был валидным
        address: "",
        email: "",
        phone: "",
      };
    }

    // Обновляем только те поля, которые передали
    if (payment !== undefined) this.data.payment = payment;
    if (address !== undefined) this.data.address = address;
    if (email !== undefined) this.data.email = email;
    if (phone !== undefined) this.data.phone = phone;
  }

  getData(): Buyer | null {
    return this.data;
  }

  clear(): void {
    this.data = null;
  }

  /**
   Задание: "Поле является валидным, если оно не пустое".
   Возвращаем объект ошибок: { поле: "текст ошибки" }
   **/
  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.data) return errors;

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
