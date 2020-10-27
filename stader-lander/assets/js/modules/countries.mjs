//Hämtar data från JSON filerna
export default async function init() {
	try {
		const fetchLand = fetch("http://localhost:3000/land");
		const fetchCity = fetch("http://localhost:3000/stad");

		const smooth = await Promise.all([fetchLand, fetchCity]);
		const response = await Promise.all(smooth.map((item) => item.json()));

		return response;
	} catch (error) {
		console.log(error);
		alert(`Kunde inte ansluta till servern ${error}`);
	}
}
