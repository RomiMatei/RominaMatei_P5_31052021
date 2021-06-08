class commonData {
  productItems = null;
  product = null;

  constructor(self) {
    this.self = self;
  }

  async allProductItems() {
    if (this.productItems !== null) return this.productItems;
    const data = await fetch(this.self);
    this.productItems = await data.json();
    return this.productItems;
  }

  async productItem(productId) {
    if (productId !== null) {
      const apiUrl = "http://localhost:3000/api/teddies/";
      const apiUrlProduct = apiUrl.concat("", productId);
      const productData = await fetch(apiUrlProduct);
      this.product = await productData.json();

      return this.product;
    }
  }

  formatLocaleMoney(total) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR"
    }).format(total);
  }
}
