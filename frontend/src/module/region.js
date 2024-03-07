import RegionApi from "../api/region";

export default class Region {
  #regionID = -1;
  #name = "";

  constructor({ region_id, region_name }) {
    this.#regionID = region_id;
    this.#name = region_name;
  }

  get regionID() {
    return this.#regionID;
  }

  get regionName() {
    return this.#name;
  }

  set regionName(newName) {
    if (typeof newName === "string") {
      this.#name = newName;
    }
  }

  render() {
    // Create a li element to represent the Region
    const regionListItem = document.createElement("li");
    regionListItem.classList.add("region");
    regionListItem.setAttribute("data-region-id", this.#regionID); // Add data-region-id attribute

    // Add content to the li (e.g., region name)
    regionListItem.innerHTML = `<p>Region ID: ${
      this.#regionID
    }</p><p>Region Name: ${this.#name}</p>`;

    // Create update button
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.addEventListener("click", () => this.handleUpdate());

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => this.handleDelete());

    // Append buttons to the li
    regionListItem.appendChild(updateButton);
    regionListItem.appendChild(deleteButton);

    // Append the li to the regions list
    const regionsList = document.getElementById("regions");
    regionsList.appendChild(regionListItem);
  }

  handleUpdate() {
    try {
      // Prompt the user for a new region name
      const newRegionName = prompt("Enter the new region name:");

      // Check if the user provided a new region name
      if (newRegionName !== null) {
        const regionListItem = document.querySelector(
          `[data-region-id="${this.#regionID}"]`
        );
        if (regionListItem) {
          regionListItem.remove();
          console.log(`Region with ID ${this.#regionID} deleted successfully.`);
        } else {
          console.error(`Region with ID ${this.#regionID} not found in the DOM.`);
        }
        // Update the region name in the frontend
        this.#name = newRegionName;
        this.render(); // Re-render the region with the updated name

        // Update the region in the backend
        RegionApi.updateRegion({ regionId: this.#regionID, name: newRegionName });
      }
    } catch (error) {
      console.error("Error updating region:", error);
    }
  }

  handleDelete() {
    try {
      // Call the RegionApi.deleteRegion method
      RegionApi.deleteRegion({ regionId: this.#regionID })
        .then(() => {
          // Remove the region from the DOM
          const regionListItem = document.querySelector(
            `[data-region-id="${this.#regionID}"]`
          );
          if (regionListItem) {
            regionListItem.remove();
            console.log(`Region with ID ${this.#regionID} deleted successfully.`);
          } else {
            console.error(
              `Region with ID ${this.#regionID} not found in the DOM.`
            );
          }
        })
        .catch((error) => {
          console.error(
            `Error deleting Region with ID ${this.#regionID}:`,
            error
          );
        });
    } catch (error) {
      console.error(
        `Error handling delete for Region with ID ${this.#regionID}:`,
        error
      );
    }
  }

  toString() {
    return `Region ID: ${this.#regionID}, Name: ${this.#name}`;
  }
}
