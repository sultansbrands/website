document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       ELEMENTS
    ========================================== */

    const genderButtons =
        document.querySelectorAll(".gender-btn");

    const watchSections =
        document.querySelectorAll(".watch-section");

    const productCards =
        document.querySelectorAll(".watch-card");

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

    const minusBtn =
        document.getElementById("minusBtn");

    const plusBtn =
        document.getElementById("plusBtn");

    const quantityElement =
        document.getElementById("quantity");

    const addToCartBtn =
        document.getElementById("addToCartBtn");

    const buyNowBtn =
        document.getElementById("buyNowBtn");

    const cartMessage =
        document.getElementById("cartMessage");

    const cartCount =
        document.getElementById("cartCount");



    /* =========================================
       CURRENT PRODUCT
    ========================================== */

    let currentProduct = null;

    let quantity = 1;



    /* =========================================
       UPDATE CART COUNT
    ========================================== */

    function updateCartCount() {

        let cart =
            JSON.parse(
                localStorage.getItem("sultanCart")
            ) || [];

        let totalQuantity = 0;

        cart.forEach(function (item) {

            totalQuantity +=
                Number(item.quantity) || 0;

        });


        if (cartCount) {

            cartCount.textContent =
                totalQuantity;

        }

    }


    updateCartCount();



    /* =========================================
       MEN / WOMEN SELECTOR
    ========================================== */

    genderButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const gender =
                    this.dataset.gender;


                /* Buttons */

                genderButtons.forEach(function (btn) {

                    btn.classList.remove("active");

                });


                this.classList.add("active");


                /* Sections */

                watchSections.forEach(function (section) {

                    section.classList.remove(
                        "active-section"
                    );

                });


                const selectedSection =
                    document.getElementById(
                        gender + "Section"
                    );


                if (selectedSection) {

                    selectedSection.classList.add(
                        "active-section"
                    );

                }


                /* Scroll */

                document
                    .getElementById("collection")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });



    /* =========================================
       VIEW PRODUCT
    ========================================== */

    productCards.forEach(function (card) {

        const button =
            card.querySelector(
                ".view-product-btn"
            );


        if (!button) return;


        button.addEventListener(
            "click",
            function () {

                openProduct(card);

            }
        );

    });



    /* =========================================
       OPEN PRODUCT
    ========================================== */

    function openProduct(card) {

        const imagesString =
            card.dataset.images || "";


        const images =
            imagesString
                .split("|")
                .map(function (image) {

                    return image.trim();

                })
                .filter(Boolean);


        currentProduct = {

            id:
                card.dataset.product,

            name:
                card.dataset.name,

            collection:
                card.dataset.collection,

            price:
                Number(card.dataset.price),

            description:
                card.dataset.description,

            images:
                images

        };


        quantity = 1;

        quantityElement.textContent =
            quantity;


        modalCollection.textContent =
            currentProduct.collection;


        modalProductName.textContent =
            currentProduct.name;


        modalProductPrice.textContent =
            "Rs. " +
            currentProduct.price.toLocaleString();


        modalProductDescription.textContent =
            currentProduct.description;


        /* Main image */

        if (currentProduct.images.length > 0) {

            mainProductImage.src =
                currentProduct.images[0];

        }


        /* Thumbnails */

        productThumbnails.innerHTML = "";


        currentProduct.images
            .slice(0, 4)
            .forEach(function (image, index) {

                const thumbnail =
                    document.createElement("button");


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
                    document.createElement("img");


                img.src =
                    image;


                img.alt =
                    currentProduct.name +
                    " Image " +
                    (index + 1);


                thumbnail.appendChild(img);


                thumbnail.addEventListener(
                    "click",
                    function () {

                        mainProductImage.src =
                            image;


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


                        thumbnail.classList.add(
                            "active"
                        );

                    }
                );


                productThumbnails.appendChild(
                    thumbnail
                );

            });


        cartMessage.textContent =
            "";


        productModal.classList.add(
            "show"
        );


        document.body.style.overflow =
            "hidden";

    }



    /* =========================================
       CLOSE PRODUCT
    ========================================== */

    function closeProduct() {

        productModal.classList.remove(
            "show"
        );


        document.body.style.overflow =
            "";

    }


    closeModal.addEventListener(
        "click",
        closeProduct
    );


    modalOverlay.addEventListener(
        "click",
        closeProduct
    );



    /* =========================================
       ESC KEY
    ========================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                productModal.classList.contains(
                    "show"
                )
            ) {

                closeProduct();

            }

        }
    );



    /* =========================================
       QUANTITY MINUS
    ========================================== */

    minusBtn.addEventListener(
        "click",
        function () {

            if (quantity > 1) {

                quantity--;

                quantityElement.textContent =
                    quantity;

            }

        }
    );



    /* =========================================
       QUANTITY PLUS
    ========================================== */

    plusBtn.addEventListener(
        "click",
        function () {

            if (quantity < 20) {

                quantity++;

                quantityElement.textContent =
                    quantity;

            }

        }
    );



    /* =========================================
       ADD TO CART
    ========================================== */

    addToCartBtn.addEventListener(
        "click",
        function () {

            if (!currentProduct) return;


            let cart =
                JSON.parse(
                    localStorage.getItem(
                        "sultanCart"
                    )
                ) || [];


            const existingProduct =
                cart.find(function (item) {

                    return item.id ===
                        currentProduct.id;

                });


            if (existingProduct) {

                /* ALWAYS USE LATEST PRICE FROM HTML */
                existingProduct.price =
                    currentProduct.price;

                existingProduct.name =
                    currentProduct.name;

                existingProduct.collection =
                    currentProduct.collection;

                existingProduct.image =
                    currentProduct.images[0];

                existingProduct.description =
                    currentProduct.description;

                existingProduct.quantity +=
                    quantity;

            } else {

                cart.push({

                    id:
                        currentProduct.id,

                    name:
                        currentProduct.name,

                    collection:
                        currentProduct.collection,

                    price:
                        currentProduct.price,

                    image:
                        currentProduct.images[0],

                    quantity:
                        quantity,

                    description:
                        currentProduct.description

                });

            }


            localStorage.setItem(
                "sultanCart",
                JSON.stringify(cart)
            );


            updateCartCount();


            cartMessage.textContent =
                "PRODUCT ADDED TO CART ✓";


            setTimeout(
                function () {

                    cartMessage.textContent =
                        "";

                },
                2500
            );

        }
    );



    /* =========================================
       CHECKOUT NOW
    ========================================== */

    buyNowBtn.addEventListener(
        "click",
        function () {

            if (!currentProduct) return;


            let cart =
                JSON.parse(
                    localStorage.getItem(
                        "sultanCart"
                    )
                ) || [];


            const existingProduct =
                cart.find(function (item) {

                    return item.id ===
                        currentProduct.id;

                });


            if (existingProduct) {

                /* ALWAYS USE LATEST PRICE FROM HTML */
                existingProduct.price =
                    currentProduct.price;

                existingProduct.name =
                    currentProduct.name;

                existingProduct.collection =
                    currentProduct.collection;

                existingProduct.image =
                    currentProduct.images[0];

                existingProduct.description =
                    currentProduct.description;

                existingProduct.quantity +=
                    quantity;

            } else {

                cart.push({

                    id:
                        currentProduct.id,

                    name:
                        currentProduct.name,

                    collection:
                        currentProduct.collection,

                    price:
                        currentProduct.price,

                    image:
                        currentProduct.images[0],

                    quantity:
                        quantity,

                    description:
                        currentProduct.description

                });

            }


            localStorage.setItem(
                "sultanCart",
                JSON.stringify(cart)
            );


            window.location.href =
                "../cart/cart.html";

        }
    );

});