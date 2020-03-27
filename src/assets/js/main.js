window.onload = function () {
    navOnLoad();
    productsOnLoad();
    aboutAuthorSlideToggle();
    categoriesOnLoad();
    sortOnLoad();
    searchOnLoad();
    checkForFooter();
    if( window.location.href.split("/")[window.location.href.split("/").length - 1] == "cart.html"){
      cartOnLoad();
    }
};


// variables


var productsWrapper = $('#productsWrapper');
var clickedIds = [];
var sortingOptions = $('#sortDdl option');


// eond of variables


//                                                                                      FUNCTIONS AND METHODS


function checkForFooter() {
    if (document.body.scrollHeight < 350) {
        console.log("Less than!");
        $('div.footer-wrapper').addClass("stick-to-bottom");
    } else {
        $('div.footer-wrapper').removeClass("stick-to-bottom");
    }
}



// navigation functions


function navOnLoad() {
    var result = ``;
    $.get('data/navigation.json', function (data) {
        console.log(data);
        let currentPage = window.location.href.split("/")[window.location.href.split("/").length - 1]
        data.forEach(link => {
            if (link.href == currentPage) {
                result += ` <li class="nav-item active">
                <a class="nav-link" href="${link.href}">${link.title}<span class="sr-only">(current)</span></a>
            </li>
                
                `
            } else {
                result += `  <li class="nav-item">
               <a class="nav-link" href="${link.href}">${link.title}</a>
           </li>
               
               `
            }
        });
        console.log(result);
        $('ul.nav-links-container').html(result);
    })
}




// end of navigation functions

// products functions

function aboutAuthorSlideToggle() {
    let counter = 0;
    $('#aboutAuthorToggle').click(function () {
        counter++;
        $('#aboutAuthorEventTarget').slideToggle({
            start: function () {
                if ($('#aboutAuthorToggle p').html() == 'About author') {
                    $('#aboutAuthorToggle p').html('Hide about author');
                } else {
                    $('#aboutAuthorToggle p').html('About author');
                }
            }
        });
    })
}

function productsOnLoad() {

    $.get('data/products.json', function (data) {
        populateProducts(data);
    });
}

function calculateSwitch(len) {
    switch (parseInt(len)) {
        case 1:
            return "col-md-12";
            break;

        case 2:
            return "col-md-6";
            break;

        case 3:
            return "col-md-4";
            break;
        default:
            return "col-md-3";

    }
}

function colorsWidth(length) {
    return calculateSwitch(length);
}

function productsWidth(length) {
    return calculateSwitch(length);
}


function populateProducts(data) {
    console.log(data);
    var result = ``;
    data.forEach((e, i) => {
        result += `
            <div class="${productsWidth(data.length)}">
            <div class="card text-center">
            <img class="card-img-top" src="${e.image.src}" alt="${e.image.alt}">
            <div class="card-body">
                <h5 class="card-title">${e.name}</h5>
                <p class="card-text">${e.description}</p>
                <p class="card-text primary-type">Primary type: ${e.type.primary} - Subtype: ${e.type.sub}</p>
                <a href="#" class="btn btn-primary add-to-cart" data-productid="${e.id}">Add to cart</a>
                 <p class="card-text bucket-quantity"> Bucket quantity :<strong> ${e.quantity}kg</strong></p>
                <h5 class="card-subtitle"> Price: ${e.price}$</h5>
            <h4 class="card-header">Colors available: </h4>
            <div class="row colors-container">`
        if (e.colors.length) {
            e.colors.forEach(c => {
                result += `
                        <div class="${colorsWidth(e.colors.length)} colors-div-wrapper color-background-${c.value} product-colors-display" data-colorid="${c.id}" data-selected="false"></div>`
            })
        } else {
            result += `
            <div class="${colorsWidth(e.colors.length)} colors-div-wrapper color-background-none product-colors-display" data-colorid="none" data-selected="false" disabled="true"></div>`
        }
        result += `</div>
           </div>
        </div>
    </div>`
    });
    productsWrapper.html(result);
    addToCartEventBinder();
    addColorsEventBinder();
}

function addColorsEventBinder() {
    $('div.product-colors-display').click(colorSelected);
}

function colorSelected(e) {
    if (e.target.dataset.selected == "true") {
        e.target.dataset.selected = false;
        $(e.target).removeClass("selected-color");
    } else {
        e.target.dataset.selected = true;
        $(e.target).addClass("selected-color");
    }
}


function addToCartEventBinder() {
    $('a.add-to-cart').click(addToCart);
    console.log($('a.add-to-cart'));
}
// end of products functions


// categories functions

function categoriesOnLoad() {
    $.get('data/categories.json', function (data) {
        populateCategories(data);
    })
}

function populateCategories(data) {

    var result = ``;

    data.forEach(c => {
        result += `
          
            <a href="#" class="categories-anchor" id="${c.id}">${c.name}</a>
        `
    })
    $("#categoriesWrapper").html(result);
    $("#categoriesWrapper a").click(getCategoriesId);

}

function populateEmtpyCategories(cat) {
    var html = `<div class="container"><div class="row"><div class="col-md-6 text-center"><h2 class="empty-category-heading">Sorry, no items in ${cat} category...</h2></div></div></div>`;
    $('div#productsWrapper').html(html);
}

function getCategoriesId(e) {
    e.preventDefault();
    if (e) {
        $.get('data/products.json', function (data) {
            getProductsByCategory(data, e.target.id);
        });

        function getProductsByCategory(data, id) {
            var filteredData = [];
            data.forEach(e => {
                if (e.categories) {
                    e.categories.forEach(cat => {
                        if (cat.id == id) {
                            filteredData.push(e);
                        }
                    })
                }
            })
            if (filteredData.length) {
                populateProducts(filteredData);
            } else {
                populateEmtpyCategories(e.target.innerHTML);
            }
        }
    }
}




// end of categories functions



// sorting functions

function sortOnLoad() {
    $('#sortDdl').change(sortProducts);
}

function sortProducts(e) {
    let currentSortingOrder = sortingOptions[e.target.selectedIndex].id;
    $.get('data/products.json', function (data) {
        sortBy(data, currentSortingOrder);
    });

    function sortBy(data, order) {

        switch (order) {
            case "price-high":
                data.sort(function (a, b) {
                    console.log(typeof (a.price));
                    return b.price - a.price;
                });
                populateProducts(data);
                break;
            case "price-low":
                data.sort(function (a, b) {
                    return a.price - b.price;
                });
                populateProducts(data);
                break;
            case "name-a":
                data.sort();
                populateProducts(data);
                break;
            case "name-z":
                data.sort().reverse();
                populateProducts(data);
                break;

        }

    }
}




// end of sorting functions



// search functions

function searchOnLoad() {
    $('#searchProductsBtn').click(function () {
        searchProducts();
    });
    $('#searchProductsInput').keydown(function (e) {
        checkIfSubmited(e);
    })
}

function searchProducts() {
    let value = $("#searchProductsInput").val();
    if (value != undefined && value != null && value != "" && typeof value === "string") {
        $.get('data/products.json', function (data) {
            data = data.filter(x => x.name.toLowerCase().includes(value.toLowerCase()));
            populateProducts(data);
        })
    } else {
        alert("Invalid search, try again!");
    }
}

function checkIfSubmited(e) {
    if (e && e.keyCode === 13) {
        searchProducts();
    }
}

// end of search functions


//                                                                                  END OF FUNCTIONS AND METHODS


//                                                                                        CART




function cartProducts() {
    return JSON.parse(localStorage.getItem("products"));
}

function addToCart(e) {
    console.log(e.target.parentElement.children[0].innerHTML)
    e.preventDefault();
    let colors = [];
    let colorsSelectedObj = [];
    let colorIsChosen = false;
    let length = $(e.target.parentElement.children[7].children).length;
    for (let i = 0; i < length; i++) {
        colorsSelectedObj = $(e.target.parentElement.children[7].children[i].classList);
        for (let [key, value] of Object.entries(colorsSelectedObj)) {
            if (value == "selected-color") {
                colorIsChosen = true;
                if(colorsSelectedObj.length == 5){
                    colors.push(Object.entries(colorsSelectedObj)[2][1].split("-")[Object.entries(colorsSelectedObj)[2][1].split("-").length - 1]);
                    console.log(colors);
                    break;
                }
            }
        }
    }
    if (!colorIsChosen) {
        alert("Choose a color please.");
    } else {
        // if(!$(e.target.parentElement.children[7].children).classList.includes("selected-color")){
        //     alert("Please choose a color to continue!");
        // }
        let id = $(this).data('productid');



        var products = cartProducts();

        if (products) {
            if (inCart()) {
                increaseQuantity()
                
            } else {
                appendToLocalStorage()
            }
        } else {
            appendFirstProductToLocalStorage();
        }

        function inCart() {
            return products.filter(p => p.id == id).length;
        }

        function appendToLocalStorage() {
            let priceFull = e.target.parentElement.children[5].innerHTML.trim().split(' ')[1];
            let truePrice = priceFull.slice(0,priceFull.length - 1);
            let name = e.target.parentElement.children[0].innerHTML.trim();
            let products = cartProducts();
            products.push({
                id: id,
                quantity: 1,
                colors: colors,
                name : name,
                price : truePrice
            
            });
            localStorage.setItem("products", JSON.stringify(products));
        }

        function appendFirstProductToLocalStorage() {
            let products = [];
            let name = e.target.parentElement.children[0].innerHTML;
            let priceFull = e.target.parentElement.children[5].innerHTML.trim().split(' ')[1];
            let truePrice = priceFull.slice(0,priceFull.length - 1);
            products[0] = {
                "id": id,
                "quantity": 1,
                "colors" : colors,
                "name" : name,
                "price" : truePrice
            };
            localStorage.setItem("products", JSON.stringify(products));
        }

        function increaseQuantity() {
            let priceFull = e.target.parentElement.children[5].innerHTML.trim().split(' ')[1];
            let truePrice = priceFull.slice(0,priceFull.length - 1);
            let products = cartProducts();
            products.forEach(p => {
                if (p.id == id) {
                    p.quantity++;
                    p.colors = colors;
                }
            });
            localStorage.setItem("products", JSON.stringify(products));
        }
    }
}

function emptyCart() {
    localStorage.removeItem("products");
}

function cartOnLoad(){
    let products = cartProducts();
    populateCart(products);

}

function populateCart(data){
    var result = `
    <div class="container">
    <div class="row">
    <div class="col-md-12">
    <table class="cart-table" id="cartTable">
                    <th>no</th><th>Name</th><th>Quantity</th><th>Total price</th><th>Colors</th>
                    <tbody>`;
    data.forEach( (row,i) =>{
       result+= populateCartRow(row,i);
    })
    result+=`</tbody></table></div></div></div>`
    console.log(result);
    $('#cartTable').html(result);
}

function populateCartRow(row,i){
    let result = ``;
    result += `
    <tr class="text-center"><td>${++i+"."}</td><td>${row.name}</td><td>${row.quantity}</td><td>${row.quantity * row.price + "$"}</td>
    <td>${printColors()}</td></tr>`;

    function printColors(){
        let result = ``;
        let stopper = row.colors.length;
        row.colors.forEach( (c,i) =>{
            if(++i == stopper){
          result+= c;
            }
            else {
                result += c + ", ";
            }
        })
        return result;
    }

    return result;
}


//                                                                                     END OF CART