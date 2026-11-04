/* =========================================================
   SULTAN WEARS
   PRODUCT / MODAL / CART JAVASCRIPT
   DYNAMIC HTML PRICE SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const genderButtons =
        document.querySelectorAll(".gender-btn");

    const genderSections =
        document.querySelectorAll(".gender-section");

    const productModal =
        document.getElementById("productModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalOverlay =
        document.querySelector(".modal-overlay");

    const viewButtons =
        document.querySelectorAll(".view-product-btn");

    const productCards =
        document.querySelectorAll(".product-card");

    const mainProductImage =
        document.getElementById("mainProductImage");

    const thumbnails =
        document.getElementById("thumbnails");

    const detailCollection =
        document.getElementById("detailCollection");

    const detailName =
        document.getElementById("detailName");

    const detailPrice =
        document.getElementById("detailPrice");

    const detailOldPrice =
        document.getElementById("detailOldPrice");

    const detailDescription =
        document.getElementById("detailDescription");

    const detailFabric =
        document.getElementById("detailFabric");

    const detailFit =
        document.getElementById("detailFit");

    const detailStyle =
        document.getElementById("detailStyle");

    const detailInfoCollection =
        document.getElementById("detailInfoCollection");

    const plusBtn =
        document.getElementById("plusBtn");

    const minusBtn =
        document.getElementById("minusBtn");

    const quantityElement =
        document.getElementById("quantity");

    const sizeButtons =
        document.querySelectorAll(".size-btn");

    const addToCartBtn =
        document.getElementById("addToCartBtn");

    const buyNowBtn =
        document.getElementById("buyNowBtn");

    const cartMessage =
        document.getElementById("cartMessage");

    const cartCount =
        document.getElementById("cartCount");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let currentProduct = null;

    let quantity = 1;

    let selectedSize = "M";


    /* =====================================================
       FORMAT PRICE
    ===================================================== */

    function formatPrice(price) {

        return "Rs. " +
            Number(price).toLocaleString("en-PK");

    }


    /* =====================================================
       GET CART
    ===================================================== */

    function getCart() {

        try {

            const cart =
                JSON.parse(
                    localStorage.getItem("sultanCart")
                );

            return Array.isArray(cart)
                ? cart
                : [];

        } catch (error) {

            return [];

        }

    }


    /* =====================================================
       SAVE CART
    ===================================================== */

    function saveCart(cart) {

        localStorage.setItem(
            "sultanCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       CART COUNT
    ===================================================== */

    function updateCartCount() {

        const cart = getCart();

        let count = 0;

        cart.forEach(function (item) {

            count += Number(item.quantity) || 0;

        });

        if (cartCount) {

            cartCount.textContent = count;

        }

    }


    /* =====================================================
       GET PRODUCT DATA FROM HTML
    ===================================================== */

    function getProductFromCard(card) {

        if (!card) {

            return null;

        }

        const imageElement =
            card.querySelector(".product-image img");


        /* -----------------------------------------------
           DATA IMAGES
        ------------------------------------------------ */

        const imagesData =
            card.dataset.images || "";


        let images =
            imagesData
                .split("|")
                .map(function (image) {

                    return image.trim();

                })
                .filter(function (image) {

                    return image !== "";

                });


        /* -----------------------------------------------
           FALLBACK IMAGE
        ------------------------------------------------ */

        if (
            images.length === 0 &&
            imageElement
        ) {

            images.push(
                imageElement.getAttribute("src")
            );

        }


        /* -----------------------------------------------
           PRODUCT DATA
           PRICE ALWAYS COMES FROM HTML
        ------------------------------------------------ */

        const product = {

            id:
                card.dataset.product || "",

            name:
                card.dataset.name ||
                card.querySelector("h2")?.textContent.trim() ||
                "Sultan Wears Product",

            collection:
                card.dataset.collection ||
                card.querySelector(".product-collection")?.textContent.trim() ||
                "ROYAL COLLECTION",

            price:
                parsePrice(
                    card.dataset.price ||
                    card.querySelector(".product-price")?.textContent
                ),

            oldPrice:
                parsePrice(
                    card.dataset.oldPrice
                ),

            description:
                card.dataset.description ||
                card.querySelector(".product-description")?.textContent.trim() ||
                "A premium Sultan Wears product crafted for timeless royal elegance.",

            fabric:
                card.dataset.fabric ||
                getMetaValue(card, 0) ||
                "Premium Fabric",

            fit:
                card.dataset.fit ||
                getMetaValue(card, 1) ||
                "Royal Fit",

            style:
                card.dataset.style ||
                getMetaValue(card, 2) ||
                "Classic",

            image:
                imageElement
                    ? imageElement.getAttribute("src")
                    : images[0],

            images:
                images

        };


        return product;

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
       GET PRODUCT META
    ===================================================== */

    function getMetaValue(card, index) {

        const metaItems =
            card.querySelectorAll(
                ".product-meta span"
            );

        if (
            metaItems[index]
        ) {

            return metaItems[index]
                .textContent
                .trim();

        }

        return "";

    }


    /* =====================================================
       OPEN PRODUCT
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


        quantity = 1;

        selectedSize = "M";


        /* -----------------------------------------------
           PRODUCT INFORMATION
        ------------------------------------------------ */

        if (detailCollection) {

            detailCollection.textContent =
                currentProduct.collection;

        }


        if (detailName) {

            detailName.textContent =
                currentProduct.name;

        }


        if (detailPrice) {

            detailPrice.textContent =
                formatPrice(
                    currentProduct.price
                );

        }


        if (detailOldPrice) {

            if (
                currentProduct.oldPrice > 0 &&
                currentProduct.oldPrice >
                currentProduct.price
            ) {

                detailOldPrice.textContent =
                    formatPrice(
                        currentProduct.oldPrice
                    );

                detailOldPrice.style.display =
                    "inline";

            } else {

                detailOldPrice.textContent =
                    "";

                detailOldPrice.style.display =
                    "none";

            }

        }


        if (detailDescription) {

            detailDescription.textContent =
                currentProduct.description;

        }


        if (detailFabric) {

            detailFabric.textContent =
                currentProduct.fabric;

        }


        if (detailFit) {

            detailFit.textContent =
                currentProduct.fit;

        }


        if (detailStyle) {

            detailStyle.textContent =
                currentProduct.style;

        }


        if (detailInfoCollection) {

            detailInfoCollection.textContent =
                currentProduct.collection;

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
           CREATE THUMBNAILS
        ------------------------------------------------ */

        createThumbnails();


        /* -----------------------------------------------
           QUANTITY
        ------------------------------------------------ */

        if (quantityElement) {

            quantityElement.textContent =
                quantity;

        }


        /* -----------------------------------------------
           SIZE
        ------------------------------------------------ */

        sizeButtons.forEach(function (button) {

            button.classList.remove("active");

            if (
                button.dataset.size === "M"
            ) {

                button.classList.add("active");

            }

        });


        /* -----------------------------------------------
           MESSAGE
        ------------------------------------------------ */

        if (cartMessage) {

            cartMessage.textContent = "";

        }


        /* -----------------------------------------------
           SHOW MODAL
        ------------------------------------------------ */

        if (productModal) {

            productModal.classList.add("show");

        }

        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CREATE THUMBNAILS
    ===================================================== */

    function createThumbnails() {

        if (!thumbnails) {

            return;

        }

        thumbnails.innerHTML = "";


        if (
            !currentProduct ||
            !currentProduct.images ||
            currentProduct.images.length === 0
        ) {

            return;

        }


        currentProduct.images.forEach(
            function (image, index) {

                const button =
                    document.createElement("button");


                button.type = "button";

                button.className =
                    "thumbnail";


                if (index === 0) {

                    button.classList.add("active");

                }


                const img =
                    document.createElement("img");


                img.src = image;

                img.alt =
                    currentProduct.name +
                    " Image " +
                    (index + 1);


                button.appendChild(img);


                button.addEventListener(
                    "click",
                    function () {

                        if (mainProductImage) {

                            mainProductImage.src =
                                image;

                        }


                        document
                            .querySelectorAll(
                                ".thumbnail"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );

                    }
                );


                thumbnails.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       VIEW PRODUCT BUTTONS
    ===================================================== */

    viewButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const card =
                        button.closest(
                            ".product-card"
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
        function (card) {

            card.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest(
                            ".view-product-btn"
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
       MEN / WOMEN SWITCH
    ===================================================== */

    genderButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const gender =
                        this.dataset.gender;


                    genderButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    genderSections.forEach(
                        function (section) {

                            section.classList.remove(
                                "active"
                            );

                        }
                    );


                    if (
                        gender === "men"
                    ) {

                        const menSection =
                            document.getElementById(
                                "menSection"
                            );

                        if (menSection) {

                            menSection.classList.add(
                                "active"
                            );

                        }

                    }


                    if (
                        gender === "women"
                    ) {

                        const womenSection =
                            document.getElementById(
                                "womenSection"
                            );

                        if (womenSection) {

                            womenSection.classList.add(
                                "active"
                            );

                        }

                    }


                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                }
            );

        }
    );


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeModal() {

        if (productModal) {

            productModal.classList.remove(
                "show"
            );

        }

        document.body.style.overflow =
            "";

        currentProduct = null;

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );

    }


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
        function (event) {

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
       QUANTITY PLUS
    ===================================================== */

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


    /* =====================================================
       QUANTITY MINUS
    ===================================================== */

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


    /* =====================================================
       SIZE SELECTION
    ===================================================== */

    sizeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    sizeButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    this.classList.add(
                        "active"
                    );


                    selectedSize =
                        this.dataset.size;

                }
            );

        }
    );


    /* =====================================================
       ADD TO CART
    ===================================================== */

    if (addToCartBtn) {

        addToCartBtn.addEventListener(
            "click",
            function () {

                if (!currentProduct) {

                    return;

                }


                /*
                   IMPORTANT:
                   Current product price is already
                   taken directly from HTML data-price.
                */

                const latestPrice =
                    Number(currentProduct.price) || 0;


                const cart =
                    getCart();


                const productId =
                    currentProduct.id +
                    "-" +
                    selectedSize;


                const existingProduct =
                    cart.find(
                        function (item) {

                            return item.id ===
                                productId;

                        }
                    );


                if (existingProduct) {

                    /*
                       UPDATE EXISTING CART ITEM
                       WITH LATEST HTML PRICE
                    */

                    existingProduct.price =
                        latestPrice;

                    existingProduct.oldPrice =
                        currentProduct.oldPrice;

                    existingProduct.name =
                        currentProduct.name;

                    existingProduct.collection =
                        currentProduct.collection;

                    existingProduct.description =
                        currentProduct.description;

                    existingProduct.image =
                        currentProduct.image;

                    existingProduct.images =
                        currentProduct.images;

                    existingProduct.fabric =
                        currentProduct.fabric;

                    existingProduct.fit =
                        currentProduct.fit;

                    existingProduct.style =
                        currentProduct.style;

                    existingProduct.quantity +=
                        quantity;

                } else {

                    cart.push({

                        id:
                            productId,

                        productId:
                            currentProduct.id,

                        name:
                            currentProduct.name,

                        collection:
                            currentProduct.collection,

                        /*
                           LATEST PRICE FROM HTML
                        */

                        price:
                            latestPrice,

                        oldPrice:
                            currentProduct.oldPrice,

                        quantity:
                            quantity,

                        image:
                            currentProduct.image,

                        images:
                            currentProduct.images,

                        description:
                            currentProduct.description,

                        fabric:
                            currentProduct.fabric,

                        fit:
                            currentProduct.fit,

                        style:
                            currentProduct.style,

                        size:
                            selectedSize

                    });

                }


                saveCart(cart);

                updateCartCount();


                /* ---------------------------------------
                   SUCCESS MESSAGE
                ---------------------------------------- */

                if (cartMessage) {

                    cartMessage.textContent =
                        "✓ PRODUCT ADDED TO YOUR CART";

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

            }
        );

    }


    /* =====================================================
       CHECKOUT NOW
    ===================================================== */

    if (buyNowBtn) {

        buyNowBtn.addEventListener(
            "click",
            function () {

                if (!currentProduct) {

                    return;

                }


                /*
                   ALWAYS USE CURRENT HTML PRICE
                */

                const latestPrice =
                    Number(currentProduct.price) || 0;


                const checkoutProduct = {

                    id:
                        currentProduct.id +
                        "-" +
                        selectedSize,

                    productId:
                        currentProduct.id,

                    name:
                        currentProduct.name,

                    collection:
                        currentProduct.collection,

                    /*
                       LATEST PRICE FROM HTML
                    */

                    price:
                        latestPrice,

                    oldPrice:
                        currentProduct.oldPrice,

                    quantity:
                        quantity,

                    image:
                        currentProduct.image,

                    images:
                        currentProduct.images,

                    description:
                        currentProduct.description,

                    fabric:
                        currentProduct.fabric,

                    fit:
                        currentProduct.fit,

                    style:
                        currentProduct.style,

                    size:
                        selectedSize

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


    /* =====================================================
       INITIAL CART COUNT
    ===================================================== */

    updateCartCount();

});


















