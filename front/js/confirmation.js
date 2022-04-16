let params = (new URL(document.location)).searchParams;
let getId = params.get('order');
document.getElementById("orderId").textContent = getId;
if (getId === null) {
    window.location = "./index.html"
}