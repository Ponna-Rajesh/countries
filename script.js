const countriesContainer = document.querySelector('.countries-container');
const filterByRegion = document.querySelector('.filter-by-region');
const searchInput = document.querySelector('.search-container input');
const themeChanger = document.querySelector('.theme-changer');

let allCountriesData = [];

document.addEventListener('DOMContentLoaded', () => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.body.classList.add('dark');
  }
});

// Fetch all countries data on load
fetch('https://restcountries.com/v3.1/all')
  .then((res) => res.json())
  .then((data) => {
    allCountriesData = data;
    renderCountries(data);
  })
  .catch((error) => {
    console.error('Error fetching countries:', error);
    countriesContainer.innerHTML = `<p class="error">Failed to load countries. Please try again later.</p>`;
  });

function renderCountries(data) {
  countriesContainer.innerHTML = '';
  data.forEach((country) => {
    const countryCard = document.createElement('a');
    countryCard.classList.add('country-card');
    countryCard.href = `country.html?name=${encodeURIComponent(country.name.common)}`;
    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="${country.name.common} flag" />
      <div class="card-text">
        <h3 class="card-title">${country.name.common}</h3>
        <p><b>Population:</b> ${country.population.toLocaleString('en-IN')}</p>
        <p><b>Region:</b> ${country.region}</p>
        <p><b>Capital:</b> ${country.capital?.[0] || 'N/A'}</p>
      </div>
    `;
    countriesContainer.appendChild(countryCard);
  });
}

filterByRegion.addEventListener('change', () => {
  const region = filterByRegion.value;
  if (region) {
    fetch(`https://restcountries.com/v3.1/region/${region}`)
      .then((res) => res.json())
      .then(renderCountries)
      .catch((error) => {
        console.error('Error filtering by region:', error);
        countriesContainer.innerHTML = `<p class="error">Failed to filter countries. Please try again later.</p>`;
      });
  } else {
    renderCountries(allCountriesData);
  }
});

searchInput.addEventListener('input', (e) => {
  const searchValue = e.target.value.toLowerCase();
  const filteredCountries = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(searchValue)
  );
  renderCountries(filteredCountries);
});

themeChanger.addEventListener('click', (e) => {
  e.preventDefault();
  const isDarkMode = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});
