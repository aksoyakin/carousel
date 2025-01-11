(() => {
    const init = () => {
        buildHTML();
        buildCSS();
        setEvents();
        getAllProductsFromLocalStorage();
    };

    const addScript = (src, scriptTobeAdded) => {
        let script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.onload = () => {
            console.log("Script loaded:", src);
            if (window.jQuery) {
                scriptTobeAdded(jQuery);
            } else {
                console.error("jQuery is not loaded.");
            }
        };
        script.onerror = () => {
            console.error("Failed to load script:", src);
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    };

    addScript("https://code.jquery.com/jquery-3.7.1.min.js", (jQuery) => {
        console.log("jQuery added successfully:", jQuery);
        init();
    });

    const buildHTML = () => {
        const productDetail = document.createElement("div");
        productDetail.className = "product-detail";
        document.getElementsByTagName("body")[0].appendChild(productDetail);
        const html = `
            <section class="product-carousel">
              <p class="product-carousel-title">You might also like</p>
              <button class="previous-button">&lt;</button>
              <button class="next-button">&gt;</button>
              <div class="product-container"></div>
            </section>
        `;
        $(".product-detail").after(html);
    };

    const buildCSS = () => {
        const css = `
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

            :root {
                --font-primary: 'Open Sans', sans-serif;
                --color-primary: #193BD0;
                --color-secondary: #302e2b;
                --color-light: #faf9f7;
                --color-dark: #29323b;
                --color-gray: #9c9b9b;
                --font-size-large: 18px;
                --font-size-medium: 16px;
                --font-size-small: 14px;
                --font-size-xlarge: 32px;
                --spacing-small: 10px;
                --spacing-medium: 15px;
                --spacing-large: 50px;
            }

            * {
                box-sizing: border-box;
                font-family: var(--font-primary);

            }

            body, p {
                margin: 0;
                padding: 0;
            }

            p {
                text-transform: capitalize;
                margin-block-start: 1em;
                margin-block-end: 1em;
            }

            a {
                text-decoration: none;
                text-transform: capitalize;
                font-size: var(--font-size-large);
                color: var(--color-secondary);
                line-height: 1.5;
                margin: 0;
                padding: 0;
            }

            img {
                vertical-align: middle;
                border: 0;
                overflow-clip-margin: content-box;
                overflow: clip;
            }

            .product-carousel {
                position: relative;
                overflow: hidden;
            /* padding: var(--spacing-large); */
                padding: var(--spacing-small) var(--spacing-large) var(--spacing-large);
                background: var(--color-light);
                margin: 0;
            }

            .product-carousel p {
                font-size: var(--font-size-large);
                color: var(--color-dark);
                line-height: 1.375;
                font-weight: lighter;
                padding: var(--spacing-medium) 0;
            }

            .product-carousel-title {
                font-size: var(--font-size-xlarge) !important;
                margin: 0;
            }

            .product-container {
                display: flex;
                overflow: hidden;
                scroll-behavior: smooth;
            }

            .product-card {
                position: relative; 
                flex: 0 0 auto;
                width: calc(100% / 6.5);
                margin-right: 10px;
                scroll-snap-align: start;
                background-color: #fff;
                box-sizing: border-box;
                cursor: pointer;
                padding-bottom:20px; 
                text-align: left;
            }

            .product-image {
                position: relative;
                width: 100%;
                overflow: hidden;
            }

            .product-thumbnail {
                max-width: 100%;
                height: auto;
                display:block;
            }

            .heart-container {
                position: absolute;
                top: var(--spacing-small);
                right: var(--spacing-small);
                background-color: white;
                width: 40px;
                height: 40px;
                display: flex;
                border-radius: 5px;
                border: 1px solid var(--color-gray);
                box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
            }

            .heart {
                font-size: 30px;
                color: var(--color-gray);
                background: transparent;
                border: none;
                cursor: pointer;
                transition: color 0.3s ease;
            }

            .heart.clicked {
                color: var(--color-primary);
            }

            .product-info {
                width: 100%;
                padding-top: var(--spacing-small);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex-grow: 1;
            }

            .product-name {
                font-size: var(--font-size-small);
                color: var(--color-secondary);
                line-height: 1.5;
                margin: var(--spacing-small) 0 0 var(--spacing-small);
            }

            .price {
                color: var(--color-primary);
                font-size: var(--font-size-large);
                font-weight: bold;
                margin: var(--spacing-small) var(--spacing-small) var(--spacing-medium);
            }


            .previous-button, .next-button {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                border: none;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 40px;
                color: black;
                background-color: transparent;
                cursor: pointer;
                z-index: 2;
                transition: background-color 0.3s ease;
            }

            .previous-button {
                left: -1px;
            }

            .next-button {
                right: -1px;
            }

            @media (max-width: 480px) {
                .product-card {
                    flex: 0 0 calc(100% / 1.5);
                    width: calc(100% / 1.5);
                }
            }

            @media (max-width: 767px) and (min-width: 481px) {
                .product-card {
                    flex: 0 0 calc(100% / 2.5);
                    width: calc(100% / 2.5);
                }
            }

            @media (max-width: 1024px) and (min-width: 768px) {
                .product-card {
                    flex: 0 0 calc(100% / 3.5);
                    width: calc(100% / 3.5);
                }
            }

            @media (max-width: 1440px) and (min-width: 1025px) {
                .product-card {
                    flex: 0 0 calc(100% / 5);
                    width: calc(100% / 5);
                }
            }

            @media (min-width: 1441px) {
                .product-card {
                    flex: 0 0 calc(100% / 6.5);
                    width: calc(100% / 6.5);
                    max-width: 300px;
                }
            }
            `;
        $("<style>")
            .prop("type", "text/css")
            .addClass("carousel-style")
            .html(css)
            .appendTo("head");
    };

    const fetchProductsFromApi = () => {
        const PRODUCTS_API_URL = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json'
        $.ajax({
            url: PRODUCTS_API_URL,
            method: "GET",
            dataType: "json",
            success: renderProducts,
            error: (error) => {
                console.error("Error while fetching data from API:", error);
            },
        });
    };

    const handleHeartClick = (e) => {
        const $heart = $(e.target);
        const $productCard = $heart.closest(".product-card");
        const productId = $productCard.data("id");
        const likedProducts = toggleLikeProduct($heart, $productCard, productId);
        saveLikedProductsToLocalStorage(likedProducts);
        $heart.toggleClass("clicked");
    };

    const markLikedProducts = (savedProducts, productId) => {
        if (savedProducts.some((p) => p.id === productId)) {
            $(`[data-id=${productId}] .heart`).addClass("clicked");
        }
    };

    const toggleLikeProduct = ($heart, $productCard, productId) => {
        let likedProducts = getLikedProductsFromLocalStorage();
        if ($heart.hasClass("clicked")) {
            likedProducts = likedProducts.filter((p) => p.id !== productId);
        } else {
            const product = {
                id: productId,
                name: $productCard.find(".product-name").text(),
                img: $productCard.find(".product-thumbnail").attr("src"),
                price: $productCard.find(".price").text(),
            };
            likedProducts.push(product);
        }
        return likedProducts;
    };

    const saveLikedProductsToLocalStorage = (products) => {
        try {
            localStorage.setItem("likedProducts", JSON.stringify(products));
        } catch (error) {
            console.log("Error occurred while saving liked products to Local Storage:", error);
        }
    };

    const getLikedProductsFromLocalStorage = () => {
        try {
            return JSON.parse(localStorage.getItem("likedProducts")) || [];
        } catch (error) {
            console.error("Error occurred while retrieving liked products from Local Storage:", error);
            return [];
        }
    };

    const saveAllProductsToLocalStorage = (products) => {
        try {
            localStorage.setItem("allProducts", JSON.stringify(products));
        } catch (error) {
            console.error("Error occurred while saving all products to Local Storage:", error);
        }
    };

    const getAllProductsFromLocalStorage = () => {
        const allSavedProducts = JSON.parse(localStorage.getItem("allProducts"));
        if (allSavedProducts && allSavedProducts.length > 0) {
            renderProducts(allSavedProducts);
        } else {
            fetchProductsFromApi();
        }
    };

    const renderProducts = (products) => {
        const likedProducts = getLikedProductsFromLocalStorage();
        products.forEach((product) => {
            const productCard = createProductCard(product);
            $(".product-container").append(productCard);
            markLikedProducts(likedProducts, product.id);
        });
        saveAllProductsToLocalStorage(products);
    };

    const createProductCard = (product) => `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            <div class="heart-container">
              <button class="heart">&#10084</button>
            </div>
            <img class="product-thumbnail" src="${product.img}" alt="${product.name}" />
          </div>
          <div class="product-info">
            <p class="product-name">
              <a href="${product.url}" target="_blank">${product.name}</a>
            </p>
            <span class="price">${product.price} TL</span>
          </div>
        </div> 
    `;

    const scrollProductContainer = (direction) => {
        const productCardWidth = $(".product-card").outerWidth(true);
        const scrollAmount = direction === "next" ? productCardWidth : -productCardWidth;
        $(".product-container").animate(
            { scrollLeft: $(".product-container").scrollLeft() + scrollAmount },
            100
        );
    };

    const setEvents = () => {
        $(document).on("click", ".heart", handleHeartClick);
        $(".next-button").on("click", () => scrollProductContainer("next"));
        $(".previous-button").on("click", () => scrollProductContainer("previous"));
    };
})();