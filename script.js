
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
  const opt = String(option);
  switch (opt) {
    case "1":
      return 0;
    case "2":
      return 80;
    case "3":
      return 150;
    default:
      return 0;
  }
}

function generateProductFields() {
  const container = document.getElementById("productsContainer");
  const count = Number(document.getElementById("productCount").value);

  container.innerHTML = "";

  if (isNaN(count) || count <= 0) {
    return;
  }

  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <label for="productName-${i}">Product Name</label><br>
      <input type="text" id="productName-${i}"><br>
      <label for="productPrice-${i}">Price</label><br>
      <input type="text" id="productPrice-${i}"><br>
      <label for="productQuantity-${i}">Quantity</label><br>
      <input type="text" id="productQuantity-${i}"><br><br>
    `;
    container.appendChild(div);
  }
}

document.getElementById("productCount").addEventListener("input", generateProductFields);
document.getElementById("productCount").addEventListener("change", generateProductFields);

document.getElementById("calculateBtn").addEventListener("click", function () {
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");

  validationMessage.innerText = "";
  orderSummary.innerText = "";

  const customerName = document.getElementById("customerName").value.trim();
  const countInput = document.getElementById("productCount").value;
  const count = Number(countInput);

  if (customerName === "") {
    validationMessage.innerText = "Please enter customer name.";
    return;
  }

  if (countInput === "" || isNaN(count) || count <= 0) {
    validationMessage.innerText = "Please enter a valid number of products.";
    return;
  }

  if (!document.getElementById("productName-0")) {
    generateProductFields();
  }

  let subtotal = 0;
  let productDetails = "";

  for (let i = 0; i < count; i++) {
    const nameField = document.getElementById(`productName-${i}`);
    const priceField = document.getElementById(`productPrice-${i}`);
    const qtyField = document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !qtyField) {
      validationMessage.innerText = "Product fields missing.";
      return;
    }

    const name = nameField.value.trim();
    const price = Number(priceField.value);
    const quantity = Number(qtyField.value);

    if (name === "" || isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
      validationMessage.innerText = "Please fill out valid product information.";
      return;
    }

    const itemAmount = calculateItemAmount(price, quantity);
    subtotal += itemAmount;

    const formattedPrice = "₱" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedAmount = "₱" + itemAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    productDetails += `${i + 1}. ${name}\n`;
    productDetails += `   Price: ${formattedPrice}\n`;
    productDetails += `   Quantity: ${quantity}\n`;
    productDetails += `   Amount: ${formattedAmount}\n\n`;
  }

  const discountAmount = calculateDiscount(subtotal);

  let discountRate = 0;
  if (subtotal >= 5000) discountRate = 10;
  else if (subtotal >= 3000) discountRate = 7;
  else if (subtotal >= 1000) discountRate = 5;

  const deliveryOption = document.getElementById("deliveryOption").value;
  const deliveryFee = getDeliveryFee(deliveryOption);

  let deliveryType = "";
  if (String(deliveryOption) === "1") deliveryType = "Store Pickup";
  else if (String(deliveryOption) === "2") deliveryType = "Standard Delivery";
  else if (String(deliveryOption) === "3") deliveryType = "Express Delivery";

  const finalAmount = subtotal - discountAmount + deliveryFee;

  const fSubtotal = "₱" + subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fDiscountAmount = "₱" + discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fDeliveryFee = "₱" + deliveryFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fFinalAmount = "₱" + finalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const summaryText =
`MINI STORE CHECKOUT SYSTEM

Customer: ${customerName}

${productDetails}ORDER SUMMARY
Subtotal: ${fSubtotal}
Discount Rate: ${discountRate}%
Discount Amount: ${fDiscountAmount}
Delivery Type: ${deliveryType}
Delivery Fee: ${fDeliveryFee}
Final Amount: ${fFinalAmount}`;

  orderSummary.innerText = summaryText;
});
