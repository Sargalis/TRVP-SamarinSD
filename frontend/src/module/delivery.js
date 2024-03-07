import DeliveryApi from "../api/delivery.js";

export default class Delivery {
  #deliveryID = -1;
  #address = "";
  #region = "";
  #amount = "";
  #description = "";
  #courierID = "";

  constructor({
    delivery_id,
    delivery_address,
    region_name,
    delivery_amount,
    delivery_description,
    delivery_courier,
  }) {
    this.#deliveryID = delivery_id;
    this.#address = delivery_address;
    this.#region = region_name;
    this.#amount = delivery_amount;
    this.#description = delivery_description;
    this.#courierID = delivery_courier;
  }

  get deliveryID() {
    return this.#deliveryID;
  }

  get address() {
    return this.#address;
  }
  set address(newAddress) {
    if (typeof newAddress === "string") {
      this.#address = newAddress;
    }
  }

  get region() {
    return this.#region;
  }
  set region(newRegion) {
    this.#region = newRegion;
  }

  get amount() {
    return this.#amount;
  }
  set amount(newAmount) {
    this.#amount = newAmount;
  }
  
  get description() {
    return this.#description;
  }
  set description(newDescription) {
    if (typeof newDescription === "string") {
      this.#description = newDescription;
    }
  }

  get courier() {
    return this.#courierID;
  }
  set courier(newCourier) {
    this.#courierID = newCourier;
  }

  render() {
    const deliveryListItem = document.createElement("li");
    deliveryListItem.classList.add("delivery");
    deliveryListItem.setAttribute("data-delivery-id", this.#deliveryID);

    const idParagraph = document.createElement("p");
    idParagraph.textContent = `ID: ${this.#deliveryID}`;
    deliveryListItem.appendChild(idParagraph);

    const addressParagraph = document.createElement("p");
    addressParagraph.textContent = `Address: ${this.#address}`;
    deliveryListItem.appendChild(addressParagraph);

    const regionParagraph = document.createElement("p");
    regionParagraph.textContent = `Region: ${this.#region}`;
    deliveryListItem.appendChild(regionParagraph);
    
    const amountParagraph = document.createElement("p");
    amountParagraph.textContent = `Amount: ${this.#amount}`;
    deliveryListItem.appendChild(amountParagraph);
    
    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = `Description: ${this.#description}`;
    deliveryListItem.appendChild(descriptionParagraph);

    const courierParagraph = document.createElement("p");
    courierParagraph.textContent = `Courier: ${this.#courierID}`;
    deliveryListItem.appendChild(courierParagraph);

    // const updateButton = document.createElement("button");
    // updateButton.textContent = "Update";
    // updateButton.addEventListener("click", () => this.handleUpdate());
    // deliveryListItem.appendChild(updateButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => this.handleDelete());
    deliveryListItem.appendChild(deleteButton);

    const deliverysList = document.getElementById("deliverys");
    deliverysList.appendChild(deliveryListItem);
  }

  // handleUpdate() {}

  handleDelete() {
    try {
      const confirmDelete = confirm(
        "Are you sure you want to delete this delivery?"
      );

      if (confirmDelete) {
        DeliveryApi.deleteDelivery(this.#deliveryID);

        const deliveryListItem = document.querySelector(
          `[data-delivery-id="${this.#deliveryID}"]`
        );
        if (deliveryListItem) {
          deliveryListItem.remove();
          console.log(
            `Delivery with ID ${this.#deliveryID} deleted successfully.`
          );
        } else {
          console.error(
            `Delivery with ID ${this.#deliveryID} not found in the DOM.`
          );
        }
      }
    } catch (error) {
      console.error("Error deleting delivery:", error);
    }
  }
}
