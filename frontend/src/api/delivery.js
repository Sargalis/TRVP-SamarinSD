export default class DeliveryApi {
  static async getDelivery(deliveryId) {
    try {
      const deliveryResponse = await fetch(
        `http://localhost:8080/delivery/${deliveryId}`,
        {
          method: "GET",
        }
      );
      const deliveryBody = await deliveryResponse.json();

      if (deliveryResponse.status !== 200) {
        return Promise.reject(deliveryBody);
      }

      return deliveryBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async getDeliveryList() {
    try {
      const deliveryResponse = await fetch(
        `http://localhost:8080/delivery/`,
        {
          method: "GET",
        }
      );
      const deliveryBody = await deliveryResponse.json();

      if (deliveryResponse.status !== 200) {
        return Promise.reject(deliveryBody);
      }

      return deliveryBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async createDelivery(address, region, amount, description) {
    try {
      const deliveryResponse = await fetch(
        `http://localhost:8080/delivery/`,
        {
          method: "POST",
          body: JSON.stringify({ address, region, amount, description }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const deliveryBody = await deliveryResponse.json();

      if (deliveryResponse.status !== 200) {
        return Promise.reject(deliveryBody);
      }

      return deliveryBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async updateDelivery(
    { deliveryId, address, region, amount, description } = {
      deliveryId: null,
      address,
      region,
      amount,
      description,
    }
  ) {
    try {
      const deliveryResponse = await fetch(
        `http://localhost:8080/delivery/${deliveryId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ address, region, amount, description }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const deliveryBody = await deliveryResponse.json();

      if (deliveryResponse.status !== 200) {
        return Promise.reject(deliveryBody);
      }

      return deliveryBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async deleteDelivery(deliveryId) {
    try {
      const deliveryResponse = await fetch(
        `http://localhost:8080/delivery/${deliveryId}`,
        {
          method: "DELETE",
        }
      );
      const deliveryBody = await deliveryResponse.json();

      if (deliveryResponse.status !== 200) {
        return Promise.reject(deliveryBody);
      }

      location.reload();
      return deliveryBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }
}
