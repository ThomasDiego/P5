let params = (new URL(document.location)).searchParams;
let getId = params.get('id');

function getProductInfos(id) {
    const infos = fetch("http://localhost:3000/api/products/" + id).then(function (res) {
        if (res.ok) {
            return res.json();
        } else {
            window.location.href = "./index.html"
        }
    }).then(function (value) {
        return value;
    }).catch((error) => {
        window.location.href = "./index.html"
    });
    return infos;
}


function getProduct(id) {
    getProductInfos(getId).then(function (value) {
        //Titre de la page
        document.title = value.name;
        //Image du produit
        let itemImg = document.querySelector(".item__img");
        const itemImgHtml = `<img src="${value.imageUrl}" alt="${value.altTxt}">`;
        itemImg.innerHTML += itemImgHtml;
        //Nom du produit
        document.getElementById("title").textContent = value.name;
        //Prix du produit
        document.getElementById("price").textContent = value.price;
        //Description du produit

        document.getElementById("description").textContent = value.description;
        //Quantité produit MINIMUM 1
        document.querySelector("#quantity").value = 1;
        //Couleurs produit
        let colorsProduct = value.colors;
        colorsProduct.forEach(element => {
            let colors = document.getElementById("colors");
            const colorHtml = `<option value="${element}">${element}</option>`;
            colors.innerHTML += colorHtml;
        });
    })
    verifyQuantity()
}

getProduct(getId);



//Panier
async function addProduct() {
    const addProduct = getProductInfos(getId).then(function (value) {
        let produit = {
            id: getId,
            quantity: document.getElementById("quantity").value,
            color: document.getElementById("colors").options[document.getElementById("colors").selectedIndex].value
        };
        //Verif couleur
        const itemsColors = [];
        itemsColors.push(value.colors);
        if (itemsColors[0].includes(produit.color)) {
        } else {
            return "error la couleur n'est pas dans la liste"
        }
        //Si quantité > 100
        if (produit.quantity > 100 || produit.quantity <= 0 || isNaN(produit.quantity) || produit.quantity.includes(".")) {
            return "error (La quantité est mauvaise)";
        }
        let panierList = JSON.parse(localStorage.getItem("panier"));
        if (panierList) {
            let searchDuplicate = panierList.find(el => el.id === produit.id && el.color === produit.color);
            if (searchDuplicate) {
                return "error (L'article est déjà dans le panier)"
            } else {
                panierList.push(produit);
                localStorage.setItem("panier", JSON.stringify(panierList));
            }
        } else {
            panierList = [];
            panierList.push(produit);
            localStorage.setItem("panier", JSON.stringify(panierList));
        }
        //Si color existe
        return "ok";
    })
    return addProduct;
}

function verifyQuantity() {
    let quant = document.getElementById("quantity");
    quant.addEventListener("input", function () {
        let quantVal = quant.value;
        if (quantVal > 100 || quantVal <= 0 || isNaN(quantVal) || quantVal.includes(".")) {
            console.log("hihi")
            document.querySelector("#quantity").value = 1;
        }
    })
}

document.getElementById('addToCart').addEventListener("click", function (event) {
    addProduct().then(function (value) {
        console.log(value)
    })
})