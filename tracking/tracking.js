document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       SUPABASE CONFIG
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
       ELEMENTS
    ========================================================= */

    const trackingForm =
        document.getElementById("trackingForm");

    const orderIdInput =
        document.getElementById("orderId");

    const trackingError =
        document.getElementById("trackingError");

    const orderResult =
        document.getElementById("orderResult");

    const displayOrderId =
        document.getElementById("displayOrderId");

    const currentStatus =
        document.getElementById("currentStatus");

    const orderDate =
        document.getElementById("orderDate");

    const customerName =
        document.getElementById("customerName");

    const orderTotal =
        document.getElementById("orderTotal");


    /* =========================================================
       ORDER STATUSES
    ========================================================= */

    const statuses = [

        "Order Placed",

        "Order Confirmed",

        "Processing",

        "Shipped",

        "Out for Delivery",

        "Delivered"

    ];


    /* =========================================================
       FORMAT PRICE
    ========================================================= */

    function formatPrice(price) {

        const number =
            Number(price) || 0;

        return (
            "Rs. " +
            number.toLocaleString("en-PK")
        );

    }


    /* =========================================================
       FORMAT DATE
    ========================================================= */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "—";

        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {

            return "—";

        }


        return date.toLocaleDateString(
            "en-PK",
            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }
        );

    }


    /* =========================================================
       SHOW ERROR
    ========================================================= */

    function showError(message) {

        if (trackingError) {

            trackingError.textContent =
                message;

        }


        if (orderResult) {

            orderResult.classList.remove(
                "show"
            );

        }

    }


    /* =========================================================
       CLEAR ERROR
    ========================================================= */

    function clearError() {

        if (trackingError) {

            trackingError.textContent =
                "";

        }

    }


    /* =========================================================
       UPDATE TIMELINE
    ========================================================= */

    function updateTimeline(status) {

        const timelineItems =
            document.querySelectorAll(
                ".timeline-item"
            );

        const timelineLines =
            document.querySelectorAll(
                ".timeline-line"
            );


        let statusIndex =
            statuses.indexOf(status);


        if (statusIndex === -1) {

            statusIndex = 0;

        }


        /* =====================================================
           UPDATE ITEMS
        ===================================================== */

        timelineItems.forEach(
            function (item, index) {

                if (index <= statusIndex) {

                    item.classList.add(
                        "active"
                    );

                } else {

                    item.classList.remove(
                        "active"
                    );

                }

            }
        );


        /* =====================================================
           UPDATE LINES
        ===================================================== */

        timelineLines.forEach(
            function (line, index) {

                if (index < statusIndex) {

                    line.classList.add(
                        "active"
                    );

                } else {

                    line.classList.remove(
                        "active"
                    );

                }

            }
        );


        /* =====================================================
           CURRENT STATUS
        ===================================================== */

        if (currentStatus) {

            currentStatus.textContent =
                statuses[statusIndex];

        }

    }


    /* =========================================================
       FETCH ORDER FROM SUPABASE
    ========================================================= */

    async function findOrder(orderId) {

        const cleanOrderId =
            String(orderId || "")
                .trim()
                .toUpperCase();


        if (!cleanOrderId) {

            return {

                success: false,

                error:
                    "Please enter your Order ID."

            };

        }


        console.log(
            "Searching Supabase for order:",
            cleanOrderId
        );


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("Orders")
                    .select("*")
                    .eq(
                        "order_id",
                        cleanOrderId
                    )
                    .maybeSingle();


            console.log(
                "Tracking Supabase response:",
                data,
                error
            );


            if (error) {

                console.error(
                    "TRACKING SUPABASE ERROR:",
                    error
                );


                return {

                    success: false,

                    error:
                        error.message ||
                        "Unable to search for this order."

                };

            }


            if (!data) {

                return {

                    success: false,

                    error:
                        "Order not found. Please check your Order ID and try again."

                };

            }


            return {

                success: true,

                order: data

            };


        } catch (error) {

            console.error(
                "TRACKING ERROR:",
                error
            );


            return {

                success: false,

                error:
                    error.message ||
                    "Something went wrong while tracking your order."

            };

        }

    }


    /* =========================================================
       DISPLAY ORDER
    ========================================================= */

    function displayOrder(order) {

        clearError();


        console.log(
            "DISPLAYING ORDER:",
            order
        );


        /* =====================================================
           ORDER ID
        ===================================================== */

        if (displayOrderId) {

            displayOrderId.textContent =
                order.order_id ||
                "—";

        }


        /* =====================================================
           CUSTOMER NAME
        ===================================================== */

        if (customerName) {

            customerName.textContent =
                order.customer_name ||
                "—";

        }


        /* =====================================================
           ORDER DATE
        ===================================================== */

        if (orderDate) {

            orderDate.textContent =
                formatDate(
                    order.order_date
                );

        }


        /* =====================================================
           TOTAL
        ===================================================== */

        if (orderTotal) {

            orderTotal.textContent =
                formatPrice(
                    order.total
                );

        }


        /* =====================================================
           STATUS
        ===================================================== */

        const status =
            order.status ||
            "Order Placed";


        updateTimeline(status);


        /* =====================================================
           SHOW RESULT
        ===================================================== */

        if (orderResult) {

            orderResult.classList.add(
                "show"
            );

        }


        /* =====================================================
           SCROLL TO RESULT
        ===================================================== */

        setTimeout(
            function () {

                if (orderResult) {

                    orderResult.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }

            },
            150
        );

    }


    /* =========================================================
       TRACK ORDER
    ========================================================= */

    if (trackingForm) {

        trackingForm.addEventListener(
            "submit",
            async function (event) {

                /*
                   VERY IMPORTANT

                   Prevent page reload.
                */

                event.preventDefault();

                event.stopPropagation();


                console.log(
                    "TRACK ORDER CLICKED"
                );


                /* =================================================
                   GET ORDER ID
                ================================================= */

                const enteredOrderId =
                    orderIdInput
                        ? orderIdInput.value.trim()
                        : "";


                console.log(
                    "ENTERED ORDER ID:",
                    enteredOrderId
                );


                /* =================================================
                   VALIDATION
                ================================================= */

                if (!enteredOrderId) {

                    showError(
                        "Please enter your Order ID."
                    );

                    return;

                }


                /* =================================================
                   BUTTON
                ================================================= */

                const button =
                    trackingForm.querySelector(
                        'button[type="submit"]'
                    );


                const originalButtonText =
                    button
                        ? button.textContent
                        : "TRACK ORDER";


                if (button) {

                    button.disabled =
                        true;

                    button.textContent =
                        "TRACKING...";

                }


                clearError();


                try {

                    /* =============================================
                       SEARCH SUPABASE
                    ============================================= */

                    const result =
                        await findOrder(
                            enteredOrderId
                        );


                    console.log(
                        "TRACKING RESULT:",
                        result
                    );


                    /* =============================================
                       ORDER NOT FOUND / ERROR
                    ============================================= */

                    if (!result.success) {

                        showError(
                            result.error
                        );

                        return;

                    }


                    /* =============================================
                       DISPLAY ORDER
                    ============================================= */

                    displayOrder(
                        result.order
                    );


                } catch (error) {

                    console.error(
                        "TRACK ORDER ERROR:",
                        error
                    );


                    showError(
                        "Something went wrong while tracking your order."
                    );

                } finally {

                    /* =============================================
                       RESET BUTTON
                    ============================================= */

                    if (button) {

                        button.disabled =
                            false;

                        button.textContent =
                            originalButtonText;

                    }

                }

            }
        );

    }


    /* =========================================================
       AUTO TRACK FROM URL
       
       Example:
       tracking.html?order=SB-XXXXXXXX-XXXXX
    ========================================================= */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const urlOrderId =
        urlParams.get("order");


    if (urlOrderId) {

        if (orderIdInput) {

            orderIdInput.value =
                urlOrderId;

        }


        /*
           Automatically search
        */

        findOrder(
            urlOrderId
        )
        .then(
            function (result) {

                if (result.success) {

                    displayOrder(
                        result.order
                    );

                } else {

                    showError(
                        result.error
                    );

                }

            }
        )
        .catch(
            function (error) {

                console.error(
                    "AUTO TRACK ERROR:",
                    error
                );

                showError(
                    "Unable to track this order."
                );

            }
        );

    }


});