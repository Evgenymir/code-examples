import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const getPage = () => async (ctx, next) => {
  const imageName = ctx.params?.name ?? '';
  const imageNameLowerCased = imageName && imageName.toLowerCase();
  const imageNameSplit = imageNameLowerCased && imageNameLowerCased.split('.');
  const imageNameOnly = imageNameSplit && imageNameSplit.shift();
  const directory = path.resolve(__dirname, '../../../../client/images');
  const imagePath = `${directory}/sprite/currencies/${imageNameOnly}.svg`;
  const outputImagePath = `${directory}/cached/${imageNameOnly}.png`;
  const defaultImagePath = `${directory}/site-image.png`;
  const isImageSvgExists = fs.existsSync(imagePath);
  const isImagePngExists = fs.existsSync(outputImagePath);
  const outputDirectoryPath = `${directory}/cached`;
  const isDirectoryPathExist = fs.existsSync(outputDirectoryPath);
  const isDirectoryExist = isDirectoryPathExist && fs.lstatSync(outputDirectoryPath).isDirectory();

  if (!isDirectoryExist) {
    fs.mkdirSync(outputDirectoryPath);
  }

  ctx.response.set('content-type', 'image/png');

  let readableStream;

  if (isImagePngExists) {
    readableStream = fs.createReadStream(outputImagePath);
  } else if (isImageSvgExists) {
    readableStream = fs.createReadStream(imagePath);
  } else {
    readableStream = fs.createReadStream(defaultImagePath);
  }

  if (!isImagePngExists) {
    const writableStream = fs.createWriteStream(outputImagePath);
    const sharpResize = sharp({ density: 2000 })
      .ensureAlpha(0)
      .sharpen(1, 3, 4)
      .resize(500, 500, { fit: 'inside' })
      .png();
    const fileStream = readableStream.pipe(sharpResize);
    ctx.body = await sharpResize.toBuffer();
    fileStream.pipe(writableStream);
  } else {
    ctx.body = readableStream;
  }

  await next();
};

export default getPage;
