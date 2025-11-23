/**
 * Slider Module
 * Handles image slider functionality
 */

const Slider = {
  currentSlide: 0,
  slides: [],
  slideCount: 0,
  sliderDotsContainer: null,
  autoSlideInterval: null,

  init() {
    this.slides = document.querySelectorAll('.slide');
    this.slideCount = this.slides.length;
    this.sliderDotsContainer = document.querySelector('.slider-dots');
    
    if (this.slideCount === 0) return;

    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');

    this.createDots();
    this.showSlide(this.currentSlide);
    this.startAutoSlide();

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetAutoSlide();
      });
    }
  },

  createDots() {
    if (!this.sliderDotsContainer) return;

    this.sliderDotsContainer.innerHTML = '';
    for (let i = 0; i < this.slideCount; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === this.currentSlide) {
        dot.classList.add('active');
      }
      dot.addEventListener('click', () => {
        this.showSlide(i);
        this.resetAutoSlide();
      });
      this.sliderDotsContainer.appendChild(dot);
    }
  },

  showSlide(n) {
    if (n >= this.slideCount) this.currentSlide = 0;
    else if (n < 0) this.currentSlide = this.slideCount - 1;
    else this.currentSlide = n;

    this.slides.forEach((slide, index) => {
      slide.classList.remove('active');
      if (index === this.currentSlide) {
        slide.classList.add('active');
      }
    });

    this.updateDots();
  },

  updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.remove('active');
      if (index === this.currentSlide) {
        dot.classList.add('active');
      }
    });
  },

  nextSlide() {
    this.showSlide(this.currentSlide + 1);
  },

  prevSlide() {
    this.showSlide(this.currentSlide - 1);
  },

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
  },

  resetAutoSlide() {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }
};
