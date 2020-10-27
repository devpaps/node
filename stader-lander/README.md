# Inlämning: Städer och länder, 10 Yhp

## Dynamisk webbapp med Javascript :rocket:

# Kodens funktioner

* Användaren ska kunna klicka på ett land och få upp vilka städer som tillhör det landet.
* Klickar man på en stad så kommer man till en ny vy där det presenteras lite information om staden utifrån vad som finns i *json* filen.
* Har man varit i staden så trycker man på hjärtat för att spara det till vidare.
* Klickar man på *"Städer jag besökt"* så kommer en ny vy upp, där presenteras det hur många människor som du kan tänkas träffat under dina resor till städerna. Där står även vilka städer du besökt.
* *"Städer jag besökt"* vyn innehåller även en knapp som användaren kan radera sina lagrade städer.

# Metoder

*Jag har exkluderat IE11 ur denna uppgift då jag använt ES6 funktioner.*

* **Template literals** - Överskådligt sätt att skriva ut HTML i javascript.
* **Arrow functions** -  Snabbare sätt att skriva en vanlig funktion.
* **Modules** - För att importera och exportera funktioner och variabler från andra javascripts filer.
* **Destructuring** - Packar upp värden från en array och lägger de i egna variabler.
* **Promise** - Är ett sätt för att arbeta mer async med exempelvis fetch().
* **const** - Variabel som inte går att skriva över värdet på.

# Sammanfattning

> Jag har inte arbetat med **fetch()** så mycket, så det var en utmaning innan jag kom över "tröskeln".

Jag började med penna och papper för att börja tänka ut hur jag skulle koda. Psuedo kod är riktigt bra som en grund. När jag hade kodat ett tag så kom jag till ett stopp som höll i sig i en hel dag. Jag fick inte fetch till att funka som jag ville. När jag startade webbappen så startade **ui()** funktionen, därefter så hämtades data från fetch som sedan sorterades i **countries()** och skickade tillbaka till **ui()** funktionen.

Så långt gick de bra. Men när jag skulle börja på vyn där man visar vilken stad man klickat på, så är jag tvungen att hämta datan från json filerna igen för att veta vilket land användaren tryckt på. Problemet jag hade nu var att försöka komma åt **init()** funktionen som hämtade i sin tur data från json filerna utan att skicka data vidare till **ui()** funktionen. Mitt syfte var att låta **init()** och **countries()** funktionen vara självständiga för att på så vis vara det hur enkelt som helst att skapa massor av dynamiska vyer.

> Frustrationen var ett faktum, jag hade inte en aning om hur det här skulle lösas.

Jag synade Google efter lösningar, jag ritade och skrev på post-it lappar när jag kom på en idé. Nästa dag satte jag mig och tog en post-it lapp i taget och provade. Nej, det går inte. Error koder avlöste varandra.

Men så provade jag att göra om koden i **init()** funktionen. Jag hade tidigare **.then** som avlöste varandra efter varje varandra. Jag använde mig istället av **async/await** metoden. Dels för att få mindre kod att titta på, jag kan nu använda mig av *Promises*. Med det så kommer koden att vänta tills json filen hämtad. Det löser inte mitt problem som jag hade riktigt, men jag kände att jag kom närmare och närmare min lösning att göra **init()** och **countries()** självständiga.

Från det här,

```javascript
async function init() {
  try {
    //Hämtar data från JSON filerna
    const fetchLand = await fetch("./land.json");
    const fetchCity = await fetch("./stad.json");

    await Promise.all([fetchLand, fetchCity])
      .then((data) => {
        const response = data.map((item) => item.json());
        return Promise.all(response);
      })
      .then((response) => {
        const [land, stad] = response;
        return ui(land, stad);
      });

  } catch (error) {
    console.log(error);
    alert(`Kunde inte ansluta till servern ${error}`);
  }
}
```

till detta,

```javascript
export async function init() {
 try {
  const fetchLand = fetch("./land.json");
  const fetchCity = fetch("./stad.json");

  const smooth = await Promise.all([fetchLand, fetchCity]);
  const response = await Promise.all(smooth.map((item) => item.json()));

  return response;
 } catch (error) {
  console.log(error);
  alert(`Kunde inte ansluta till servern ${error}`);
 }
}
```

Det här ser ju onekligen bra ut! Jo, jag la till moduler också för att lättare bryta ut vissa kod block som skulle återanvändas, japp, **init()** och **countries()**. Kan väl säga att när jag fick till så att min **init()** returnerade bara mitt response så var den i princip självständig direkt. Men så kom nästa problem, hur jag skulle anropa en funktion som var **async** och använde sig av ***Promise.all()***. Det var ju inte bara att anropa som en vanlig funktion, **init()**. Eftersom **init()** var **async** och använde sig av **Promises** så returnerade den ochså ett **Promise**. Jag var tvungen att göra den anropade funktionen **async** och i mitt anrop så kunde jag nu lägga till **await** som väntade på svaret från **init()**, när svaret kom, "desctrukta" jag om det till två olika variabler, land och stad. För att svaret som kom innehöll två arrayer, men det kom tillbaka i en variabel bara.

Det som har varit mest lärorikt den här veckan har varit hur man använder **modules** och Promises. Jag kommer använda **modules** fler gånger, var så säker. Supersmidigt att dela upp koden till mindre bitar, och om det är något som kan återanvändas. Har verkligen mött min nemesis, Promises. Men jag klarade det. Ska repetera det under veckan så det sitter.

## Förbättringar

Jag skulle behöva ändra på några variabelnamn, och lära mig namnge dem bättre. Designen skulle också varit lite bättre. Men jag satsade på funktion före form, det är ju typ hela konceptet inom MVP.
