function allProducts() {
  const infos = fetch("http://localhost:3000/api/products/").then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }).then(function (value) {
    return value
  }).catch((error) => {
    window.location.href = "./index.html"
  });
  return infos
};

function displayCartList(list) {
  let items = document.getElementById("cart__items");
  let panierList = JSON.parse(localStorage.getItem("panier"));
  if (!panierList || panierList == "") {
    document.getElementById("totalPrice").textContent = "0";
    document.querySelector(".cart__order").style.display = "none";
    return;
  }
  panierList.forEach(element => {
    const found = list.find(dev => dev._id == element.id);
    if (!found) {
      console.log(element.id + " introuvable");
      return;
    }
    const html = `<article class="cart__item" data-id="${element.id}" data-color="${element.color}">
    <div class="cart__item__img">
      <img src="${found.imageUrl}" alt="${found.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${found.name}</h2>
        <p>${element.color}</p>
        <p>${found.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
    `
    items.innerHTML += html;
  });
  addDeleteEvent();
  addQuantityEdit();
  updatePrice()
}
allProducts().then(function (value) {
  displayCartList(value)
})

function addDeleteEvent() {
  let deleteButton = document.querySelectorAll(".deleteItem");
  deleteButton.forEach(element => {
    element.addEventListener("click", function () {
      const elementId = element.closest('article').getAttribute('data-id');
      const elementColor = element.closest('article').getAttribute('data-color');
      console.log("id:" + elementId + "color:" + elementColor);
      let panierList = JSON.parse(localStorage.getItem("panier"));
      const findItem = panierList.find(element => element.color == elementColor && element.id == elementId);
      if (findItem) {
        console.log(panierList.indexOf(findItem));
        const indexItemInPanierList = panierList.indexOf(findItem);
        panierList.splice(indexItemInPanierList, 1);
        localStorage.setItem("panier", JSON.stringify(panierList));
        element.closest('article').remove();
        updatePrice();
      } else {
        console.log("introuvable");
      }
    })
  });
}

function addQuantityEdit() {
  let quantityInput = document.querySelectorAll(".itemQuantity");
  quantityInput.forEach(element => {
    element.addEventListener("input", function (event) {
      var quantityNumber = parseInt(element.value);
      if (quantityNumber > 100 || quantityNumber <= 0 || isNaN(quantityNumber)) {
        element.value = 1
        const elementId = element.closest('article').getAttribute('data-id');
        const elementColor = element.closest('article').getAttribute('data-color');
        let panierList = JSON.parse(localStorage.getItem("panier"));
        const findItem = panierList.find(element => element.color == elementColor && element.id == elementId);
        findItem.quantity = quantityNumber;
        localStorage.setItem("panier", JSON.stringify(panierList));
        console.log("Quantity modifié");
        updatePrice();
      } else {
        const elementId = element.closest('article').getAttribute('data-id');
        const elementColor = element.closest('article').getAttribute('data-color');
        let panierList = JSON.parse(localStorage.getItem("panier"));
        const findItem = panierList.find(element => element.color == elementColor && element.id == elementId);
        findItem.quantity = quantityNumber;
        localStorage.setItem("panier", JSON.stringify(panierList));
        console.log("Quantitée modifiée");
        updatePrice();
      }
    })
  });
}

function updatePrice() {
  let articleList = document.querySelectorAll(".cart__item");
  let price = 0;
  articleList.forEach(element => {
    let articleQuantity = parseInt(element.querySelector(".itemQuantity").value);
    let articlePrice = parseInt(element.querySelector(".cart__item__content__description").querySelectorAll("p")[1].textContent);
    let totalPriceOfArticle = articleQuantity * articlePrice;
    price += totalPriceOfArticle;
  });
  document.getElementById("totalPrice").textContent = price;
  if (price == 0) {
    document.querySelector(".cart__order").style.display = "none";
  }
}