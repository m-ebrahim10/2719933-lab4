
const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const loadingSpinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");


searchBtn.addEventListener("click", () => {
    searchCountry(countryInput.value.trim());
});

countryInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchCountry(countryInput.value.trim());
    }
});


async function searchCountry(countryName) {
    if (!countryName) {
        setError("Please enter a country name.");
        return;
    }

    try {
        clearError();
        show(loadingSpinner);
        hide(countryInfo);
        hide(borderingCountries);
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "";

        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);

        if (!response.ok) {
            throw new Error("Country not found. Please check spelling.");
        }

        const data = await response.json();
        const country = data[0];

        const name = country.name.common;
        const capital = country.capital ? country.capital[0] : "N/A";
        const population = country.population.toLocaleString();
        const region = country.region;
        const flag = country.flags.svg;

        countryInfo.innerHTML = `
            <h2>${name}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flag}" alt="${name} flag">
        `;
        show(countryInfo);

        if (country.borders && country.borders.length > 0) {
            borderingCountries.innerHTML = `<h3 style="grid-column: 1/-1;">Bordering Countries</h3>`;
            show(borderingCountries);

            for (let code of country.borders) {
                const borderRes = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderRes.json();
                const borderCountry = borderData[0];

                const borderDiv = document.createElement("div");
                borderDiv.className = "border-item";
                borderDiv.innerHTML = `
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common}">
                    <span>${borderCountry.name.common}</span>
                `;
                borderingCountries.appendChild(borderDiv);
            }
        } else {
            borderingCountries.innerHTML = `<p style="grid-column: 1/-1;">No bordering countries (island nation).</p>`;
            show(borderingCountries);
        }

    } catch (error) {
        setError(error.message);
    } finally {
        hide(loadingSpinner);
    }
}


function show(el) {
    el.classList.remove("hidden");
}

function hide(el) {
    el.classList.add("hidden");
}

function setError(message) {
    errorMessage.textContent = message;
    show(errorMessage);
}

function clearError() {
    errorMessage.textContent = "";
    hide(errorMessage);
}