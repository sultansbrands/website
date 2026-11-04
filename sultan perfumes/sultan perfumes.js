document.addEventListener("DOMContentLoaded", function () {


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const productCards =
        document.querySelectorAll(".product-card");


    const genderButtons =
        document.querySelectorAll(".gender-btn");


    const productModal =
        document.getElementById("productModal");


    const modalOverlay =
        document.getElementById("modalOverlay");


    const closeModal =
        document.getElementById("closeModal");


    const mainProductImage =
        document.getElementById("mainProductImage");


    const productThumbnails =
        document.getElementById("productThumbnails");


    const modalCollection =
        document.getElementById("modalCollection");


    const modalProductName =
        document.getElementById("modalProductName");


    const modalProductPrice =
        document.getElementById("modalProductPrice");


    const modalProductDescription =
        document.getElementById("modalProductDescription");


    const quantityElement =
        document.getElementById("quantity");


    const minusBtn =
        document.getElementById("minusBtn");


    const plusBtn =
        document.getElementById("plusBtn");


    const addToCartBtn =
        document.getElementById("addToCartBtn");


    const buyNowBtn =
        document.getElementById("buyNowBtn");


    const cartMessage =
        document.getElementById("cartMessage");


    const cartCount =
        document.getElementById("cartCount");



    /* =========================================================
       VARIABLES
    ========================================================= */

    let currentProduct = null;

    let quantity = 1;



    /* =========================================================
       PRICE FORMAT
    ========================================================= */

    function formatPrice(price) {

        return (
            "Rs. " +
            Number(price).toLocaleString("en-PK")
        );

    }



    /* =========================================================
       GET CART
    ========================================================= */

    function getCart() {

        try {

            const cart =
                JSON.parse(
                    localStorage.getItem("sultanCart")
                );

            if (Array.isArray(cart)) {

                return cart;

            }

        } catch (error) {

        }

        return [];

    }



    /* =========================================================
       SAVE CART
    ========================================================= */

    function saveCart(cart) {

        localStorage.setItem(
            "sultanCart",
            JSON.stringify(cart)
        );

    }



    /* =========================================================
       UPDATE CART COUNT
    ========================================================= */

    function updateCartCount() {

        const cart = getCart();

        let count = 0;


        cart.forEach(function (item) {

            count +=
                Number(item.quantity) || 0;

        });


        if (cartCount) {

            cartCount.textContent = count;

        }

    }


    updateCartCount();



    /* =========================================================
       MEN / WOMEN FILTER
    ========================================================= */

    function filterProducts(gender) {


        gender =
            gender.toLowerCase();


        productCards.forEach(function (card) {


            const cardGender =
                (
                    card.dataset.gender ||
                    ""
                ).toLowerCase();


            /*
             * MEN CARD
             */

            if (cardGender === gender) {

                card.style.display = "";

            }


            /*
             * WOMEN CARD
             */

            else {

                card.style.display = "none";

            }

        });



        /* =====================================================
           ACTIVE BUTTON
        ===================================================== */

        genderButtons.forEach(function (button) {


            const buttonGender =
                (
                    button.dataset.gender ||
                    ""
                ).toLowerCase();


            if (
                buttonGender === gender
            ) {

                button.classList.add("active");

            }

            else {

                button.classList.remove("active");

            }

        });


        /*
         * Make sure browser scrolls back to
         * product area after switching.
         */

        const productsGrid =
            document.getElementById(
                "productsGrid"
            );


        if (productsGrid) {

            productsGrid.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }

    }



    /* =========================================================
       GENDER BUTTON EVENTS
    ========================================================= */

    genderButtons.forEach(function (button) {


        button.addEventListener(
            "click",
            function () {


                const gender =
                    this.dataset.gender;


                if (!gender) {

                    return;

                }


                filterProducts(
                    gender
                );

            }
        );

    });



    /* =========================================================
       DEFAULT = MEN
    ========================================================= */

    filterProducts("men");



    /* =========================================================
       GET PRODUCT DATA
       PRICE ALWAYS COMES FROM HTML DATA-PRICE
    ========================================================= */

    function getProductData(card) {


        let images = [];


        if (card.dataset.images) {

            images =
                card.dataset.images
                    .split("|")
                    .map(function (image) {

                        return image.trim();

                    })
                    .filter(function (image) {

                        return image !== "";

                    });

        }


        if (
            images.length === 0 &&
            card.dataset.image
        ) {

            images.push(
                card.dataset.image
            );

        }


        return {

            id:
                card.dataset.product ||
                "sultan-perfume",

            gender:
                card.dataset.gender ||
                "men",

            name:
                card.dataset.name ||
                "Sultan Perfume",

            collection:
                card.dataset.collection ||
                "SULTAN PERFUMES",

            /*
             * DYNAMIC PRICE
             * DIRECTLY FROM HTML DATA-PRICE
             */

            price:
                parsePrice(
                    card.dataset.price
                ),

            /*
             * OLD PRICE
             * DIRECTLY FROM HTML DATA-OLD-PRICE
             */

            oldPrice:
                parsePrice(
                    card.dataset.oldPrice
                ),

            image:
                card.dataset.image ||
                images[0] ||
                "",

            images:
                images,

            description:
                card.dataset.description ||
                ""

        };

    }



    /* =========================================================
       PARSE PRICE
    ========================================================= */

    function parsePrice(value) {

        if (!value) {

            return 0;

        }


        const cleaned =
            String(value).replace(
                /[^\d.]/g,
                ""
            );


        return Number(cleaned) || 0;

    }



    /* =========================================================
       OPEN PRODUCT
    ========================================================= */

    function openProduct(card) {


        currentProduct =
            getProductData(card);


        if (!currentProduct) {

            return;

        }


        quantity = 1;


        /* =====================================================
           QUANTITY RESET
        ===================================================== */

        if (quantityElement) {

            quantityElement.textContent =
                quantity;

        }



        /* =====================================================
           PRODUCT INFORMATION
        ===================================================== */

        if (modalCollection) {

            modalCollection.textContent =
                currentProduct.collection
                    .toUpperCase();

        }


        if (modalProductName) {

            modalProductName.textContent =
                currentProduct.name;

        }


        if (modalProductPrice) {

            /*
             * LATEST PRICE FROM HTML
             */

            modalProductPrice.textContent =
                formatPrice(
                    currentProduct.price
                );

        }


        if (modalProductDescription) {

            modalProductDescription.textContent =
                currentProduct.description;

        }



        /* =====================================================
           MAIN IMAGE
        ===================================================== */

        if (mainProductImage) {

            mainProductImage.src =
                currentProduct.images[0] ||
                currentProduct.image;

            mainProductImage.alt =
                currentProduct.name;

        }



        /* =====================================================
           THUMBNAILS
        ===================================================== */

        if (productThumbnails) {


            productThumbnails.innerHTML =
                "";


            currentProduct.images
                .slice(0, 4)
                .forEach(function (
                    image,
                    index
                ) {


                    const thumbnail =
                        document.createElement(
                            "button"
                        );


                    thumbnail.type =
                        "button";


                    thumbnail.className =
                        "thumbnail";


                    if (index === 0) {

                        thumbnail.classList.add(
                            "active"
                        );

                    }


                    const img =
                        document.createElement(
                            "img"
                        );


                    img.src =
                        image;


                    img.alt =
                        currentProduct.name;


                    thumbnail.appendChild(
                        img
                    );


                    thumbnail.addEventListener(
                        "click",
                        function () {


                            if (mainProductImage) {

                                mainProductImage.src =
                                    image;

                            }


                            productThumbnails
                                .querySelectorAll(
                                    ".thumbnail"
                                )
                                .forEach(
                                    function (
                                        item
                                    ) {

                                        item.classList.remove(
                                            "active"
                                        );

                                    }
                                );


                            thumbnail.classList.add(
                                "active"
                            );

                        }
                    );


                    productThumbnails.appendChild(
                        thumbnail
                    );

                });

        }



        /* =====================================================
           CLEAR MESSAGE
        ===================================================== */

        if (cartMessage) {

            cartMessage.textContent =
                "";

        }



        /* =====================================================
           SHOW MODAL
        ===================================================== */

        if (productModal) {

            productModal.classList.add(
                "show"
            );

        }


        document.body.style.overflow =
            "hidden";

    }



    /* =========================================================
       VIEW PRODUCT BUTTONS
    ========================================================= */

    productCards.forEach(function (card) {


        const viewButton =
            card.querySelector(
                ".view-product-btn"
            );


        if (!viewButton) {

            return;

        }


        viewButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                openProduct(card);

            }
        );

    });



    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    function closeProductModal() {


        if (productModal) {

            productModal.classList.remove(
                "show"
            );

        }


        document.body.style.overflow =
            "";

    }



    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeProductModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeProductModal
        );

    }



    /* =========================================================
       ESCAPE
    ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                productModal &&
                productModal.classList.contains(
                    "show"
                )
            ) {

                closeProductModal();

            }

        }
    );



    /* =========================================================
       PLUS
    ========================================================= */

    if (plusBtn) {

        plusBtn.addEventListener(
            "click",
            function () {


                if (quantity < 99) {

                    quantity++;

                }


                if (quantityElement) {

                    quantityElement.textContent =
                        quantity;

                }

            }
        );

    }



    /* =========================================================
       MINUS
    ========================================================= */

    if (minusBtn) {

        minusBtn.addEventListener(
            "click",
            function () {


                if (quantity > 1) {

                    quantity--;

                }


                if (quantityElement) {

                    quantityElement.textContent =
                        quantity;

                }

            }
        );

    }



    /* =========================================================
       ADD TO CART
       LATEST HTML PRICE IS USED
    ========================================================= */

    if (addToCartBtn) {

        addToCartBtn.addEventListener(
            "click",
            function () {


                if (!currentProduct) {

                    return;

                }


                /*
                 * CURRENT PRICE
                 * FROM HTML DATA-PRICE
                 */

                const latestPrice =
                    Number(
                        currentProduct.price
                    ) || 0;


                const latestOldPrice =
                    Number(
                        currentProduct.oldPrice
                    ) || 0;


                const cart =
                    getCart();


                const productId =
                    currentProduct.id +
                    "-" +
                    currentProduct.gender;


                const existing =
                    cart.find(
                        function (item) {

                            return (
                                item.id ===
                                productId
                            );

                        }
                    );


                if (existing) {

                    /*
                     * UPDATE EXISTING ITEM
                     * WITH LATEST HTML PRICE
                     */

                    existing.price =
                        latestPrice;


                    existing.oldPrice =
                        latestOldPrice;


                    existing.name =
                        currentProduct.name;


                    existing.collection =
                        currentProduct.collection;


                    existing.gender =
                        currentProduct.gender;


                    existing.image =
                        currentProduct.image;


                    existing.images =
                        currentProduct.images;


                    existing.description =
                        currentProduct.description;


                    existing.quantity +=
                        quantity;

                }

                else {

                    cart.push({

                        id:
                            productId,

                        productId:
                            currentProduct.id,

                        gender:
                            currentProduct.gender,

                        name:
                            currentProduct.name,

                        collection:
                            currentProduct.collection,

                        /*
                         * PRICE FROM HTML
                         */

                        price:
                            latestPrice,

                        oldPrice:
                            latestOldPrice,

                        image:
                            currentProduct.image,

                        images:
                            currentProduct.images,

                        description:
                            currentProduct.description,

                        quantity:
                            quantity

                    });

                }


                saveCart(cart);


                updateCartCount();


                /* =================================================
                   SUCCESS MESSAGE
                ================================================= */

                if (cartMessage) {

                    cartMessage.textContent =
                        "✓ PRODUCT ADDED TO YOUR CART";

                }


                setTimeout(
                    function () {

                        if (cartMessage) {

                            cartMessage.textContent =
                                "";

                        }

                    },
                    3000
                );

            }
        );

    }



    /* =========================================================
       BUY NOW
       LATEST HTML PRICE IS USED
    ========================================================= */

    if (buyNowBtn) {

        buyNowBtn.addEventListener(
            "click",
            function () {


                if (!currentProduct) {

                    return;

                }


                /*
                 * ALWAYS USE CURRENT HTML PRICE
                 */

                const latestPrice =
                    Number(
                        currentProduct.price
                    ) || 0;


                const latestOldPrice =
                    Number(
                        currentProduct.oldPrice
                    ) || 0;


                const checkoutProduct = {

                    id:
                        currentProduct.id +
                        "-" +
                        currentProduct.gender,

                    productId:
                        currentProduct.id,

                    gender:
                        currentProduct.gender,

                    name:
                        currentProduct.name,

                    collection:
                        currentProduct.collection,

                    /*
                     * PRICE FROM HTML
                     */

                    price:
                        latestPrice,

                    oldPrice:
                        latestOldPrice,

                    image:
                        currentProduct.image,

                    images:
                        currentProduct.images,

                    description:
                        currentProduct.description,

                    quantity:
                        quantity

                };


                saveCart([
                    checkoutProduct
                ]);


                updateCartCount();


                window.location.href =
                    "../checkout/checkout.html";

            }
        );

    }


});