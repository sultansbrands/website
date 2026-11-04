/* =========================================================
   SULTAN'S COSMETICS
   PRODUCT / MODAL / CART JAVASCRIPT
   DYNAMIC HTML PRICE SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const productModal = document.getElementById("productModal");
    const modalOverlay = document.querySelector(".modal-overlay");
    const closeModalBtn = document.getElementById("closeModal");

    const mainProductImage = document.getElementById("mainProductImage");
    const productThumbnails = document.getElementById("productThumbnails");

    const modalCollection = document.getElementById("modalCollection");
    const modalProductName = document.getElementById("modalProductName");
    const modalProductPrice = document.getElementById("modalProductPrice");
    const modalProductDescription = document.getElementById("modalProductDescription");

    const quantityElement = document.getElementById("quantity");
    const minusBtn = document.getElementById("minusBtn");
    const plusBtn = document.getElementById("plusBtn");

    const addToCartBtn = document.getElementById("addToCartBtn");
    const buyNowBtn = document.getElementById("buyNowBtn");

    const cartMessage = document.getElementById("cartMessage");
    const cartCount = document.getElementById("cartCount");

    const productCards = document.querySelectorAll(".product-card");
    const viewProductButtons = document.querySelectorAll(".view-product");


    /* =====================================================
       CURRENT PRODUCT
    ===================================================== */

    let currentProduct = null;
    let currentQuantity = 1;


    /* =====================================================
       PRICE FORMAT
    ===================================================== */

    function formatPrice(price) {

        return (
            "Rs. " +
            Number(price).toLocaleString("en-PK")
        );

    }


    /* =====================================================
       CART
    ===================================================== */

    function getCart() {

        try {

            const cart = JSON.parse(
                localStorage.getItem("sultanCart")
            );

            return Array.isArray(cart) ? cart : [];

        } catch (error) {

            return [];

        }

    }


    function saveCart(cart) {

        localStorage.setItem(
            "sultanCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    function updateCartCount() {

        const cart = getCart();

        let totalItems = 0;

        cart.forEach(item => {

            totalItems += Number(item.quantity) || 0;

        });

        if (cartCount) {

            cartCount.textContent = totalItems;

        }

    }


    /* =====================================================
       PARSE IMAGES
    ===================================================== */

    function getProductImages(card) {

        const imagesData = card.dataset.images || "";

        const images = imagesData
            .split("|")
            .map(image => image.trim())
            .filter(image => image !== "");

        return images;

    }


    /* =====================================================
       GET PRODUCT DATA
       PRICE COMES DIRECTLY FROM HTML
    ===================================================== */

    function getProductFromCard(card) {

        if (!card) {

            return null;

        }

        const imageElement =
            card.querySelector(".product-image img");

        const images =
            getProductImages(card);


        if (
            images.length === 0 &&
            imageElement
        ) {

            images.push(
                imageElement.getAttribute("src")
            );

        }


        return {

            id:
                card.dataset.product || "",

            name:
                card.dataset.name ||
                card.querySelector("h3")?.textContent.trim() ||
                "Sultan Cosmetics Product",

            collection:
                card.dataset.collection ||
                card.querySelector(".product-info span")?.textContent.trim() ||
                "ROYAL COLLECTION",

            /*
             * DYNAMIC PRICE
             * ALWAYS READ FROM HTML DATA-PRICE
             */

            price:
                parsePrice(
                    card.dataset.price
                ),

            /*
             * DYNAMIC OLD PRICE
             * READ FROM HTML DATA-OLD-PRICE
             */

            oldPrice:
                parsePrice(
                    card.dataset.oldPrice
                ),

            description:
                card.dataset.description ||
                "A premium Sultan's Cosmetics product crafted for a luxurious beauty experience.",

            image:
                imageElement
                    ? imageElement.getAttribute("src")
                    : images[0],

            images:
                images

        };

    }


    /* =====================================================
       PARSE PRICE
    ===================================================== */

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


    /* =====================================================
       EXTRACT PRICE
       FALLBACK FOR VISIBLE PRODUCT PRICE
    ===================================================== */

    function extractPrice(priceText) {

        if (!priceText) {

            return 0;

        }


        const number =
            String(priceText).replace(
                /[^\d.]/g,
                ""
            );


        return Number(number) || 0;

    }


    /* =====================================================
       OPEN PRODUCT MODAL
    ===================================================== */

    function openProduct(card) {

        if (!card) {

            return;

        }


        currentProduct =
            getProductFromCard(card);


        if (!currentProduct) {

            return;

        }


        currentQuantity = 1;


        /* -----------------------------------------------
           PRODUCT DETAILS
        ------------------------------------------------ */

        if (modalCollection) {

            modalCollection.textContent =
                currentProduct.collection;

        }


        if (modalProductName) {

            modalProductName.textContent =
                currentProduct.name;

        }


        if (modalProductPrice) {

            /*
             * LATEST PRICE FROM HTML DATA-PRICE
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


        if (quantityElement) {

            quantityElement.textContent =
                currentQuantity;

        }


        /* -----------------------------------------------
           MAIN IMAGE
        ------------------------------------------------ */

        if (mainProductImage) {

            mainProductImage.src =
                currentProduct.images[0] ||
                currentProduct.image;

            mainProductImage.alt =
                currentProduct.name;

        }


        /* -----------------------------------------------
           THUMBNAILS
        ------------------------------------------------ */

        createThumbnails();


        /* -----------------------------------------------
           CART MESSAGE
        ------------------------------------------------ */

        if (cartMessage) {

            cartMessage.textContent = "";

        }


        /* -----------------------------------------------
           SHOW MODAL
        ------------------------------------------------ */

        if (productModal) {

            productModal.classList.add("show");

            document.body.classList.add("modal-open");

        }

    }


    /* =====================================================
       CREATE THUMBNAILS
    ===================================================== */

    function createThumbnails() {

        if (!productThumbnails) {

            return;

        }


        productThumbnails.innerHTML = "";


        if (!currentProduct) {

            return;

        }


        currentProduct.images.forEach(
            (image, index) => {

                const thumbnail =
                    document.createElement("button");


                thumbnail.type = "button";

                thumbnail.className = "thumbnail";


                if (index === 0) {

                    thumbnail.classList.add(
                        "active"
                    );

                }


                const img =
                    document.createElement("img");


                img.src = image;

                img.alt =
                    currentProduct.name +
                    " view " +
                    (index + 1);


                thumbnail.appendChild(img);


                thumbnail.addEventListener(
                    "click",
                    () => {

                        changeMainImage(
                            image
                        );


                        productThumbnails
                            .querySelectorAll(
                                ".thumbnail"
                            )
                            .forEach(
                                item => {

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

            }
        );

    }


    /* =====================================================
       CHANGE MAIN IMAGE
    ===================================================== */

    function changeMainImage(image) {

        if (!mainProductImage) {

            return;

        }


        mainProductImage.style.opacity =
            "0.4";


        setTimeout(() => {

            mainProductImage.src =
                image;

            mainProductImage.style.opacity =
                "1";

        }, 100);

    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeModal() {

        if (productModal) {

            productModal.classList.remove(
                "show"
            );

        }


        document.body.classList.remove(
            "modal-open"
        );


        currentProduct = null;

        currentQuantity = 1;

    }


    /* =====================================================
       QUANTITY -
    ===================================================== */

    if (minusBtn) {

        minusBtn.addEventListener(
            "click",
            () => {

                if (currentQuantity > 1) {

                    currentQuantity--;

                    if (quantityElement) {

                        quantityElement.textContent =
                            currentQuantity;

                    }

                }

            }
        );

    }


    /* =====================================================
       QUANTITY +
    ===================================================== */

    if (plusBtn) {

        plusBtn.addEventListener(
            "click",
            () => {

                if (currentQuantity < 99) {

                    currentQuantity++;

                    if (quantityElement) {

                        quantityElement.textContent =
                            currentQuantity;

                    }

                }

            }
        );

    }


    /* =====================================================
       ADD TO CART
       LATEST HTML PRICE
    ===================================================== */

    if (addToCartBtn) {

        addToCartBtn.addEventListener(
            "click",
            () => {

                if (!currentProduct) {

                    return;

                }


                /*
                 * CURRENT PRICE IS TAKEN
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


                const existingProduct =
                    cart.find(
                        item =>
                            item.id ===
                            currentProduct.id
                    );


                if (existingProduct) {

                    /*
                     * UPDATE EXISTING PRODUCT
                     * TO LATEST HTML PRICE
                     */

                    existingProduct.price =
                        latestPrice;


                    existingProduct.oldPrice =
                        latestOldPrice;


                    existingProduct.name =
                        currentProduct.name;


                    existingProduct.collection =
                        currentProduct.collection;


                    existingProduct.image =
                        currentProduct.image;


                    existingProduct.images =
                        currentProduct.images;


                    existingProduct.description =
                        currentProduct.description;


                    existingProduct.quantity +=
                        currentQuantity;

                } else {

                    cart.push({

                        id:
                            currentProduct.id,

                        productId:
                            currentProduct.id,

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
                            currentQuantity

                    });

                }


                saveCart(cart);

                updateCartCount();


                /* -------------------------------------------
                   SUCCESS MESSAGE
                -------------------------------------------- */

                if (cartMessage) {

                    cartMessage.textContent =
                        "✓ Product added to cart successfully.";

                    cartMessage.style.opacity =
                        "1";


                    setTimeout(() => {

                        if (cartMessage) {

                            cartMessage.textContent =
                                "";

                        }

                    }, 2500);

                }

            }
        );

    }


    /* =====================================================
       CHECKOUT NOW
       LATEST HTML PRICE
    ===================================================== */

    if (buyNowBtn) {

        buyNowBtn.addEventListener(
            "click",
            () => {

                if (!currentProduct) {

                    return;

                }


                /*
                 * ALWAYS USE CURRENT
                 * HTML DATA-PRICE
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
                        currentProduct.id,

                    productId:
                        currentProduct.id,

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
                        currentQuantity

                };


                /*
                 * BUY NOW SHOULD CHECKOUT
                 * ONLY THIS PRODUCT
                 */

                saveCart([
                    checkoutProduct
                ]);


                updateCartCount();


                /* -------------------------------------------
                   GO TO CHECKOUT
                -------------------------------------------- */

                window.location.href =
                    "../checkout/checkout.html";

            }
        );

    }


    /* =====================================================
       VIEW PRODUCT BUTTONS
    ===================================================== */

    viewProductButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const productId =
                        button.dataset.product;


                    const card =
                        document.querySelector(
                            `.product-card[data-product="${productId}"]`
                        );


                    openProduct(card);

                }
            );

        }
    );


    /* =====================================================
       PRODUCT CARD CLICK
    ===================================================== */

    productCards.forEach(
        card => {

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".view-product"
                        )
                    ) {

                        return;

                    }


                    openProduct(card);

                }
            );

        }
    );


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       OVERLAY CLICK
    ===================================================== */

    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                productModal &&
                productModal.classList.contains(
                    "show"
                )
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       PREVENT MODAL CONTENT CLICK
       FROM CLOSING
    ===================================================== */

    const modalContent =
        document.querySelector(
            ".modal-content"
        );


    if (modalContent) {

        modalContent.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );

    }


    /* =====================================================
       IMAGE ERROR HANDLING
    ===================================================== */

    if (mainProductImage) {

        mainProductImage.addEventListener(
            "error",
            () => {

                mainProductImage.style.display =
                    "none";

            }
        );

    }


    /* =====================================================
       INITIAL CART COUNT
    ===================================================== */

    updateCartCount();

});