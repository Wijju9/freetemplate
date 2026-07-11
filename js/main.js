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


    // Static restaurant users and dashboards
    var bistroUsers = [
        { username: "superadmin", password: "superadmin123", role: "superadmin", name: "Super Admin" },
        { username: "admin", password: "admin123", role: "admin", name: "Admin" },
        { username: "cook", password: "cook123", role: "cook", name: "Cook" },
        { username: "cashier", password: "cashier123", role: "cashier", name: "Cashier" },
        { username: "employee", password: "employee123", role: "employee", name: "Employee" },
        { username: "customer", password: "customer123", role: "customer", name: "Customer" }
    ];

    var defaultBistroState = {
        customers: [
            { id: 1, name: "Guest Customer", phone: "+1 555 0101", visits: "2026-07-11 12:30" }
        ],
        employees: [
            { id: 1, name: "Ava Server", role: "employee", phone: "+1 555 0201" },
            { id: 2, name: "Mia Cook", role: "cook", phone: "+1 555 0202" }
        ],
        categories: ["Starters", "Mains", "Desserts"],
        products: [
            { id: 1, name: "Garden Bruschetta", category: "Starters", price: 12 },
            { id: 2, name: "Roasted Beet Salad", category: "Starters", price: 14 },
            { id: 3, name: "Veggie Primavera", category: "Mains", price: 19 },
            { id: 4, name: "Wood-Fired Veg Bowl", category: "Mains", price: 18 },
            { id: 5, name: "Seasonal Fruit Parfait", category: "Desserts", price: 10 }
        ],
        orders: [
            { id: 1, customer: "Guest Customer", type: "Dine in", items: "Veggie Primavera, Seasonal Fruit Parfait", status: "Cooking", time: "2026-07-11 12:30" }
        ],
        history: [
            { customer: "customer", visit: "2026-07-11 12:30", order: "Dine in - Veggie Primavera" }
        ]
    };

    var activeBistroUser = null;

    function getBistroState() {
        var savedState = localStorage.getItem("bistroStaticState");
        if (!savedState) {
            localStorage.setItem("bistroStaticState", JSON.stringify(defaultBistroState));
            return $.extend(true, {}, defaultBistroState);
        }
        return JSON.parse(savedState);
    }

    function saveBistroState(state) {
        localStorage.setItem("bistroStaticState", JSON.stringify(state));
    }

    function nextBistroId(items) {
        var maxId = 0;
        items.forEach(function (item) {
            if (item.id > maxId) maxId = item.id;
        });
        return maxId + 1;
    }

    function escapeBistroHtml(value) {
        return String(value).replace(/[&<>'"]/g, function (character) {
            return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character];
        });
    }

    function bistroAccess() {
        var role = activeBistroUser ? activeBistroUser.role : "";
        return {
            full: role === "superadmin" || role === "admin",
            canOrder: role === "superadmin" || role === "admin" || role === "employee",
            canCook: role === "superadmin" || role === "admin" || role === "cook",
            canCashier: role === "superadmin" || role === "admin" || role === "cashier",
            isCustomer: role === "customer"
        };
    }

    function buildBistroShell() {
        if ($("#bistroLoginDialog").length) return;

        $("body").append([
            '<div class="bistro-auth-overlay" id="bistroLoginDialog" aria-hidden="true">',
            '  <div class="bistro-auth-card">',
            '    <button class="bistro-close" data-bistro-close="login" type="button" aria-label="Close login">&times;</button>',
            '    <h3 class="mb-3">Bistro Login</h3>',
            '    <p class="text-muted mb-4">Choose one static user role to open the matching dashboard.</p>',
            '    <form id="bistroLoginForm">',
            '      <div class="mb-3"><label class="form-label" for="bistroUsername">User</label><select class="form-select" id="bistroUsername"></select></div>',
            '      <div class="mb-3"><label class="form-label" for="bistroPassword">Password</label><input class="form-control" id="bistroPassword" type="password" value="superadmin123"></div>',
            '      <div class="small text-muted mb-3">Passwords: superadmin123, admin123, cook123, cashier123, employee123, customer123</div>',
            '      <div class="text-danger small mb-3 d-none" id="bistroLoginError">Invalid username or password.</div>',
            '      <button class="btn btn-primary rounded-pill w-100" type="submit">Open Dashboard</button>',
            '    </form>',
            '  </div>',
            '</div>'
        ].join(""));

        bistroUsers.forEach(function (user) {
            $("#bistroUsername").append('<option value="' + user.username + '">' + user.name + ' (' + user.role + ')</option>');
        });
    }

    function openBistroLogin() {
        buildBistroShell();
        $("#bistroLoginDialog").addClass("show").attr("aria-hidden", "false");
    }

    function closeBistroLayer(target) {
        $(target).removeClass("show").attr("aria-hidden", "true");
    }

    function renderBistroTable(headers, rows) {
        return '<div class="table-responsive"><table class="table table-bordered align-middle"><thead><tr>' +
            headers.map(function (header) { return '<th>' + header + '</th>'; }).join("") +
            '</tr></thead><tbody>' + rows.join("") + '</tbody></table></div>';
    }

    function renderBistroDashboard() {
        var state = getBistroState();
        var access = bistroAccess();
        var content = [];
        var roleLabel = activeBistroUser.role.charAt(0).toUpperCase() + activeBistroUser.role.slice(1);

        $("#bistroDashboardTitle").text(roleLabel + " Dashboard");
        $("#bistroDashboardSubtitle").text("Logged in as " + activeBistroUser.name + ". Static demo data is saved in this browser.");
        $("#bistroDashboardRole").text(roleLabel);
        $("#bistroDashboardUser").text(activeBistroUser.name);
        $("#bistroDashboardStats").html(renderBistroStats(state));

        var moduleName = $("#bistroDashboardPage").data("bistro-module") || "overview";
        if (moduleName === "overview") {
            if (access.full) {
                content.push(renderCustomersSection(state));
                content.push(renderEmployeesSection(state));
                content.push(renderMenuSection(state));
            }
            if (access.canOrder) content.push(renderOrderSection(state));
            if (access.canCook) content.push(renderCookSection(state));
            if (access.canCashier) content.push(renderCashierSection(state));
            if (access.isCustomer) content.push(renderCustomerHistorySection(state));
        } else {
            content.push(renderBistroModule(moduleName, state, access));
        }

        $("#bistroDashboardContent").html(content.join(""));
        if (!$("#bistroDashboardPage").length) window.location.href = "dashboard.html";
    }

    function renderBistroModule(moduleName, state, access) {
        var noAccess = '<section class="bistro-panel"><h4>No Access</h4><p class="mb-0">Your current role cannot open this restaurant operation page.</p></section>';
        if (moduleName === "customers") return access.full || access.isCustomer ? renderCustomerHistorySection(state) : noAccess;
        if (moduleName === "customer-management") return access.full ? renderCustomersSection(state) : noAccess;
        if (moduleName === "employees") return access.full ? renderEmployeesSection(state) : noAccess;
        if (moduleName === "orders") return access.canOrder ? renderOrderSection(state) : noAccess;
        if (moduleName === "cook") return access.canCook ? renderCookSection(state) : noAccess;
        if (moduleName === "products") return access.full ? renderProductSection(state) : noAccess;
        if (moduleName === "categories") return access.full ? renderCategorySection(state) : noAccess;
        return noAccess;
    }

    function renderBistroStats(state) {
        return [
            bistroStatCard("Customers", state.customers.length, "fa-users"),
            bistroStatCard("Employees", state.employees.length, "fa-user-tie"),
            bistroStatCard("Veg Dishes", state.products.length, "fa-utensils"),
            bistroStatCard("Orders", state.orders.length, "fa-receipt")
        ].join("");
    }

    function bistroStatCard(label, value, icon) {
        return '<div class="col-sm-6 col-xl-3"><div class="bistro-stat-card"><i class="fa ' + icon + '"></i><div><span>' + label + '</span><strong>' + value + '</strong></div></div></div>';
    }

    function renderCustomersSection(state) {
        var rows = state.customers.map(function (customer) {
            return '<tr><td>' + customer.id + '</td><td>' + escapeBistroHtml(customer.name) + '</td><td>' + escapeBistroHtml(customer.phone) + '</td><td>' + escapeBistroHtml(customer.visits) + '</td><td><button class="btn btn-sm btn-outline-danger" data-bistro-delete="customer" data-id="' + customer.id + '">Delete</button></td></tr>';
        });
        return '<section class="bistro-panel"><h4>Add Customer</h4><form class="row g-2 mb-3" data-bistro-form="customer"><div class="col-md-4"><input class="form-control" name="name" placeholder="Customer name" required></div><div class="col-md-4"><input class="form-control" name="phone" placeholder="Phone" required></div><div class="col-md-4"><button class="btn btn-primary w-100" type="submit">Add Customer</button></div></form>' + renderBistroTable(["ID", "Name", "Phone", "Visit Time", "Action"], rows) + '</section>';
    }

    function renderEmployeesSection(state) {
        var rows = state.employees.map(function (employee) {
            return '<tr><td>' + employee.id + '</td><td>' + escapeBistroHtml(employee.name) + '</td><td>' + escapeBistroHtml(employee.role) + '</td><td>' + escapeBistroHtml(employee.phone) + '</td><td><button class="btn btn-sm btn-outline-danger" data-bistro-delete="employee" data-id="' + employee.id + '">Delete</button></td></tr>';
        });
        return '<section class="bistro-panel"><h4>Add Employee</h4><form class="row g-2 mb-3" data-bistro-form="employee"><div class="col-md-4"><input class="form-control" name="name" placeholder="Employee name" required></div><div class="col-md-3"><select class="form-select" name="role"><option>cook</option><option>food serve</option><option>food order place person</option><option>cashier</option><option>admin</option></select></div><div class="col-md-3"><input class="form-control" name="phone" placeholder="Phone" required></div><div class="col-md-2"><button class="btn btn-primary w-100" type="submit">Add</button></div></form>' + renderBistroTable(["ID", "Name", "Role", "Phone", "Action"], rows) + '</section>';
    }

    function renderMenuSection(state) {
        return renderCategorySection(state) + renderProductSection(state);
    }

    function renderCategorySection(state) {
        var categoryRows = state.categories.map(function (category, index) {
            return '<tr><td>' + (index + 1) + '</td><td>' + escapeBistroHtml(category) + '</td><td>Veg menu</td><td><button class="btn btn-sm btn-outline-danger" data-bistro-delete="category" data-id="' + index + '">Delete</button></td></tr>';
        });
        return '<section class="bistro-panel"><h4>Product Category</h4><form class="row g-2 mb-3" data-bistro-form="category"><div class="col-md-8"><input class="form-control" name="name" placeholder="Category name" required></div><div class="col-md-4"><button class="btn btn-primary w-100" type="submit">Add Category</button></div></form>' + renderBistroTable(["#", "Category", "Type", "Action"], categoryRows) + '</section>';
    }

    function renderProductSection(state) {
        var productRows = state.products.map(function (product) {
            return '<tr><td>' + product.id + '</td><td>' + escapeBistroHtml(product.name) + '</td><td>' + escapeBistroHtml(product.category) + '</td><td>$' + Number(product.price).toFixed(2) + '</td><td>Veg</td><td><button class="btn btn-sm btn-outline-danger" data-bistro-delete="product" data-id="' + product.id + '">Delete</button></td></tr>';
        });
        var categoryOptions = state.categories.map(function (category) { return '<option>' + escapeBistroHtml(category) + '</option>'; }).join("");
        return '<section class="bistro-panel"><h4>Product</h4><form class="row g-2 mb-3" data-bistro-form="product"><div class="col-md-4"><input class="form-control" name="name" placeholder="Dish name" required></div><div class="col-md-3"><select class="form-select" name="category">' + categoryOptions + '</select></div><div class="col-md-3"><input class="form-control" name="price" type="number" min="1" placeholder="Price" required></div><div class="col-md-2"><button class="btn btn-primary w-100" type="submit">Add</button></div></form>' + renderBistroTable(["ID", "Dish", "Category", "Price", "Menu", "Action"], productRows) + '</section>';
    }

    function renderOrderSection(state) {
        var productOptions = state.products.map(function (product) { return '<option value="' + escapeBistroHtml(product.name) + '">' + escapeBistroHtml(product.name) + '</option>'; }).join("");
        var rows = state.orders.map(orderRow);
        return '<section class="bistro-panel"><h4>Add Order</h4><form class="row g-2 mb-3" data-bistro-form="order"><div class="col-md-3"><input class="form-control" name="customer" placeholder="Customer name" required></div><div class="col-md-3"><select class="form-select" name="type"><option>Parcel</option><option>Dine in</option></select></div><div class="col-md-4"><select class="form-select" name="items">' + productOptions + '</select></div><div class="col-md-2"><button class="btn btn-primary w-100" type="submit">Add Order</button></div></form>' + renderBistroTable(["ID", "Customer", "Type", "Items", "Status", "Time"], rows) + '</section>';
    }

    function renderCookSection(state) {
        var rows = state.orders.filter(function (order) { return order.status !== "Served"; }).map(function (order) {
            return '<tr><td>' + order.id + '</td><td>' + escapeBistroHtml(order.type) + '</td><td>' + escapeBistroHtml(order.items) + '</td><td>' + escapeBistroHtml(order.status) + '</td><td><button class="btn btn-sm btn-outline-primary" data-bistro-status="Ready" data-id="' + order.id + '">Mark Ready</button></td></tr>';
        });
        return '<section class="bistro-panel"><h4>Cook - What To Cook</h4>' + renderBistroTable(["Order", "Type", "Veg Items", "Status", "Action"], rows) + '</section>';
    }

    function renderCashierSection(state) {
        var rows = state.orders.map(function (order) {
            return '<tr><td>' + order.id + '</td><td>' + escapeBistroHtml(order.customer) + '</td><td>' + escapeBistroHtml(order.type) + '</td><td>' + escapeBistroHtml(order.items) + '</td><td>' + escapeBistroHtml(order.status) + '</td><td><button class="btn btn-sm btn-outline-success" data-bistro-status="Paid" data-id="' + order.id + '">Mark Paid</button></td></tr>';
        });
        return '<section class="bistro-panel"><h4>Cashier Orders</h4>' + renderBistroTable(["ID", "Customer", "Type", "Items", "Status", "Payment"], rows) + '</section>';
    }

    function renderCustomerHistorySection(state) {
        var rows = state.history.filter(function (history) { return history.customer === activeBistroUser.username; }).map(function (history) {
            return '<tr><td>' + escapeBistroHtml(history.visit) + '</td><td>' + escapeBistroHtml(history.order) + '</td></tr>';
        });
        if (!rows.length) rows.push('<tr><td colspan="2">No hotel visit history yet.</td></tr>');
        return '<section class="bistro-panel"><h4>My Hotel Visit History</h4>' + renderBistroTable(["Visit Time", "Order"], rows) + '</section>';
    }

    function orderRow(order) {
        return '<tr><td>' + order.id + '</td><td>' + escapeBistroHtml(order.customer) + '</td><td>' + escapeBistroHtml(order.type) + '</td><td>' + escapeBistroHtml(order.items) + '</td><td>' + escapeBistroHtml(order.status) + '</td><td>' + escapeBistroHtml(order.time) + '</td></tr>';
    }

    $(document).on("click", ".fa-user.text-body", function (event) {
        event.preventDefault();
        openBistroLogin();
    });

    $(document).on("change", "#bistroUsername", function () {
        $("#bistroPassword").val($(this).val() + "123");
    });

    $(document).on("submit", "#bistroLoginForm", function (event) {
        event.preventDefault();
        var username = $("#bistroUsername").val();
        var password = $("#bistroPassword").val();
        activeBistroUser = bistroUsers.find(function (user) {
            return user.username === username && user.password === password;
        });
        if (!activeBistroUser) {
            $("#bistroLoginError").removeClass("d-none");
            return;
        }
        $("#bistroLoginError").addClass("d-none");
        localStorage.setItem("bistroActiveUser", JSON.stringify(activeBistroUser));
        closeBistroLayer("#bistroLoginDialog");
        window.location.href = "dashboard.html";
    });

    $(document).on("click", "[data-bistro-close]", function () {
        closeBistroLayer($(this).data("bistro-close") === "login" ? "#bistroLoginDialog" : "#bistroDashboard");
    });

    $(document).on("click", "#bistroLogout", function () {
        activeBistroUser = null;
        localStorage.removeItem("bistroActiveUser");
        window.location.href = "index.html";
    });

    $(document).on("submit", "[data-bistro-form]", function (event) {
        event.preventDefault();
        var state = getBistroState();
        var formType = $(this).data("bistro-form");
        var values = Object.fromEntries(new FormData(this).entries());
        var now = new Date().toLocaleString();

        if (formType === "customer") state.customers.push({ id: nextBistroId(state.customers), name: values.name, phone: values.phone, visits: now });
        if (formType === "employee") state.employees.push({ id: nextBistroId(state.employees), name: values.name, role: values.role, phone: values.phone });
        if (formType === "category" && !state.categories.includes(values.name)) state.categories.push(values.name);
        if (formType === "product") state.products.push({ id: nextBistroId(state.products), name: values.name, category: values.category, price: Number(values.price) });
        if (formType === "order") {
            state.orders.push({ id: nextBistroId(state.orders), customer: values.customer, type: values.type, items: values.items, status: "Cooking", time: now });
            state.history.push({ customer: values.customer.toLowerCase() === "customer" ? "customer" : values.customer, visit: now, order: values.type + " - " + values.items });
        }

        saveBistroState(state);
        renderBistroDashboard();
    });

    $(document).on("click", "[data-bistro-delete]", function () {
        var state = getBistroState();
        var type = $(this).data("bistro-delete");
        var id = Number($(this).data("id"));
        if (type === "customer") state.customers = state.customers.filter(function (customer) { return customer.id !== id; });
        if (type === "employee") state.employees = state.employees.filter(function (employee) { return employee.id !== id; });
        if (type === "product") state.products = state.products.filter(function (product) { return product.id !== id; });
        if (type === "category") state.categories.splice(id, 1);
        saveBistroState(state);
        renderBistroDashboard();
    });

    $(document).on("click", "[data-bistro-status]", function () {
        var state = getBistroState();
        var id = Number($(this).data("id"));
        var status = $(this).data("bistro-status");
        state.orders.forEach(function (order) {
            if (order.id === id) order.status = status;
        });
        saveBistroState(state);
        renderBistroDashboard();
    });


    $(document).on("click", "#bistroSidebarToggle", function () {
        $("body").toggleClass("bistro-sidebar-collapsed");
    });


    function initBistroDashboardPage() {
        if (!$("#bistroDashboardPage").length) return;
        var savedUser = localStorage.getItem("bistroActiveUser");
        if (!savedUser) {
            window.location.href = "index.html";
            return;
        }
        activeBistroUser = JSON.parse(savedUser);
        renderBistroDashboard();
    }

    initBistroDashboardPage();

    
})(jQuery);

