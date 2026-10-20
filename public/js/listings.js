/**
 * ParkSphere - Listings Page Client-Side Logic (listings.js)
 * Manages category slider navigation and dynamic municipal tax calculation.
 */
(() => {
  "use strict";

  // 1. Horizontal Category Filter Scrolling
  const filters = document.getElementById("filters");
  const leftButton = document.getElementById("filterLeft");
  const rightButton = document.getElementById("filterRight");

  function updateArrowButtons() {
    if (!filters || !leftButton || !rightButton) return;
    const maxScroll = filters.scrollWidth - filters.clientWidth;
    leftButton.disabled = filters.scrollLeft <= 4;
    rightButton.disabled = filters.scrollLeft >= maxScroll - 4;
  }

  if (leftButton && rightButton && filters) {
    leftButton.addEventListener("click", () => {
      filters.scrollBy({ left: -260, behavior: "smooth" });
    });

    rightButton.addEventListener("click", () => {
      filters.scrollBy({ left: 260, behavior: "smooth" });
    });

    filters.addEventListener("scroll", updateArrowButtons);
    window.addEventListener("resize", updateArrowButtons);
    updateArrowButtons();
  }

  // 2. Real-Time Display Taxes Toggle (ParkSphere Municipal Tax Calculation)
  const taxBox = document.getElementById("taxToggleBox");
  const taxSwitch = document.getElementById("taxSwitch");
  const listingPrices = document.querySelectorAll(".listing-price");
  const taxLabels = document.querySelectorAll(".tax-included-label");

  function updateListingPrices() {
    if (!taxSwitch) return;
    const includeTaxes = taxSwitch.checked;

    if (taxBox) {
      taxBox.classList.toggle("active", includeTaxes);
    }

    listingPrices.forEach(priceElement => {
      const basePrice = Number(priceElement.dataset.basePrice);
      if (!Number.isFinite(basePrice)) return;

      const taxRate = Number(priceElement.dataset.taxRate) || 0.12;

      const symbol = priceElement.dataset.currencySymbol || "$";
      const isIntegerCurrency = symbol === '₹';
      const val = includeTaxes ? (basePrice * (1 + taxRate)) : basePrice;
      const formatted = isIntegerCurrency ? Math.round(val) : val.toFixed(2);

      priceElement.textContent = symbol + " " + formatted;
    });

    taxLabels.forEach(label => {
      label.hidden = !includeTaxes;
    });
  }

  if (taxBox && taxSwitch) {
    taxBox.addEventListener("click", (e) => {
      if (e.target !== taxSwitch) {
        taxSwitch.checked = !taxSwitch.checked;
        updateListingPrices();
      }
    });

    taxSwitch.addEventListener("change", updateListingPrices);
  }
})();
