import cheerio from "cheerio";

async function getPageHTML(searchTerm, fallback) {
	try {
		let wikipediaTitle = searchTerm.match(/\/wiki\/(.*?)(?=#|$)/)[1];
		wikipediaTitle = decodeURIComponent(wikipediaTitle);
		wikipediaTitle = wikipediaTitle.replace(/\_/g, " ");

		const url =
			"https://en.wikipedia.org/w/api.php?" +
			new URLSearchParams({
				action: "parse",
				origin: "*",
				page: wikipediaTitle,
				format: "json",
			});

		const response = await fetch(url, { mode: "cors" });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		if (
			!data["parse"] ||
			!data["parse"]["text"] ||
			!data["parse"]["text"]["*"]
		) {
			throw new Error(
				`Unexpected response structure from Wikipedia API for page ${wikipediaTitle}`
			);
		}
		let htmlText = data["parse"]["text"]["*"];

		// Check for a redirect.
		if (htmlText.includes('class="redirectMsg"')) {
			// Parse out the URL of the new page.
			const $ = cheerio.load(htmlText);
			const redirectUrl = $(".redirectText a").attr("href");
			// Recursively call getPageHTML with the new URL.
			htmlText = await getPageHTML(redirectUrl, fallback);
		}

		return htmlText;
	} catch (error) {
		console.error(error);
		return fallback;
	}
}

function getInfoboxFirstImage(htmlContent, isCircuit, fallback) {
	try {
		const $ = cheerio.load(htmlContent);
		const Images = $(".infobox-image img");
		const svgImages = $(".infobox-image img").filter(function () {
			return $(this).attr("src").includes(".svg");
		});
		if (Images.length < 1) return fallback;
		if (Images.length < 2) return $(".infobox-image img").first().attr("src");
		if (isCircuit) {
			if (svgImages.length < 2)
				return $(".infobox-image img")
					.filter(function () {
						return $(this).attr("src").includes(".svg");
					})
					.first()
					.attr("src");
			return svgImages.eq(1).attr("src");
		} else {
			if (svgImages.length < 2) return Images.first().attr("src");
		}
	} catch (error) {
		console.error(error);
		return fallback;
	}
}

export default async function getImageForPage(url, fallback, isCircuit) {
	const htmlContent = await getPageHTML(url, fallback);
	const imageUrl = getInfoboxFirstImage(htmlContent, isCircuit, fallback);
	return imageUrl;
}
