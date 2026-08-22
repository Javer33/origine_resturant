document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const navbar = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-panel");

  function updateNavbar() {
    if (navbar) {
      navbar.classList.toggle(
        "scrolled",
        window.scrollY > 30
      );
    }
  }

  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );

  updateNavbar();


  /* =====================================================
     MOBILE MENU
     ===================================================== */

  if (menuToggle && mobileNav) {

    menuToggle.addEventListener("click", () => {

      const isOpen =
        mobileNav.classList.toggle("open");

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });


    mobileNav
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener("click", () => {

          mobileNav.classList.remove("open");

          document.body.classList.remove(
            "menu-open"
          );

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        });

      });
  }


  /* =====================================================
     SCROLL REVEAL
     ===================================================== */

  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );
          }

        });

      },
      {
        threshold: .12
      }
    );


  document
    .querySelectorAll(".reveal")
    .forEach(element => {

      revealObserver.observe(element);

    });


  /* =====================================================
     MENU DETAILS
     ===================================================== */

  function activateDetailButtons() {

    document
      .querySelectorAll(".details-btn")
      .forEach(button => {

        button.onclick = () => {

          const card =
            button.closest(".menu-item");

          if (!card) return;

          const isOpen =
            card.classList.toggle("open");

          button.setAttribute(
            "aria-expanded",
            String(isOpen)
          );

          button.innerHTML =
            isOpen
              ? "Hide taste & origin ↑"
              : "Taste & origin ↓";
        };

      });

  }

  activateDetailButtons();


  /* =====================================================
     FAQ ACCORDION
     ===================================================== */

  document
    .querySelectorAll(".faq-question")
    .forEach(button => {

      button.addEventListener("click", () => {

        const item =
          button.closest(".faq-item");

        if (!item) return;

        const wasOpen =
          item.classList.contains("open");

        document
          .querySelectorAll(".faq-item.open")
          .forEach(openItem => {

            openItem.classList.remove("open");

            const openButton =
              openItem.querySelector(
                ".faq-question"
              );

            if (openButton) {
              openButton.setAttribute(
                "aria-expanded",
                "false"
              );
            }

          });

        if (!wasOpen) {

          item.classList.add("open");

          button.setAttribute(
            "aria-expanded",
            "true"
          );
        }

      });

    });


  /* =====================================================
     OWNER MENU SYSTEM
     ===================================================== */

  const ownerToggle =
    document.getElementById("ownerToggle");

  const ownerForm =
    document.getElementById("ownerForm");

  const menuList =
    document.querySelector(".menu-list");

  const addMenuForm =
    document.getElementById("addMenuForm");


  /* Demo owner password */
  const OWNER_PASSWORD = "origine2026";


  if (ownerToggle && ownerForm) {

    ownerToggle.addEventListener(
      "click",
      () => {

        const isOpen =
          ownerForm.classList.contains("open");

        if (isOpen) {

          ownerForm.classList.remove(
            "open"
          );

          ownerToggle.textContent =
            "Owner Access";

          return;
        }


        const password =
          prompt(
            "Owner access required. Enter password:"
          );


        if (password === OWNER_PASSWORD) {

          ownerForm.classList.add(
            "open"
          );

          ownerToggle.textContent =
            "Close Owner Panel";

        } else if (password !== null) {

          alert(
            "Incorrect owner password."
          );

        }

      }
    );
  }


  /* =====================================================
     SAVE / LOAD OWNER DISHES
     ===================================================== */

  function getOwnerDishes() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "origineOwnerDishes"
        )
      ) || [];

    } catch {

      return [];

    }

  }


  function saveOwnerDishes(dishes) {

    localStorage.setItem(
      "origineOwnerDishes",
      JSON.stringify(dishes)
    );

  }


  /* =====================================================
     CREATE MENU CARD
     ===================================================== */

  function createMenuCard(dish) {

    const article =
      document.createElement("article");

    article.className =
      "menu-item reveal owner-added";

    article.dataset.category =
      dish.category;


    article.innerHTML = `

      <img
        src="${escapeHTML(dish.image)}"
        alt="${escapeHTML(dish.name)}"
      >

      <div>

        <div class="dish-top">

          <div>

            <span class="meta">
              ${escapeHTML(dish.category)}
            </span>

            <h3>
              ${escapeHTML(dish.name)}
            </h3>

          </div>

          <span class="price">
            Rs. ${escapeHTML(dish.price)}
          </span>

        </div>


        <p>
          ${escapeHTML(dish.description)}
        </p>


        <div class="menu-details">

          <span class="tag">
            Owner's addition
          </span>

          <span class="tag">
            Origin included
          </span>

        </div>


        <button
          class="text-link details-btn"
          type="button"
          aria-expanded="false"
        >
          Taste &amp; origin ↓
        </button>


        <div class="detail-panel">

          <div class="detail-row">
            <strong>Origin</strong>
            <span>
              ${escapeHTML(dish.origin)}
            </span>
          </div>

          <div class="detail-row">
            <strong>Ingredients</strong>
            <span>
              ${escapeHTML(dish.ingredients)}
            </span>
          </div>

          <div class="detail-row">
            <strong>Taste</strong>
            <span>
              ${escapeHTML(dish.taste)}
            </span>
          </div>

          <div class="detail-row">
            <strong>Allergens</strong>
            <span>
              ${escapeHTML(dish.allergens || "None declared")}
            </span>
          </div>

          <button
            class="remove-dish"
            type="button"
            data-id="${dish.id}"
          >
            Remove from Menu
          </button>

        </div>

      </div>

    `;


    return article;

  }


  /* =====================================================
     SECURITY HELPER
     ===================================================== */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* =====================================================
     LOAD OWNER DISHES
     ===================================================== */

  function loadOwnerDishes() {

    if (!menuList) return;

    const dishes =
      getOwnerDishes();


    dishes.forEach(dish => {

      const card =
        createMenuCard(dish);

      menuList.appendChild(card);

    });


    activateDetailButtons();

    activateRemoveButtons();

  }


  loadOwnerDishes();


  /* =====================================================
     ADD NEW DISH
     ===================================================== */

  if (addMenuForm) {

    addMenuForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const formData =
          new FormData(addMenuForm);


        const dish = {

          id:
            Date.now().toString(),

          name:
            formData.get("name"),

          category:
            formData.get("category"),

          price:
            formData.get("price"),

          image:
            formData.get("image"),

          description:
            formData.get("description"),

          origin:
            formData.get("origin"),

          ingredients:
            formData.get("ingredients"),

          taste:
            formData.get("taste"),

          allergens:
            formData.get("allergens")

        };


        if (
          !dish.name ||
          !dish.category ||
          !dish.price ||
          !dish.image ||
          !dish.description
        ) {

          alert(
            "Please complete the required fields."
          );

          return;

        }


        const dishes =
          getOwnerDishes();


        dishes.push(dish);

        saveOwnerDishes(dishes);


        if (menuList) {

          const card =
            createMenuCard(dish);

          menuList.appendChild(card);

          card.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }


        activateDetailButtons();
        activateRemoveButtons();


        addMenuForm.reset();


        alert(
          `${dish.name} has been added to the menu.`
        );

      }
    );

  }


  /* =====================================================
     REMOVE OWNER DISH
     ===================================================== */

  function activateRemoveButtons() {

    document
      .querySelectorAll(".remove-dish")
      .forEach(button => {

        button.onclick = () => {

          const id =
            button.dataset.id;


          const confirmed =
            confirm(
              "Remove this dish from the menu?"
            );


          if (!confirmed) return;


          let dishes =
            getOwnerDishes();


          dishes =
            dishes.filter(
              dish => dish.id !== id
            );


          saveOwnerDishes(dishes);


          const card =
            button.closest(".menu-item");


          if (card) {

            card.style.opacity = "0";

            card.style.transform =
              "translateY(20px)";

            setTimeout(() => {

              card.remove();

            }, 300);

          }

        };

      });

  }


  /* =====================================================
     MENU FILTERING
     ===================================================== */

  const filters =
    document.querySelectorAll(
      ".filter"
    );


  filters.forEach(filter => {

    filter.addEventListener(
      "click",
      () => {

        filters.forEach(item => {

          item.classList.remove(
            "active"
          );

        });


        filter.classList.add(
          "active"
        );


        const category =
          filter.dataset.category;


        document
          .querySelectorAll(".menu-item")
          .forEach(card => {

            if (
              category === "all" ||
              card.dataset.category === category
            ) {

              card.style.display = "";

              requestAnimationFrame(() => {

                card.style.opacity = "1";
                card.style.transform = "translateY(0)";

              });

            } else {

              card.style.opacity = "0";
              card.style.transform =
                "translateY(15px)";

              setTimeout(() => {

                if (
                  card.dataset.category !== category
                ) {

                  card.style.display = "none";

                }

              }, 250);

            }

          });

      });

  });


  /* =====================================================
     CUSTOMER REVIEW SYSTEM
     ===================================================== */

  const reviewForm =
    document.getElementById(
      "reviewForm"
    );

  const reviewsGrid =
    document.getElementById(
      "reviewsGrid"
    );


  function getReviews() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "origineCustomerReviews"
        )
      ) || [];

    } catch {

      return [];

    }

  }


  function saveReviews(reviews) {

    localStorage.setItem(
      "origineCustomerReviews",
      JSON.stringify(reviews)
    );

  }


  function createReview(review) {

    const card =
      document.createElement("article");

    card.className =
      "review-card reveal";


    card.innerHTML = `

      <div class="review-stars">
        ${"★".repeat(Number(review.rating))}
      </div>

      <blockquote>
        “${escapeHTML(review.message)}”
      </blockquote>

      <div class="review-author">
        — ${escapeHTML(review.name)}
      </div>

    `;


    return card;

  }


  function loadReviews() {

    if (!reviewsGrid) return;


    getReviews()
      .forEach(review => {

        reviewsGrid.appendChild(
          createReview(review)
        );

      });

  }


  loadReviews();


  if (reviewForm) {

    reviewForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const formData =
          new FormData(reviewForm);


        const review = {

          name:
            formData.get("name"),

          rating:
            formData.get("rating"),

          message:
            formData.get("message")

        };


        if (
          !review.name ||
          !review.rating ||
          !review.message
        ) {

          alert(
            "Please complete your review."
          );

          return;

        }


        const reviews =
          getReviews();


        reviews.unshift(review);


        saveReviews(reviews);


        if (reviewsGrid) {

          const card =
            createReview(review);

          reviewsGrid.prepend(card);

        }


        reviewForm.reset();


        alert(
          "Thank you for sharing your experience."
        );

      }
    );

  }


  /* =====================================================
     RESERVATION FORM
     ===================================================== */

  const reservationForm =
    document.getElementById(
      "reservationForm"
    );

  const formMessage =
    document.getElementById(
      "formMessage"
    );


  if (reservationForm) {

    const dateInput =
      reservationForm.querySelector(
        'input[name="date"]'
      );


    if (dateInput) {

      const today =
        new Date();

      const yyyy =
        today.getFullYear();

      const mm =
        String(
          today.getMonth() + 1
        ).padStart(2, "0");

      const dd =
        String(
          today.getDate()
        ).padStart(2, "0");


      dateInput.min =
        `${yyyy}-${mm}-${dd}`;

    }


    reservationForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const name =
          reservationForm.elements.name.value.trim();

        const email =
          reservationForm.elements.email.value.trim();

        const date =
          reservationForm.elements.date.value;

        const guests =
          reservationForm.elements.guests.value;


        if (
          !name ||
          !email ||
          !date ||
          !guests
        ) {

          if (formMessage) {

            formMessage.textContent =
              "Please complete your name, email, date and number of guests.";

          }

          return;

        }


        const validEmail =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);


        if (!validEmail) {

          if (formMessage) {

            formMessage.textContent =
              "Please enter a valid email address.";

          }

          return;

        }


        if (formMessage) {

          formMessage.textContent =
            `Thank you, ${name}. Your table request has been received for ${guests} guest${guests === "1" ? "" : "s"}.`;

        }


        reservationForm.reset();

      }
    );

  }


  /* =====================================================
     BACK TO TOP
     ===================================================== */

  const backTop =
    document.querySelector(
      ".backtop"
    );


  if (backTop) {

    window.addEventListener(
      "scroll",
      () => {

        backTop.classList.toggle(
          "show",
          window.scrollY > 500
        );

      }
    );


    backTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }

});
/* =====================================================
   ORIGINE AUTOMATIC AMBIENT OUD MUSIC
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const audio =
        document.getElementById("origineAudio");

    const button =
        document.getElementById("origineSoundToggle");

    const icon =
        button?.querySelector(".sound-icon");


    /* Safety check */

    if (!audio || !button || !icon) {
        return;
    }


    /* =================================================
       VOLUME
    ================================================= */

    audio.volume = 0.14;


    /* =================================================
       UPDATE BUTTON
    ================================================= */

    function updateButton(isPlaying) {

        if (isPlaying) {

            icon.textContent = "🔊";

            button.setAttribute(
                "aria-label",
                "Turn ambient music off"
            );

            button.setAttribute(
                "title",
                "Turn ambient music off"
            );

            button.classList.add(
                "sound-playing"
            );

        } else {

            icon.textContent = "🔇";

            button.setAttribute(
                "aria-label",
                "Turn ambient music on"
            );

            button.setAttribute(
                "title",
                "Turn ambient music on"
            );

            button.classList.remove(
                "sound-playing"
            );
        }
    }


    /* =================================================
       START MUSIC
    ================================================= */

    function startMusic() {

        audio.volume = 0.15;

        const promise =
            audio.play();

        if (promise !== undefined) {

            promise
                .then(function () {

                    updateButton(true);

                })
                .catch(function () {

                    /*
                       Browser blocked autoplay.
                       Music will start after first interaction.
                    */

                    updateButton(false);

                });
        }
    }


    /* =================================================
       TRY AUTOPLAY IMMEDIATELY
    ================================================= */

    startMusic();


    /* =================================================
       FALLBACK FOR BROWSER AUTOPLAY BLOCK
    ================================================= */

    function startAfterInteraction() {

        if (audio.paused) {
            startMusic();
        }

        document.removeEventListener(
            "click",
            startAfterInteraction
        );

        document.removeEventListener(
            "touchstart",
            startAfterInteraction
        );

        document.removeEventListener(
            "keydown",
            startAfterInteraction
        );
    }


    document.addEventListener(
        "click",
        startAfterInteraction
    );

    document.addEventListener(
        "touchstart",
        startAfterInteraction
    );

    document.addEventListener(
        "keydown",
        startAfterInteraction
    );


    /* =================================================
       SOUND BUTTON
    ================================================= */

    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (audio.paused) {

                startMusic();

            } else {

                audio.pause();

                updateButton(false);
            }

        }
    );

});