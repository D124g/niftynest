const ADMIN_WHATSAPP = "8801988940955";

// ==========================================
// এখানে আপনার পণ্যের নাম, দাম, ক্যাটাগরি ও ছবি বসাবেন
// ==========================================
const products = [
    {
        id: 1,
        name: "পণ্যের নাম ১",
        category: "gadget", // gadget, fashion অথবা lifestyle দিন
        price: 550,
        desc: "পণ্যের সংক্ষিপ্ত বিবরণ এখানে লিখুন",
        image: "" // ছবির লিংক দিন
    },
    {
        id: 2,
        name: "পণ্যের নাম ২ (ফাঁকা স্লট)",
        category: "fashion",
        price: 0,
        desc: "script.js ফাইল থেকে নাম ও দাম বসান",
        image: ""
    },
    {
        id: 3,
        name: "পণ্যের নাম ৩ (ফাঁকা স্লট)",
        category: "lifestyle",
        price: 0,
        desc: "script.js ফাইল থেকে নাম ও দাম বসান",
        image: ""
    },
    {
        id: 4,
        name: "পণ্যের নাম ৪ (ফাঁকা স্লট)",
        category: "gadget",
        price: 0,
        desc: "script.js ফাইল থেকে নাম ও দাম বসান",
        image: ""
    }
];

let cart = JSON.parse(localStorage.getItem("niftynest_cart")) || [];
let currentCategory = "all";

// টোস্ট মেসেজ দেখানো
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.className = "toast show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 2500);
}

// পণ্য রেন্ডার করা
function renderProducts(itemsToRender) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    if (itemsToRender.length === 0) {
        productList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b;">কোনো পণ্য পাওয়া যায়নি!</p>`;
        return;
    }

    itemsToRender.forEach(product => {
        const imgHTML = product.image 
            ? `<img src="${product.image}" alt="${product.name}">` 
            : `<span>ছবি যুক্ত করা হয়নি</span>`;

        productList.innerHTML += `
            <div class="product-card">
                <div class="product-img-wrap">${imgHTML}</div>
                <div class="product-info">
                    <span class="product-cat-tag">${product.category.toUpperCase()}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-price">${product.price} ৳</div>
                    <button class="add-btn" onclick="addToCart(${product.id})">🛒 অর্ডার লিস্টে যোগ করুন</button>
                </div>
            </div>
        `;
    });
}

// ক্যাটাগরি ফিল্টার
function filterCategory(category, btnElement) {
    currentCategory = category;
    document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");
    filterProducts();
}

// সার্চ ও ক্যাটাগরি একসাথে ফিল্টার
function filterProducts() {
    const searchText = document.getElementById("search-input").value.toLowerCase();
    
    const filtered = products.filter(p => {
        const matchesCat = currentCategory === "all" || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchText) || p.desc.toLowerCase().includes(searchText);
        return matchesCat && matchesSearch;
    });

    renderProducts(filtered);
}

// কার্টে যোগ করা
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product.price <= 0) {
        showToast("⚠️ পণ্যটির দাম এখনো সেট করা হয়নি!");
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveAndUpdateCart();
    showToast(`✅ "${product.name}" কার্টে যোগ হয়েছে!`);
}

function saveAndUpdateCart() {
    localStorage.setItem("niftynest_cart", JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    const cartContainer = document.getElementById("cart-items-container");
    const totalPriceEl = document.getElementById("total-price");
    const deliveryCharge = parseInt(document.getElementById("delivery-area").value);

    let totalQty = 0;
    let subtotal = 0;

    cart.forEach(item => {
        totalQty += item.qty;
        subtotal += item.price * item.qty;
    });

    cartCount.innerText = totalQty;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="color: #64748b; text-align: center; padding: 15px;">আপনার কার্টে কোনো পণ্য নেই!</p>`;
        totalPriceEl.innerText = "0 ৳";
        return;
    }

    cartContainer.innerHTML = "";
    cart.forEach((item, index) => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.price} ৳ x ${item.qty} = ${item.price * item.qty} ৳</small>
                </div>
                <div class="qty-controls">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span style="margin: 0 8px;">${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    const grandTotal = subtotal + deliveryCharge;
    totalPriceEl.innerText = `${grandTotal} ৳`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveAndUpdateCart();
}

function openCart() {
    updateCartUI();
    document.getElementById("cart-modal").style.display = "flex";
}

function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

// বিকাশ নম্বর এক ক্লিকে কপি করা
function copyBkash() {
    const num = document.getElementById("bkash-num").innerText;
    navigator.clipboard.writeText(num);
    showToast("📋 বিকাশ নম্বর কপি হয়েছে: " + num);
}

// হোয়াটসঅ্যাপে অর্ডার পাঠানো
function sendOrderToWhatsApp(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("⚠️ আগে অন্তত একটি পণ্য সিলেক্ট করুন!");
        return;
    }

    const name = document.getElementById("cust-name").value;
    const phone = document.getElementById("cust-phone").value;
    const address = document.getElementById("cust-address").value;
    const bkashSender = document.getElementById("bkash-sender").value;
    const bkashTrxId = document.getElementById("bkash-trxid").value;
    
    const deliverySelect = document.getElementById("delivery-area");
    const deliveryCharge = parseInt(deliverySelect.value);
    const deliveryText = deliverySelect.options[deliverySelect.selectedIndex].text;

    let productDetails = "";
    let subtotal = 0;

    cart.forEach((item, i) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        productDetails += `${i + 1}. ${item.name} (${item.qty} টি) - ${itemTotal}৳\n`;
    });

    const grandTotal = subtotal + deliveryCharge;

    const message = `*🛍️ নতুন অর্ডার - NiftyNest*\n` +
                    `--------------------------\n` +
                    `*👤 কাস্টমারের তথ্য:*\n` +
                    `• নাম: ${name}\n` +
                    `• ফোন: ${phone}\n` +
                    `• ঠিকানা (Location): ${address}\n\n` +
                    `*📦 অর্ডারকৃত পণ্য:*\n` +
                    `${productDetails}\n` +
                    `• ডেলিভারি: ${deliveryText}\n` +
                    `• *সর্বমোট বিল: ${grandTotal}৳*\n\n` +
                    `*💳 বিকাশ পেমেন্ট তথ্য:*\n` +
                    `• প্রাপক নম্বর: 01570237061\n` +
                    `• প্রেরক নম্বর: ${bkashSender}\n` +
                    `• TrxID: *${bkashTrxId}*\n` +
                    `--------------------------`;

    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
    
    // অর্ডার পাঠানোর পর কার্ট খালি করা
    cart = [];
    saveAndUpdateCart();
    closeCart();
    
    window.open(whatsappURL, "_blank");
}

// শুরুতে সব পণ্য ও কার্ট লোড হবে
renderProducts(products);
updateCartUI();