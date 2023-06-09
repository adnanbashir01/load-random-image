/*
// Button and Container to render the country 
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

let currLat;
let currLng;

// // Get the curent location using geolocation API 
// const currentLocation = navigator.geolocation.getCurrentPosition(function (position) {
//     currLat = position.coords.latitude;
//     currLng = position.coords.longitude;
// }, function (error) {
//     console.log(error);
// })

// Promisify the geolocation 
const getPosition = function () {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

// Where Am I function 
const whereAmI = function () {

    getPosition().then(pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=224116842654155321462x108681`)
    })

        .then(response => {
            if (!response.ok) throw new Error('Region not found');
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log(`You are in ${data.city}, ${data.country}`);

            // Render the country 
            getCountryData(data.country);
        })
        .catch(err => {
            console.log(err);
        })
}

//////////////////////////////////////
// Render the Country using the same data
///////////////////////////////////////

const renderCountry = function (data, className = '') {
    const html = `
        <article class="country ${className}">
          <img class="country__img" src="${data.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[Object.keys(data.languages)[0]]}</p>
            <p class="country__row"><span>💰</span>${data.currencies[Object.keys(data.currencies)[0]].name}</p>
          </div>
        </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
}

const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
}

// Fetch and catch error manually
const getJSON = function (url, errorMsg = 'Something went wrong') {
    return fetch(url)
        .then(response => {
            // console.log(response)
            if (!response.ok)
                throw new Error(`${errorMsg} (${response.status})`)
            return response.json()
        })
}

// Get the Data of country 
const getCountryData = function (country) {
    // Country 1
    getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
        .then(data => {
            renderCountry(data[0])

            const neighbour = data[0].borders?.[0];
            if (!neighbour) throw new Error('No neighbour found');

            // Country 2 (Neighbour)
            return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'No neighbour available!')
        })
        .then(data => {
            renderCountry(data[0], 'neighbour');
        })
        .catch(err => {
            console.log(err);
            renderError(`Something went wrong. 💥💥 ${err.message}. Try again!`)
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;
        });
}

btn.addEventListener('click', function () {
    // whereAmI(19.037, 72.873);
    whereAmI(currLat, currLng);
});

// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
*/
// const imgContainer = document.querySelector('.images')

// const createImage = function (imgPath) {
//     return new Promise(function (resolve, reject) {
//         const img = document.createElement('img');
//         img.src = imgPath;
//         img.addEventListener('load', function () {
//             imgContainer.append(img);
//             resolve(img)
//         })

//         img.addEventListener('error', function () {
//             reject(new Error('Image not found'))
//         })
//     })
// }

// const wait = function (seconds) {
//     return new Promise(function (resolve) {
//         setTimeout(resolve, 1000 * seconds);
//     })
// }

// let currentImg;
// createImage('img/img-1.jpg').then(img => {
//     currentImg = img;
//     console.log(img);
//     return wait(2)
// })
//     .then(() => {
//         currentImg.style.display = 'none';
//         return createImage('img/img-2.jpg')
//     })
//     .then(img => {
//         currentImg = img;
//         console.log(img);
//         return wait(2)
//     }).catch(err => console.log(err));

const imgContainer = document.querySelector('.images')

const createImage = function (imgPath) {
    return new Promise(function (resolve, reject) {
        const img = document.createElement('img');
        img.src = imgPath;
        img.addEventListener('load', function () {
            imgContainer.append(img);
            resolve(img)
        })

        img.addEventListener('error', function () {
            reject(new Error('Image not found'))
        })
    })
}

const wait = function (seconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, 1000 * seconds);
    })
}

let currentImg;


// Load images from Pixabay 
// Get the values using Form
const form = document.querySelector('.form')
const formSubmit = document.querySelector('.form__submit');
let placeholder;

form.addEventListener('submit', function (e) {
    const searchQuery = document.querySelector('.form__input').value;
    e.preventDefault();
    if (currentImg != undefined) currentImg.style.display = 'none';
    placeholder = searchQuery;
    loadNPause();
});

// Define the images
let imageOne;
let imageTwo;

const loadNPause = async function () {
    try {
        await fetch(`https://pixabay.com/api/?key=37012067-4a6262ec39669342dd42cccfc&q=${placeholder}&image_type=photo&pretty=true`)
            .then(response => {
                if (!response.ok)
                    throw new Error(`Country not found ${response.status}`)
                return response.json();
            })
            .then(data => {
                console.log(data.hits);
                imageOne = data.hits[Math.trunc((Math.random() * data.hits.length))].largeImageURL;
                imageTwo = data.hits[Math.trunc((Math.random() * data.hits.length))].largeImageURL;
            });

        const imgCrt = await createImage(`${imageOne}`)
        currentImg = imgCrt;
    } catch (err) {
        console.log(err);
    }
}

console.log('Welcome');