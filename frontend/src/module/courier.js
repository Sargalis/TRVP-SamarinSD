import DeliveryApi from "../api/delivery";
import RegionApi from "../api/region";
import CourierApi from "../api/courier";


export default class Courier {
  #courierID = -1;
  #name = "";
  #regionID = -1;
  #region = "";
  #deliverys = [];

  constructor({
    courier_id,
    courier_name,
    courier_region_id,
    courier_region,
    deliverys
  }) {
    this.#courierID = courier_id;
    this.#name = courier_name;
    this.#regionID = courier_region_id;
    this.#region = courier_region;
    this.#deliverys = deliverys;
    console.log(deliverys);
  }

  get courierID() {
    return this.#courierID;
  }

  get courierName() {
    return this.#name;
  }
  set courierName(newName) {
    if (typeof newName === "string") {
      this.#name = newName;
    }
  }

  get region() {
    return this.#region;
  }
  set region(newRegion) {
    if (typeof newRegion === "string") {
      this.#region = newRegion;
    }
  }
  
  get deliverys() {
    return this.#deliverys;
  }
  set deliverys(newDeliverys) {
    if (Array.isArray(newDeliverys)) {
      if (
        newDeliverys.every((delivery) => typeof delivery === "object" && delivery !== null)
      ) {
        this.#deliverys = newDeliverys;
      }
    } else {
      console.error(
        "Invalid value for deliverys. Should be an array of delivery objects."
      );
    }
  }  

  render() {
    const courierListItem = document.createElement("li");
    courierListItem.classList.add("courier");
    courierListItem.setAttribute("data-courier-id", this.#courierID);

    const heading = document.createElement("h2");
    heading.textContent = `Courier ${this.#courierID}`;
    courierListItem.appendChild(heading);

    const idParagraph = document.createElement("p");
    idParagraph.textContent = `ID: ${this.#courierID}`;
    courierListItem.appendChild(idParagraph);

    const nameParagraph = document.createElement("p");
    nameParagraph.textContent = `Name: ${this.#name}`;
    courierListItem.appendChild(nameParagraph);
    
    console.log("Delivery List: ");
    const regionParagraph = document.createElement("p");
    regionParagraph.textContent = `Region: ${this.#region}`;
    courierListItem.appendChild(regionParagraph);
    
    const deliverysList = document.createElement("ul");
    deliverysList.textContent = `Deliveries: `;
    this.#deliverys.forEach((delivery) => {
      const deliveryItem = document.createElement("li");
      deliveryItem.textContent = delivery;
      deliverysList.appendChild(deliveryItem);
    });
    courierListItem.appendChild(deliverysList);

    // Create update button
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.addEventListener("click", (event) => this.handleUpdate(event));
    courierListItem.appendChild(updateButton);

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => this.handleDelete());
    courierListItem.appendChild(deleteButton);

    const couriersList = document.getElementById("couriers");

    // Append the courier li to the ul element
    couriersList.appendChild(courierListItem);
  }

  // Assuming you have a handleUpdate function
  handleUpdate(event) {
    // Fetch courier data and update the "Update Courier" form
    const courierListItem = event.target.closest(".courier");

    // Fetch courier data from the list item
    const courierId = courierListItem.dataset.courierId;
    console.log(courierId);
    const promise = CourierApi.getCourier(courierId);
    // Show the "Update Courier" form and hide the "Add Courier" form
    document.getElementById("add-courier-form").style.display = "none";
    document.getElementById("update-courier-form").style.display = "block";

    // Call a function to fill the "Update Courier" form with the fetched data
    promise
      .then((result) => {
        this.fillUpdateForm(result);
        // Continue with synchronous logic using the result
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Function to fill the "Update Courier" form
  fillUpdateForm(courier) {
    // Assuming there are input fields and checkboxes in the update form
    const updateCourierId = document.getElementById(
      "updateCourierID"
    );
    const updateCourierNameInput = document.getElementById(
      "updateCourierName"
    );
    const updateRegionSelectInput = document.getElementById(
      "updateRegionSelect"
    );
    const updateDeliveryCheckboxList = document.getElementById(
      "updateDeliveryCheckboxList"
    );
    
    
    // Fill in the input fields with the fetched data

    updateCourierId.textContent = courier.courier_id;
    updateCourierNameInput.value = courier.courier_name;
    updateRegionSelectInput.value = courier.courier_region_id;
    // Clear any existing checkboxes in the skills list
    updateDeliveryCheckboxList.innerHTML = "";
    
    const allDeliverysPromise = DeliveryApi.getDeliveryList();
    allDeliverysPromise
      .then((allDeliverys) => {
        console.log(allDeliverys)
        allDeliverys.forEach((delivery) => {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          //checkbox.id = `updateDeliveryCheckbox_${delivery.delivery_id}`;
          checkbox.name = "updatedDeliverys";
          checkbox.value = delivery.delivery_id;
          checkbox.checked = courier.deliverys.includes(delivery.delivery_id);

          const label = document.createElement("label");
          label.textContent = delivery.delivery_id;
          label.appendChild(checkbox);
          
          updateDeliveryCheckboxList.appendChild(label);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Show the "Update Courier" form and hide the "Add Courier" form
    document.getElementById("add-courier-form").style.display = "none";
    document.getElementById("update-courier-form").style.display = "block";
  }

  handleDelete() {
    try {
      CourierApi.deleteCourier(this.#courierID)
        .then(() => {
          const courierListItem = document.querySelector(
            `[data-courier-id="${this.#courierID}"]`
          );
          if (courierListItem) {
            courierListItem.remove();
            console.log(
              `Courier with ID ${this.#courierID} deleted successfully.`
            );
          } else {
            console.error(
              `Courier with ID ${this.#courierID} not found in the DOM.`
            );
          }
        })
        .catch((error) => {
          console.error(
            `Error deleting Courier with ID ${this.#courierID}:`,
            error
          );
        });
    } catch (error) {
      console.error(
        `Error handling delete for Courier with ID ${this.#courierID}:`,
        error
      );
    }
  }
}
