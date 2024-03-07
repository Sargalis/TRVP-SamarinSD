export default class RegionApi {
  static async getRegion({ regionId } = { regionId: null }) {
    try {
      const regionResponse = await fetch(
        `http://localhost:8080/region/${regionId}`,
        {
          method: "GET",
        }
      );
      const regionBody = await regionResponse.json();

      if (regionResponse.status !== 200) {
        return Promise.reject(regionBody);
      }

      return regionBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async getRegionList() {
    try {
      const regionResponse = await fetch(`http://localhost:8080/region/`, {
        method: "GET",
      });
      const regionBody = await regionResponse.json();

      if (regionResponse.status !== 200) {
        return Promise.reject(regionBody);
      }

      return regionBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async createRegion(name) {
    try {
      const regionResponse = await fetch(`http://localhost:8080/region/`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });
      const regionBody = await regionResponse.json();

      if (regionResponse.status !== 200) {
        return Promise.reject(regionBody);
      }

      location.reload();
      return regionBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async updateRegion({ regionId, name } = { regionId: null, name }) {
    try {
      const regionResponse = await fetch(
        `http://localhost:8080/region/${regionId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const regionBody = await regionResponse.json();
      location.reload();

      if (regionResponse.status !== 200) {
        return Promise.reject(regionBody);
      }

      return regionBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }

  static async deleteRegion({ regionId } = { regionId: null }) {
    try {
      const regionResponse = await fetch(
        `http://localhost:8080/region/${regionId}`,
        {
          method: "DELETE",
        }
      );
      const regionBody = await regionResponse.json();

      if (regionResponse.status !== 200) {
        return Promise.reject(regionBody);
      }
      location.reload();

      return regionBody;
    } catch (err) {
      return Promise.reject({
        timestamp: new Date().toISOString(),
        statusCode: 400,
        message: err.message,
      });
    }
  }
}
