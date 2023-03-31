var { createCanvas, loadImage } = require('canvas');
var path = require("path");
const router = require("express").Router();

router.get('/', getScott);
router.get('/:id', getScott);
router.get('/:id/:scott', getScott);

async function getScott (req, res) {
  var gameID = req.params.id ?? 620;
  var scottID = req.params.scott ?? Math.floor(Math.random() * 7);

  res.set('Cache-Control', "public, max-age=300, s-maxage=600");
  res.setHeader('Content-Type', 'image/png');

  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');

  var hero = await loadImage(`https://cdn.cloudflare.steamstatic.com/steam/apps/${gameID}/library_hero.jpg`).catch(() => "404");
	var scott = await loadImage(`/public/woz${scottID}.png`).catch(() => "404");
	var logo = await loadImage(`https://cdn.cloudflare.steamstatic.com/steam/apps/${gameID}/logo.png`).catch(() => "404");

  if (scott === "404") {
		console.log("Scott error: " + scottID);
		res.setHeader('Content-Type', 'text/plain');
		res.status(404).send(`Scott ID ${scottID} does not exist.`);
		return;
  }
	if (hero === "404" || logo === "404") {
		console.log("404 error: " + gameID);
		res.setHeader('Content-Type', 'text/plain');
		res.status(404).send(`Steam ID ${gameID} does not have logo, hero image, or does not exist.`);
		return;
	}

	console.log("Generating: " + gameID);
	ctx.drawImage(hero, -505, 0, 2229, 720);
	ctx.drawImage(scott, 0, 0, 1280, 720);

	const newHeight = 800 / (logo.width / logo.height);
  ctx.fillStyle = 'black';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 16;
	ctx.drawImage(logo, 64, Math.max(240 - (newHeight / 2), 32), 800, newHeight);
	res.send(canvas.toBuffer());
	return;
}

module.exports = router;