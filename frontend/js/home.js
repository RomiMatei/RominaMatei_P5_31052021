class home {
  constructor(self) {
    this.self = self;
    this.getAllProductItems();
  }

  async getAllProductItems() {
    let content = "";
    try {
      const products = await orinocoApi.commonData.allProductItems();
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
  }

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
}
