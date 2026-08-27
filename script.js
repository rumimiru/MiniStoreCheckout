function calculateItemAmount(price, quantity) {
  return Number(price) * Number(quantity);
}

function calculateDiscount(subtotal) {
  const amt = Number(subtotal);
  if (amt >= 5000) {
    return amt * 0.10;
  } else if (amt >= 3000) {
    return amt * 0.07;
  } else if (amt >= 1000) {
    return amt * 0.05;
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
  const count = Number(document.getElementById("productCount").value);
  container.innerHTML = "";

  if (count > 0 && Number.isInteger(count)) {
    for (let i = 0; i < count; i++) {
      container.innerHTML += `
        <div>
          <label for="productName-${i}">Product Name</label><br>
          <input type="text" id="productName-${i}"><br>
          <label for="productPrice-${i}">Price</label><br>
          <input type="number" id="productPrice-${i}"><br>
          <label for="productQuantity-${i}">Quantity</label><br>
          <input type="number" id="productQuantity-${i}"><br><br>
        </div>
      `;
    }
  }
}

document.getElementById("productCount").addEventListener("input", generateProducts);
document.getElementById("productCount").addEventListener("change", generateProducts);

document.getElementById("calculateBtn").addEventListener("click", function () {
  const validationMessage = document.getElementById("validationMessage");
  const orderSummary = document.getElementById("orderSummary");

  validationMessage.innerText = "";
  orderSummary.innerText = "";

  const customerName = document.getElementById("customerName").value.trim();
  const count = Number(document.getElementById("productCount").value);

  if (customerName === "") {
    validationMessage.innerText = "Please enter a valid Customer Name.";
    return;
  }

  if (isNaN(count) || count <= 0 || !Number.isInteger(count)) {
    validationMessage.innerText = "Please enter a valid positive Number of Products.";
    return;
  }

  if (!document.getElementById("productName-0")) {
    generateProducts();
  }

  let subtotal = 0;
  let productDetails = "";

  for (let i = 0; i < count; i++) {
    const nameElem = document.getElementById(`productName-${i}`);
    const priceElem = document.getElementById(`productPrice-${i}`);
    const qtyElem = document.getElementById(`productQuantity-${i}`);

    if (!nameElem || !priceElem || !qtyElem) {
      validationMessage.innerText = "Product input fields are missing.";
      return;
    }

    const name = nameElem.value.trim();
    const price = Number(priceElem.value);
    const quantity = Number(qtyElem.value);

    if (name === "" || isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
      validationMessage.innerText = `Please enter valid values for Product ${i + 1}.`;
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
  switch (String(deliveryOption)) {
    case "1": deliveryType = "Store Pickup"; break;
    case "2": deliveryType = "Standard Delivery"; break;
    case "3": deliveryType = "Express Delivery"; break;
  }

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
