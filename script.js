function calculateItemAmount(price, quantity) {
  return Number(price) * Number(quantity);
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
  switch (String(option)) {
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

function formatAmount(amount) {
  const parts = amount.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${parts[0]}.${parts[1]}`;
}

function generateProducts() {
  const countValue = document.getElementById("productCount").value;
  const count = Number(countValue);
  const container = document.getElementById("productsContainer");
  const validationMessage = document.getElementById("validationMessage");

  container.innerHTML = "";

  if (countValue === "" || isNaN(count) || count <= 0 || !Number.isInteger(count)) {
    validationMessage.innerHTML = "Please enter a valid positive number of products.";
    return;
  }

  validationMessage.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const product = document.createElement("div");

    product.innerHTML =
      `<strong>Product ${i + 1}</strong><br>` +
      `<label>Product Name</label><br>` +
      `<input type="text" id="productName-${i}"><br>` +
      `<label>Price</label><br>` +
      `<input type="text" id="productPrice-${i}"><br>` +
      `<label>Quantity</label><br>` +
      `<input type="text" id="productQuantity-${i}"><br><br>`;

    container.appendChild(product);
  }
}

function calculateOrder() {
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");

  validationMessage.innerHTML = "";
  orderSummary.innerHTML = "";

  const customerName = document.getElementById("customerName").value;
  const count = Number(document.getElementById("productCount").value);

  if (customerName.trim() === "") {
    validationMessage.innerHTML = "Customer name cannot be empty.";
    return;
  }

  if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
    validationMessage.innerHTML = "Please enter a valid positive number of products.";
    return;
  }

  let subtotal = 0;
  let productDetails = "";

  for (let i = 0; i < count; i++) {
    const nameField = document.getElementById(`productName-${i}`);
    const priceField = document.getElementById(`productPrice-${i}`);
    const quantityField = document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !quantityField) {
      validationMessage.innerHTML = "Please click 'Generate Product Fields' first.";
      return;
    }

    const productName = nameField.value;
    const price = Number(priceField.value);
    const quantity = Number(quantityField.value);

    if (productName.trim() === "") {
      validationMessage.innerHTML = `Product ${i + 1} name cannot be empty.`;
      return;
    }

    if (isNaN(price) || price <= 0) {
      validationMessage.innerHTML = `Product ${i + 1} price must be a valid positive number.`;
      return;
    }

    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
      validationMessage.innerHTML = `Product ${i + 1} quantity must be a valid positive number.`;
      return;
    }

    const itemAmount = calculateItemAmount(price, quantity);

    subtotal += itemAmount;

    productDetails += `${i + 1}. ${productName}\n`;
    productDetails += `   Price: ₱${formatAmount(price)}\n`;
    productDetails += `   Quantity: ${quantity}\n`;
    productDetails += `   Amount: ₱${formatAmount(itemAmount)}\n\n`;
  }

  const discount = calculateDiscount(subtotal);

  let discountRate = 0;

  if (subtotal >= 5000) {
    discountRate = 10;
  } else if (subtotal >= 3000) {
    discountRate = 7;
  } else if (subtotal >= 1000) {
    discountRate = 5;
  }

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

  const finalAmount = subtotal - discount + deliveryFee;

  let summaryText = "MINI STORE CHECKOUT SYSTEM\n\n";
  summaryText += `Customer: ${customerName}\n\n`;
  summaryText += productDetails;
  summaryText += "ORDER SUMMARY\n";
  summaryText += `Subtotal: ₱${formatAmount(subtotal)}\n`;
  summaryText += `Discount Rate: ${discountRate}%\n`;
  summaryText += `Discount Amount: ₱${formatAmount(discount)}\n`;
  summaryText += `Delivery Type: ${deliveryTypeText}\n`;
  summaryText += `Delivery Fee: ₱${formatAmount(deliveryFee)}\n`;
  summaryText += `Final Amount: ₱${formatAmount(finalAmount)}`;

  orderSummary.innerText = summaryText;
  console.log(summaryText);
}

document.getElementById("generateBtn").addEventListener("click", generateProducts);
document.getElementById("calculateBtn").addEventListener("click", calculateOrder);
