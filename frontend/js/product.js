class product {
  constructor(self, idProduct) {
    this.self = self;
    this.getProductItem(idProduct);
  }

  async getProductItem(idProduct) {
    let content = '';
    try {
      const productObj = await orinocoApi.commonData.productItem(idProduct);
      const unitPrice = orinocoApi.commonData.formatLocaleMoney(
        productObj.price / 100
      );
      content += product.buildHtmlProduct(productObj, unitPrice);
    } catch (err) {
      console.error(err);
    }
    console.log(this);
    this.self.innerHTML = content;
  }

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
  static getColorsOptions(color) {
    let result = '';
    for (let i = 0, size = color.length; i < size; i++) {
      result += ` <option>${color[i]}</option>`;
    }
    return result;
  }
}