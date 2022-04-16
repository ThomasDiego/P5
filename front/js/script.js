//Récupérer tous les produits, et les afficher dans la page
function allProducts() {
    fetch("http://localhost:3000/api/products/").then(function(res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function(value) {
        let items = document.getElementById("items");
        value.forEach(element => {
            const htmlProduct = `<a href="./product.html?id=${element._id}">
            <article>
              <img src="${element.imageUrl}" alt="${element.altTxt}">
              <h3 class="productName">${element.name}</h3>
              <p class="productDescription">${element.description}</p>
            </article>
          </a>`;
            items.innerHTML += htmlProduct;
        });
    }).catch((error) => {
        document.getElementById("items").innerHTML = `<h2>Erreur avec l'api</h2>`;
    });
};
allProducts();