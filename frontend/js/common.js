class commonData {
  productItems = null;
  product = null;

  /**
   * Creates an instance of commonData.
   */
  constructor(self) {
    this.self = self;
  }

  /**
   * Permet d'appeler tous les produits depuis le backend
   *
   */
  async allProductItems() {
    if (this.productItems !== null) return this.productItems;
    const data = await fetch(this.self);
    this.productItems = await data.json();
    return this.productItems;
  }

  /**
   * Appel d'un produit unique depuis le backend avec l'id du produit
   *
   */
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

  /**
   * Boucle d'ajout de quantité de produit dans le panier
   *
   */
  addInCart(productId, qty = 1) {
    for (let i = 1; i <= qty; i++) {
      this.setCart(productId);
    }
  }

  /**
   * Ajout d'un produit dans le panier et stockage dans le localStorage
   *
   */
  setCart(cart) {
    if (cart !== null) {
      let productItemStorage = [];
      if (localStorage.getItem("cart") !== null) {
        productItemStorage = JSON.parse(localStorage.getItem("cart")) || [];
      }
      productItemStorage.push(cart);

      localStorage.setItem("cart", JSON.stringify(productItemStorage));
    }
  }

  /**
   * Affiche les produits du panier stocké dans le localstorage
   *
   */
  getCart() {
    return localStorage.getItem("cart") === null
      ? []
      : localStorage.getItem("cart");
  }

  /**
   * Permet d'effacer un article du panier
   *
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
  }

  /**
   * Regroupe les id identiques des articles dans le panier
   *
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

  modalPopup(title, content, goCart = false) {
    const modal = document.getElementById('orinocoModal');
    const titleContent = document.getElementsByClassName('modal-title')[0];
    const bodyContent = document.getElementById('modal-body');
    const span = document.getElementsByClassName('close')[0];
    const footer = document.getElementsByClassName('modal-footer')[0];
    const closeBtn = document.getElementsByClassName('close-btn')[0];

    modal.style.display = 'block';

    titleContent.innerHTML = title;
    bodyContent.innerHTML = content;

    if (goCart === true) {
      const cartButton = document.getElementById('get-cart-btn');
      cartButton.classList.add('visible');
      cartButton.classList.remove('invisible');
    }

    span.onclick = function () {
      modal.style.display = 'none';
    };
    closeBtn.onclick = function () {
      modal.style.display = 'none';
    };
  }

  orderTeddiesInCart(orderItems) {
    fetch('http://localhost:3000/api/teddies/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: orderItems
    })
      .then((result) => {
        return result.json();
      })
      .then((confirmation) => {
        window.location.assign(
          './confirmation.html?orderId=' + confirmation.orderId
        );
      })
      .catch((err) => {
        console.error('erreur : ' + err.name);
      });
  }
}
