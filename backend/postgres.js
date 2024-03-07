import pkg from "pg";
const { Client } = pkg;

class Database {
  constructor(config) {
    this.config = config;
    this.client = new Client(this.config);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Connected to the database");
    } catch (err) {
      console.error("Error connecting to the database", err);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log("Disconnected from the database");
    } catch (err) {
      console.error("Error disconnecting from the database", err);
    }
  }

  // couriers
  async getCourier(courierId) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const sqlQuery = `
        SELECT courier.id AS courier_id, courier.name AS courier_name, courier.region AS courier_region_id, region.name AS courier_region, ARRAY(SELECT delivery.id FROM delivery WHERE courier.id = delivery.courier ORDER BY delivery.id ) AS deliverys
            FROM courier
            LEFT JOIN region ON courier.region = region.id
            LEFT JOIN delivery ON delivery.courier = courier.id
            WHERE courier.id = $1
            GROUP BY courier.id, region.id;
    `;

      const result = await this.client.query(sqlQuery, [courierId]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        console.log(
          `Courier ID: ${row.courier_id
          }, Name: ${row.courier_name
          }, Region: ${row.courier_region
          }, Deliveries: ${row.deliverys.join(", ")
          }`
        );
      } else {
        console.log(`Courier with ID ${courierId} not found.`);
      }
      return result.rows[0];
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  } 

  async getCourierList() {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const sqlQuery = `
        SELECT courier.id AS courier_id, courier.name AS courier_name, courier.region AS courier_region_id, region.name AS courier_region, ARRAY(SELECT delivery.id FROM delivery WHERE courier.id = delivery.courier ORDER BY delivery.id ) AS deliverys
            FROM courier
            LEFT JOIN region ON courier.region = region.id
            LEFT JOIN delivery ON delivery.courier = courier.id
            GROUP BY courier.id, region.id
            ORDER BY courier.id;
       `;

      const result = await this.client.query(sqlQuery);

      console.log("Couriers with Regions:");
      result.rows.forEach((row) => {
        console.log(
          `Courier ID: ${row.courier_id
          }, Name: ${row.courier_name
          }, Region: ${row.courier_region
          }, Deliveries: ${row.deliverys.join(", ")
          }`
        );
      });
      return result.rows;
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  }

  async createCourier(courierName, regionId) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const insertCourierQuery = `
        INSERT INTO courier (name, region)
        VALUES ($1, $2)
        RETURNING id;
      `;

      const courierResult = await this.client.query(insertCourierQuery, [
        courierName,
        regionId
      ]);
      const courierId = courierResult.rows[0].id;

      console.log(`Courier with ID ${courierId} created successfully.`);
      const courier = await this.getCourier(courierId);
      return courier;
    } catch (err) {
      console.error("Error creating courier", err);
    } finally {
      await this.client.end();
      console.log("client has disconnected");
    }
  }

  async updateCourier(
    courierId,
    courierFIO,
    regionName,
    deliveryIdList
  ) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const updateCourierQuery = `
                UPDATE courier
                SET name = $1, region = $2
                WHERE id = $3;
            `;

      await this.client.query(updateCourierQuery, [
        courierFIO,
        regionName,
        courierId,
      ]);

      const clearDeliveryQuery = `
        UPDATE delivery 
        SET courier = NULL
        WHERE courier = $1;
      `; 
      
      await this.client.query(clearDeliveryQuery, [courierId]);

      const updateDeliveryQuery = `
        UPDATE delivery 
        SET courier = $1
        WHERE id = $2;
      `;

      for (const deliveryId of deliveryIdList) {
        await this.client.query(updateDeliveryQuery, [courierId, deliveryId]);
      }      
      

      console.log(`Courier with ID ${courierId} updated successfully.`);
      return await this.getCourier(courierId)
    } catch (err) {
      console.error("Error updating courier", err);
    } finally {
      await this.client.end();
    }
  }

  async deleteCourier(courierId) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const deleteDeliverysQuery = `
                UPDATE delivery
                SET courier = NULL
                WHERE courier = $1;
            `;

      await this.client.query(deleteDeliverysQuery, [courierId]);

      const deleteCourierQuery = `
                DELETE FROM courier
                WHERE id = $1;
            `;

      await this.client.query(deleteCourierQuery, [courierId]);

      console.log(`Courier with ID ${courierId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting courier", err);
    } finally {
      await this.client.end();
    }
  }

  async getCourierDeliveryList(courierId) {}

  // regions
  async getRegion(regionId) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const sqlQuery = `
                SELECT region.id AS region_id, region.name AS region_name
                FROM region
                WHERE region.id = $1;
            `;

      const result = await this.client.query(sqlQuery, [regionId]);

      if (result.rows.length > 0) {
        const region = result.rows[0];
        console.log(`Region ID: ${region.region_id}, Name: ${region.region_name}`);
        return region;
      } else {
        console.log(`Region with ID ${regionId} not found.`);
        return null;
      }
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  }

  async getRegionList() {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const sqlQuery = `
                SELECT region.id AS region_id, region.name AS region_name
                FROM region
                ORDER BY region.id;
            `;

      const result = await this.client.query(sqlQuery);

      if (result.rows.length > 0) {
        const regions = result.rows;
        console.log("Regions:");
        result.rows.forEach((row) => {
          console.log(`Region ID: ${row.region_id}, Name: ${row.region_name}`);
        });
        return regions;
      } else {
        return [];
      }
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  }

  async createRegion(regionName) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const sqlQuery = `
                INSERT INTO region (name)
                VALUES ($1)
                RETURNING id;
            `;

      const result = await this.client.query(sqlQuery, [regionName]);

      if (result.rows.length > 0) {
        const regionId = result.rows[0].id;
        console.log(`Region ID: ${regionId}}`);

        const region = await this.getRegion(regionId);
        return region;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  }

  async updateRegion(regionId, regionName) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const sqlQuery = `
                UPDATE region
                SET name = $1
                WHERE id = $2;
            `;

      const result = await this.client.query(sqlQuery, [regionName, regionId]);

      console.log(`Region with ID ${regionId} updated successfully.`);
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  }

  async deleteRegion(regionId) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const deleteRegionQuery = `
                DELETE FROM region
                WHERE id = $1;
            `;

      await this.client.query(deleteRegionQuery, [regionId]);

      console.log(`Region with ID ${regionId} deleted successfully.`);
      return null;
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  }

  // deliverys
  async getDelivery(deliveryId) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const sqlQuery = `
                SELECT delivery.id AS delivery_id, delivery.address AS delivery_address, region.name AS region_name, delivery.amount AS delivery_amount, delivery.description as delivery_description, delivery.courier as delivery_courier
                FROM delivery
                LEFT JOIN region ON delivery.region = region.id
                WHERE delivery.id = $1
                GROUP BY delivery.id, region.id;
            `;

      const result = await this.client.query(sqlQuery, [deliveryId]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        console.log(
          `Delivery ID: ${row.delivery_id
          }, Address: ${row.delivery_address
          }, Region: ${row.region_name
          }, Amount: ${row.delivery_amount
          }, Description: ${row.delivery_description
          }`
        );
        return row;
      } else {
        console.log(`Delivery with ID ${deliveryId} not found.`);
      }
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  }

  async getDeliveryList() {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const sqlQuery = `
                      SELECT delivery.id AS delivery_id, delivery.address AS delivery_address, region.name AS region_name, delivery.amount AS delivery_amount, delivery.description as delivery_description, delivery.courier as delivery_courier
                      FROM delivery
                      LEFT JOIN region ON delivery.region = region.id
                      GROUP BY region.id, delivery.id
                      ORDER BY delivery.id;
                  `;

      const result = await this.client.query(sqlQuery);

      if (result.rows.length > 0) {
        console.log("Deliverys with Regions:");
        result.rows.forEach((row) => {
          console.log(
              `Delivery ID: ${row.delivery_id
              }, Address: ${row.delivery_address
              }, Region: ${row.region_name
              }, Amount: ${row.delivery_amount
              }, Description: ${row.delivery_description
              }`
          );
        });
        return result.rows;
      } else {
        console.log(`Deliverys not found.`);
        return []
      }
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      await this.client.end();
    }
  }

  async createDelivery(address, region, amount, description) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const insertDeliveryQuery = `
                INSERT INTO delivery (address, region, amount, description)
                VALUES ($1, $2, $3, $4)
                RETURNING id;
            `;

      const deliveryResult = await this.client.query(insertDeliveryQuery, [
        address,
        region,
        amount,
        description
      ]);
      const deliveryId = deliveryResult.rows[0].id;
      

      console.log(`Delivery with ID ${deliveryId} created successfully.`);
      const delivery = await this.getDelivery(deliveryId);
      console.log(delivery);
      return delivery;
    } catch (err) {
      console.error("Error creating delivery", err);
      return null;
    } finally {
      await this.client.end();
    }
  }

  async deleteDelivery(deliveryId) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const deleteDeliveryQuery = `
                DELETE FROM delivery
                WHERE id = $1;
            `;

      await this.client.query(deleteDeliveryQuery, [deliveryId]);

      console.log(`Delivery with ID ${deliveryId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting delivery", err);
    } finally {
      await this.client.end();
    }
  }

  async changeDeliveryCourier(deliveryId, courierId) {
    try {
      this.client = new Client(this.config);
      await this.client.connect();

      const updateDeliveryCourierQuery = `
                UPDATE delivery
                SET courier = $2
                WHERE id = $1;
            `;

      await this.client.query(updateDeliveryCourierQuery, [
        deliveryID,
        courierID,
      ]);

      console.log(
        `Delivery with ID ${deliveryId} delivery updated successfully.`
      );
    } catch (err) {
      console.error("Error updating delivery", err);
    } finally {
      await this.client.end();
    }
  }
}

export { Database };
