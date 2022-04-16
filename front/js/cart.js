//Récupérer les informations de tous les produits dans la bdd
function allProducts() {
    const infos = fetch("http://localhost:3000/api/products/").then(function(res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function(value) {
        return value
    }).catch((error) => {
        window.location.href = "./index.html"
    });
    return infos
};

//Afficher les éléments présents dans le localstorage
function displayCartList(list) {
    let items = document.getElementById("cart__items");
    items.innerHTML = "";
    let panierList = JSON.parse(localStorage.getItem("panier"));
    if (!panierList || panierList == "") {
        document.getElementById("totalPrice").textContent = "0";
        document.querySelector(".cart__order").style.display = "none";
        return;
    }
    panierList.forEach(element => {
        const found = list.find(dev => dev._id == element.id);
        const foundColor = found.colors.find(color => color == element.color);
        if (!found || element.quantity > 100 || !foundColor || element.quantity < 1) {
            console.log("Panier corrompu");
            let panierList = JSON.parse(localStorage.getItem("panier"));
            const findItem = panierList.find(elementz => elementz.id == element.id);
            const indexItemInPanierList = panierList.indexOf(findItem);
            panierList.splice(indexItemInPanierList, 1);
            localStorage.setItem("panier", JSON.stringify(panierList));
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
allProducts().then(function(value) {
    displayCartList(value)
});


//Ajouter un évenement sur le bouton supprimer des items du panier
function addDeleteEvent() {
    let deleteButton = document.querySelectorAll(".deleteItem");
    deleteButton.forEach(element => {
        element.addEventListener("click", function() {
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

//Ajuter un event listener sur les inputs de changement de quantité
function addQuantityEdit() {
    let quantityInput = document.querySelectorAll(".itemQuantity");
    quantityInput.forEach(element => {
        element.addEventListener("input", function(event) {
            var quantityNumber = parseInt(element.value);
            if (quantityNumber > 100 || quantityNumber <= 0 || isNaN(quantityNumber)) {
                element.value = 1;
                quantityNumber = 1;
                const elementId = element.closest('article').getAttribute('data-id');
                const elementColor = element.closest('article').getAttribute('data-color');
                let panierList = JSON.parse(localStorage.getItem("panier"));
                const findItem = panierList.find(element => element.color == elementColor && element.id == elementId);
                findItem.quantity = quantityNumber;
                localStorage.setItem("panier", JSON.stringify(panierList));
                console.log("Quantity modifiée(2)");
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

//Mettre à jour le prix total
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

//Ecouter un changement d'état sur le local storage et appeler DisplayCartList()
window.addEventListener('storage', () => {
    allProducts().then(function(value) {
        displayCartList(value)
    });
});


//Vérification pour chaque input du formulaire
function checkOrderDetails(event) {
    const regexNomPrenom = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð. '-]+$/u;
    const regexAdresse = /^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð. '-]+$/u;
    const regexCity = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð. '-]+$/u;
    const regexMail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm;
    //check prenom
    let prenom = document.getElementById("firstName");
    if (event.id === "firstName") {
        if (!prenom.value.match(regexNomPrenom) || prenom.value.length < 3) {
            document.getElementById('firstNameErrorMsg').textContent = "Prénom incorrect";
            return "error";
        } else {
            document.getElementById('firstNameErrorMsg').textContent = "";
        }
    }
    //check nom
    let nom = document.getElementById("lastName");
    if (event.id === "lastName") {
        if (!nom.value.match(regexNomPrenom) || nom.value.length < 3) {
            document.getElementById('lastNameErrorMsg').textContent = "Nom incorrect";
            return "error";
        } else {
            document.getElementById('lastNameErrorMsg').textContent = "";
        }
    }
    //check adresse
    let adresse = document.getElementById("address");
    if (event.id === "address") {
        if (!adresse.value.match(regexAdresse)) {
            document.getElementById('addressErrorMsg').textContent = "Adresse incorrect";
            return "error";
        } else {
            document.getElementById('addressErrorMsg').textContent = "";
        }
    }
    let ville = document.getElementById("city");
    if (event.id === "city") {
        if (!ville.value.match(regexCity)) {
            document.getElementById('cityErrorMsg').textContent = "Ville incorrect";
            return "error";
        } else {
            document.getElementById('cityErrorMsg').textContent = "";
        }
    }
    let email = document.getElementById("email");
    if (event.id === "email") {
        if (!email.value.match(regexMail)) {
            document.getElementById('emailErrorMsg').textContent = "Email incorrect";
            return "error";
        } else {
            document.getElementById('emailErrorMsg').textContent = "";
        }
    }
    let orderButton = document.getElementById("order");
    if (event.id === "order") {
        return "ok";
    }
}

//Ecouter le changement d'état de chaque input, et appeler la fonction de vérification
document.querySelector(".cart__order__form").addEventListener('input', function(event) {
    checkOrderDetails(event.target);
});

//Quand on click sur le bouton commander, il lance la vérification de tous les input en même temps
document.getElementById("order").addEventListener('click', function(event) {
    event.preventDefault();
    let form = document.querySelector('.cart__order__form');
    let inputs = form.querySelectorAll('input');
    let error = 0;
    inputs.forEach(element => {
        if (checkOrderDetails(element) === "error") {
            error += 1;
        };
    });
    if (error === 0) {
        let productIds = [];
        let panierList = JSON.parse(localStorage.getItem("panier"));
        panierList.forEach(element => {
            productIds.push(element.id);
        });
        let order = {
            contact: {
                firstName: document.getElementById("firstName").value,
                lastName: document.getElementById("lastName").value,
                address: document.getElementById("address").value,
                city: document.getElementById("city").value,
                email: document.getElementById("email").value
            },
            products: productIds
        }

        let post = {
            method: 'POST',
            body: JSON.stringify(order),
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
        };

        fetch("http://localhost:3000/api/products/order", post)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.log("Il y a eu une erreur pendant la commande");
                }
            }).then(function(value) {
                if (value.orderId) {
                    ViderPanier = [];
                    localStorage.setItem("panier", JSON.stringify(ViderPanier));
                    window.location = "./confirmation.html?order=" + value.orderId;
                }
            })
    }
});