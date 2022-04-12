function allProducts() {
    const infos = fetch("http://localhost:3000/api/products/").then(function (res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function (value) {
        return value
    }).catch((error) => {
        document.getElementById("items").innerHTML = `<h2>Erreur avec l'api</h2>`;
    });
    return infos
};

function displayCartList(list) {
    let items = document.getElementById("cart__items");
    let panierList = JSON.parse(localStorage.getItem("panier"));
    if (!panierList || panierList == "") {
        console.log("il y a rien");
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

}
allProducts().then(function (value) {
    displayCartList(value)
})