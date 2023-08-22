'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function(data, className='') {
    const html =  `
    <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${data.population} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
        </div>
    </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    // countriesContainer.style.opacity = 1;
}

const renderError = function(err) {
    console.error(err);
    countriesContainer.insertAdjacentText('beforeend', err);
}

///////////////////////////////////////
// const getCountryData = function(country) {

//     const request = new XMLHttpRequest();
//     request.open('GET', `https://countries-api-836d.onrender.com/countries/name/${country}`);
//     request.send();

//     request.addEventListener('load', function() {
//         // console.log(this.responseText);
//         const [data] = JSON.parse(this.responseText);
//         console.log(data);

//         const html =  `
//             <article class="country">
//                 <img class="country__img" src="${data.flag}" />
//                 <div class="country__data">
//                     <h3 class="country__name">${data.name}</h3>
//                     <h4 class="country__region">${data.region}</h4>
//                     <p class="country__row"><span>👫</span>${data.population} people</p>
//                     <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
//                     <p class="country__row"><span>💰</span>${data.currencies[0].code}</p>
//                 </div>
//             </article>
//         `;
//         countriesContainer.insertAdjacentHTML('beforeend', html);
//         countriesContainer.style.opacity = 1;
//     });

// }

// getCountryData('india');
// getCountryData('usa');

// const getCountryAndNeighbor = function(country) {

//     const request = new XMLHttpRequest();
//     request.open('GET', `https://countries-api-836d.onrender.com/countries/name/${country}`);
//     request.send();

//     request.addEventListener('load', function() {
//         // console.log(this.responseText);
//         const [data] = JSON.parse(this.responseText);
//         console.log(data);

//         renderCountry(data);

//         const neighbor = data.borders?.[0];
//         if(!neighbor) return;

//         const request2 = new XMLHttpRequest();
//         request2.open('GET', `https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`);
//         request2.send();

//         request2.addEventListener('load', function() {
//             const data2 = JSON.parse(this.responseText);
//             console.log(data2);
//             renderCountry(data2, 'neighbour');
//         });

//     });

// }

// getCountryAndNeighbor('usa');

const getJSON = function(url, errorMsg = 'Something went wrong!') {
    return fetch(url)
    .then(response => {
        if(!response.ok) throw new Error(`${errorMsg} (${response.status})`);
        // console.log(response.json());
        return response.json();
    });
};

const getCountryData = function(country) {
    getJSON(`https://countries-api-836d.onrender.com/countries/name/${country}`, 'Country not found')
    .then(data => {
        renderCountry(data[0]);
        const neighbor = data[0].borders?.[0];
        if(!neighbor) throw new Error('Country has no neighbours');
        return getJSON(`https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`, 'Country not found');
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => renderError(err))
    .finally(() => countriesContainer.style.opacity = 1);
}

// const getCountryData = function(country) {
//     fetch(`https://countries-api-836d.onrender.com/countries/name/${country}`)
//     .then(response => response.json())
//     .then(data => {
//         renderCountry(data[0]);
//         const neighbor = data[0].borders?.[0];
//         if(!neighbor) return;
//         return fetch(`https://countries-api-836d.onrender.com/countries/alpha/${neighbor}`);
//     })
//     .then(response => response.json())
//     .then(data => renderCountry(data, 'neighbour'))
//     .catch(err => renderError(err))
//     .finally(() => countriesContainer.style.opacity = 1);
// }

// btn.addEventListener('click', function() {
//     getCountryData('australia');
// });

// getCountryData('australia');

/***** CHALLENGE #1 *****/
const whereAmI = function(lat, lng) {
    fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(response => {
        if(!response.ok) throw new Error(`Error in fetching data ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log(data)
        console.log(`You are in ${data.city}, ${data.country}`);
        getCountryData(data.country);
    }).catch(err => {
        console.log(err);
    });
}

whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);