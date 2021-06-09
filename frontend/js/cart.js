class cartPage {

  constructor(self) {
    this.self = self;
    this.cartListProducts();
    // cartPage.checkForm();
    // this.validateOrder();
  }

  async cartListProducts() {
    let content = '';
    let total = 0;
    try {
      const cartContent = await orinocoApi.commonData.groupCart();

      for (const [key, value] of Object.entries(cartContent)) {
        const product = await orinocoApi.commonData.productItem(key);
        total += (product.price / 100) * value;
        const totalLine = orinocoApi.commonData.formatLocaleMoney(
          (product.price / 100) * value
        );
        const unitPrice = orinocoApi.commonData.formatLocaleMoney(
          product.price / 100
        );
        content += cartPage.buildHtmlCartTable(
          product,
          unitPrice,
          value,
          totalLine
        );
      }
    } catch (err) {
      console.error(err);
    }

    if (content === '') {
      content = `<tr><td colspan="6" class="text-center">Votre panier est vide</td></tr>`;
    }

    this.self.innerHTML = content;
    // this.updateTotalCart(total);
    // this.removeProduct();
  }

  static buildHtmlCartTable(product, unitPrice, qty = 1, total) {
    return `
      <tr id="${product._id}">
        <td class="img-td" data-title="No"><img class="img-fluid" src="${product.imageUrl}" width="170" alt="#"></td>
        <td class="product-des" data-title="Description">
          <p class="product-name"><b><a href="produit.html?id=${product._id}">${product.name}</a></b></p>
          <p class="product-des">${product.description}</p>
        </td>
        <td class="price" data-title="Price"><span>${unitPrice}</span></td>
        <td class="qty" data-title="Qty"><!-- Input Order -->
          <span>${qty}</span>
        </td>
        <td class="total-amount" data-title="Total"><span>${total}</span></td>
        <td class="action" data-title="Remove""><a href="#" class="remove" data-id="${product._id}"><i class="far fa-trash-alt"></i></a></td>
      </tr>
    `;
  }

}