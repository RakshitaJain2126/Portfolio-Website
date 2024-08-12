document.addEventListener('DOMContentLoaded', () => {

  const text = document.querySelector('.text p');
  if (text) {
    text.innerHTML = text.innerText.split('').map(
      (char, i) => `<span style="transform:rotate(${i * 8.3}deg)">${char}</span>`
    ).join('');
  }


  const gallery = document.querySelector('.gallery');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');

  const scrollGallery = (distance) => {
    gallery.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  };

  if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => scrollGallery(-300));
    nextButton.addEventListener('click', () => scrollGallery(300));
  }

  let isDragging = false;
  let startX;
  let scrollLeft;

  const handleDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - gallery.offsetLeft;
    const walk = (x - startX) * 2;
    gallery.scrollLeft = scrollLeft - walk;
  };

  gallery.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
    gallery.style.cursor = 'grabbing';
  });

  gallery.addEventListener('mouseleave', () => {
    isDragging = false;
    gallery.style.cursor = 'grab';
  });

  gallery.addEventListener('mouseup', () => {
    isDragging = false;
    gallery.style.cursor = 'grab';
  });

  gallery.addEventListener('mousemove', handleDrag);

  gallery.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
    gallery.style.cursor = 'grabbing';
  });

  gallery.addEventListener('touchend', () => {
    isDragging = false;
    gallery.style.cursor = 'grab';
  });

  gallery.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - gallery.offsetLeft;
    const walk = (x - startX) * 2;
    gallery.scrollLeft = scrollLeft - walk;
  });


  const updateImageSources = () => {
    const images = document.querySelectorAll('.gallery-item img');
    const isSmallScreen = window.innerWidth <= 468;

    images.forEach(img => {
      img.src = isSmallScreen ? img.getAttribute('data-src-small') : img.getAttribute('data-src');
    });
  };

  window.addEventListener('load', updateImageSources);
  window.addEventListener('resize', updateImageSources);


  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Thank you for your message!');
            form.reset();
          } else {
            console.error('Submission failed:', data);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  }


  const texts = ['Tech Enthusiast', 'Active', 'Creative', 'Dreamer', 'Front End Developer'];
  let currentIndex = 0;
  const textSlideElement = document.getElementById("text-slide");

  function changeText() {
    if (!textSlideElement) return;

    textSlideElement.classList.add('hide');

    setTimeout(() => {
      textSlideElement.textContent = texts[currentIndex];
      textSlideElement.classList.remove('hide');
      currentIndex = (currentIndex + 1) % texts.length;
    }, 1000);
  }

  setInterval(changeText, 2000);


  const navItems = document.querySelectorAll(".nav-list > li");
  const navList = document.querySelector(".nav-list");
  const indicator = document.createElement("div");
  indicator.className = "nav-active-indicator";
  navList.appendChild(indicator);

  const updateIndicator = () => {
    const activeItem = document.querySelector(".nav-list > li.active") || navItems[0];
    const { offsetLeft, offsetWidth } = activeItem;
    indicator.style.left = `${offsetLeft}px`;
    indicator.style.width = `${offsetWidth}px`;
  };

  const setActiveSection = () => {
    let index = -1;
    navItems.forEach((item, i) => {
      const sectionId = item.querySelector('a').getAttribute('href').substring(1);
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          index = i;
        }
      }
    });

    navItems.forEach((item, i) => item.classList.toggle('active', i === index));
    updateIndicator();
  };

  updateIndicator();
  indicator.style.transition = "none";

  requestAnimationFrame(() => {
    indicator.style.transition = "width 0.3s ease, left 0.3s ease";
  });

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item.querySelector('a').getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: offsetTop,
          behavior: 'auto'
        });
      }

      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      updateIndicator();

      if (navList.classList.contains("show")) {
        navList.classList.remove("show");
        navToggle.classList.remove("active");
      }
    });
  });

  const navToggle = document.getElementById("navbar-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("show");
      navToggle.classList.toggle("active");

      if (navList.classList.contains("show")) {
        navList.classList.add("hide-indicator");
      } else {
        navList.classList.remove("hide-indicator");
        updateIndicator();
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 800) {
      updateIndicator();
    }
  });

  window.addEventListener("scroll", setActiveSection);
});
