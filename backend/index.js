import express from "express";
import { databaseConfig } from "./config.js";
import { Database } from "./postgres.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appHost = "localhost";
const appPort = 8080;

var app = express();
var database = new Database(databaseConfig);

var deliveryTime = 90;

function sendGoodResponse(res, data) {
  res.status(200).json(data);
}

function sendBadResponse(res, status, errorMessage, errorDetails = null) {
  res.status(status).json({
    status: "error",
    message: errorMessage,
    error: errorDetails,
  });
}

//logging middleware
app.use("*", (req, res, next) => {
  console.log(req.method, req.baseUrl || req.url, new Date().toISOString());

  next();
});

// Middleware for static app files
app.use("/", express.static(path.resolve(__dirname, "../dist")));

app.get("/", async function (req, res) {
  res.send("Hello World!");
});

// couriers
app.get("/courier", async function (req, res) {
  var courierList = await database.getCourierList();

  if (courierList != null) {
    sendGoodResponse(res, courierList);
  } else {
    sendBadResponse(res, 500, "Something went wrong");
  }
});

app.get("/courier/:courierId", async function (req, res) {
  const { courierId } = req.params;
  var courier = await database.getCourier(courierId);

  if (courier != null) {
    sendGoodResponse(res, courier);
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

app.use("/courier", express.json());
app.post("/courier", async function (req, res) {
  const { name, region } = req.body;
  var courierCreate = await database.createCourier(
    name,
    region
  );

  if (courierCreate != null) {
    sendGoodResponse(res, courierCreate);
  } else {
    sendBadResponse(res, 500, "Something went wrong");
  }
});

app.use("/courier/:courierId", express.json());
app.patch("/courier/:courierId", async function (req, res) {
  const { courierId } = req.params;
  const { name, region, deliverys } = req.body;
  var courierUpdate = await database.updateCourier(
    courierId, 
    name, 
    region, 
    deliverys
  );

  if (courierUpdate != null) {
    sendGoodResponse(res, courierUpdate);
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

app.delete("/courier/:courierId", async function (req, res) {
  const { courierId } = req.params;
  var courierDelete = await database.deleteCourier(courierId);

  if (courierDelete == null) {
    sendGoodResponse(res, "Courier deleted");
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

// regions
app.get("/region", async function (req, res) {
  console.log("HERE")
  var regionList = await database.getRegionList();

  if (regionList != null) {
    sendGoodResponse(res, regionList);
  } else {
    sendBadResponse(res, 500, "Something went wrong");
  }
});

app.get("/region/:regionId", async function (req, res) {
  const { regionId } = req.params;
  var region = await database.getRegion(regionId);

  if (region != null) {
    sendGoodResponse(res, region);
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

app.use("/region", express.json());
app.post("/region", async function (req, res) {
  const { name } = req.body;
  var regionCreate = await database.createRegion(name);
  if (regionCreate != null) {
    sendGoodResponse(res, regionCreate);
  } else {
    sendBadResponse(res, 500, "Something went wrong");
  }
});

app.use("/region/:regionId", express.json());
app.patch("/region/:regionId", async function (req, res) {
  const { regionId } = req.params;
  const { name } = req.body;
  var regionUpdate = await database.updateRegion(regionId, name);

  if (regionUpdate == null) {
    sendGoodResponse(res, "Region updated");
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

app.delete("/region/:regionId", async function (req, res) {
  const { regionId } = req.params;
  var regionDelete = await database.deleteRegion(regionId);

  if (regionDelete == null) {
    sendGoodResponse(res, "Region deleted");
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

// deliverys
app.get("/delivery", async function (req, res) {
  var deliveryList = await database.getDeliveryList();

  if (deliveryList != null) {
    sendGoodResponse(res, deliveryList);
  } else {
    sendBadResponse(res, 500, "Something went wrong");
  }
});

app.get("/delivery/:deliveryId", async function (req, res) {
  const { deliveryId } = req.params;
  var delivery = await database.getDelivery(deliveryId);

  if (delivery != null) {
    sendGoodResponse(res, delivery);
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

app.use("/delivery", express.json());
app.post("/delivery", async function (req, res) {
  const { address, region, amount, description } = req.body;
  var deliveryCreate = await database.createDelivery(
    address,
    region,
    amount,
    description
  );
  if (deliveryCreate != null) {
    sendGoodResponse(res, deliveryCreate);
  } else {
    sendBadResponse(res, 500, "Something went wrong");
  }
});

app.use("/delivery/:deliveryId", express.json());
app.patch("/delivery/:deliveryId", async function (req, res) {
  const { deliveryId } = req.params;
  const { courierId, name, region, deliverys } = req.body;
  var deliveryUpdate = await database.updateCourier(
    courierId, 
    name, 
    region, 
    deliverys
  );

  if (deliveryUpdate == null) {
    sendGoodResponse(res, "Delivery updated");
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

app.delete("/delivery/:deliveryId", async function (req, res) {
  const { deliveryId } = req.params;
  var deliveryDelete = await database.deleteDelivery(deliveryId);

  if (deliveryDelete == null) {
    sendGoodResponse(res, "Delivery deleted");
  } else {
    sendBadResponse(res, 422, "No data in database with such ID");
  }
});

console.log(`App started at host http://${appHost}:${appPort}`);
const server = app.listen(Number(appPort), appHost, async () => {
  // try {
  //     await database.connect();
  // } catch(error) {
  //     console.log('Disconnect');
  //     process.exit(100);
  // }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    await database.disconnect();
    console.log("HTTP server closed");
  });
});
