const projects = [
  { name: 'Northcote Terrace', type: 'Multi-residential', meta: '1,980 m² · Melbourne · 2023', cost: 2850 },
  { name: 'Merri Creek Offices', type: 'Commercial', meta: '2,450 m² · Melbourne · 2022', cost: 3120 },
  { name: 'West End Learning Hub', type: 'Education', meta: '2,760 m² · Geelong · 2024', cost: 3400 },
  { name: 'Banksia Apartments', type: 'Multi-residential', meta: '3,420 m² · Brisbane · 2021', cost: 2680 },
  { name: 'Harbour View Workplace', type: 'Commercial', meta: '5,100 m² · Sydney · 2023', cost: 3650 },
  { name: 'Little Lantern School', type: 'Education', meta: '1,850 m² · Ballarat · 2022', cost: 3180 },
  { name: 'Elm Street House', type: 'Single residential', meta: '420 m² · Melbourne · 2024', cost: 4920 },
  { name: 'Crescent Health Centre', type: 'Health', meta: '2,200 m² · Adelaide · 2020', cost: 4100 },
  { name: 'Redgum Townhouses', type: 'Multi-residential', meta: '2,680 m² · Canberra · 2022', cost: 2950 },
  { name: 'Foundry Lane Studios', type: 'Commercial', meta: '1,620 m² · Melbourne · 2021', cost: 2780 },
  { name: 'Wattle Park Primary', type: 'Education', meta: '3,100 m² · Perth · 2023', cost: 3520 },
  { name: 'Kite House', type: 'Single residential', meta: '280 m² · Hobart · 2022', cost: 4350 },
  { name: 'Riverside Medical Suites', type: 'Health', meta: '1,480 m² · Brisbane · 2024', cost: 4480 },
  { name: 'Lygon Street Living', type: 'Multi-residential', meta: '4,250 m² · Melbourne · 2020', cost: 2510 },
  { name: 'Southern Cross Offices', type: 'Commercial', meta: '6,800 m² · Sydney · 2021', cost: 3890 },
  { name: 'Paperbark Early Learning', type: 'Education', meta: '980 m² · Bendigo · 2024', cost: 3710 },
  { name: 'Clifton Hill Renovation', type: 'Single residential', meta: '360 m² · Melbourne · 2023', cost: 5280 },
  { name: 'Mallee Community Clinic', type: 'Health', meta: '760 m² · Mildura · 2022', cost: 3980 },
  { name: 'Seafarers Residences', type: 'Multi-residential', meta: '5,600 m² · Fremantle · 2023', cost: 3090 },
  { name: 'Orchard Road Hub', type: 'Commercial', meta: '2,900 m² · Newcastle · 2024', cost: 3310 }
];

const results = document.querySelector('#results-list');
const form = document.querySelector('#tender-form');
const count = document.querySelector('#match-count');
const estimate = document.querySelector('#estimate');
const copy = document.querySelector('#estimate-copy');

function money(value) { return `$${value.toLocaleString('en-AU')}`; }

function render(items) {
  results.innerHTML = items.map(project => `
    <article class="project-card">
      <span class="type">${project.type}</span>
      <h3>${project.name}</h3>
      <p>${project.meta}</p>
      <strong class="cost">${money(project.cost)} <small>/ m²</small></strong>
    </article>`).join('');
  count.textContent = `${items.length} match${items.length === 1 ? '' : 'es'}`;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const type = document.querySelector('#project-type').value;
  const area = Number(document.querySelector('#area').value);
  const location = document.querySelector('#location').value;
  const matches = type === 'Commercial' ? projects.filter(project => project.type === type).concat(projects[0]) : projects;
  const costs = matches.map(project => project.cost);
  estimate.textContent = `${money(Math.min(...costs))} — ${money(Math.max(...costs))} / m²`;
  copy.textContent = `${matches.length} comparable projects for a ${area.toLocaleString()} m² ${type.toLowerCase()} in ${location}.`;
  render(matches);
  document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#report-button').addEventListener('click', () => {
  const button = document.querySelector('#report-button');
  button.innerHTML = 'Comparison saved ✓';
  button.disabled = true;
});

render(projects);
