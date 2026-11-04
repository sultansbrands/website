document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       ELEMENTS
    ========================================================= */

    const cartContainer =
        document.getElementById("cartItems");

    const subtotalElement =
        document.getElementById("cartSubtotal");

    const totalElement =
        document.getElementById("cartTotal");

    const emptyCart =
        document.getElementById("emptyCart");

    const cartContent =
        document.getElementById("cartContent");


    /* =========================================================
       LOAD CART
    ========================================================= */

    let cart = [];

    try {

        const savedCart =
            localStorage.getItem("sultanCart");

        if (savedCart) {

            cart = JSON.parse(savedCart);

        }

        if (!Array.isArray(cart)) {

            cart = [];

        }

    } catch (error) {

        console.error(
            "Cart loading error:",
            error
        );

        cart = [];

    }


    /* =========================================================
       SAVE CART
    ========================================================= */

    function saveCart() {

        try {

            localStorage.setItem(
                "sultanCart",
                JSON.stringify(cart)
            );

        } catch (error) {

            console.error(
                "Cart saving error:",
                error
            );

        }

    }


    /* =========================================================
       FORMAT PRICE
    ========================================================= */

    function formatPrice(amount) {

        const price =
            Number(amount) || 0;

        return (
            "Rs. " +
            price.toLocaleString("en-PK")
        );

    }


    /* =========================================================
       SAFE HTML
    ========================================================= */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =========================================================
       GET PRODUCT PRICE
    ========================================================= */

    function getProductPrice(product) {

        const price =
            Number(product.price);

        if (
            Number.isFinite(price) &&
            price >= 0
        ) {

            return price;

        }

        return 0;

    }


    /* =========================================================
       SYNC WATCH PRICES FROM HTML
       HTML data-price is the source of truth.
    ========================================================= */

    async function syncWatchPricesFromHTML() {

        if (!cart.length) {

            return;

        }

        try {

            const response =
                await fetch(
                    "../watches/watches.html",
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                return;

            }


            const html =
                await response.text();


            const parser =
                new DOMParser();


            const doc =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            const watchCards =
                doc.querySelectorAll(
                    ".watch-card[data-product][data-price]"
                );


            const priceMap = {};


            watchCards.forEach(function (card) {

                const id =
                    card.dataset.product;


                const price =
                    Number(card.dataset.price);


                if (
                    id &&
                    Number.isFinite(price) &&
                    price >= 0
                ) {

                    priceMap[id] =
                        price;

                }

            });


            let changed = false;


            cart.forEach(function (product) {

                if (
                    product.id &&
                    Object.prototype.hasOwnProperty.call(
                        priceMap,
                        product.id
                    )
                ) {

                    const latestPrice =
                        priceMap[product.id];


                    if (
                        Number(product.price) !==
                        latestPrice
                    ) {

                        product.price =
                            latestPrice;

                        changed = true;

                    }

                }

            });


            if (changed) {

                saveCart();

            }

        } catch (error) {

            console.warn(
                "Watch price sync skipped:",
                error
            );

        }

    }


    /* =========================================================
       GET PRODUCT QUANTITY
    ========================================================= */

    function getProductQuantity(product) {

        const quantity =
            Number(product.quantity);

        if (
            Number.isFinite(quantity) &&
            quantity > 0
        ) {

            return Math.floor(quantity);

        }

        return 1;

    }


    /* =========================================================
       CALCULATE SUBTOTAL
    ========================================================= */

    function calculateSubtotal() {

        let subtotal = 0;


        cart.forEach(function (product) {

            const price =
                getProductPrice(product);


            const quantity =
                getProductQuantity(product);


            subtotal +=
                price * quantity;

        });


        return subtotal;

    }


    /* =========================================================
       RENDER CART
    ========================================================= */

    function renderCart() {

        if (!cartContainer) {

            return;

        }


        cartContainer.innerHTML = "";


        /* =====================================================
           EMPTY CART
        ===================================================== */

        if (cart.length === 0) {

            if (emptyCart) {

                emptyCart.style.display =
                    "block";

            }


            if (cartContent) {

                cartContent.style.display =
                    "none";

            }


            if (subtotalElement) {

                subtotalElement.textContent =
                    "Rs. 0";

            }


            if (totalElement) {

                totalElement.textContent =
                    "Rs. 0";

            }


            return;

        }


        /* =====================================================
           SHOW CART
        ===================================================== */

        if (emptyCart) {

            emptyCart.style.display =
                "none";

        }


        if (cartContent) {

            cartContent.style.display =
                "block";

        }


        let subtotal = 0;


        /* =====================================================
           PRODUCTS
        ===================================================== */

        cart.forEach(function (product, index) {

            const price =
                getProductPrice(product);


            const quantity =
                getProductQuantity(product);


            const itemTotal =
                price * quantity;


            subtotal +=
                itemTotal;


            const item =
                document.createElement("div");


            item.className =
                "cart-item";


            item.innerHTML = `

                <div class="cart-product">

                    <img
                        src="${escapeHTML(
                            product.image || ""
                        )}"
                        alt="${escapeHTML(
                            product.name ||
                            "Sultan Product"
                        )}"
                    >

                    <div class="cart-product-info">

                        <span class="cart-collection">

                            ${escapeHTML(
                                product.collection ||
                                "SULTAN BRANDS"
                            )}

                        </span>

                        <h3>

                            ${escapeHTML(
                                product.name ||
                                "Sultan Product"
                            )}

                        </h3>

                        <p>

                            ${escapeHTML(
                                product.description ||
                                ""
                            )}

                        </p>

                    </div>

                </div>


                <div class="cart-price">

                    ${formatPrice(price)}

                </div>


                <div class="cart-quantity">

                    <button
                        class="qty-btn"
                        type="button"
                        onclick="changeQuantity(${index}, -1)"
                    >

                        −

                    </button>


                    <span>

                        ${quantity}

                    </span>


                    <button
                        class="qty-btn"
                        type="button"
                        onclick="changeQuantity(${index}, 1)"
                    >

                        +

                    </button>

                </div>


                <div class="cart-total">

                    ${formatPrice(itemTotal)}

                </div>


                <button
                    class="remove-btn"
                    type="button"
                    onclick="removeFromCart(${index})"
                >

                    REMOVE

                </button>

            `;


            cartContainer.appendChild(item);

        });


        /* =====================================================
           TOTALS
        ===================================================== */

        if (subtotalElement) {

            subtotalElement.textContent =
                formatPrice(subtotal);

        }


        /*
           IMPORTANT:
           Cart total currently equals subtotal.
           Checkout shipping is calculated separately.
        */

        if (totalElement) {

            totalElement.textContent =
                formatPrice(subtotal);

        }

    }


    /* =========================================================
       CHANGE QUANTITY
    ========================================================= */

    window.changeQuantity =
        function (index, amount) {

            if (!cart[index]) {

                return;

            }


            let quantity =
                getProductQuantity(
                    cart[index]
                );


            quantity +=
                Number(amount) || 0;


            /* =================================================
               REMOVE WHEN ZERO
            ================================================= */

            if (quantity <= 0) {

                cart.splice(index, 1);

            } else {

                cart[index].quantity =
                    quantity;

            }


            saveCart();

            renderCart();

        };


    /* =========================================================
       REMOVE PRODUCT
    ========================================================= */

    window.removeFromCart =
        function (index) {

            if (!cart[index]) {

                return;

            }


            cart.splice(index, 1);


            saveCart();

            renderCart();

        };


    /* =========================================================
       GO TO CHECKOUT
    ========================================================= */

    window.goToCheckout =
        function () {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            window.location.href =
                "../checkout/checkout.html";

        };


    /* =========================================================
       INITIAL RENDER
    ========================================================= */

    (async function () {

        await syncWatchPricesFromHTML();

        renderCart();

    })();

});