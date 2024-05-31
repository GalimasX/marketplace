"use strict"
//==========================================
import { ERROR_SERVER, NO_ITEMS_CART } from './constants.js';
import { 
    showErrorMessage,
    setBasketLocalStorage,
    getBasketLocalStorage,
    checkingRelevanceValueBasket
} from './utils.js';

const cart = document.querySelector('.cart');
let productsData = [];


getProducts();
cart.addEventListener('click', delProductBasket);


async function getProducts() {
    try {

        if (!productsData.length) {
            const res = await fetch('../data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            productsData = await res.json();
        }
        
        loadProductBasket(productsData);

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err.message);
    }
}

function loadProductBasket(data) {
    cart.textContent = '';

    if (!data || !data.length) {
        showErrorMessage(ERROR_SERVER)
        return;
    }

    checkingRelevanceValueBasket(data);
    const basket = getBasketLocalStorage();

    if(!basket || !basket.length) {
        showErrorMessage(NO_ITEMS_CART)
        return;
    }

    const findProducts = data.filter(item => basket.includes(String(item.id)));

    if(!findProducts.length) {
        showErrorMessage(NO_ITEMS_CART)
        return;
    }

    renderProductsBasket(findProducts);
}

function delProductBasket(event) {
    const targetButton = event.target.closest('.cart__del-card');
    if (!targetButton) return;

    const card = targetButton.closest('.cart__product');
    const id = card.dataset.productId;
    const basket = getBasketLocalStorage();

    const newBasket = basket.filter(item => item !== id);
    setBasketLocalStorage(newBasket);

    getProducts()
}

function renderProductsBasket(arr) {
    arr.forEach(card => {
        const { id, img, title, price, discount } = card;
        const priceDiscount = price - ((price * discount) / 100);

        const cardItem = 
        `
        <div class="cart__product" data-product-id="${id}">
            <div class="cart__img">
                <img src="./images/${img}" alt="${title}">
            </div>
            <div class="cart__title">${title}</div>
            <div class="cart__block-btns">
                <div class="cart__minus">-</div>
                <div class="cart__count">1</div>
                <div class="cart__plus">+</div>
            </div>
            <div class="cart__price">
                <span>${price}</span>
            </div>
            <div class="cart__price-discount">
                <span>${priceDiscount} - Cкидка </span>
            </div>
            <div class="cart__del-card">X</div>
        </div>
        `;

        cart.insertAdjacentHTML('beforeend', cardItem);
    });
    
    function updateTotalPrice() {
        const cartProducts = document.querySelectorAll('.cart__product');
        let totalPrice = 0;
    
        cartProducts.forEach(product => {
            const price = parseFloat(product.querySelector('.cart__price span').textContent);
            const discountPrice = parseFloat(product.querySelector('.cart__price-discount span').textContent);
            const count = parseInt(product.querySelector('.cart__count').textContent);
            const productPrice = discountPrice || price; // используем цену со скидкой, если она есть
    
            totalPrice += productPrice * count;
        });
    
        let totalPriceElement = document.querySelector('.cart__total-price');
        if (!totalPriceElement) {
            totalPriceElement = document.createElement('p');
            totalPriceElement.classList.add('cart__total-price');
            document.querySelector('.cart').appendChild(totalPriceElement);
        }
    
        totalPriceElement.textContent = `Общая сумма: ${totalPrice.toFixed(2)} руб.`;
    }
    
    const cartPlusButtons = document.querySelectorAll('.cart__plus');
    const cartMinusButtons = document.querySelectorAll('.cart__minus');
    
    cartPlusButtons.forEach(button => {
        button.addEventListener('click', function(){
            const cartCountElement = button.parentElement.querySelector('.cart__count');
            let count = parseInt(cartCountElement.textContent);
            count = count + 1; // увеличиваем значение на единицу
            cartCountElement.textContent = count;
    
            updateTotalPrice(); // обновляем общую сумму
        });
    });
    
    cartMinusButtons.forEach(button => {
        button.addEventListener('click', function(){
            const cartCountElement = button.parentElement.querySelector('.cart__count');
            let count = parseInt(cartCountElement.textContent);
            count = Math.max(0, count - 1); // чтобы не уйти в отрицательные значения
            cartCountElement.textContent = count;
    
            updateTotalPrice(); // обновляем общую сумму
        });
    });
    
    // вызываем для обновления общей суммы при загрузке страницы
    updateTotalPrice();
    
    

//     const cartMinus = document.querySelectorAll('.cart__minus');

//     const cartMinusButtons = document.querySelectorAll('.cart__minus');

//     cartMinusButtons.forEach(button => {
//         button.addEventListener('click', function(){
//             const cartCountElement = button.parentElement.querySelector('.cart__count');
//             let count = parseInt(cartCountElement.textContent);
//             count = Math.max(0, count - 1); // чтобы не уйти в отрицательные значения
//             cartCountElement.textContent = count;
//         });
//     });

//     const cartPlusButtons = document.querySelectorAll('.cart__plus');

//     cartPlusButtons.forEach(button => {
//          button.addEventListener('click', function(){
//              const cartCountElement = button.parentElement.querySelector('.cart__count');
//              let count = parseInt(cartCountElement.textContent);
//              count = count + 1; // увеличиваем значение на единицу
//             cartCountElement.textContent = count;
//     });
// });

}


