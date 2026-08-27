// FUNCTION 1: Calculate the amount for one product
// price x quantity
function calculateItemAmount(price, quantity) {
  return price * quantity;
}

// FUNCTION 2: Calculate the discount based on the subtotal

function calculateDiscount(subtotal) {
  let discount = 0;

  if (subtotal >= 5000) {
    discount = subtotal * 0.10;   // 10% discount
  } else if (subtotal >= 3000) {
    discount = subtotal * 0.07;   // 7% discount
  } else if (subtotal >= 1000) {
    discount = subtotal * 0.05;   // 5% discount
  } else {
    discount = 0;                 // no discount
  }

  return discount;
}

// FUNCTION 3: Get the delivery fee using a switch statement

function getDeliveryFee(option) {
  let fee = 0;

  switch (option) {
    case "1":
      fee = 0;      // Store Pickup
      break;
    case "2":
      fee = 80;     // Standard Delivery
      break;
    case "3":
      fee = 150;    // Express Delivery
      break;
    default:
      fee = 0;
  }

  return fee;
}

// Generate the product input fields
// This uses a for loop, based on productCount

function generateProducts() {
  const countValue = document.getElementById("productCount").value;
  const count = Number(countValue);

  const container = document.getElementById("productsContainer");
  const validationMessage = document.getElementById("validationMessage");

  // clear old fields first
  container.innerHTML = "";

  // validate the count
  if (countValue === "" || isNaN(count) || count <= 0) {
    validationMessage.innerHTML = "Please enter a valid positive number of products.";
    return;
  }

  validationMessage.innerHTML = "";

  // for loop to create the input fields for each product
  for (let i = 0; i < count; i++) {
    let productHTML = "";

    productHTML += "<div>";
    productHTML += "<strong>Product " + (i + 1) + "</strong><br>";

    productHTML += "<label>Product Name</label><br>";
    productHTML += "<input type='text' id='productName-" + i + "'><br>";

    productHTML += "<label>Price</label><br>";
    productHTML += "<input type='text' id='productPrice-" + i + "'><br>";

    productHTML += "<label>Quantity</label><br>";
    productHTML += "<input type='text' id='productQuantity-" + i + "'><br>";

    productHTML += "</div>";

    container.innerHTML += productHTML;
  }
}

// Main function that runs when "Calculate Order" is clicked

function calculateOrder() {
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");

  // clear old messages
  validationMessage.innerHTML = "";
  orderSummary.innerHTML = "";

  // get customer name
  const customerName = document.getElementById("customerName").value;

  // get number of products
  const count = Number(document.getElementById("productCount").value);

  //VALIDATION
  if (customerName.trim() === "") {
    validationMessage.innerHTML = "Customer name cannot be empty.";
    return;
  }

  if (isNaN(count) || count <= 0) {
    validationMessage.innerHTML = "Please enter a valid positive number of products.";
    return;
  }

  let subtotal = 0;              // accumulator for the subtotal
  let productDetails = "";       // text for each product, to show later

  // for loop to go through each product field
  for (let i = 0; i < count; i++) {
    const nameField = document.getElementById("productName-" + i);
    const priceField = document.getElementById("productPrice-" + i);
    const quantityField = document.getElementById("productQuantity-" + i);

    // check that the fields actually exist (in case Generate was not clicked)
    if (!nameField || !priceField || !quantityField) {
      validationMessage.innerHTML = "Please click 'Generate Product Fields' first.";
      return;
    }

    const productName = nameField.value;
    const price = parseFloat(priceField.value);
    const quantity = parseFloat(quantityField.value);

    //validate product name
    if (productName.trim() === "") {
      validationMessage.innerHTML = "Product " + (i + 1) + " name cannot be empty.";
      return;
    }

    // validate price
    if (isNaN(price) || price <= 0) {
      validationMessage.innerHTML = "Product " + (i + 1) + " price must be a valid positive number.";
      return;
    }

    // validate quantity
    if (isNaN(quantity) || quantity <= 0) {
      validationMessage.innerHTML = "Product " + (i + 1) + " quantity must be a valid positive number.";
      return;
    }

    // calculate the amount for this product
    const itemAmount = calculateItemAmount(price, quantity);

    // add it to the subtotal (accumulator)
    subtotal += itemAmount;

    // build the text that will show in the order summary
    productDetails += (i + 1) + ". " + productName + "\n";
    productDetails += "   Price: \u20B1" + price.toFixed(2) + "\n";
    productDetails += "   Quantity: " + quantity + "\n";
    productDetails += "   Amount: \u20B1" + itemAmount.toFixed(2) + "\n\n";
  }

  //DISCOUNT
  const discount = calculateDiscount(subtotal);

  let discountRate = 0;
  if (subtotal >= 5000) {
    discountRate = 10;
  } else if (subtotal >= 3000) {
    discountRate = 7;
  } else if (subtotal >= 1000) {
    discountRate = 5;
  } else {
    discountRate = 0;
  }

  //DELIVERY FEE
  const deliveryOption = document.getElementById("deliveryOption").value;
  const deliveryFee = getDeliveryFee(deliveryOption);

  let deliveryTypeText = "";
  if (deliveryOption === "1") {
    deliveryTypeText = "Store Pickup";
  } else if (deliveryOption === "2") {
    deliveryTypeText = "Standard Delivery";
  } else if (deliveryOption === "3") {
    deliveryTypeText = "Express Delivery";
  }

  //FINAL AMOUNT
  const finalAmount = subtotal - discount + deliveryFee;

  //DISPLAY THE ORDER SUMMARY
  let summaryText = "MINI STORE CHECKOUT SYSTEM\n\n";
  summaryText += "Customer: " + customerName + "\n\n";
  summaryText += productDetails;
  summaryText += "ORDER SUMMARY\n";
  summaryText += "Subtotal: \u20B1" + subtotal.toFixed(2) + "\n";
  summaryText += "Discount Rate: " + discountRate + "%\n";
  summaryText += "Discount Amount: \u20B1" + discount.toFixed(2) + "\n";
  summaryText += "Delivery Type: " + deliveryTypeText + "\n";
  summaryText += "Delivery Fee: \u20B1" + deliveryFee.toFixed(2) + "\n";
  summaryText += "Final Amount: \u20B1" + finalAmount.toFixed(2);

  orderSummary.innerText = summaryText;
  console.log(summaryText);
}

// Connect the buttons to their functions

document.getElementById("generateBtn").addEventListener("click", generateProducts);
document.getElementById("calculateBtn").addEventListener("click", calculateOrder);
