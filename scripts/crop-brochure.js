const sharp = require("sharp");
const fs = require("fs");

fs.mkdirSync("assets", { recursive: true });

const right = { left: 664, top: 48, width: 880, height: 800 };
const left = { left: 48, top: 48, width: 888, height: 800 };

async function crop(src, dest, rect) {
  await sharp(src).extract(rect).jpeg({ quality: 84, mozjpeg: true }).toFile(dest);
  console.log(dest);
}

async function cover(src, dest, regions) {
  const composites = [];
  for (const r of regions) {
    const patch = await sharp(src)
      .extract({
        left: r.left,
        top: r.sampleTop,
        width: r.width,
        height: r.sampleHeight,
      })
      .resize(r.width, r.height, { fit: "fill" })
      .blur(10)
      .toBuffer();
    composites.push({ input: patch, left: r.left, top: r.top });
  }
  await sharp(src).composite(composites).jpeg({ quality: 84, mozjpeg: true }).toFile(dest);
  console.log(dest);
}

(async () => {
  const framed = await sharp("brochure/page-01.jpg")
    .extract({ left: 40, top: 108, width: 1520, height: 720 })
    .toBuffer();
  const caption = await sharp(framed)
    .extract({ left: 400, top: 360, width: 740, height: 28 })
    .resize(740, 40, { fit: "fill" })
    .blur(0.6)
    .toBuffer();
  await sharp(framed)
    .composite([{ input: caption, left: 400, top: 304 }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile("assets/hero.jpg");
  console.log("assets/hero.jpg");

  await crop("brochure/page-17.jpg", "assets/living.jpg", right);
  await crop("brochure/page-14.jpg", "assets/pool.jpg", left);
  await crop("brochure/page-05.jpg", "assets/yachts.jpg", right);
  await crop("brochure/page-04.jpg", "assets/sealink.jpg", right);
  await crop("brochure/page-16.jpg", "assets/lobby.jpg", right);
  await crop("brochure/page-08.jpg", "assets/coastal.jpg", right);
  await crop("brochure/page-12.jpg", "assets/wellness.jpg", right);
  await crop("brochure/page-06.jpg", "assets/arrival.jpg", right);
})();
