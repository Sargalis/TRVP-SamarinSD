export default class CourierApi {
  static async getCourier(courierId) {
    try {
      const courierResponse = await fetch(
        `http://localhost:8080/courier/${courierId}`,
        {
          method: "GET",
        }
      );
      const courierBody = await courierResponse.json();

      if (courierResponse.status !== 200) {
        return Promise.reject(courierBody);
      }

      return courierBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async getCourierList() {
    try {
      const courierResponse = await fetch(
        `http://localhost:8080/courier/`,
        {
          method: "GET",
        }
      );
      const courierBody = await courierResponse.json();

      if (courierResponse.status !== 200) {
        return Promise.reject(courierBody);
      }

      return courierBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async createCourier(name, region) {
    try {
      const courierResponse = await fetch(
        `http://localhost:8080/courier/`,
        {
          method: "POST",
          body: JSON.stringify({ name, region }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const courierBody = await courierResponse.json();

      if (courierResponse.status !== 200) {
        return Promise.reject(courierBody);
      }

      return courierBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async updateCourier(
    courierId,
    name,
    region,
    deliverys
  ) {
    try {
      const courierResponse = await fetch(
        `http://localhost:8080/courier/${courierId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name, region, deliverys }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const courierBody = await courierResponse.json();

      if (courierResponse.status !== 200) {
        return Promise.reject(courierBody);
      }

      return courierBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async deleteCourier(courierId) {
    try {
      const courierResponse = await fetch(
        `http://localhost:8080/courier/${courierId}`,
        {
          method: "DELETE",
        }
      );
      const courierBody = await courierResponse.json();

      if (courierResponse.status !== 200) {
        return Promise.reject(courierBody);
      }

      location.reload();
      return courierBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }
}
