//1
function calculateItemAmount(price, quantity) {
  return Number(price) * Number(quantity);
}

function calculateDiscount(subtotal) {
  const amount = Number(subtotal);
  if (amount >= 5000) return amount * 0.10;
  if (amount >= 3000) return amount * 0.07;
  if (amount >= 1000) return amount * 0.05;
  return 0;
}

function getDeliveryFee(option) {
  switch (Number(option)) {
    case 1: return 0;
    case 2: return 80;
    case 3: return 150;
    default: return 0;
  }
}

// 2 
const productCountInput = document.getElementById("productCount");
const productsContainer = document.getElementById("productsContainer");
const calculateBtn = document.getElementById("calculateBtn");
const validationMessage = document.getElementById("validationMessage");
const orderSummary = document.getElementById("orderSummary");

// Automatically generate inputs when the number changes using a for loop
productCountInput.addEventListener("input", function() {
  productsContainer.innerHTML = ""; 
  const count = Number(productCountInput.value);

  if (count > 0) {
    for (let i = 0; i < count; i++) {
      // Required IDs: productName-N, productPrice-N, productQuantity-N starting at 0
      productsContainer.innerHTML += `
        <div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc;">
          <strong>Product ${i + 1}</strong><br>
          <label for="productName-${i}">Product Name</label>
          <input type="text" id="productName-${i}"><br>
          
          <label for="productPrice-${i}">Price</label>
          <input type="number" id="productPrice-${i}" min="0"><br>
          
          <label for="productQuantity-${i}">Quantity</label>
          <input type="number" id="productQuantity-${i}" min="1">
        </div>
      `;
    }
  }
});

// Process the order on click using a for loop
calculateBtn.addEventListener("click", function() {
  validationMessage.innerText = "";
  orderSummary.innerText = "";

  const customerName = document.getElementById("customerName").value.trim();
  const count = Number(productCountInput.value);

  if (customerName === "" || count <= 0) {
    validationMessage.innerText = "Please provide a valid Customer Name and Number of Products.";
    return;
  }

  let subtotal = 0;
  let summaryText = `Customer Name: ${customerName}\n\n-- ORDER DETAILS --\n`;

  // Required for loop processing
  for (let i = 0; i < count; i++) {
    const nameField = document.getElementById(`productName-${i}`);
    const priceField = document.getElementById(`productPrice-${i}`);
    const qtyField = document.getElementById(`productQuantity-${i}`);

    if (!nameField || !priceField || !qtyField) {
      validationMessage.innerText = "Error: Product fields are missing.";
      return;
    }

    const name = nameField.value.trim();
    const price = Number(priceField.value);
    const quantity = Number(qtyField.value);

    if (name === "" || price <= 0 || quantity <= 0) {
      validationMessage.innerText = `Please fill out valid details for Product ${i + 1}.`;
      return;
    }

    const itemAmount = calculateItemAmount(price, quantity);
    subtotal += itemAmount;

    summaryText += `${name} (Qty: ${quantity} @ ${price}) = ${itemAmount}\n`;
  }

  const deliveryOption = document.getElementById("deliveryOption").value;
  
  // Call the required calculation functions
  const discountAmount = calculateDiscount(subtotal);
  const deliveryFee = getDeliveryFee(deliveryOption);
  
  const finalTotal = subtotal - discountAmount + deliveryFee;

  summaryText += `\n-- SUMMARY --\n`;
  summaryText += `Subtotal: ${subtotal}\n`;
  summaryText += `Discount: ${discountAmount}\n`;
  summaryText += `Delivery Fee: ${deliveryFee}\n`;
  summaryText += `Final Amount: ${finalTotal}`;

  orderSummary.innerText = summaryText;
});
