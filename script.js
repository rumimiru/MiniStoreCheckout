function calculateItemAmount(price, quantity) {
    return price * quantity;
  }
  
  function calculateDiscount(subtotal) {
    let discount = 0;
  
    if (subtotal >= 5000) {
      discount = subtotal * 0.10;
    } else if (subtotal >= 3000) {
      discount = subtotal * 0.07;
    } else if (subtotal >= 1000) {
      discount = subtotal * 0.05;
    } else {
      discount = 0;
    }
  
    return discount;
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
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      calculateItemAmount,
      calculateDiscount,
      getDeliveryFee
    };
  }
  
  if (typeof document !== 'undefined') {
  
    const productCountInput = document.getElementById('productCount');
    const productsContainer = document.getElementById('productsContainer');
    const validationMessage = document.getElementById('validationMessage');
    const orderSummary = document.getElementById('orderSummary');
    const calculateBtn = document.getElementById('calculateBtn');
  
    productCountInput.addEventListener('input', generateProductFields);
    productCountInput.addEventListener('change', generateProductFields);
    productCountInput.addEventListener('keyup', generateProductFields);
    productCountInput.addEventListener('blur', generateProductFields);
  
    let lastGeneratedCount = -1;
  
    function pollProductCount() {
      const value = parseInt(productCountInput.value, 10);
  
      if (!isNaN(value) && value > 0) {
        if (value !== lastGeneratedCount) {
          generateProductFields();
        }
      } else if (lastGeneratedCount !== 0) {
        productsContainer.innerHTML = '';
        lastGeneratedCount = 0;
      }
    }
  
    setInterval(pollProductCount, 150);
  
    function generateProductFields() {
      const count = parseInt(productCountInput.value, 10);
      productsContainer.innerHTML = '';
  
      if (isNaN(count) || count <= 0) {
        lastGeneratedCount = 0;
        return;
      }
  
      lastGeneratedCount = count;
  
      for (let i = 0; i < count; i++) {
        const block = document.createElement('div');
        block.className = 'product-block';
  
        block.innerHTML = `
          <strong>Product ${i + 1}</strong>
  
          <div class="field">
            <label for="productName-${i}">Product Name</label>
            <input type="text" id="productName-${i}">
          </div>
  
          <div class="field">
            <label for="productPrice-${i}">Price</label>
            <input type="number" id="productPrice-${i}" step="0.01" min="0">
          </div>
  
          <div class="field">
            <label for="productQuantity-${i}">Quantity</label>
            <input type="number" id="productQuantity-${i}" min="0">
          </div>
        `;
  
        productsContainer.appendChild(block);
      }
    }
  
    calculateBtn.addEventListener('click', calculateOrder);
  
    function formatCurrency(value) {
      return '₱' + value.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  
    function calculateOrder() {
      validationMessage.textContent = '';
      orderSummary.innerHTML = '';
  
      pollProductCount();
  
      const customerName = document
        .getElementById('customerName')
        .value.trim();
  
      if (customerName === '') {
        validationMessage.textContent = 'Please enter the customer name.';
        return;
      }
  
      const productCount = parseInt(productCountInput.value, 10);
  
      if (isNaN(productCount) || productCount <= 0) {
        validationMessage.textContent =
          'Please enter a valid positive number of products.';
        return;
      }
  
      if (!document.getElementById(`productName-${productCount - 1}`)) {
        generateProductFields();
  
        if (!document.getElementById(`productName-${productCount - 1}`)) {
          validationMessage.textContent =
            'Product fields could not be generated. Please re-enter the number of products.';
          return;
        }
      }
  
      let subtotal = 0;
      let productDetailsText = '';
  
      for (let i = 0; i < productCount; i++) {
        const nameField = document.getElementById(`productName-${i}`);
        const priceField = document.getElementById(`productPrice-${i}`);
        const quantityField = document.getElementById(`productQuantity-${i}`);
  
        const name = nameField ? nameField.value.trim() : '';
        const price = priceField ? parseFloat(priceField.value) : NaN;
        const quantity = quantityField
          ? parseFloat(quantityField.value)
          : NaN;
  
        if (name === '') {
          validationMessage.textContent =
            `Please enter a name for Product ${i + 1}.`;
          return;
        }
  
        if (isNaN(price) || price <= 0) {
          validationMessage.textContent =
            `Please enter a valid positive price for Product ${i + 1}.`;
          return;
        }
  
        if (isNaN(quantity) || quantity <= 0) {
          validationMessage.textContent =
            `Please enter a valid positive quantity for Product ${i + 1}.`;
          return;
        }
  
        const amount = calculateItemAmount(price, quantity);
        subtotal += amount;
  
        productDetailsText += `${i + 1}. ${name}\n`;
        productDetailsText += `   Price: ${formatCurrency(price)}\n`;
        productDetailsText += `   Quantity: ${quantity}\n`;
        productDetailsText += `   Amount: ${formatCurrency(amount)}\n\n`;
      }
  
      const discount = calculateDiscount(subtotal);
  
      let discountRateLabel = 'No discount';
  
      if (subtotal >= 5000) {
        discountRateLabel = '10%';
      } else if (subtotal >= 3000) {
        discountRateLabel = '7%';
      } else if (subtotal >= 1000) {
        discountRateLabel = '5%';
      }
  
      const deliveryOptionValue =
        document.getElementById('deliveryOption').value;
  
      const deliveryFee = getDeliveryFee(deliveryOptionValue);
  
      let deliveryTypeLabel = 'Store Pickup';
  
      switch (Number(deliveryOptionValue)) {
        case 1:
          deliveryTypeLabel = 'Store Pickup';
          break;
        case 2:
          deliveryTypeLabel = 'Standard Delivery';
          break;
        case 3:
          deliveryTypeLabel = 'Express Delivery';
          break;
      }
  
      const finalAmount = subtotal - discount + deliveryFee;
  
      let summaryText = `MINI STORE CHECKOUT SYSTEM\n\n`;
      summaryText += `Customer: ${customerName}\n\n`;
      summaryText += productDetailsText;
      summaryText += `ORDER SUMMARY\n`;
      summaryText += `Subtotal: ${formatCurrency(subtotal)}\n`;
      summaryText += `Discount Rate: ${discountRateLabel}\n`;
      summaryText += `Discount Amount: ${formatCurrency(discount)}\n`;
      summaryText += `Delivery Type: ${deliveryTypeLabel}\n`;
      summaryText += `Delivery Fee: ${formatCurrency(deliveryFee)}\n`;
      summaryText += `Final Amount: ${formatCurrency(finalAmount)}`;
  
      orderSummary.textContent = summaryText;
      validationMessage.textContent = '';
    }
  }
