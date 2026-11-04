document.addEventListener("DOMContentLoaded", function () {


    /* =========================
       PRODUCT INFORMATION
    ========================= */

    const product = {

        id: "sultan-emerald-royal",

        name: "Sultan Emerald Royal",

        collection: "Royal Collection",

        price: 24999,

        image:
            "../img/watches/sultan-emerald-royal-01.jpg",

        description:
            "A refined automatic timepiece created for those who appreciate timeless elegance.",

        quantity: 1

    };



    /* =========================
       ELEMENTS
    ========================= */

    const mainImage =
        document.getElementById("mainProductImage");


    const thumbnails =
        document.querySelectorAll(".thumbnail");


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



    /* =========================
       CART COUNT
    ========================= */

    function updateCartCount() {

        const cart =
            JSON.parse(
                localStorage.getItem("sultanCart")
            ) || [];


        let count = 0;


        cart.forEach(item => {

            count += Number(item.quantity) || 0;

        });


        if (cartCount) {

            cartCount.textContent = count;

        }

    }


    updateCartCount();



    /* =========================
       IMAGE GALLERY
    ========================= */

    thumbnails.forEach(thumbnail => {

        thumbnail.addEventListener("click", function () {

            const image =
                this.getAttribute("data-image");


            if (mainImage) {

                mainImage.src = image;

            }


            thumbnails.forEach(item => {

                item.classList.remove("active");

            });


            this.classList.add("active");

        });

    });



    /* =========================
       QUANTITY
    ========================= */

    let quantity = 1;


    if (plusBtn) {

        plusBtn.addEventListener("click", function () {

            quantity++;

            quantityElement.textContent = quantity;

        });

    }


    if (minusBtn) {

        minusBtn.addEventListener("click", function () {

            if (quantity > 1) {

                quantity--;

            }

            quantityElement.textContent = quantity;

        });

    }



    /* =========================
       ADD TO CART
    ========================= */

    if (addToCartBtn) {

        addToCartBtn.addEventListener("click", function () {


            let cart =
                JSON.parse(
                    localStorage.getItem("sultanCart")
                ) || [];


            const existingProduct =
                cart.find(
                    item => item.id === product.id
                );


            if (existingProduct) {

                existingProduct.quantity += quantity;

            } else {

                cart.push({

                    ...product,

                    quantity: quantity

                });

            }


            localStorage.setItem(
                "sultanCart",
                JSON.stringify(cart)
            );


            updateCartCount();


            if (cartMessage) {

                cartMessage.textContent =
                    "✓ PRODUCT ADDED TO YOUR CART";


                setTimeout(function () {

                    cartMessage.textContent = "";

                }, 3000);

            }

        });

    }



    /* =========================
       BUY NOW
    ========================= */

    if (buyNowBtn) {

        buyNowBtn.addEventListener("click", function () {


            /*
                BUY NOW cart ko replace karega
                aur sirf ye product checkout
                mein jayega.
            */


            const buyNowProduct = {

                ...product,

                quantity: quantity

            };


            localStorage.setItem(

                "sultanCart",

                JSON.stringify([
                    buyNowProduct
                ])

            );


            /*
                Direct checkout
            */

            window.location.href =
                "../checkout/checkout.html";

        });

    }

});