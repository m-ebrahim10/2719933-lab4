
document.getElementById("search-btn").addEventListener("click", fetchCountryData);

// gwala search on Enter key press
document.getElementById("country-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        fetchCountryData();
    }
});

async function fetchCountryData() {
    const countryName = document.getElementById("country-input").value.trim();
    
    // gwala DOM elements
    const spinner = document.getElementById("loading-spinner");
    const errorMsg = document.getElementById("error-message");
    const countryInfo = document.getElementById("country-info");
    const bordersInfo = document.getElementById("bordering-countries");

    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }

    
    errorMsg.classList.add("hidden");
    countryInfo.classList.add("hidden");
    bordersInfo.classList.add("hidden");
    
    //gwala spinner bs
    spinner.classList.remove("hidden");

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error("Country not found. Please try another name.");
        }

        const countryData = await response.json();
        displayCountryInfo(countryData[0]);

        
        countryInfo.classList.remove("hidden");

    } catch (error) {
        
        errorMsg.textContent = error.message;
        errorMsg.classList.remove("hidden");
    } finally {
        
        spinner.classList.add("hidden");
    }
}

function displayCountryInfo(country) {
    const countryInfo = document.getElementById("country-info");
    
   
    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="150">
    `;

    if (country.borders) {
        fetchBorderingCountries(country.borders);
    } else {
        const bordersInfo = document.getElementById("bordering-countries");
        bordersInfo.innerHTML = "<p>No bordering countries.</p>";
        bordersInfo.classList.remove("hidden");
    }
}

async function fetchBorderingCountries(borderCodes) {
    const bordersInfo = document.getElementById("bordering-countries");
    
    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`);
        const borderCountries = await response.json();

        let bordersHTML = "<h3>Bordering Countries:</h3><div class='border-grid'>";
        borderCountries.forEach(border => {
            bordersHTML += `
                <div>
                    <p><strong>${border.name.common}</strong></p>
                    <img src="${border.flags.svg}" alt="Flag of ${border.name.common}" width="100">
                </div>
            `;
        });
        bordersHTML += "</div>";

        bordersInfo.innerHTML = bordersHTML;
        bordersInfo.classList.remove("hidden");
    } catch (error) {
        bordersInfo.innerHTML = "<p class='error'>Error loading border countries.</p>";
        bordersInfo.classList.remove("hidden");
    }
}