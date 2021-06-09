const orinocoApi = {
  commonData: new commonData("http://localhost:3000/api/teddies/")
};

function definePage() {
  const searchParams = new URLSearchParams(
    document.location.search.substring(1)
  );
  const idProduct = searchParams.get("id");
  const url = window.location.pathname;

  switch (url) {
    case "/frontend/html/product.html":
      return new product(document.querySelector("#product-view"), idProduct);
    case "/frontend/html/cart.html":
      return new cartPage(document.querySelector("tbody.cart-table-line"));
    default:
      return new home(document.querySelector("#home-page-articles"));
  }
}
orinocoApi.page = this.definePage();
