// IndexedDB ko open karna ya create karna
let request = indexedDB.open("StockManagementDB", 1);

request.onupgradeneeded = function (event) {
  let db = event.target.result;

  // Object store create karna (table ke saman)
  let objectStore = db.createObjectStore("stocks", {
    keyPath: "id",
    autoIncrement: true,
  });

  // Indexes create karna
  objectStore.createIndex("name", "name", { unique: false });
  objectStore.createIndex("color", "color", { unique: false });
  objectStore.createIndex("quantity", "quantity", { unique: false });
  objectStore.createIndex("image", "image", { unique: false });
};

request.onsuccess = function (event) {
  console.log("Database opened successfully");
};

request.onerror = function (event) {
  console.error("Database error: " + event.target.errorCode);
};

function addStockWithImage(stock, imageFile) {
  let reader = new FileReader();
  reader.onload = function (event) {
    stock.image = event.target.result;

    let request = indexedDB.open("StockManagementDB", 1);

    request.onsuccess = function (event) {
      let db = event.target.result;
      let transaction = db.transaction(["stocks"], "raedwrite");
      let objectStore = transaction.objectStore("stocks");

      let addRequest = objectStore.add(stock);

      addRequest.onsuccess = function (event) {
        console.log("Stock with image added successfully");
      };

      addRequest.onerror = function (event) {
        console.error("Error adding stock: " + event.target.errorCode);
      };
    };
  };

  reader.readAsDataURL(imageFile); // Image ko Data URL me read karna
}

let newStock = {
  name: "Item with Image",
  quantity: 50,
};

// HTML file input se image ko read karna
let imageFile = document.querySelector('input[type="file"]').files[0];

addStockWithImage(newStock, imageFile);

// Stock ko uthana means display krwana

function getStockWithImageById(id) {
  let request = indexedDB.open("StockManagementDB", 1);

  request.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(["stocks"]);
    let objectStore = transaction.objectStore("stocks");

    let getRequest = objectStore.get(id);

    getRequest.onsuccess = function (event) {
      if (getRequest.result) {
        console.log("Stock:", getRequest.result);
        let image = new Image();
        image.src = getRequest.result.image; // Image URL set karna
        document.body.appendChild(image); // Image ko document me append karna
      } else {
        console.log("Stock not found");
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error getting stock: " + event.target.errorCode);
    };
  };
}

getStockWithImageById(1); // Example ID

// Update functionality

// function updateStockWithImage(stock, imageFile) {
//   let reader = new FileReader();

//   reader.onload = function (event) {
//     stock.image = event.target.result; // Image ko Blob format me convert karna

//     let request = indexedDB.open("StockManagementDB", 1);

//     request.onsuccess = function (event) {
//       let db = event.target.result;
//       let transaction = db.transaction(["stocks"], "readwrite");
//       let objectStore = transaction.objectStore("stocks");

//       let updateRequest = objectStore.put(stock);

//       updateRequest.onsuccess = function (event) {
//         console.log("Stock with image updated successfully");
//       };

//       updateRequest.onerror = function (event) {
//         console.error("Error updating stock: " + event.target.errorCode);
//       };
//     };
//   };

//   reader.readAsDataURL(imageFile); // Image ko Data URL me read karna
// }

// let updatedStock = {
//   id: 1, // existing stock id
//   name: "Updated Item with Image",
//   quantity: 75,
// };

// // HTML file input se image ko read karna
// let updatedImageFile = document.querySelector('input[type="file"]').files[0];

// updateStockWithImage(updatedStock, updatedImageFile);

// Delete functionality

// function deleteStock(id) {
//   let request = indexedDB.open("StockManagementDB", 1);

//   request.onsuccess = function (event) {
//     let db = event.target.result;
//     let transaction = db.transaction(["stocks"], "readwrite");
//     let objectStore = transaction.objectStore("stocks");

//     let deleteRequest = objectStore.delete(id);

//     deleteRequest.onsuccess = function (event) {
//       console.log("Stock deleted successfully");
//     };

//     deleteRequest.onerror = function (event) {
//       console.error("Error deleting stock: " + event.target.errorCode);
//     };
//   };
// }

// deleteStock(1); // Example ID


