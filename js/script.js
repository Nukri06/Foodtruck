document.addEventListener('DOMContentLoaded', () => {
    
    
// 1. BURGER MENU

    const burgerBtn = document.getElementById('burgerBtn');
    const navLinks = document.querySelector('.nav-links');

    if (burgerBtn && navLinks) {
        burgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = burgerBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }


    // 2. API INTEGRATION FOR COCKTAILS

    const cocktailContainer = document.getElementById('cocktailContainer');
    const searchInput = document.getElementById('cocktailSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');

    //ფასის დაგენერირება IDით
    
    function generatePrice(id) {
        //ვიღებთ IDის ბოლო 2 ციფრს
        const seed = parseInt(id.substring(id.length - 2)); 
        //მინიმუმ 10$ + (ID-ის ნაშთი)
        const price = 10 + (seed % 15); 
        return price.toFixed(2); 
    }

    async function fetchCocktails(url) {
        if (!cocktailContainer) return;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            
            const data = await response.json();
            
            const drinks = data.drinks ? data.drinks.slice(0, 8) : [];

            if (drinks.length === 0) {
                cocktailContainer.innerHTML = '<p style="color:white; text-align:center; width:100%;">No cocktails found.</p>';
                return;
            }

            cocktailContainer.innerHTML = drinks.map(drink => {
                const dynamicPrice = generatePrice(drink.idDrink);

                return `
                <div class="cocktail-card">
                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                    <div class="cocktail-info">
                        <h4>${drink.strDrink}</h4>
                        <span class="text-orange" style="display:block; margin-bottom:5px; font-size: 14px;">
                            ${drink.strCategory || 'Special Drink'}
                        </span>
                        <span class="cocktail-price">$${dynamicPrice}</span>
                    </div>
                </div>
            `}).join('');

        } catch (error) {
            console.error('API Error:', error);
            cocktailContainer.innerHTML = '<p style="color:white; text-align:center;">Could not load cocktails.</p>';
        }
    }


    fetchCocktails('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita');

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.trim();
            if (term) fetchCocktails(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`);
            else fetchCocktails('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita');
        });
    }

    //ფილტრაცია
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.filter-btn.active')?.classList.remove('active');
                btn.classList.add('active');
                const type = btn.getAttribute('data-type');
                
                if (type === 'margarita') fetchCocktails('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita');
                else fetchCocktails(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${type}`);
            });
        });
    }

   
    // 3. FORM VALIDATION
    const authForm = document.getElementById('authForm');

    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    const togglePasswordBtn = document.getElementById('togglePassword');
    const emailError = document.getElementById('emailError');
    const formMessage = document.getElementById('formMessage');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            togglePasswordBtn.classList.toggle('fa-eye');
            togglePasswordBtn.classList.toggle('fa-eye-slash');
        });
    }


    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const userValue = usernameInput.value.trim();
            const emailValue = emailInput.value.trim();
            const passwordValue = passwordInput.value; 
            const confirmValue = confirmPasswordInput.value;
            emailError.style.display = 'none';
            formMessage.innerText = "";
            formMessage.style.color = 'red';

            if (!userValue || !emailValue || !passwordValue || !confirmValue) {
                formMessage.innerText = "All fields are required!";
                return;
            }

            //რეჯექსი
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                emailError.style.display = 'block';
                emailError.innerText = "Invalid Email Format";
                return;
            }

            //პაროლლის მოთხოვნები
            if (/\s/.test(passwordValue)) {
                formMessage.innerText = "Password must not contain spaces.";
                return;
            }

            if (!/\d/.test(passwordValue)) {
                formMessage.innerText = "Password must contain at least one number.";
                return;
            }

 
            if (passwordValue.length < 6) {
                formMessage.innerText = "Password must be at least 6 characters long.";
                return;
            }


            if (passwordValue !== confirmValue) {
                formMessage.innerText = "Passwords do not match!";
                return;
            }
            formMessage.style.color = '#FF9F0D'; 
            formMessage.innerText = "Registration Successful! Redirecting...";


            setTimeout(() => {
                authForm.reset();
                formMessage.innerText = "";
            }, 2000);
        });
    }

    
    //SCROLL TO TOP დამატებითი ლოგიკა 

    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // თუ 300pxზე მეტია ჩამოსქროლილი ისარს გამივაჩენთ
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' 
            });
        });
    }

  
    //COOKIE 

    const cookieBox = document.getElementById('cookieBox');
    const acceptBtn = document.getElementById('acceptCookie');

 
    if (cookieBox && acceptBtn) {
        
     
        const cookieAccepted = localStorage.getItem('cookieAccepted');

    
        if (cookieAccepted !== 'true') {
            setTimeout(() => {
                cookieBox.classList.add('show');
            }, 2000); 
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            
            cookieBox.classList.remove('show');
        });
    }
});

    // TESTIMONIAL SLIDER

    const testimonialsData = [
        {
            name: "Alamin Hasan",
            role: "Food Specialist",
            image: "images/client-1.jpg", 
            rating: 5,
            text: "I was blown away by the quality of the food and the speed of service. The atmosphere is cozy, and the staff is incredibly friendly. Definitely the best place to grab a delicious, quick meal in town!"
        },
        {
            name: "Sarah Jenkins",
            role: "Chef de Cuisine",
            image: "images/client-2.jpg", 
            rating: 4,
            text: "Amazing experience! The flavors were outstanding and the service was impeccable. I highly recommend the steak house special."
        },
        {
            name: "Michael Doe",
            role: "Food Blogger",
            image: "images/client-3.jpg", 
            rating: 5,
            text: "I have visited many restaurants, but this one stands out. The atmosphere is cozy and the burger menu is just delicious."
        },
        {
            name: "Emily Clark",
            role: "Regular Customer",
            image: "images/client-4.jpg", 
            rating: 5,
            text: "My favorite place for dinner. The desserts are to die for, especially the chocolate cake. Great for family gatherings."
        }
    ];

    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');

    if (track && dotsContainer) {
       
        testimonialsData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.classList.add('testimonial-item');

            let starsHtml = '';
            for(let i=0; i<5; i++) {
                if(i < item.rating) starsHtml += '<i class="fas fa-star"></i>';
                else starsHtml += '<i class="far fa-star"></i>';
            }

            slide.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="client-img" onerror="this.src='https://via.placeholder.com/80'">
                <div class="quote-icon"><i class="fas fa-quote-right"></i></div>
                <p class="testimonial-text">${item.text}</p>
                <div class="rating">${starsHtml}</div>
                <h3 class="client-name">${item.name}</h3>
                <span class="client-role">${item.role}</span>
            `;
            track.appendChild(slide);

            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active'); 

            dot.addEventListener('click', () => {
                moveToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        function moveToSlide(index) {
      
            track.style.transform = `translateX(-${index * 100}%)`;

            const dots = document.querySelectorAll('.dot');
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
        }
    }
    // MENU TABS 

    const menuData = [
        { id: 1, category: 'breakfast', title: 'Lettuce Leaf', desc: 'Crispy garden greens tossed with our signature citrus vinaigrette.', price: '12.5$', image: 'images/menu-1.jpg' },
        { id: 2, category: 'breakfast', title: 'Fresh Breakfast', desc: 'Fresh ingredients for a healthy start to your day.', price: '14.5$', image: 'images/menu-2.jpg' },
        { id: 3, category: 'breakfast', title: 'Mild Butter', desc: 'Rich and creamy butter for your morning toast.', price: '12.5$', image: 'images/menu-3.jpg' },
        { id: 4, category: 'breakfast', title: 'Fresh Bread', desc: 'Warm, freshly baked bread with a crispy crust.', price: '12.5$', image: 'images/menu-4.jpg' },

        { id: 5, category: 'lunch', title: 'Italian Pizza', desc: 'Delicious cheese and tomato sauce.', price: '18.5$', image: 'images/menu-5.jpg' },
        { id: 6, category: 'lunch', title: 'Beef Burger', desc: 'Juicy beef with fresh vegetables.', price: '15.0$', image: 'images/menu-6.jpg' },
        
        { id: 7, category: 'dinner', title: 'Steak House', desc: 'Grilled steak with mashed potatoes.', price: '25.0$', image: 'images/menu-7.jpg' },
        { id: 8, category: 'dinner', title: 'Salmon Grill', desc: 'Fresh atlantic salmon.', price: '22.0$', image: 'images/menu-8.jpg' },
        
        { id: 9, category: 'dessert', title: 'Chocolate Cake', desc: 'Sweet chocolate delight.', price: '8.0$', image: 'images/menu-9.jpg' },
        { id: 10, category: 'drink', title: 'Fresh Mojito', desc: 'Cool mint and lime.', price: '5.0$', image: 'images/menu-10.jpg' }
    ];

    const menuGrid = document.getElementById('menuGrid');
    const tabs = document.querySelectorAll('.menu-tab');
    function renderMenu(category) {
        // ვფილტრავთ მონაცემებს
        const filteredItems = menuData.filter(item => item.category === category);
   
        const itemsToShow = filteredItems.length > 0 ? filteredItems : menuData.slice(0, 4);

        menuGrid.innerHTML = itemsToShow.map(item => `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="menu-info">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                    <span class="price">${item.price}</span>
                </div>
            </div>
        `).join('');
    }

    renderMenu('breakfast');

    // ტაბებზე დაჭერის ლოგიკა
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            renderMenu(category);
        });
    });