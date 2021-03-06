class home {
  constructor(self) {
    this.self = self;
    this.getAllProductItems();
  }

  /**
   * Affiche la liste de tous les produits disponibles dans le backend
   *
   */
  async getAllProductItems() {
    let content = "";
    try {
      let products;
      await orinocoApi.commonData
        .allProductItems()
        .then((result) => {
          products = result;
        })
        .catch((err) => {
          console.log(err);
        });

      for (let p = 0; p < products.length; p += 1) {
        const unitPrice = orinocoApi.commonData.formatLocaleMoney(
          products[p].price / 100
        );
        content += home.buildHtmlProduct(products[p], unitPrice);
      }
    } catch (err) {
      console.error(err);
    }
    this.self.innerHTML = content;
    this.addInMyCartClick();
  }

  /**
   * Construit le HTML de la présentation de la liste des produits
   *
   */
  static buildHtmlProduct(product, unitPrice) {
    const resultHtml = `
      <div class="col-md-4 col-sm-12 mb-4">
        <div class="card" data-id="${product._id}">
            <a href="product.html?id=${product._id}">
                <figure>
                    <img src="${product.imageUrl}" class="card-img-top" alt="${product.description}">
                </figure>
            </a>
            <div class="card-body">
                <h2 class="card-title">${product.name} </h2>
                <div class="card-text">${product.description} </div>
                <div class="row pt-3">
                    <div class="col">
                        <div class="prix text-danger">${unitPrice}</div>
                    </div>
                    <div class="col">
                        <a href="#" class="btn btn-success add-in-cart" data-id="${product._id}"><i class="fas fa-cart-plus"></i> Ajouter</a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;

    return resultHtml;
  }
  /**
   * Permet d'ajouter dans le panier un produit directement depuis la liste
   * sans retourner sur la page du produit
   *
   */
  addInMyCartClick() {
    this.self.querySelectorAll("a.add-in-cart").forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        const product = event.target.getAttribute("data-id");
        orinocoApi.commonData.addInCart(product, 1);
        const modalBody =
          "Félicitation, votre produit est ajouté au panier!<br>Vous souhaitez continuer vos achats ou aller directement au panier?";
        orinocoApi.commonData.modalPopup("Ajouté au panier", modalBody, true);
      });
    });
  }
}
