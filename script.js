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
  let fee = 0;
  switch (Number(option)) {
    case 1:
      fee = 0;
      break;
    case 2:
      fee = 80;
      break;
    case 3:
      fee = 150;
      break;
    default:
      fee = 0;
  }
  return fee;
}

function generateProductInputs() {
  const container = document.getElementById("productsContainer");
  const count = parseInt(document.getElementById("productCount").value);
  
  container.innerHTML = "";
  
  if (count > 0) {
    for (let i = 0; i < count; i++) {
      container.innerHTML += `
        <div style="margin-bottom: 10px;">
          <strong>${i + 1}.</strong><br>
          <label>Product Name</label><br>
          <input type="text" id="productName-${i}"><br>
          <label>Price</label><br>
          <input type="text" id="productPrice-${i}"><br>
          <label>Quantity</label><br>
          <input type="text" id="productQuantity-${i}">
        </div>
      `;
    }
  }
}

document.getElementById("productCount").addEventListener("input", generateProductInputs);
document.getElementById("productCount").addEventListener("change", generateProductInputs);

document.getElementById("calculateBtn").addEventListener("click", function() {
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");
  
  validationMessage.innerText = "";
  orderSummary.innerText = "";

  const customerName = document.getElementById("customerName").value.trim();
  const productCountVal = document.getElementById("productCount").value;
  const count = parseInt(productCountVal);

  if (customerName === "") {
    validationMessage.innerText = "Please provide a Customer Name.";
    return;
  }

  if (isNaN(count) || count <= 0) {
    validationMessage.innerText = "Please provide a valid Number of Products.";
    return;
  }

  if (!document.getElementById("productName-0")) {
    generateProductInputs();
  }

  let subtotal = 0;
  let productDetailsText = "";

  for (let i = 0; i < count; i++) {
    const nameField = document.getElementById(`productName-${i}`);
    const priceField = document.getElementById(`productPrice-${i}`);
    const qtyField = document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !qtyField) {
      validationMessage.innerText = "Input fields missing.";
      return;
    }

    const name = nameField.value.trim();
    const price = parseFloat(priceField.value);
    const quantity = parseInt(qtyField.value);

    if (name === "" || isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
      validationMessage.innerText = `Invalid inputs for Product ${i + 1}.`;
      return;
    }

    const amount = calculateItemAmount(price, quantity);
    subtotal += amount;

    const fPrice = "₱" + price.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
    const fAmount = "₱" + amount.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});

    productDetailsText += `${i + 1}. ${name}\n`;
    productDetailsText += `   Price: ${fPrice}\n`;
    productDetailsText += `   Quantity: ${quantity}\n`;
    productDetailsText += `   Amount: ${fAmount}\n\n`;
  }

  const discountAmount = calculateDiscount(subtotal);
  const deliveryOption = document.getElementById("deliveryOption").value;
  const deliveryFee = getDeliveryFee(deliveryOption);
  const finalAmount = subtotal - discountAmount + deliveryFee;

  let discountRate = 0;
  if (subtotal >= 5000) discountRate = 10;
  else if (subtotal >= 3000) discountRate = 7;
  else if (subtotal >= 1000) discountRate = 5;

  let deliveryType = "";
  if (deliveryOption === "1") deliveryType = "Store Pickup";
  else if (deliveryOption === "2") deliveryType = "Standard Delivery";
  else if (deliveryOption === "3") deliveryType = "Express Delivery";

  const fSubtotal = "₱" + subtotal.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const fDiscount = "₱" + discountAmount.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const fDelivery = "₱" + deliveryFee.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const fFinal = "₱" + finalAmount.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});

  const summaryText = 
`MINI STORE CHECKOUT SYSTEM

Customer: ${customerName}

${productDetailsText}ORDER SUMMARY
Subtotal: ${fSubtotal}
Discount Rate: ${discountRate}%
Discount Amount: ${fDiscount}
Delivery Type: ${deliveryType}
Delivery Fee: ${fDelivery}
Final Amount: ${fFinal}`;

  orderSummary.innerText = summaryText;
});
