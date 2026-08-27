// 1. Required Calculation Functions

function calculateItemAmount(price, quantity) {
  return price * quantity;
}

function calculateDiscount(subtotal) {
  if (subtotal >= 5000) {
    return subtotal * 0.10;
  } else if (subtotal >= 3000) {
    return subtotal * 0.07;
  } else if (subtotal >= 1000) {
    return subtotal * 0.05;
  } else {
    return 0;
  }
}

function getDeliveryFee(option) {
  switch (Number(option)) {
    case 1:
      return 0;
    case 2:
      return 80;
    case 3:
      return 150;
    default:
      return 0;
  }
}

// 2. DOM Elements & Dynamic Field Generation

const productCountInput = document.getElementById("productCount");
const productsContainer = document.getElementById("productsContainer");
const calculateBtn = document.getElementById("calculateBtn");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

// Function to build product input rows dynamically using a loop
function generateProductFields() {
  const count = parseInt(productCountInput.value, 10);
  productsContainer.innerHTML = "";

  if (isNaN(count) || count <= 0) return;

  for (let i = 0; i < count; i++) {
    const row = document.createElement("div");
    row.style.marginBottom = "12px";
    
    row.innerHTML = `
      <strong>Product ${i + 1}</strong><br>
      <label for="productName-${i}">Name:</label>
      <input type="text" id="productName-${i}"><br>
      <label for="productPrice-${i}">Price:</label>
      <input type="number" id="productPrice-${i}" step="0.01" min="0"><br>
      <label for="productQuantity-${i}">Quantity:</label>
      <input type="number" id="productQuantity-${i}" min="1">
    `;
    productsContainer.appendChild(row);
  }
}

// Straightforward, standard event listeners
productCountInput.addEventListener("input", generateProductFields);
productCountInput.addEventListener("change", generateProductFields);

// 3. Checkout Logic

calculateBtn.addEventListener("click", function () {
  validationMessage.textContent = "";
  orderSummary.textContent = "";

  const customerName = document.getElementById("customerName").value.trim();
  if (!customerName) {
    validationMessage.textContent = "Please enter the customer name.";
    return;
  }

  const count = parseInt(productCountInput.value, 10);
  if (isNaN(count) || count <= 0) {
    validationMessage.textContent = "Please enter a valid number of products.";
    return;
  }

  // Fallback check if fields haven't rendered yet
  if (!document.getElementById("productName-0")) {
    generateProductFields();
  }

  let subtotal = 0;
  let itemsText = "";

  // Loop through each product entry field safely
  for (let i = 0; i < count; i++) {
    const nameEl = document.getElementById(`productName-${i}`);
    const priceEl = document.getElementById(`productPrice-${i}`);
    const qtyEl = document.getElementById(`productQuantity-${i}`);

    if (!nameEl || !priceEl || !qtyEl) {
      validationMessage.textContent = "Some product fields are missing.";
      return;
    }

    const name = nameEl.value.trim();
    const price = parseFloat(priceEl.value);
    const quantity = parseInt(qtyEl.value, 10);

    if (!name || isNaN(price) || price < 0 || isNaN(quantity) || quantity < 0) {
      validationMessage.textContent = `Please enter valid details for Product ${i + 1}.`;
      return;
    }

    const amount = calculateItemAmount(price, quantity);
    subtotal += amount;

    // Formatting currency inline cleanly
    itemsText += `${i + 1}. ${name}\n`;
    itemsText += `   Price: ₱${price.toFixed(2)}\n`;
    itemsText += `   Quantity: ${quantity}\n`;
    itemsText += `   Amount: ₱${amount.toFixed(2)}\n\n`;
  }

  // Calculate discounts and fees using required functions
  const discountAmount = calculateDiscount(subtotal);
  
  let discountRate = "0%";
  if (subtotal >= 5000) discountRate = "10%";
  else if (subtotal >= 3000) discountRate = "7%";
  else if (subtotal >= 1000) discountRate = "5%";

  const deliveryOptionVal = document.getElementById("deliveryOption").value;
  const deliveryFee = getDeliveryFee(deliveryOptionVal);

  let deliveryTypeName = "Store Pickup";
  switch (Number(deliveryOptionVal)) {
    case 2: deliveryTypeName = "Standard Delivery"; break;
    case 3: deliveryTypeName = "Express Delivery"; break;
    default: deliveryTypeName = "Store Pickup";
  }

  const finalAmount = subtotal - discountAmount + deliveryFee;

  // Final Output Formatting
  orderSummary.textContent = 
`MINI STORE CHECKOUT SYSTEM

Customer: ${customerName}

${itemsText}ORDER SUMMARY
Subtotal: ₱${subtotal.toFixed(2)}
Discount Rate: ${discountRate}
Discount Amount: ₱${discountAmount.toFixed(2)}
Delivery Type: ${deliveryTypeName}
Delivery Fee: ₱${deliveryFee.toFixed(2)}
Final Amount: ₱${finalAmount.toFixed(2)}`;
});
