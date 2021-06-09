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

  addInCart(productId, qty = 1) {
    for (let i = 1; i <= qty; i++) {
      this.setCart(productId);
    }
  }

  setCart(cart) {
    if (cart !== null) {
      let productItemStorage = [];
      if (localStorage.getItem("cart") !== null) {
        productItemStorage = JSON.parse(localStorage.getItem("cart")) || [];
      }
      productItemStorage.push(cart);

      localStorage.setItem("cart", JSON.stringify(productItemStorage));
    }
    // this.countCart();
    // this.cartList();
  }

  getCart() {
    return localStorage.getItem("cart") === null
      ? []
      : localStorage.getItem("cart");
  }

  /**
   * Permet d'effacer un article du panier
   *
   * @param   {String}  productId Id du produit
   * @memberof apiDatas
   */
  removeProductInCart(productId) {
    const newCart = [];
    let cart = JSON.parse(this.getCart());
    for (let i = 0, size = cart.length; i < size; i++) {
      if (cart[i] !== productId) newCart.push(cart[i]);
    }
    localStorage.removeItem("cart");

    for (let x = 0, size = newCart.length; x < size; x++) {
      this.setCart(newCart[x]);
    }
    this.cartList();
  }

  /**
   * Retourne le nombre d'articles dans le panier et les affiche sur l'icone de pannier
   *
   * @memberof apiDatas
   */
  countCart() {
    let cartContent = this.getCart();

    if (cartContent.length > 0) {
      cartContent = JSON.parse(this.getCart());
    } else {
      cartContent = 0;
    }

    if (cartContent !== 0) {
      document.getElementsByClassName("total-count")[0].innerText =
        cartContent.length;
      document.getElementsByClassName("shop-cart-items")[0].innerText =
        cartContent.length + " Article(s)";
    }
  }

  /**
   * Regroupe les id identiques des articles dans le panier
   *
   * @return  {Object}  retourne un objet
   * key            | value
   * id produit     | quantité total correspondant à l'ID du produit
   * @memberof apiDatas
   */
  groupCart() {
    let cardDict = {};
    if (this.getCart().length !== 0) {
      const cartContent = JSON.parse(this.getCart());

      for (let i = 0; i < cartContent.length; i++) {
        if (cardDict[cartContent[i]]) {
          cardDict[cartContent[i]] += 1;
        } else {
          cardDict[cartContent[i]] = 1;
        }
      }
    }
    return cardDict;
  }
}
