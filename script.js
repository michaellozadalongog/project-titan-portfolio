const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const feaImage = document.querySelector('#fea-image');
const feaTitle = document.querySelector('#fea-title');
const feaCopy = document.querySelector('#fea-copy');
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    feaImage.src = tab.dataset.img;
    feaImage.alt = `Project TITAN ${tab.dataset.title}`;
    feaTitle.textContent = tab.dataset.title;
    feaCopy.textContent = tab.dataset.copy;
  });
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
document.querySelectorAll('.drawing-card').forEach((card) => {
  card.addEventListener('click', () => {
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector('img').alt;
    lightbox.showModal();
  });
});
document.querySelector('#lightbox-close')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
