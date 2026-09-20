const projects = [
  { name: 'Northcote Terrace', type: 'Multi-residential', meta: '1,980 m² · Melbourne · 2023', cost: 2850 },
  { name: 'Merri Creek Offices', type: 'Commercial', meta: '2,450 m² · Melbourne · 2022', cost: 3120 },
  { name: 'West End Learning Hub', type: 'Education', meta: '2,760 m² · Geelong · 2024', cost: 3400 }
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
