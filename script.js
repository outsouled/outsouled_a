// super-simple loader + swipe logic
let data = {};
let city = 'nyc';
let index = 0;

const cardContainer = document.getElementById('cardContainer');
const sellersList = document.getElementById('sellersList');
const nycBtn = document.getElementById('nycBtn');
const mumbaiBtn = document.getElementById('mumbaiBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

fetch('./data.json')
  .then(r => r.json())
  .then(d => {
    data = d;
    renderCards();
    showCard(0);
  })
  .catch(err => {
    cardContainer.innerHTML = '<div class="card"><h2>Could not load data.json</h2><p style="color:#666;">Make sure data.json is in the same folder.</p></div>';
    console.error(err);
  });

nycBtn.addEventListener('click', () => { city='nyc'; setActiveCity(); renderCards(); showCard(0); });
mumbaiBtn.addEventListener('click', () => { city='mumbai'; setActiveCity(); renderCards(); showCard(0); });
prevBtn.addEventListener('click', () => showCard(index - 1));
nextBtn.addEventListener('click', () => showCard(index + 1));

function setActiveCity(){
  nycBtn.classList.toggle('active', city==='nyc');
  mumbaiBtn.classList.toggle('active', city==='mumbai');
}

function renderCards(){
  cardContainer.innerHTML = '';
  const arr = data[city] || [];
  arr.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.i = i;
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <h2>${item.name}</h2>
      <div class="meta">Release: ${item.releaseDate} • $${item.price}</div>
      <div class="meta">${item.storeNote || ''}</div>
    `;
    // place with small offset for stacked look
    card.style.transform = `translateX(${i*6}px) translateY(${i*6}px)`;
    card.style.zIndex = 100 - i;
    cardContainer.appendChild(card);
  });
}

function showCard(i){
  const arr = data[city] || [];
  if(arr.length === 0){
    cardContainer.innerHTML = '<div class="card"><h2>No drops listed</h2><p class="meta">Add sellers using the "Become a Seller" link</p></div>';
    sellersList.innerHTML = '';
    return;
  }
  if(i < 0) i = arr.length - 1;
  if(i >= arr.length) i = 0;
  index = i;

  const cards = Array.from(cardContainer.querySelectorAll('.card'));
  cards.forEach((card, idx) => {
    const pos = idx - index;
    if(pos === 0){
      card.style.transform = 'translateX(0) translateY(0) scale(1)';
      card.style.opacity = 1;
      card.style.pointerEvents = 'auto';
    } else {
      const sign = pos > 0 ? 1 : -1;
      card.style.transform = `translateX(${sign * 80 + pos*6}px) translateY(${Math.abs(pos)*6}px) scale(${0.95 - Math.abs(pos)*0.03})`;
      card.style.opacity = Math.max(0.25, 1 - Math.abs(pos)*0.25);
      card.style.pointerEvents = 'none';
    }
  });

  // sellers list
  const current = arr[index];
  sellersList.innerHTML = '';
  current.sellers.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${s.name}</span><a href="${s.contact}" target="_blank">Contact</a>`;
    sellersList.appendChild(li);
  });
}

// touch swipe for mobile
let startX = 0;
cardContainer.addEventListener('touchstart', e => startX = e.touches[0].clientX);
cardContainer.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  if(diff > 40){
    showCard(index - 1);
  } else if(diff < -40){
    showCard(index + 1);
  }
});
