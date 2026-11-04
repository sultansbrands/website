document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       SUPABASE
    ====================================================== */

    const SUPABASE_URL =
        "https://xhjxeexvibjvzzhmdccf.supabase.co";


    const SUPABASE_PUBLISHABLE_KEY =
        "sb_publishable_BiA8pv0qcfcdfzcdQ9GjWg_QvZvuOnB";


    if (!window.supabase) {

        console.error(
            "Supabase library could not be loaded."
        );

        return;
    }


    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );



    /* =====================================================
       ELEMENTS
    ====================================================== */

    const ordersOptions =
        document.getElementById(
            "ordersOptions"
        );


    const trackOptionBtn =
        document.getElementById(
            "trackOptionBtn"
        );


    const viewOrdersOptionBtn =
        document.getElementById(
            "viewOrdersOptionBtn"
        );


    const viewOrdersSection =
        document.getElementById(
            "viewOrdersSection"
        );


    const backToOptionsBtn =
        document.getElementById(
            "backToOptionsBtn"
        );


    const ordersEmailInput =
        document.getElementById(
            "ordersEmailInput"
        );


    const findOrdersBtn =
        document.getElementById(
            "findOrdersBtn"
        );


    const ordersMessage =
        document.getElementById(
            "ordersMessage"
        );


    const ordersList =
        document.getElementById(
            "ordersList"
        );


    const cancelOverlay =
        document.getElementById(
            "cancelOverlay"
        );


    const cancelOrderIdText =
        document.getElementById(
            "cancelOrderIdText"
        );


    const keepOrderBtn =
        document.getElementById(
            "keepOrderBtn"
        );


    const confirmCancelBtn =
        document.getElementById(
            "confirmCancelBtn"
        );



    /* =====================================================
       CURRENT CUSTOMER DATA
    ====================================================== */

    let currentCustomerEmail = "";

    let selectedOrderId = "";



    /* =====================================================
       ESCAPE HTML
    ====================================================== */

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



    /* =====================================================
       FORMAT PRICE
    ====================================================== */

    function formatPrice(amount) {

        const value =
            Number(amount) || 0;


        return (
            "Rs. " +
            value.toLocaleString(
                "en-PK"
            )
        );

    }



    /* =====================================================
       FORMAT DATE
    ====================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "—";

        }


        const date =
            new Date(dateValue);


        if (Number.isNaN(date.getTime())) {

            return escapeHTML(dateValue);

        }


        return date.toLocaleDateString(
            "en-PK",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }



    /* =====================================================
       TRACK ORDER
    ====================================================== */

    if (trackOptionBtn) {

        trackOptionBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "../tracking/tracking.html";

            }
        );

    }



    /* =====================================================
       OPEN VIEW ORDERS
    ====================================================== */

    if (viewOrdersOptionBtn) {

        viewOrdersOptionBtn.addEventListener(
            "click",
            function () {

                if (ordersOptions) {

                    ordersOptions.style.display =
                        "none";

                }


                if (viewOrdersSection) {

                    viewOrdersSection.classList.add(
                        "show"
                    );

                }


                if (ordersEmailInput) {

                    setTimeout(
                        function () {

                            ordersEmailInput.focus();

                        },
                        100
                    );

                }

            }
        );

    }



    /* =====================================================
       BACK TO OPTIONS
    ====================================================== */

    if (backToOptionsBtn) {

        backToOptionsBtn.addEventListener(
            "click",
            function () {

                if (viewOrdersSection) {

                    viewOrdersSection.classList.remove(
                        "show"
                    );

                }


                if (ordersOptions) {

                    ordersOptions.style.display =
                        "grid";

                }


                if (ordersList) {

                    ordersList.innerHTML = "";

                }


                if (ordersMessage) {

                    ordersMessage.textContent = "";

                }


                currentCustomerEmail = "";

                selectedOrderId = "";

            }
        );

    }



    /* =====================================================
       FIND CUSTOMER ORDERS
    ====================================================== */

    async function findCustomerOrders() {

        const email =
            ordersEmailInput
                ? ordersEmailInput.value
                    .trim()
                    .toLowerCase()
                : "";


        if (!email) {

            if (ordersMessage) {

                ordersMessage.textContent =
                    "Please enter your email address.";

            }

            return;

        }


        currentCustomerEmail = email;


        if (findOrdersBtn) {

            findOrdersBtn.disabled = true;

            findOrdersBtn.textContent =
                "LOADING...";

        }


        if (ordersMessage) {

            ordersMessage.textContent =
                "Finding your orders...";

        }


        if (ordersList) {

            ordersList.innerHTML = "";

        }


        try {

            const { data, error } =
                await supabaseClient
                    .from("Orders")
                    .select("*")
                    .eq(
                        "customer_email",
                        currentCustomerEmail
                    )
                    .order(
                        "order_date",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                throw error;

            }


            if (
                !data ||
                data.length === 0
            ) {

                if (ordersMessage) {

                    ordersMessage.textContent =
                        "No orders were found with this email address.";

                }


                if (ordersList) {

                    ordersList.innerHTML = `
                        <div class="no-orders">
                            No orders found.
                        </div>
                    `;

                }

                return;

            }


            if (ordersMessage) {

                ordersMessage.textContent =
                    data.length +
                    (
                        data.length === 1
                            ? " order found."
                            : " orders found."
                    );

            }


            renderOrders(data);


        } catch (error) {

            console.error(
                "ORDERS FETCH ERROR:",
                error
            );


            if (ordersMessage) {

                ordersMessage.textContent =
                    "Could not load your orders. Please try again.";

            }


        } finally {

            if (findOrdersBtn) {

                findOrdersBtn.disabled = false;

                findOrdersBtn.textContent =
                    "VIEW MY ORDERS";

            }

        }

    }



    /* =====================================================
       FIND BUTTON
    ====================================================== */

    if (findOrdersBtn) {

        findOrdersBtn.addEventListener(
            "click",
            findCustomerOrders
        );

    }



    /* =====================================================
       ENTER KEY
    ====================================================== */

    if (ordersEmailInput) {

        ordersEmailInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    findCustomerOrders();

                }

            }
        );

    }



    /* =====================================================
       GET ORDER PRODUCTS
    ====================================================== */

    function getOrderItems(order) {

        if (
            Array.isArray(order.items)
        ) {

            return order.items;

        }


        if (
            typeof order.items === "string"
        ) {

            try {

                return JSON.parse(
                    order.items
                );

            } catch (error) {

                console.warn(
                    "Could not parse order items.",
                    error
                );

            }

        }


        return [];

    }



    /* =====================================================
       RENDER ORDERS
    ====================================================== */

    function renderOrders(orders) {

        if (!ordersList) {

            return;

        }


        ordersList.innerHTML = "";


        orders.forEach(
            function (order) {


                const items =
                    getOrderItems(order);


                let productsHTML = "";


                if (items.length > 0) {

                    items.forEach(
                        function (item) {


                            const image =
                                item.image ||
                                "../img/watches/sultan-emerald-royal-01.jpg";


                            const quantity =
                                Number(
                                    item.quantity
                                ) || 1;


                            const itemTotal =
                                (
                                    Number(
                                        item.price
                                    ) || 0
                                ) * quantity;


                            productsHTML += `

                                <div class="order-product">

                                    <img
                                        src="${escapeHTML(image)}"
                                        alt="${escapeHTML(
                                            item.name ||
                                            "Sultan Product"
                                        )}"
                                    >


                                    <div class="order-product-info">

                                        <strong>

                                            ${escapeHTML(
                                                item.name ||
                                                "Sultan Product"
                                            )}

                                        </strong>


                                        <span>

                                            Qty: ${quantity}

                                        </span>

                                    </div>


                                    <div class="order-product-price">

                                        ${formatPrice(
                                            itemTotal
                                        )}

                                    </div>

                                </div>

                            `;

                        }
                    );


                } else {

                    productsHTML = `

                        <div class="order-product">

                            <div class="order-product-info">

                                <strong>
                                    Order Products
                                </strong>


                                <span>
                                    Product details are unavailable.
                                </span>

                            </div>

                        </div>

                    `;

                }


                const orderCard =
                    document.createElement(
                        "div"
                    );


                orderCard.className =
                    "order-card";


                orderCard.innerHTML = `

                    <div class="order-card-top">

                        <div>

                            <span class="order-card-label">

                                ORDER ID

                            </span>


                            <strong class="order-card-id">

                                ${escapeHTML(
                                    order.order_id ||
                                    "—"
                                )}

                            </strong>

                        </div>


                        <div class="order-status">

                            ${escapeHTML(
                                order.status ||
                                "Order Placed"
                            )}

                        </div>

                    </div>


                    <div class="order-products">

                        ${productsHTML}

                    </div>


                    <div class="order-card-bottom">

                        <div class="order-total">

                            ORDER DATE:
                            ${formatDate(
                                order.order_date
                            )}


                            <strong>

                                ${formatPrice(
                                    order.total
                                )}

                            </strong>

                        </div>


                        <button
                            type="button"
                            class="cancel-order-button"
                            data-order-id="${escapeHTML(
                                order.order_id
                            )}"
                        >

                            CANCEL ORDER

                        </button>

                    </div>

                `;


                ordersList.appendChild(
                    orderCard
                );

            }
        );


        attachCancelButtons();

    }



    /* =====================================================
       CANCEL BUTTONS
    ====================================================== */

    function attachCancelButtons() {

        const cancelButtons =
            document.querySelectorAll(
                ".cancel-order-button"
            );


        cancelButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {


                        selectedOrderId =
                            this.getAttribute(
                                "data-order-id"
                            );


                        if (
                            !selectedOrderId
                        ) {

                            return;

                        }


                        if (
                            cancelOrderIdText
                        ) {

                            cancelOrderIdText.textContent =
                                selectedOrderId;

                        }


                        if (
                            cancelOverlay
                        ) {

                            cancelOverlay.classList.add(
                                "show"
                            );

                        }

                    }
                );

            }
        );

    }



    /* =====================================================
       KEEP ORDER
    ====================================================== */

    if (keepOrderBtn) {

        keepOrderBtn.addEventListener(
            "click",
            closeCancelPopup
        );

    }



    /* =====================================================
       CLOSE POPUP
    ====================================================== */

    function closeCancelPopup() {

        selectedOrderId = "";


        if (cancelOverlay) {

            cancelOverlay.classList.remove(
                "show"
            );

        }

    }



    /* =====================================================
       CLICK OUTSIDE POPUP
    ====================================================== */

    if (cancelOverlay) {

        cancelOverlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === cancelOverlay
                ) {

                    closeCancelPopup();

                }

            }
        );

    }



    /* =====================================================
       CONFIRM CANCEL ORDER

       IMPORTANT:
       Is section mein direct DELETE nahi hai.

       Sirf:
       RPC -> cancel_order

       Isliye browser ko:
       POST /rpc/cancel_order
       request bhejni chahiye.
    ====================================================== */

    if (confirmCancelBtn) {

        confirmCancelBtn.addEventListener(
            "click",
            async function () {


                if (
                    !selectedOrderId
                ) {

                    return;

                }


                if (
                    !currentCustomerEmail
                ) {

                    alert(
                        "Customer email is missing."
                    );

                    return;

                }


                const originalText =
                    confirmCancelBtn.textContent;


                confirmCancelBtn.disabled =
                    true;


                confirmCancelBtn.textContent =
                    "CANCELLING...";


                try {


                    console.log(
                        "CALLING CANCEL ORDER RPC:",
                        {
                            orderId:
                                selectedOrderId,

                            email:
                                currentCustomerEmail
                        }
                    );


                    const { data, error } =
                        await supabaseClient.rpc(
                            "cancel_order",
                            {
                                p_order_id:
                                    selectedOrderId,

                                p_customer_email:
                                    currentCustomerEmail
                            }
                        );


                    if (error) {

                        console.error(
                            "RPC CANCEL ERROR:",
                            error
                        );

                        throw error;

                    }


                    console.log(
                        "RPC RESULT:",
                        data
                    );


                    if (
                        data !== true
                    ) {

                        throw new Error(
                            "Order was not found or could not be cancelled."
                        );

                    }


                    /* SUCCESS */

                    if (cancelOverlay) {

                        cancelOverlay.classList.remove(
                            "show"
                        );

                    }


                    selectedOrderId = "";


                    if (ordersMessage) {

                        ordersMessage.textContent =
                            "✓ Order cancelled successfully.";

                    }


                    /* RELOAD ORDERS */

                    await findCustomerOrders();


                } catch (error) {


                    console.error(
                        "CANCEL ORDER ERROR:",
                        error
                    );


                    alert(
                        "Could not cancel this order.\n\n" +
                        (
                            error.message ||
                            "Please try again."
                        )
                    );


                } finally {


                    confirmCancelBtn.disabled =
                        false;


                    confirmCancelBtn.textContent =
                        originalText;

                }

            }
        );

    }


});