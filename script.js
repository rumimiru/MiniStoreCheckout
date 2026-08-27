function calculateItemAmount(price, quantity) {
  return price * quantity;
}

// Returns the discount AMOUNT (not the rate) based on the subtotal.
function calculateDiscount(subtotal) {
  let rate = 0;

  if (subtotal >= 5000) {
    rate = 0.10;
  } else if (subtotal >= 3000) {
    rate = 0.07;
  } else if (subtotal >= 1000) {
    rate = 0.05;
  } else {
    rate = 0;
  }

  return subtotal * rate;
}


// returns the discount RATE as a percentage, using the same brackets.
function getDiscountRate(subtotal) {
  if (subtotal >= 5000) return 10;
  else if (subtotal >= 3000) return 7;
  else if (subtotal >= 1000) return 5;
  else return 0;
}

// Returns the delivery fee based on the selected option.
function getDeliveryFee(option) {
  let fee = 0;

  switch (Number(option)) {
    case 1:
      fee = 0; // Store Pickup
      break;
    case 2:
      fee = 80; // Standard Delivery
      break;
    case 3:
      fee = 150; // Express Delivery
      break;
    default:
      fee = 0;
  }

  return fee;
}

// Helper for display text of the chosen delivery type.
function getDeliveryTypeLabel(option) {
  switch (Number(option)) {
    case 1:
      return "Store Pickup";
    case 2:
      return "Standard Delivery";
    case 3:
      return "Express Delivery";
    default:
      return "Unknown";
  }
}


function formatPeso(amount) {
  return "₱" + amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}



const productCountInput = document.getElementById("productCount");
const calculateBtn = document.getElementById("calculateBtn");
const productsContainer = document.getElementById("productsContainer");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

// Generate the dynamic product input fields using a for loop.
// This is called automatically whenever productCount changes, and again
// defensively right before calculation, so no separate button/click is
// ever required to make the productName-N / productPrice-N / productQuantity-N
// fields exist.
function generateProductFields() {
  productsContainer.innerHTML = "";

  const productCount = parseFloat(productCountInput.value);

  if (isNaN(productCount) || productCount <= 0) {
    return;
  }

  for (let i = 0; i < productCount; i++) {
    const block = document.createElement("div");
    block.className = "product-block";

    block.innerHTML = `
      <h3>Product ${i + 1}</h3>

      <label for="productName-${i}">Product Name</label>
      <input type="text" id="productName-${i}" placeholder="Enter product name" />

      <label for="productPrice-${i}">Price</label>
      <input type="number" id="productPrice-${i}" placeholder="Enter price" min="0" step="0.01" />

      <label for="productQuantity-${i}">Quantity</label>
      <input type="number" id="productQuantity-${i}" placeholder="Enter quantity" min="1" step="1" />
    `;

    productsContainer.appendChild(block);
  }
}

// Regenerate fields live as the user types/changes the product count.
productCountInput.addEventListener("input", generateProductFields);
productCountInput.addEventListener("change", generateProductFields);

// Main calculation, validation, and output logic.
calculateBtn.addEventListener("click", function () {
  validationMessage.textContent = "";
  orderSummary.textContent = "";

  const customerNameInput = document.getElementById("customerName").value.trim();
  const productCount = parseFloat(document.getElementById("productCount").value);
  const deliveryOption = document.getElementById("deliveryOption").value;

  let errors = [];

  // Validate customer name.
  if (customerNameInput === "") {
    errors.push("Customer name is required.");
  }

  // Validate product count.
  if (isNaN(productCount) || productCount <= 0) {
    errors.push("Number of products must be a valid positive number.");
    validationMessage.textContent = errors.join("\n");
    return;
  }

  // Safety net: make sure the dynamic product fields exist even if the
  // productCount value was set programmatically (no input/change event fired).
  if (!document.getElementById("productName-0")) {
    generateProductFields();
  }

  let subtotal = 0; // accumulator
  let productLines = []; // collected text for the order summary
  let productErrorFound = false;

  // Use a for loop to process each dynamically generated product.
  for (let i = 0; i < productCount; i++) {
    const nameField = document.getElementById("productName-" + i);
    const priceField = document.getElementById("productPrice-" + i);
    const quantityField = document.getElementById("productQuantity-" + i);

    // If the fields were never generated (e.g. count changed after generating).
    if (!nameField || !priceField || !quantityField) {
      errors.push("Product " + (i + 1) + ": input fields not found. Click \"Generate Product Fields\" first.");
      productErrorFound = true;
      continue;
    }

    const name = nameField.value.trim();
    const price = parseFloat(priceField.value);
    const quantity = parseFloat(quantityField.value);

    if (name === "") {
      errors.push("Product " + (i + 1) + ": name is required.");
      productErrorFound = true;
    }

    if (isNaN(price) || price <= 0) {
      errors.push("Product " + (i + 1) + ": price must be a valid positive number.");
      productErrorFound = true;
    }

    if (isNaN(quantity) || quantity <= 0) {
      errors.push("Product " + (i + 1) + ": quantity must be a valid positive number.");
      productErrorFound = true;
    }

    // Only compute if this product's inputs are valid.
    if (name !== "" && !isNaN(price) && price > 0 && !isNaN(quantity) && quantity > 0) {
      const amount = calculateItemAmount(price, quantity);
      subtotal += amount; // accumulate subtotal

      productLines.push(
        `${i + 1}. ${name}\n   Price: ${formatPeso(price)}\n   Quantity: ${quantity}\n   Amount: ${formatPeso(amount)}`
      );
    }
  }

  if (productErrorFound || errors.length > 0) {
    validationMessage.textContent = errors.join("\n");
    return;
  }

  // Compute discount, delivery fee, and final amount.
  const discountRate = getDiscountRate(subtotal);
  const discountAmount = calculateDiscount(subtotal);
  const deliveryFee = getDeliveryFee(deliveryOption);
  const deliveryTypeLabel = getDeliveryTypeLabel(deliveryOption);
  const finalAmount = subtotal - discountAmount + deliveryFee;

  // Build the full order summary using template literals.
  const summaryText =
`MINI STORE CHECKOUT SYSTEM

Customer: ${customerNameInput}

${productLines.join("\n\n")}

ORDER SUMMARY
Subtotal: ${formatPeso(subtotal)}
Discount Rate: ${discountRate}%
Discount Amount: ${formatPeso(discountAmount)}
Delivery Type: ${deliveryTypeLabel}
Delivery Fee: ${formatPeso(deliveryFee)}
Final Amount: ${formatPeso(finalAmount)}`;

  orderSummary.textContent = summaryText;

  // Optional debugging output.
  console.log(summaryText);
});
