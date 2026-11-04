document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       SUPABASE
    ========================================================= */

    const SUPABASE_URL =
        "https://xhjxeexvibjvzzhmdccf.supabase.co";

    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_BiA8pv0qcfcdfzcdQ9GjWg_QvZvuOnB";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );


    /* =========================================================
       EMAILJS
    ========================================================= */

    const EMAILJS_PUBLIC_KEY =
        "mjftA1hZ1J_kGNUpH";

    const EMAILJS_SERVICE_ID =
        "service_5tsw4ag";

    const EMAILJS_TEMPLATE_ID =
        "template_xps80t3";


    if (
        window.emailjs &&
        typeof window.emailjs.init === "function"
    ) {

        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });

    }


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const checkoutForm =
        document.getElementById("checkoutForm");

    const checkoutItems =
        document.getElementById("checkoutItems");

    const checkoutSubtotal =
        document.getElementById("checkoutSubtotal");

    const checkoutShipping =
        document.getElementById("checkoutShipping");

    const checkoutTotal =
        document.getElementById("checkoutTotal");

    const orderSuccess =
        document.getElementById("orderSuccess");

    const successOrderId =
        document.getElementById("successOrderId");

    const copyOrderIdButton =
        document.getElementById("copyOrderId");

    const trackOrderButton =
        document.getElementById("trackOrderButton");

    const closeOrderCompleteBtn =
        document.getElementById(
            "closeOrderCompleteBtn"
        );


    /* =========================================================
       SHIPPING
    ========================================================= */

    const DEFAULT_SHIPPING_COST = 250;


    /* =========================================================
       LOAD CART
    ========================================================= */

    let cart = [];

    try {

        const savedCart =
            localStorage.getItem("sultanCart");

        if (savedCart) {

            cart =
                JSON.parse(savedCart);

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


    console.log(
        "CHECKOUT CART:",
        cart
    );


    /* =========================================================
       FORMAT PRICE
    ========================================================= */

    function formatPrice(amount) {

        const value =
            Number(amount) || 0;

        return (
            "Rs. " +
            value.toLocaleString("en-PK")
        );

    }


    /* =========================================================
       ESCAPE HTML
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
       RENDER CHECKOUT ITEMS
    ========================================================= */

    function renderCheckoutItems() {

        if (!checkoutItems) {

            return;

        }


        checkoutItems.innerHTML = "";


        /* =====================================================
           EMPTY CART
        ===================================================== */

        if (cart.length === 0) {

            checkoutItems.innerHTML = `

                <div class="checkout-empty">

                    <p>
                        Your cart is empty.
                    </p>

                    <a href="../index.html">
                        Continue Shopping
                    </a>

                </div>

            `;


            if (checkoutSubtotal) {

                checkoutSubtotal.textContent =
                    "Rs. 0";

            }


            if (checkoutShipping) {

                checkoutShipping.textContent =
                    "Rs. 0";

            }


            if (checkoutTotal) {

                checkoutTotal.textContent =
                    "Rs. 0";

            }

            return;

        }


        /* =====================================================
           PRODUCTS
        ===================================================== */

        cart.forEach(function (product) {

            const price =
                getProductPrice(product);


            const quantity =
                getProductQuantity(product);


            const itemTotal =
                price * quantity;


            const item =
                document.createElement("div");


            item.className =
                "checkout-item";


            item.innerHTML = `

                <div class="checkout-item-image">

                    <img
                        src="${escapeHTML(
                            product.image || ""
                        )}"
                        alt="${escapeHTML(
                            product.name ||
                            "Sultan Product"
                        )}"
                    >

                    <span class="checkout-item-quantity">

                        ${quantity}

                    </span>

                </div>


                <div class="checkout-item-info">

                    <strong>

                        ${escapeHTML(
                            product.name ||
                            "Sultan Product"
                        )}

                    </strong>


                    <span>

                        ${escapeHTML(
                            product.collection ||
                            "SULTAN BRANDS"
                        )}

                    </span>


                    <small>

                        Qty: ${quantity}

                    </small>

                </div>


                <div class="checkout-item-price">

                    ${formatPrice(itemTotal)}

                </div>

            `;


            checkoutItems.appendChild(item);

        });


        /* =====================================================
           TOTALS
        ===================================================== */

        const subtotal =
            calculateSubtotal();


        const shipping =
            getSelectedShipping();


        const total =
            subtotal + shipping;


        if (checkoutSubtotal) {

            checkoutSubtotal.textContent =
                formatPrice(subtotal);

        }


        if (checkoutShipping) {

            checkoutShipping.textContent =
                formatPrice(shipping);

        }


        if (checkoutTotal) {

            checkoutTotal.textContent =
                formatPrice(total);

        }


        console.log(
            "CHECKOUT SUBTOTAL:",
            subtotal
        );


        console.log(
            "CHECKOUT SHIPPING:",
            shipping
        );


        console.log(
            "CHECKOUT TOTAL:",
            total
        );

    }


    /* =========================================================
       GET SELECTED SHIPPING
    ========================================================= */

    function getSelectedShipping() {

        const shippingElement =
            document.querySelector(
                'input[name="shipping"]:checked'
            );


        if (!shippingElement) {

            return DEFAULT_SHIPPING_COST;

        }


        const value =
            Number(
                shippingElement.value
            );


        if (
            Number.isFinite(value) &&
            value >= 0
        ) {

            return value;

        }


        return DEFAULT_SHIPPING_COST;

    }


    /* =========================================================
       GENERATE ORDER ID
    ========================================================= */

    function generateOrderId() {

        const number =
            Math.floor(
                1000000 +
                Math.random() * 9000000
            );


        return "SB-" + number;

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
       SAVE ORDER LOCALLY
    ========================================================= */

    function saveOrderLocally(order) {

        let orders = [];


        try {

            const savedOrders =
                localStorage.getItem(
                    "sultanOrders"
                );


            if (savedOrders) {

                orders =
                    JSON.parse(savedOrders);

            }


            if (!Array.isArray(orders)) {

                orders = [];

            }

        } catch (error) {

            console.error(
                "Order loading error:",
                error
            );

            orders = [];

        }


        orders.push(order);


        localStorage.setItem(
            "sultanOrders",
            JSON.stringify(orders)
        );


        localStorage.setItem(
            "sultanLastOrder",
            JSON.stringify(order)
        );


        console.log(
            "ORDER SAVED LOCALLY:",
            order
        );

    }


    /* =========================================================
       SAVE ORDER TO SUPABASE
    ========================================================= */

    async function saveOrderToSupabase(order) {

        console.log(
            "SENDING ORDER TO SUPABASE:",
            order
        );


        try {

            const { data, error } =
                await supabaseClient
                    .from("Orders")
                    .insert({

                        order_id:
                            order.orderId,

                        user_id:
                            null,

                        customer_name:
                            order.customerName,

                        customer_email:
                            order.customerEmail,

                        customer_phone:
                            order.customerPhone,

                        total:
                            order.total,

                        status:
                            order.status,

                        order_date:
                            order.orderDate,

                        items:
                            order.items,

                        address:
                            order.delivery.address,

                        city:
                            order.delivery.city,

                        postal_code:
                            order.delivery.postalCode,

                        payment_method:
                            order.paymentMethod,

                        shipping:
                            order.shipping

                    });


            if (error) {

                console.error(
                    "SUPABASE ERROR:",
                    error
                );


                return {

                    success: false,

                    error:
                        error.message

                };

            }


            console.log(
                "ORDER SUCCESSFULLY SAVED:",
                data
            );


            return {

                success: true,

                data: data

            };

        } catch (error) {

            console.error(
                "SUPABASE CONNECTION ERROR:",
                error
            );


            return {

                success: false,

                error:
                    error.message

            };

        }

    }


    /* =========================================================
       SEND ORDER EMAIL
    ========================================================= */

    async function sendOrderEmail(order) {

        if (
            !window.emailjs ||
            typeof window.emailjs.send !== "function"
        ) {

            console.warn(
                "EmailJS is not loaded."
            );


            return {

                success: false,

                error:
                    "EmailJS not loaded"

            };

        }


        try {

            const templateParams = {

                order_id:
                    order.orderId,

                customer_name:
                    order.customerName,

                customer_email:
                    order.customerEmail,

                customer_phone:
                    order.customerPhone,

                total:
                    formatPrice(order.total),

                subtotal:
                    formatPrice(order.subtotal),

                shipping:
                    formatPrice(order.shipping),

                payment_method:
                    order.paymentMethod,

                address:
                    order.delivery.address,

                city:
                    order.delivery.city,

                postal_code:
                    order.delivery.postalCode,

                order_date:
                    order.orderDate,

                status:
                    order.status,

                items:
                    order.items
                        .map(function (item) {

                            return (
                                item.name +
                                " x " +
                                item.quantity +
                                " - " +
                                formatPrice(
                                    item.price *
                                    item.quantity
                                )
                            );

                        })
                        .join("\n")

            };


            const result =
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams
                );


            console.log(
                "ORDER EMAIL SENT:",
                result
            );


            return {

                success: true,

                data: result

            };

        } catch (error) {

            console.error(
                "EMAILJS ERROR:",
                error
            );


            return {

                success: false,

                error:
                    error.text ||
                    error.message ||
                    "Email could not be sent"

            };

        }

    }


    /* =========================================================
       SHOW SUCCESS
    ========================================================= */

    function showOrderSuccess(orderId) {

        if (successOrderId) {

            successOrderId.textContent =
                orderId;

        }


        if (orderSuccess) {

            orderSuccess.classList.add(
                "show"
            );

        }

    }


    /* =========================================================
       COPY ORDER ID
    ========================================================= */

    if (copyOrderIdButton) {

        copyOrderIdButton.addEventListener(
            "click",
            async function () {

                const orderId =
                    successOrderId
                        ? successOrderId.textContent.trim()
                        : "";


                if (!orderId) {

                    return;

                }


                try {

                    await navigator.clipboard.writeText(
                        orderId
                    );


                    const oldText =
                        copyOrderIdButton.textContent;


                    copyOrderIdButton.textContent =
                        "COPIED!";


                    setTimeout(function () {

                        copyOrderIdButton.textContent =
                            oldText;

                    }, 2000);

                } catch (error) {

                    console.error(
                        "COPY ERROR:",
                        error
                    );

                }

            }
        );

    }


    /* =========================================================
       TRACK ORDER
    ========================================================= */

    if (trackOrderButton) {

        trackOrderButton.addEventListener(
            "click",
            function () {

                const orderId =
                    successOrderId
                        ? successOrderId.textContent.trim()
                        : "";


                if (!orderId) {

                    return;

                }


                window.location.href =
                    "../tracking/tracking.html?order=" +
                    encodeURIComponent(orderId);

            }
        );

    }


    /* =========================================================
       SHIPPING CHANGE
    ========================================================= */

    const shippingInputs =
        document.querySelectorAll(
            'input[name="shipping"]'
        );


    shippingInputs.forEach(function (input) {

        input.addEventListener(
            "change",
            function () {

                renderCheckoutItems();

            }
        );

    });


    /* =========================================================
       SUBMIT ORDER
    ========================================================= */

    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* =================================================
                   CART CHECK
                ================================================= */

                if (cart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                /* =================================================
                   FORM ELEMENTS
                ================================================= */

                const emailInput =
                    document.getElementById(
                        "email"
                    );

                const firstNameInput =
                    document.getElementById(
                        "firstName"
                    );

                const lastNameInput =
                    document.getElementById(
                        "lastName"
                    );

                const addressInput =
                    document.getElementById(
                        "address"
                    );

                const cityInput =
                    document.getElementById(
                        "city"
                    );

                const postalCodeInput =
                    document.getElementById(
                        "postalCode"
                    );

                const phoneInput =
                    document.getElementById(
                        "phone"
                    );


                /* =================================================
                   FORM VALUES
                ================================================= */

                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : "";


                const firstName =
                    firstNameInput
                        ? firstNameInput.value.trim()
                        : "";


                const lastName =
                    lastNameInput
                        ? lastNameInput.value.trim()
                        : "";


                const address =
                    addressInput
                        ? addressInput.value.trim()
                        : "";


                const city =
                    cityInput
                        ? cityInput.value.trim()
                        : "";


                const postalCode =
                    postalCodeInput
                        ? postalCodeInput.value.trim()
                        : "";


                const phone =
                    phoneInput
                        ? phoneInput.value.trim()
                        : "";


                /* =================================================
                   SHIPPING
                ================================================= */

                const shipping =
                    getSelectedShipping();


                /* =================================================
                   PAYMENT
                ================================================= */

                const paymentElement =
                    document.querySelector(
                        'input[name="payment"]:checked'
                    );


                const paymentMethod =
                    paymentElement
                        ? paymentElement.value
                        : "COD";


                /* =================================================
                   VALIDATION
                ================================================= */

                if (
                    !email ||
                    !firstName ||
                    !lastName ||
                    !address ||
                    !city ||
                    !phone
                ) {

                    alert(
                        "Please complete all required delivery information."
                    );

                    return;

                }


                /* =================================================
                   SYNC LATEST WATCH PRICES BEFORE ORDER
                ================================================= */

                await syncWatchPricesFromHTML();


                /* =================================================
                   CALCULATE PRICE
                ================================================= */

                const subtotal =
                    calculateSubtotal();


                const total =
                    subtotal + shipping;


                /* =================================================
                   ORDER ID
                ================================================= */

                const orderId =
                    generateOrderId();


                /* =================================================
                   FINAL ITEMS
                ================================================= */

                const orderItems =
                    cart.map(function (product) {

                        return {

                            id:
                                product.id ||
                                null,

                            name:
                                product.name ||
                                "",

                            price:
                                getProductPrice(
                                    product
                                ),

                            quantity:
                                getProductQuantity(
                                    product
                                ),

                            image:
                                product.image ||
                                "",

                            collection:
                                product.collection ||
                                "SULTAN BRANDS",

                            description:
                                product.description ||
                                ""

                        };

                    });


                /* =================================================
                   FINAL ORDER
                ================================================= */

                const order = {

                    orderId:
                        orderId,

                    userId:
                        null,

                    customerName:
                        firstName +
                        " " +
                        lastName,

                    customerEmail:
                        email,

                    customerPhone:
                        phone,

                    subtotal:
                        subtotal,

                    shipping:
                        shipping,

                    total:
                        total,

                    status:
                        "Order Placed",

                    orderDate:
                        new Date().toISOString(),

                    paymentMethod:
                        paymentMethod,

                    delivery: {

                        firstName:
                            firstName,

                        lastName:
                            lastName,

                        address:
                            address,

                        city:
                            city,

                        postalCode:
                            postalCode,

                        phone:
                            phone,

                        email:
                            email

                    },

                    items:
                        orderItems

                };


                console.log(
                    "FINAL ORDER:",
                    order
                );


                /* =================================================
                   SUBMIT BUTTON
                ================================================= */

                const submitButton =
                    checkoutForm.querySelector(
                        ".place-order"
                    );


                const originalText =
                    submitButton
                        ? submitButton.textContent
                        : "COMPLETE ORDER";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "PROCESSING ORDER...";

                }


                try {

                    /* =============================================
                       1. SAVE LOCALLY
                    ============================================= */

                    saveOrderLocally(
                        order
                    );


                    /* =============================================
                       2. SUPABASE
                    ============================================= */

                    const supabaseResult =
                        await saveOrderToSupabase(
                            order
                        );


                    console.log(
                        "SUPABASE RESULT:",
                        supabaseResult
                    );


                    if (!supabaseResult.success) {

                        alert(
                            "Order saved locally, but Supabase could not save it.\n\n" +
                            "Error:\n" +
                            supabaseResult.error
                        );


                        if (submitButton) {

                            submitButton.disabled =
                                false;

                            submitButton.textContent =
                                originalText;

                        }

                        return;

                    }


                    /* =============================================
                       3. EMAIL
                    ============================================= */

                    const emailResult =
                        await sendOrderEmail(
                            order
                        );


                    console.log(
                        "EMAIL RESULT:",
                        emailResult
                    );


                    /* =============================================
                       4. CLEAR CART
                    ============================================= */

                    localStorage.removeItem(
                        "sultanCart"
                    );


                    cart = [];


                    /* =============================================
                       5. SUCCESS
                    ============================================= */

                    showOrderSuccess(
                        orderId
                    );


                    console.log(
                        "ORDER COMPLETED:",
                        orderId
                    );

                } catch (error) {

                    console.error(
                        "ORDER ERROR:",
                        error
                    );


                    alert(
                        "Something went wrong.\n\n" +
                        error.message
                    );

                }


                /* =================================================
                   RESET BUTTON
                ================================================= */

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalText;

                }

            }
        );

    }


    /* =========================================================
       CLOSE ORDER COMPLETE
    ========================================================= */

    if (closeOrderCompleteBtn) {

        closeOrderCompleteBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "../index.html";

            }
        );

    }


    /* =========================================================
       CONTINUE SHOPPING
    ========================================================= */

    window.continueShopping =
        function () {

            window.location.href =
                "../index.html";

        };


    /* =========================================================
       INITIAL RENDER
    ========================================================= */

    (async function () {

        await syncWatchPricesFromHTML();

        renderCheckoutItems();

    })();

});