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
// const whereAmI = function(lat, lng) {
//     fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     .then(response => {
//         if(!response.ok) throw new Error(`Error in fetching data ${response.status}`);
//         return response.json();
//     })
//     .then(data => {
//         console.log(data)
//         console.log(`You are in ${data.city}, ${data.country}`);
//         getCountryData(data.country);
//     }).catch(err => {
//         console.log(err);
//     });
// }

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);

// const lotteryPromise = new Promise(function(resolve, reject) {
//     console.log("The lottery is being drawn");
//     setTimeout(() => {
//         if(Math.random() >= 0.5) {
//             resolve('You won the lottery');
//         } else {
//             reject(new Error('You lost'));
//         }
//     }, 2000);
// });

// lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

// PROMISIFYING
const wait = function(seconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, seconds*1000);
    });
}

// wait(1)
// .then(() => {
//     console.log("Waited for one second")
//     return wait(1);
// })
// .then(() => console.log('Waited for 2 seconds'));

// Promise.resolve('abc').then((x) => console.log('Promise has been resolved. Value returned = ' + x));
// Promise.reject(new Error('Promise got rejected')).then((err) => console.log(err));

const getPosition = function() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            err => reject(err)
        )
    })
};

// const whereAmI = function() {
//     console.log("Started Search");
//     getPosition().then(position => {
//         const {latitude: lat, longitude: lng} = position.coords;
//         return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//     })
//     .then(response => {
//         console.log(response);
//         if(!response.ok) throw new Error(`Error in fetching data ${response.status}`);
//         return response.json();
//     })
//     .then(data => {
//         console.log(data)
//         console.log(`You are in ${data.city}, ${data.country}`);
//         getCountryData(data.country);
//     }).catch(err => {
//         console.log(err);
//     });
// }

// btn.addEventListener('click', whereAmI);

/***** CHALLENGE #2 *****/

const createImage = function(imgPath) {
    return new Promise(function(resolve, reject) {
        const newImg = document.createElement('img');
        newImg.src = imgPath;
        newImg.addEventListener('load', function() {
            const images = document.querySelector('.images');
            images.insertAdjacentElement('beforeend', newImg);
            resolve(newImg);
        });

        newImg.addEventListener('error', function() {
            reject(new Error('Image at Path does not exits'));
        });
    });
};

// let currentImg;

// createImage('img/img-1.jpg')
// .then(img => {
//     currentImg = img;
//     return wait(2);
// })
// .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-2.jpg')
// })
// .then(img => {
//     currentImg = img;
//     return wait(2);
// })
// .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-3.jpg')
// })
// .catch(err => {
//     console.log(err);
// });

// const whereAmI = async function() {
//     console.log('STARTED');
//     try {
//         const position = await getPosition();
//         console.log(position);
//         const {latitude: lat, longitude: lng} = position.coords;

//         const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
//         if(!resGeo.ok) throw new Error('Problem getting location data');

//         const dataGeo = await resGeo.json();

//         console.log(dataGeo);

//         // getPosition().then(position => {
//         //     const {latitude: lat, longitude: lng} = position.coords;
//         //     return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//         // })
//         const res = await fetch(`https://countries-api-836d.onrender.com/countries/name/${dataGeo.country}`);
//         if(!res.ok) throw new Error('Problem getting location data');
//         const resData = await res.json();
//         console.log(resData);
//         renderCountry(resData[0]);

//         return `You are in ${dataGeo.city}, ${dataGeo.country}`;
//     } catch (err) {
//         console.log('In catch');
//         renderError(err.message);
//         throw err;
//     } finally {
//         countriesContainer.style.opacity = 1;
//     }
// }

// console.log('1: Will get the location');
// (async function() {
//     try {
//         const city = await whereAmI();
//         console.log(`2: ${city}`);
//     } catch(err) {
//         console.error(`2: ${err}`);
//     }
//     console.log('3: Finished getting location');
// })();

// const get3Countries = async function(c1, c2, c3) {
//     try {
//         const data = await Promise.all([
//             getJSON(`https://countries-api-836d.onrender.com/countries/name/${c1}`),
//             getJSON(`https://countries-api-836d.onrender.com/countries/name/${c2}`),
//             getJSON(`https://countries-api-836d.onrender.com/countries/name/${c3}`)
//         ]);
//         console.log(data.map(d => d[0].capital));
//     } catch(err) {
//         console.error(err);
//     }
// }

// get3Countries('portugal', 'canada', 'tanzania');

(async function() {
    const data = await Promise.race([
        getJSON(`https://countries-api-836d.onrender.com/countries/name/portugal`),
        getJSON(`https://countries-api-836d.onrender.com/countries/name/canada`),
        getJSON(`https://countries-api-836d.onrender.com/countries/name/tanzania`)
    ]);
    console.log(data);
})();

const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error('REQUEST TOOK TOO LONG!'));
        }, s*1000);
    });
};

Promise.race([
    getJSON(`https://countries-api-836d.onrender.com/countries/name/portugal`),
    timeout(1)
])
.then(data => console.log(data[0]))
.catch(err => console.log(err));

Promise.allSettled([
    Promise.resolve('ALL_SETTLED: Success'),
    Promise.reject('ALL_SETTLED: REJECT'),
    Promise.reject('ALL_SETTLED: Success')
])
.then(res => console.log(res))
.catch(err => console.error(err));

Promise.any([
    Promise.resolve('ANY: Success'),
    Promise.reject('REJECT'),
    Promise.reject('Success')
])
.then(res => console.log(res))
.catch(err => console.error(err));

/***** CHALLENGE #3 *****/
// let currentImg;
// const loadNPause = async function() {
//     try {
//         currentImg = await createImage('img/img-1.jpg');
//         await wait(2);
//         currentImg.style.display = 'none';
//         currentImg = await createImage('img/img-2.jpg');
//         await wait(2);
//         currentImg.style.display = 'none';
//         currentImg = await createImage('img/img-3.jpg');
//         await wait(2);
//         currentImg.style.display = 'none';
//     } catch(err) {
//         console.error(err);
//     }
// }

// loadNPause();


const loadAll = async function(imgArr) {
    const imgs = imgArr.map(async img => await createImage(img));
    console.log(imgs);
    const actualImgs = await Promise.all(imgs);
    actualImgs.forEach(img => img.classList.add('parallel'));
}

loadAll(['img/img-1.jpg','img/img-2.jpg','img/img-3.jpg'])

// .then(img => {
    //     currentImg = img;
    //     return wait(2);
    // })
    // .then(() => {
    //     currentImg.style.display = 'none';
    //     return createImage('img/img-2.jpg')
    // })
    // .then(img => {
    //     currentImg = img;
    //     return wait(2);
    // })
    // .then(() => {
    //     currentImg.style.display = 'none';
    //     return createImage('img/img-3.jpg')
    // })
    // .catch(err => {
    //     console.log(err);
    // });