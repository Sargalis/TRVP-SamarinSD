var deliveryLimit = 5;

import Region from "./module/region.js";
import Courier from "./module/courier.js";
import Delivery from "./module/delivery.js";

import RegionApi from "./api/region.js";
import CourierApi from "./api/courier.js";
import DeliveryApi from "./api/delivery.js";

function checkRegionAndAmount(region, selectedDeliverys, deliverys) {
  var current_amount = 0;
  var badRegion = 0;
  
  selectedDeliverys.forEach((selectedDelivery) => {
    deliverys.forEach((delivery) => {
      if (delivery.deliveryID == selectedDelivery){
        if (region != delivery.region){
          alert("Courier Region doesn't match Delivery Region.");
          badRegion = 1;
            return false;
        }
        current_amount+=delivery.amount;
      }
     });
  });
  if (current_amount > deliveryLimit){
    alert("Selected Deliveries Amount is too high for the selected Courier..");
    return false;
  }
  if (badRegion == 0){
    return true;
  } else {
    return false;
  }
}

export default class App {
  #regions = [];
  #couriers = [];
  #deliverys = [];

  addRegion() {}

  initRegions(regions) {
    try {
      console.log("Regions:", regions);

      // Render each region
      regions.forEach((regionData) => {
        const region = new Region(regionData);
        this.#regions.push(region);
        region.render();
      });
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  }

  async initCouriers(couriers) {
    try {
      console.log("Couriers:", couriers);

      // Render each courier
      couriers.forEach((courierData) => {
        const courier = new Courier(courierData);
        this.#couriers.push(courier);
        courier.render();
      });
    } catch (error) {
      console.error("Error fetching couriers:", error);
    }
  }

  async initDeliverys(deliverys) {
    try {
      console.log("Deliverys:", deliverys);

      // Render each delivery
      deliverys.forEach((deliveryData) => {
        const delivery = new Delivery(deliveryData);
        this.#deliverys.push(delivery);
        delivery.render();
      });
    } catch (error) {
      console.error("Error fetching deliverys:", error);
    }
  }

  async init() {
    const regions = await RegionApi.getRegionList();
    this.initRegions(regions);
    const couriers = await CourierApi.getCourierList();
    this.initCouriers(couriers);
    const deliverys = await DeliveryApi.getDeliveryList();
    this.initDeliverys(deliverys);

    // Now, you can handle the selected regions when needed, for example, on form submission
    const addCourierForm = document.getElementById("addCourierForm");
    // Get the selected region IDs
  
    const regionSelect = document.getElementById("regionSelect");
  
    // Populate the regionSelect dropdown with options
    this.#regions.forEach((region) => {
      const option = document.createElement("option");
      option.value = region.regionID;
      option.textContent = region.regionName;
      regionSelect.appendChild(option);
    });

    // Handle form submission
    addCourierForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form data
      const name = document.getElementById("courierName").value;
      
      // Get the selected region ID
      const region = regionSelect.value;

      try {
        // Use the RegionApi class to add the region to the database
        const response = await CourierApi.createCourier(
          name,
          region
        );
        console.log(response);
        const courier = new Courier(response);
        courier.render();
      } catch (error) {
        console.error("Error creating courier:", error, "Value: ", region);
        alert("Error creating courier. Please try again.");
      }
    });
    
    // UPDATE EVENT FOR COURIER
   
    const updateRegionSelect = document.getElementById("updateRegionSelect");
            
    // Populate the updateRegionSelect dropdown with options
    this.#regions.forEach((region) => {
      const option = document.createElement("option");
      option.value = region.regionID;
      option.textContent = region.regionName;
      updateRegionSelect.appendChild(option);
    });
    
    const updateCourierForm = document.getElementById(
      "updateCourierForm"
    );
    updateCourierForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Get the selected skill IDs
      const selectedDeliveryCheckboxes = document.querySelectorAll(
        'input[name="updatedDeliverys"]:checked'
      );
      const selectedDeliveryIDs = Array.from(selectedDeliveryCheckboxes).map(
        (checkbox) => checkbox.value
      );

      // Use the selected skill IDs as needed
      console.log("Selected Delivery IDs:", selectedDeliveryIDs);
    });
    
    //const updateDeliveryCheckboxList = document.getElementById("updateDeliveryCheckboxList");
    
    // Populate the skills with checkboxes dynamically
    /*this.#deliverys.forEach((delivery) => {
      const deliveryCheckbox = document.createElement("input");
      deliveryCheckbox.type = "checkbox";
      deliveryCheckbox.name = "updatedDeliverys";
      deliveryCheckbox.value = delivery.deliveryID;
      deliveryCheckbox.checked = 1;

      const deliveryLabel = document.createElement("label");
      deliveryLabel.textContent = delivery.deliveryID;
      deliveryLabel.appendChild(deliveryCheckbox);

      updateDeliveryCheckboxList.appendChild(deliveryLabel);
    });*/
    
    // Now, you can handle the selected regions when needed, for example, on form submission
    updateCourierForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form data
      const id = document.getElementById("updateCourierID").textContent;
      const name = document.getElementById("updateCourierName").value;
     
      console.log("updateRegionSelect:", updateRegionSelect);
      const region = updateRegionSelect.value;
      console.log("region:", region);
      const region_name = updateRegionSelect.options[updateRegionSelect.selectedIndex].text;
      console.log("region_name:", region_name);
      //const region_name = updateRegionSelect.textContent;
      
      const selectedDeliveryCheckboxes = document.querySelectorAll(
        'input[name="updatedDeliverys"]:checked'
      );
      const selectedDeliverys = Array.from(selectedDeliveryCheckboxes).map(
        (checkbox) => checkbox.value
      );
      
      
      try {
        
        const courierValidationCheck = checkRegionAndAmount(region_name, selectedDeliverys, this.#deliverys);
        if (courierValidationCheck){
            // Use the RegionApi class to add the region to the database
            const response = await CourierApi.updateCourier(
              id,
              name,
              region,
              selectedDeliverys
            );
            document.getElementById("add-courier-form").style.display = "block";
            document.getElementById("update-courier-form").style.display =
              "none";
    
            const courierListItem = document.querySelector(
              `[data-courier-id="${id}"]`
            );
            if (courierListItem) {
              courierListItem.remove();
            } else {
              console.error(`Courier with ID ${id} not found in the DOM.`);
            }
    
            const courier = new Courier(response);
            courier.render();
           location.reload();
        }
      } catch (error) {
        console.error("Error creating courier:", error);
        alert("Error creating courier. Please try again.");
      }
    });
    
    

    const addRegionForm = document.getElementById("addRegionForm");

    addRegionForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const regionNameInput = document.getElementById("regionName");
      const regionName = regionNameInput.value;

      try {
        // Use the RegionApi class to add the region to the database
        const response = await RegionApi.createRegion(regionName);
        console.log(response);
        const region = new Region(response);
        region.render();
      } catch (error) {
        console.error("Error:", error);
      }
    });
    
    

    // Handle form submission
    const addDeliveryForm = document.getElementById("addDeliveryForm");
    
    const deliveryRegionSelect = document.getElementById("deliveryRegionSelect");
          
            // Populate the deliveryRegionSelect dropdown with options
    this.#regions.forEach((region) => {
      const option = document.createElement("option");
      option.value = region.regionID;
      option.textContent = region.regionName;
      deliveryRegionSelect.appendChild(option);
    });
    
    addDeliveryForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form data
      const address = document.getElementById("deliveryAddress").value;
      const region = deliveryRegionSelect.value;
      const amount = document.getElementById("deliveryAmount").value;
      const description = document.getElementById("deliveryDescription").value;

        // Proceed with creating the delivery
        const response = await DeliveryApi.createDelivery(
          address,
          region,
          amount,
          description
        );
        console.log(response);
        const delivery = new Delivery(response);
        delivery.render();
    });
  }
}
