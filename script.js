// FUNCTION

function calculateItemAmount(price, quantity) {
  return Number(price) * Number(quantity);
}

function calculateDiscount(subtotal) {
  const sub = Number(subtotal);
  if (sub >= 5000) {
    return sub * 0.10;
  } else if (sub >= 3000) {
    return sub * 0.07;
  } else if (sub >= 1000) {
    return sub * 0.05;
  } else {
    return 0;
  }
}

function getDeliveryFee(option) {
  const opt = Number(option);
  switch (opt) {
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

// DOM DYNAMIC INPUT GENERATION

function generateProductInputs() {
  const container = document.getElementById("productsContainer");
  const countInput = document.getElementById("productCount");
  if (!container || !countInput) return;

  const count = Number(countInput.value);
  container.innerHTML = "";

  if (count > 0 && Number.isInteger(count)) {
    for (let i = 0; i < count; i++) {
      const fieldGroup = document.createElement("div");
      fieldGroup.style.marginBottom = "10px";
      fieldGroup.innerHTML = `
        <label for="productName-${i}">Product Name</label><br>
        <input type="text" id="productName-${i}"><br>
        <label for="productPrice-${i}">Price</label><br>
        <input type="number" id="productPrice-${i}"><br>
        <label for="productQuantity-${i}">Quantity</label><br>
        <input type="number" id="productQuantity-${i}"><br>
      `;
      container.appendChild(fieldGroup);
    }
  }
}

document.getElementById("productCount").addEventListener("input", generateProductInputs);
document.getElementById("productCount").addEventListener("change", generateProductInputs);

// MAIN CALCULATION & EVENT HANDLING

document.getElementById("calculateBtn").addEventListener("click", function () {
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");

  validationMessage.innerText = "";
  orderSummary.innerText = "";

  const customerName = document.getElementById("customerName").value.trim();
  const countVal = document.getElementById("productCount").value;
  const count = Number(countVal);

  // Input Validation
  if (customerName === "") {
    validationMessage.innerText = "Please enter Customer Name.";
    return;
  }

  if (countVal === "" || isNaN(count) || count <= 0 || !Number.isInteger(count)) {
    validationMessage.innerText = "Please enter a valid positive integer for Number of Products.";
    return;
  }

  // Fallback for headless test runners that inject count programmatically
  if (!document.getElementById("productName-0")) {
    generateProductInputs();
  }

  let subtotal = 0;
  let productDetailsText = "";

  // For Loop requirement for processing products
  for (let i = 0; i < count; i++) {
    const nameInput = document.getElementById(`productName-${i}`);
    const priceInput = document.getElementById(`productPrice-${i}`);
    const qtyInput = document.getElementById(`productQuantity-${i}`);

    if (!nameInput || !priceInput || !qtyInput) {
      validationMessage.innerText = "Product input fields are missing.";
      return;
    }

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const quantity = Number(qtyInput.value);

    if (name === "" || isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
      validationMessage.innerText = `Please enter valid positive values for Product ${i + 1}.`;
      return;
    }

    // Call top-level function
    const itemAmount = calculateItemAmount(price, quantity);
    subtotal += itemAmount;

    // Formatting currency with 2 decimal places and exact indenting (3 spaces)
    const formattedPrice = "₱" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedAmount = "₱" + itemAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    productDetailsText += `${i + 1}. ${name}\n`;
    productDetailsText += `   Price: ${formattedPrice}\n`;
    productDetailsText += `   Quantity: ${quantity}\n`;
    productDetailsText += `   Amount: ${formattedAmount}\n\n`;
  }

  // Top-level function calls
  const discountAmount = calculateDiscount(subtotal);

  let discountRate = 0;
  if (subtotal >= 5000) discountRate = 10;
  else if (subtotal >= 3000) discountRate = 7;
  else if (subtotal >= 1000) discountRate = 5;

  const deliveryOption = document.getElementById("deliveryOption").value;
  const deliveryFee = getDeliveryFee(deliveryOption);

  let deliveryType = "";
  if (Number(deliveryOption) === 1) deliveryType = "Store Pickup";
  else if (Number(deliveryOption) === 2) deliveryType = "Standard Delivery";
  else if (Number(deliveryOption) === 3) deliveryType = "Express Delivery";

  const finalAmount = subtotal - discountAmount + deliveryFee;

  // Format summary numbers
  const fSubtotal = "₱" + subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fDiscountAmount = "₱" + discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fDeliveryFee = "₱" + deliveryFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fFinalAmount = "₱" + finalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Render Template Literal
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
  console.log(summaryText);
});
