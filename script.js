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

function generateProducts() {
  const container = document.getElementById("productsContainer");
  const countValue = document.getElementById("productCount").value;
  const count = Number(countValue);

  container.innerHTML = "";

  if (count > 0 && Number.isInteger(count)) {
    for (let i = 0; i < count; i++) {
      const productDiv = document.createElement("div");
      productDiv.innerHTML = `
        <strong>Product ${i + 1}</strong><br>
        <label for="productName-${i}">Product Name</label><br>
        <input type="text" id="productName-${i}"><br>
        <label for="productPrice-${i}">Price</label><br>
        <input type="text" id="productPrice-${i}"><br>
        <label for="productQuantity-${i}">Quantity</label><br>
        <input type="text" id="productQuantity-${i}"><br><br>
      `;
      container.appendChild(productDiv);
    }
  }
}

const generateBtn = document.getElementById("generateBtn");
if (generateBtn) {
  generateBtn.addEventListener("click", generateProducts);
}

const productCountInput = document.getElementById("productCount");
if (productCountInput) {
  productCountInput.addEventListener("input", generateProducts);
  productCountInput.addEventListener("change", generateProducts);
}

document.getElementById("calculateBtn").addEventListener("click", function () {
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");

  validationMessage.innerText = "";
  orderSummary.innerText = "";

  const customerName = document.getElementById("customerName").value.trim();
  const countValue = document.getElementById("productCount").value;
  const count = Number(countValue);

  if (customerName === "") {
    validationMessage.innerText = "Please enter customer name.";
    return;
  }

  if (countValue === "" || isNaN(count) || count <= 0 || !Number.isInteger(count)) {
    validationMessage.innerText = "Please enter a valid number of products.";
    return;
  }

  if (!document.getElementById("productName-0")) {
    generateProducts();
  }

  let subtotal = 0;
  let productLines = [];

  for (let i = 0; i < count; i++) {
    const nameField = document.getElementById(`productName-${i}`);
    const priceField = document.getElementById(`productPrice-${i}`);
    const qtyField = document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !qtyField) {
      validationMessage.innerText = "Product input fields are missing.";
      return;
    }

    const name = nameField.value.trim();
    const price = Number(priceField.value);
    const quantity = Number(qtyField.value);

    if (name === "" || isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
      validationMessage.innerText = `Please enter valid values for Product ${i + 1}.`;
      return;
    }

    const itemAmount = calculateItemAmount(price, quantity);
    subtotal += itemAmount;

    const fPrice = "₱" + price.toFixed(2);
    const fAmount = "₱" + itemAmount.toFixed(2);

    productLines.push(`${i + 1}. ${name}\n   Price: ${fPrice}\n   Quantity: ${quantity}\n   Amount: ${fAmount}`);
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

  const summaryText = 
`MINI STORE CHECKOUT SYSTEM

Customer: ${customerName}

${productLines.join("\n\n")}

ORDER SUMMARY
Subtotal: ₱${subtotal.toFixed(2)}
Discount Rate: ${discountRate}%
Discount Amount: ₱${discountAmount.toFixed(2)}
Delivery Type: ${deliveryType}
Delivery Fee: ₱${deliveryFee.toFixed(2)}
Final Amount: ₱${finalAmount.toFixed(2)}`;

  orderSummary.innerText = summaryText;
});
