(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow');
            } else {
                $('.fixed-top').removeClass('bg-white shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
            }
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    // Header login dialog, cart drawer, and product list interactions
    var sampleProducts = [
        { name: 'Fresh Tomato', price: '$19.00', image: 'img/product-1.jpg' },
        { name: 'Fresh Pineapple', price: '$19.00', image: 'img/product-2.jpg' },
        { name: 'Fresh Chilli', price: '$19.00', image: 'img/product-3.jpg' },
        { name: 'Fresh Strawberry', price: '$19.00', image: 'img/product-4.jpg' },
        { name: 'Fresh Cucumber', price: '$19.00', image: 'img/product-5.jpg' },
        { name: 'Fresh Orange', price: '$19.00', image: 'img/product-6.jpg' },
        { name: 'Fresh Potato', price: '$19.00', image: 'img/product-7.jpg' },
        { name: 'Fresh Banana', price: '$19.00', image: 'img/product-8.jpg' }
    ];

    function buildShopPopups() {
        if (!$('#loginModal').length) {
            $('body').append(
                '<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog modal-dialog-centered">' +
                        '<div class="modal-content border-0 rounded-3">' +
                            '<div class="modal-header bg-primary text-white">' +
                                '<h5 class="modal-title" id="loginModalLabel">Login User</h5>' +
                                '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
                            '</div>' +
                            '<div class="modal-body p-4">' +
                                '<form>' +
                                    '<div class="mb-3"><label class="form-label">Email address</label><input type="email" class="form-control" placeholder="name@example.com"></div>' +
                                    '<div class="mb-3"><label class="form-label">Password</label><input type="password" class="form-control" placeholder="Password"></div>' +
                                    '<button type="button" class="btn btn-primary w-100 rounded-pill">Login</button>' +
                                '</form>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }

        if (!$('#cartOffcanvas').length) {
            $('body').append(
                '<div class="offcanvas offcanvas-start foody-cart" tabindex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel">' +
                    '<div class="offcanvas-header border-bottom">' +
                        '<h5 class="offcanvas-title" id="cartOffcanvasLabel">Shopping Cart</h5>' +
                        '<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>' +
                    '</div>' +
                    '<div class="offcanvas-body"><div id="cartItems"></div><div class="cart-total d-flex justify-content-between border-top pt-3 mt-3 fw-bold"><span>Total</span><span>$0.00</span></div><button class="btn btn-primary rounded-pill w-100 mt-3">Checkout</button></div>' +
                '</div>'
            );
        }
    }

    function getRandomCartItems() {
        return sampleProducts.slice().sort(function () { return 0.5 - Math.random(); }).slice(0, Math.floor(Math.random() * 2) + 2);
    }

    function renderCartItems() {
        var items = getRandomCartItems();
        var total = items.length * 19;
        $('#cartItems').html(items.map(function (item) {
            return '<div class="cart-item d-flex align-items-center mb-3"><img src="' + item.image + '" alt="' + item.name + '"><div class="ms-3 flex-grow-1"><h6 class="mb-1">' + item.name + '</h6><small class="text-muted">1 x ' + item.price + '</small></div><strong>' + item.price + '</strong></div>';
        }).join(''));
        $('.cart-total span:last-child').text('$' + total + '.00');
    }

    buildShopPopups();

    $('.fa-user.text-body').closest('a').attr({ href: '#', 'aria-label': 'Open login dialog' }).on('click', function (event) {
        event.preventDefault();
        new bootstrap.Modal(document.getElementById('loginModal')).show();
    });

    $('.fa-shopping-bag.text-body').closest('a').attr({ href: '#', 'aria-label': 'Open shopping cart' }).on('click', function (event) {
        event.preventDefault();
        renderCartItems();
        new bootstrap.Offcanvas(document.getElementById('cartOffcanvas')).show();
    });

    $('.product-item small a').on('click', function (event) {
        event.preventDefault();
        renderCartItems();
        new bootstrap.Offcanvas(document.getElementById('cartOffcanvas')).show();
    });

    $('.btn:contains("Browse More Products")').each(function () {
        $(this).attr('href', '#products');
    }).on('click', function (event) {
        event.preventDefault();
        var $button = $(this);
        var $pane = $button.closest('.tab-pane');
        var $row = $pane.find('.row.g-4').first();
        var repeatCount = Number($pane.data('repeat-count') || 1);

        if (!$row.length || repeatCount >= 5) {
            $button.text('All Products Loaded').addClass('disabled');
            return;
        }

        var $products = $row.children('.col-xl-3.col-lg-4.col-md-6').slice(0, 8).clone(true, true);
        $products.addClass('extra-product-set');
        $row.append($products);
        repeatCount += 1;
        $pane.data('repeat-count', repeatCount);

        if (repeatCount >= 5) {
            $button.text('All Products Loaded').addClass('disabled');
        }
    });

    
})(jQuery);
