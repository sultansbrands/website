document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const productCards =
            document.querySelectorAll(
                ".product-card"
            );


        const productModal =
            document.getElementById(
                "productModal"
            );


        const modalOverlay =
            document.getElementById(
                "modalOverlay"
            );


        const closeModal =
            document.getElementById(
                "closeModal"
            );


        const mainProductImage =
            document.getElementById(
                "mainProductImage"
            );


        const productThumbnails =
            document.getElementById(
                "productThumbnails"
            );


        const modalCollection =
            document.getElementById(
                "modalCollection"
            );


        const modalProductName =
            document.getElementById(
                "modalProductName"
            );


        const modalProductPrice =
            document.getElementById(
                "modalProductPrice"
            );


        const modalProductDescription =
            document.getElementById(
                "modalProductDescription"
            );


        const quantityElement =
            document.getElementById(
                "quantity"
            );


        const minusBtn =
            document.getElementById(
                "minusBtn"
            );


        const plusBtn =
            document.getElementById(
                "plusBtn"
            );


        const addToCartBtn =
            document.getElementById(
                "addToCartBtn"
            );


        const buyNowBtn =
            document.getElementById(
                "buyNowBtn"
            );


        const cartMessage =
            document.getElementById(
                "cartMessage"
            );


        const cartCount =
            document.getElementById(
                "cartCount"
            );



        /* =====================================================
           CURRENT PRODUCT
        ===================================================== */

        let selectedProduct = null;

        let quantity = 1;



        /* =====================================================
           FORMAT PRICE
        ===================================================== */

        function formatPrice(amount) {

            return (
                "Rs. " +
                (
                    Number(amount) || 0
                ).toLocaleString("en-PK")
            );

        }



        /* =====================================================
           GET CART
        ===================================================== */

        function getCart() {

            try {

                const savedCart =
                    localStorage.getItem(
                        "sultanCart"
                    );


                if (!savedCart) {

                    return [];

                }


                const cart =
                    JSON.parse(
                        savedCart
                    );


                if (
                    !Array.isArray(cart)
                ) {

                    return [];

                }


                return cart;

            } catch (error) {

                console.error(
                    "Cart error:",
                    error
                );

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
           UPDATE CART COUNT
        ===================================================== */

        function updateCartCount() {

            const cart =
                getCart();


            let count = 0;


            cart.forEach(
                function (item) {

                    count +=
                        Number(
                            item.quantity
                        ) || 0;

                }
            );


            if (cartCount) {

                cartCount.textContent =
                    count;

            }

        }



        /* =====================================================
           CREATE PRODUCT OBJECT FROM HTML CARD
        ===================================================== */

        function getProductFromCard(card) {

            const imageString =
                card.dataset.images ||
                card.dataset.image ||
                "";


            const images =
                imageString
                    .split("|")
                    .map(
                        function (image) {

                            return image.trim();

                        }
                    )
                    .filter(
                        function (image) {

                            return image !== "";

                        }
                    );


            const mainImage =
                card.querySelector(
                    ".product-image img"
                );


            return {

                id:
                    card.dataset.product ||
                    "restaurant-product",

                name:
                    card.dataset.name ||
                    "Sultan Product",

                collection:
                    card.dataset.collection ||
                    "SULTAN'S MENU",

                price:
                    Number(
                        card.dataset.price
                    ) || 0,

                description:
                    card.dataset.description ||
                    "",

                image:
                    (
                        images[0] ||
                        (
                            mainImage
                                ? mainImage.src
                                : ""
                        )
                    ),

                images:
                    images

            };

        }



        /* =====================================================
           OPEN PRODUCT
        ===================================================== */

        function openProduct(product) {

            selectedProduct =
                product;


            quantity = 1;


            /* ================================================
               QUANTITY RESET
            ================================================= */

            if (quantityElement) {

                quantityElement.textContent =
                    quantity;

            }



            /* ================================================
               PRODUCT DETAILS
            ================================================= */

            if (modalCollection) {

                modalCollection.textContent =
                    product.collection
                        .toUpperCase();

            }


            if (modalProductName) {

                modalProductName.textContent =
                    product.name;

            }


            if (modalProductPrice) {

                modalProductPrice.textContent =
                    formatPrice(
                        product.price
                    );

            }


            if (modalProductDescription) {

                modalProductDescription.textContent =
                    product.description;

            }



            /* ================================================
               MAIN IMAGE
            ================================================= */

            const images =
                product.images.length
                    ? product.images
                    : [product.image];


            if (mainProductImage) {

                mainProductImage.src =
                    images[0];

                mainProductImage.alt =
                    product.name;

            }



            /* ================================================
               THUMBNAILS
            ================================================= */

            if (productThumbnails) {

                productThumbnails.innerHTML =
                    "";


                images.forEach(
                    function (
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


                        const thumbnailImage =
                            document.createElement(
                                "img"
                            );


                        thumbnailImage.src =
                            image;


                        thumbnailImage.alt =
                            product.name +
                            " Image " +
                            (
                                index + 1
                            );


                        thumbnail.appendChild(
                            thumbnailImage
                        );



                        /* =================================
                           THUMBNAIL CLICK
                        ================================= */

                        thumbnail.addEventListener(
                            "click",
                            function () {


                                if (
                                    mainProductImage
                                ) {

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

                    }
                );

            }



            /* ================================================
               CLEAR MESSAGE
            ================================================= */

            if (cartMessage) {

                cartMessage.textContent =
                    "";

            }



            /* ================================================
               SHOW MODAL
            ================================================= */

            if (productModal) {

                productModal.classList.add(
                    "show"
                );

            }


            document.body.style.overflow =
                "hidden";


            window.scrollTo({

                top: 0

            });

        }



        /* =====================================================
           VIEW PRODUCT BUTTONS
        ===================================================== */

        productCards.forEach(
            function (card) {


                const viewButton =
                    card.querySelector(
                        ".view-product"
                    );


                if (!viewButton) {

                    return;

                }


                viewButton.addEventListener(
                    "click",
                    function (event) {


                        event.preventDefault();


                        const product =
                            getProductFromCard(
                                card
                            );


                        openProduct(
                            product
                        );

                    }
                );

            }
        );



        /* =====================================================
           CLOSE MODAL FUNCTION
        ===================================================== */

        function closeProduct() {

            if (productModal) {

                productModal.classList.remove(
                    "show"
                );

            }


            document.body.style.overflow =
                "";

        }



        /* =====================================================
           CLOSE BUTTON
        ===================================================== */

        if (closeModal) {

            closeModal.addEventListener(
                "click",
                closeProduct
            );

        }



        /* =====================================================
           OVERLAY CLICK
        ===================================================== */

        if (modalOverlay) {

            modalOverlay.addEventListener(
                "click",
                closeProduct
            );

        }



        /* =====================================================
           ESCAPE KEY
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeProduct();

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


                    quantity++;


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


                    if (
                        quantity > 1
                    ) {

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
           ADD TO CART
        ===================================================== */

        function addSelectedProductToCart() {

            if (!selectedProduct) {

                return false;

            }


            const cart =
                getCart();


            const existingProduct =
                cart.find(
                    function (item) {

                        return (
                            item.id ===
                            selectedProduct.id
                        );

                    }
                );


            if (existingProduct) {

                existingProduct.quantity +=
                    quantity;

            } else {

                cart.push({

                    id:
                        selectedProduct.id,

                    productId:
                        selectedProduct.id,

                    name:
                        selectedProduct.name,

                    collection:
                        selectedProduct.collection,

                    price:
                        selectedProduct.price,

                    image:
                        selectedProduct.image,

                    images:
                        selectedProduct.images,

                    description:
                        selectedProduct.description,

                    quantity:
                        quantity

                });

            }


            saveCart(
                cart
            );


            updateCartCount();


            return true;

        }



        /* =====================================================
           ADD TO CART BUTTON
        ===================================================== */

        if (addToCartBtn) {

            addToCartBtn.addEventListener(
                "click",
                function () {


                    const added =
                        addSelectedProductToCart();


                    if (
                        !added
                    ) {

                        return;

                    }


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



        /* =====================================================
           CHECKOUT NOW
        ===================================================== */

        if (buyNowBtn) {

            buyNowBtn.addEventListener(
                "click",
                function () {


                    if (!selectedProduct) {

                        return;

                    }


                    const checkoutProduct = {

                        id:
                            selectedProduct.id,

                        productId:
                            selectedProduct.id,

                        name:
                            selectedProduct.name,

                        collection:
                            selectedProduct.collection,

                        price:
                            selectedProduct.price,

                        image:
                            selectedProduct.image,

                        images:
                            selectedProduct.images,

                        description:
                            selectedProduct.description,

                        quantity:
                            quantity

                    };


                    localStorage.setItem(

                        "sultanCart",

                        JSON.stringify([
                            checkoutProduct
                        ])

                    );


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


    }
);