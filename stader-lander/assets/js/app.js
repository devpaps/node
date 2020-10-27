
import init from './modules/countries.mjs';

// Visar starsidan
async function ui() {
	const [response] = await Promise.all([init()]);
	// Destructuring
	const [countries, cities] = response;

	let x = '';

	for (var i = 0; i < countries.length; i++) {
		const name = countries[i];
		x += `
			<div class="${name.countryname}">
				<h1 class="${name.countryname} country">${name.countryname}</h1>
					<div class="countries hide">
						<ul>
		`;

		for (var j = 0; j < cities.length; j++) {
			const stad = cities[j];
			if (countries[i].id === stad.countryid) {
				x += `
					<li>
						<a href="#" class="cities" data-index-number="${stad.id}">${stad.stadname}</a>
					</li>
				`;
			}
		}
		x += `	</ul>
					</div>
				</div>
		`;
	}

	const showtext = `
    <div id="list">
			<h1 class="title">Mina besökta länder</h1>
			${x}
			<div class="visited">
				<a href="#" id="visitedButton">Städer jag besökt</a>
				<br/>
				<br/>
				<a href="#" id="addNewDataButton">Lägg till</a>
			</div>
	</div>
`;

	const app = document.getElementById('app');
	app.insertAdjacentHTML('afterbegin', showtext);

	// Öppnar besökta städer sidan
	const visitedButton = document.getElementById('visitedButton');
	visitedButton.addEventListener('click', showVisitedPage);

	const addNewDataButton = document.getElementById('addNewDataButton');
	addNewDataButton.addEventListener('click', showAddNewData);

	// Gömmer städerna vid klick
	const countriesElement = Array.from(document.querySelectorAll('.country'));

	countriesElement.map((item) =>
		item.addEventListener('click', () => {
			const element = item.parentElement.children[1].classList;
			if (element.contains('hide')) {
				element.toggle('hide');
				return;
			} else {
				element.add('hide');
			}
		})
	);

	const selectCity = Array.from(document.querySelectorAll('.cities'));

	selectCity.map((item) =>
		item.addEventListener('click', () => {
			const stadId = item;
			return citiesInfo(stadId);
		})
	);
}

// Vy för att lägga till städer och länder
async function showAddNewData() {

	const [response] = await Promise.all([init()]);
	// Destructuring
	let [countries, cities] = response;

	//Tar bort listan med städer på startsidan
	const list = document.getElementById('list');
	list.parentNode.removeChild(list);

	const text = `
	<div id="addData">
		<h1>Lägga till en stad och ett land</h1>
		
			<div class="input-countries">
				<div>
					<label for="country">Land</label>
					<input type="text" name="country" id="country" class="form-field"/>
				</div>
				<button type="submit" id="addDataButtonLand">Lägg till land</button>
			</div>
			<div class="input-cities">
				<div>
					<label for="stad">Välj land:</label>
					<select name="stad" id="countryId">
						${countries.map(item => `
						<option value="${item.id}">${item.countryname}</option>
						`).join('')}
					</select>
				</div>
				<div>
					<label for="city">Stad</label>
					<input type="text" name="city" id="city" class="form-field"/>
				</div>
				<div>
					<label for="cityCount">Antal som bor där</label>
					<input type="text" name="cityCount" id="cityCount" class="form-field"/>
				</div>
				<button  id="addDataButtonStad">Lägg till stad</button>
				</div>
			</div>
		
		<a href="/stader-lander">Gå tillbaka</a>
	</div>
	`;

	const app = document.getElementById('app');
	app.insertAdjacentHTML('afterbegin', text);

	// Kör in datan från formuläret till API:et och vidare till 
	const addDataButtonLand = document.getElementById('addDataButtonLand');
	addDataButtonLand.addEventListener('click', (e) => addDataToJSONLand(e));

	const addDataButtonStad = document.getElementById('addDataButtonStad');
	addDataButtonStad.addEventListener('click', (e) => addDataToJSONStad(e));

}

 async function addDataToJSONLand(e) {
	 e.preventDefault();
	const [response] = await Promise.all([init()]);
	let [countries, cities] = response;

	// Hämtar landet som skrivits in i input fältet
	const land = document.getElementById('country').value;

	const x = {
		id: countries.length + 1,
		countryname: land
	}

	// Skickar med options för att servern ska kunna ta emot inkommande datan
	const optionsLand = {
		method: 'POST',
		headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		},
		body: JSON.stringify(x)
	}

	try {
		const resData = await fetch("http://localhost:3000/land", optionsLand);
		const res = await resData.text()
		alert(res);
	} catch (error) {
		alert(error);
	}
}

async function addDataToJSONStad() {
	const [response] = await Promise.all([init()]);
	let [countries, cities] = response;

	const countryId = document.getElementById('countryId');
	const countrySelectedId = countryId.options[countryId.selectedIndex].index+1;
	const city = document.getElementById('city').value;
	const cityCount = parseInt(document.getElementById('cityCount').value);

	const y = {
		id: cities.length + 1,
		stadname: city,
		countryid: countrySelectedId,
		population: cityCount
	};

	const optionsStad = {
		method: 'POST',
		headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		},
		body: JSON.stringify(y)
	}
	fetch("http://localhost:3000/stad", optionsStad);
	return false;
}



// Visar sidan med städer jag besökt
async function showVisitedPage() {
	const [response] = await Promise.all([init()]);
	const [land, stad] = response;

	const local = JSON.parse(localStorage.getItem('likedCities'));

	const antalInvånare = [];

	if (local) {
		local.map((item) => {
			const x = stad.find((index) => index.id === item).population;
			antalInvånare.push(x);
		});

		//Tar bort listan med städer på startsidan
		const list = document.getElementById('list');
		list.parentNode.removeChild(list);

		const showText = `
      <div id="visitedCities">
        <h1>Städer jag besökt</h1>
          <strong>${local
						.map((item) => stad.find((stad) => stad.id === item).stadname)
						.join(', ')}</strong>
          <p>Sammanlagt så kan jag har träffat ${antalInvånare
						.reduce((summa, antal) => summa + antal)
						.toString()
						.replace(
							/\B(?=(\d{3})+(?!\d))/g,
							' '
						)} st personer genom mina resor.</p>
          <button id="rensaStäderKnapp">Rensa besökta städer</button>
          <a id="backToHome" href="/stader-lander" style="display: block; margin-top: 2rem">Tillbaka till startsidan</a>
      </div>
		`;

		//Visar en ny lista på besökta städer
		const app = document.getElementById('app');
		app.insertAdjacentHTML('afterbegin', showText);

		//Raderar localstorage
		const rensaStäderKnapp = document.getElementById('rensaStäderKnapp');
		rensaStäderKnapp.addEventListener('click', clearLocalStorage);
	} else {
		//Tar bort listan med städer på startsidan
		const list = document.getElementById('list');
		list.parentNode.removeChild(list);

		const ingaStäderGillade = `
			<div id="visitedCities">
			<h1 class="title">Besökta städer</h1>
				<strong>Du har inte besökt några städer 😥</strong>
				<p><a href="/stader-lander">Gå tillbaka</a> och se om du missat att klicka i någon stad.</p>
			</div>
		`;

		//Visar en ny lista på besökta städer
		const app = document.getElementById('app');
		app.insertAdjacentHTML('afterbegin', ingaStäderGillade);
	}
}

// Raderar localstorage
function clearLocalStorage() {
	const raderaLocalStorage = confirm('Vill du radera dina sparade städer?');
	const storage = localStorage.getItem('likedCities');

	if (raderaLocalStorage && storage) {
		console.log('Raderar...');
		localStorage.removeItem('likedCities');

		//Tar bort listan med städer på startsidan
		const visitedCities = document.getElementById('visitedCities');
		visitedCities.parentNode.removeChild(visitedCities);

		const ingaStäderGillade = `
			<div id="visitedCities">
				<h1 class="title">Besökta städer</h1>
				<strong>Du har inte besökt några städer 😥</strong>
				<p><a href="/stader-lander">Gå tillbaka</a> och se om du missat att klicka i någon stad.</p>
			</div>
		`;

		//Visar en ny lista på besökta städer
		const app = document.getElementById('app');
		app.insertAdjacentHTML('afterbegin', ingaStäderGillade);
	} else if (!storage) {
		alert('Du har inga städer sparade');
	}
}

// Presenterar staden som blivit klickad på
async function citiesInfo(stadId) {
	const stadNr = parseInt(stadId.getAttribute('data-index-number'));

	// Anropar init funktionen för att hämta data från json filerna
	const [response] = await Promise.all([init()]);
	// Destructuring
	const [land, stad] = response;

	const list = document.getElementById('list');
	list.parentNode.removeChild(list);

	const hittaStaden = stad.find((item) => item.id === stadNr).countryid;
	const hittaLandet = land.find((item) => item.id === hittaStaden).countryname;

	const presenteraStad = `
    <div class="stad">
      <h1>Du har valt stad ${
				stad.find((item) => item.id === stadNr).stadname
			}. Den staden ligger i ${hittaLandet}.</h1>
      <p>Här bor det ${stad
				.find((item) => item.id === stadNr)
				.population.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} st människor</p>
      <div class="heart-btn">
        <div class="content">
          <i id="like" class="far fa-heart" data-liked-city=${stadNr}></i> Besökt
        </div>
      </div>
      <p><a href="/stader-lander">Gå tillbaka</a></p>
    </div>
  `;

	const app = document.getElementById('app');
	app.insertAdjacentHTML('afterbegin', presenteraStad);

	const getLikedHeart = document.getElementById('like');
	const isLocalStorageEmpty = JSON.parse(localStorage.getItem('likedCities'));

	for (const key in isLocalStorageEmpty) {
		if (isLocalStorageEmpty.hasOwnProperty(key)) {
			const element = isLocalStorageEmpty[key];
			if (element === stadNr) {
				getLikedHeart.classList.add('fas');
				getLikedHeart.classList.add('liked');
			}
		}
	}

	const like = document.getElementById('like');
	like.addEventListener('click', likedCity);
}

// Lägger till stad i localstorage och lägger till/från ett rött hjärta
function likedCity() {
	let likedCityId;
	const att = JSON.parse(like.getAttribute('data-liked-city'));

	const likedOrNot = like.classList.contains('liked');

	if (localStorage.getItem('likedCities') === null) {
		likedCityId = [];
	} else {
		likedCityId = JSON.parse(localStorage.getItem('likedCities'));
	}

	
	if (!likedOrNot && like.classList.contains('far')) {
		likedCityId.push(att);
		localStorage.setItem('likedCities', JSON.stringify(likedCityId));
		like.classList.add('fas');
		like.classList.add('liked');
	} else {
		like.classList.remove('fas');
		like.classList.remove('liked');
		let local = JSON.parse(localStorage.getItem('likedCities'))
		if (local.length === 1) {
			localStorage.removeItem('likedCities');
		} else {
			local.splice(att, 1)
			localStorage.setItem('likedCities', JSON.stringify(local));
		}
		//localStorage.setItem('likedCities', JSON.stringify(likedCities));
	}
}

//Initierar funktionen när HTML och alla Nodes blivit inlästa
document.addEventListener('DOMContentLoaded', ui);
