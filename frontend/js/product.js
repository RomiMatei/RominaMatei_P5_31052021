class product {
  constructor(self, idProduct) {
    this.self = self;
    this.getProductItem(idProduct);
  }

  /**
   * Affiche le produit avec les spécifications et construit le html
   *
   */
  async getProductItem(idProduct) {
    let content = "";
    try {
      let productObj;
      await orinocoApi.commonData
        .productItem(idProduct)
        .then((result) => {
          productObj = result;
        })
        .catch((err) => {
          console.log(err);
        });
      const unitPrice = orinocoApi.commonData.formatLocaleMoney(
        productObj.price / 100
      );
      content += product.buildHtmlProduct(productObj, unitPrice);
    } catch (err) {
      console.error(err);
    }

    this.self.innerHTML = content;
    this.quantityUpdate();
    this.addInMyCartClick();
  }

  /**
   * Construit le HTML du produit sur la page product.html
   *
   */
  static buildHtmlProduct(productObj, unitPrice) {
    return `
    <div class="col-12 col-lg-6">
      <div class="card bg-light mb-3">
          <div class="card-body">
              <a href="" data-toggle="modal" data-target="#productModal">
              <img src="${productObj.imageUrl}" class="img-fluid" alt="${
      productObj.description
    }">
                  <p class="text-center">Zoom</p>
              </a>
          </div>
      </div>
    </div>

      <div class="col-12 col-lg-6">
        <div class="card" data-id="${productObj._id}">
            <div class="card-body">
                <h2 class="card-title">${productObj.name} </h2>
                <div class="card-text">${productObj.description} </div>
                <select class="form-control mb-4">${product.getColorsOptions(
                  productObj.colors
                )} </select>
                <div class="row">
                  <div class="col col-lg-6">
                    <div class="form-group">
                    <div class="input-group plus-minus">
                        <div class="button minus">
                            <button type="button" class="quantity-left-minus btn btn-primary btn-number" id="minus" data-field="">
                                <i class="fa fa-minus"></i>
                            </button>
                        </div>
                        <input type="text" class="input-number"  id="quantity" name="quantity" min="1" max="100" value="1">
                        <div class="button plus">
                            <button type="button" class="quantity-right-plus btn btn-primary btn-number" id="plus" data-field="">
                                <i class="fa fa-plus"></i>
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row pt-3">
                    <div class="col">
                        <div class="prix font-weight-bold label label-danger">${unitPrice}</div>
                    </div>
                    <div class="col">
                        <button id="add-in-cart" class="btn btn-sm btn-success"><i class="fas fa-cart-plus"></i> Ajouter</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;
  }

  /**
   * Construit un champ select affichant les options du produit
   *
   */
  static getColorsOptions(color) {
    let result = "";
    for (let i = 0, size = color.length; i < size; i++) {
      result += ` <option>${color[i]}</option>`;
    }
    return result;
  }

  /**
   * Ajoute une écoute sur le boutton plus et moins lorsqu'on modifie la quantité
   *
   */
  quantityUpdate() {
    document
      .getElementById("minus")
      .addEventListener("click", this.minusQuantity);
    document
      .getElementById("plus")
      .addEventListener("click", this.plusQuantity);
  }

  /**
   * Décrémente la quantité de produit maximum jusqu'à 1
   *
   */
  minusQuantity() {
    let getValue = parseInt(document.getElementById("quantity").value);
    if (getValue > 1) {
      let newValue = (getValue -= 1);
      document.getElementById("quantity").value = newValue;
    }
  }

  /**
   * Incrémente la quantité de produit par 1
   *
   */
  plusQuantity() {
    let getValue = parseInt(document.getElementById("quantity").value);
    let newValue = (getValue += 1);
    document.getElementById("quantity").value = newValue;
  }

  /**
   * Ecoute le click sur Ajouter au panier
   *
   */
  addInMyCartClick() {
    document
      .getElementById("add-in-cart")
      .addEventListener("click", this.addInMyCart);
  }

  /**
   * Ajoute au panier le produit et la quantité saisie
   *
   */
  addInMyCart() {
    const searchParams = new URLSearchParams(
      document.location.search.substring(1)
    );
    const productId = searchParams.get("id");
    const quantity = parseInt(document.getElementById("quantity").value);

    orinocoApi.commonData.addInCart(productId, quantity);
    document.getElementById("quantity").value = 1;
    const modalBody =
      "Félicitation, votre produit est ajouté au panier!<br>Vous souhaitez continuer vos achats ou aller directement au panier?";
    orinocoApi.commonData.modalPopup("Ajouté au panier", modalBody, true);
  }
}
