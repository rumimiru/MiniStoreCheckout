
function calculateItemAmount(price, quantity) {
  return Number(price) * Number(quantity);
}

function calculateDiscount(subtotal) {
  const amount = Number(subtotal);
  if (amount >= 5000) {
    return amount * 0.10;
  } else if (amount >= 3000) {
    return amount * 0.07;
  } else if (amount >= 1000) {
    return amount * 0.05;
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

// DOM ELEMENTS & EVENT HANDLING

const customerNameInput = document.getElementById("customerName");
const productCountInput = document.getElementById("productCount");
const productsContainer = document.getElementById("productsContainer");
const deliveryOptionSelect = document.getElementById("deliveryOption");
const calculateBtn = document.getElementById("calculateBtn");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

// 1. Generate Product Inputs (Triggered automatically when the number changes)
productCountInput.addEventListener("input", function() {
  productsContainer.innerHTML = ""; 
  const count = Number(productCountInput.value);

  if (count > 0) {
    for (let i = 0; i < count; i++) {
   
      productsContainer.innerHTML += `
        <div style="margin-bottom: 15px;">
          <label>Product Name</label><br>
          <input type="text" id="productName-${i}"><br>
          
          <label>Price</label><br>
          <input type="number" id="productPrice-${i}"><br>
          
          <label>Quantity</label><br>
          <input type="number" id="productQuantity-${i}">
        </div>
      `;
    }
  }
});

// 2. Process Order and Build Summary
calculateBtn.addEventListener("click", function() {
  validationMessage.innerText = "";
  orderSummary.innerText = "";

  const customerName = customerNameInput.value.trim();
  const count = Number(productCountInput.value);

  // Input Validation
  if (customerName === "") {
    validationMessage.innerText = "Please enter the Customer Name.";
    return;
  }
  if (count <= 0 || isNaN(count)) {
    validationMessage.innerText = "Please enter a valid Number of Products.";
    return;
  }

  let subtotal = 0; // Accumulator
  let productDetailsText = "";

  for (let i = 0; i < count; i++) {
    const nameField = document.getElementById(`productName-${i}`);
    const priceField = document.getElementById(`productPrice-${i}`);
    const qtyField = document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !qtyField) {
      validationMessage.innerText = "Error: Please re-enter the number of products.";
      return;
    }

    const name = nameField.value.trim();
    const price = Number(priceField.value);
    const quantity = Number(qtyField.value);

    // Validate individual products
    if (name === "" || price <= 0 || isNaN(price) || quantity <= 0 || isNaN(quantity)) {
      validationMessage.innerText = `Please fill out valid details for Product ${i + 1}.`;
      return;
    }

    // Calculation
    const amount = calculateItemAmount(price, quantity);
    subtotal += amount;

    const formattedPrice = "₱" + price.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
    const formattedAmount = "₱" + amount.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});

    productDetailsText += `${i + 1}. ${name}\n`;
    productDetailsText += `   Price: ${formattedPrice}\n`;
    productDetailsText += `   Quantity: ${quantity}\n`;
    productDetailsText += `   Amount: ${formattedAmount}\n\n`;
  }

  // Final Calculations based on the top-level functions
  const discountAmount = calculateDiscount(subtotal);
  const deliveryOption = deliveryOptionSelect.value;
  const deliveryFee = getDeliveryFee(deliveryOption);
  const finalAmount = subtotal - discountAmount + deliveryFee;

  let discountRate = 0;
  if (subtotal >= 5000) discountRate = 10;
  else if (subtotal >= 3000) discountRate = 7;
  else if (subtotal >= 1000) discountRate = 5;

  let deliveryType = "";
  if (Number(deliveryOption) === 1) deliveryType = "Store Pickup";
  else if (Number(deliveryOption) === 2) deliveryType = "Standard Delivery";
  else if (Number(deliveryOption) === 3) deliveryType = "Express Delivery";

  const fSubtotal = "₱" + subtotal.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const fDiscountAmount = "₱" + discountAmount.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const fDeliveryFee = "₱" + deliveryFee.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const fFinalAmount = "₱" + finalAmount.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});


  const summaryText = 
`MINI STORE CHECKOUT SYSTEM

Customer: ${customerName}

${productDetailsText}ORDER SUMMARY
Subtotal: ${fSubtotal}
Discount Rate: ${discountRate}%
Discount Amount: ${fDiscountAmount}
Delivery Type: ${deliveryType}
Delivery Fee: ${fDeliveryFee}
Final Amount: ${fFinalAmount}`;

  orderSummary.innerText = summaryText;
});
