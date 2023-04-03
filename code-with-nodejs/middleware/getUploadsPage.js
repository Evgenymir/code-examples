import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import getCurrencyImage from '../../../helpers/get-currency-image';
import safeFsOperations from '../../../utils/safe-fs-operations';
import LOG_NAMES from '../../../constants/log-names';
import safelyRemoveFile from '../../../utils/safely-remove-file';

const imageSharpen = (imagePath) => {
  const sharpInput = imagePath || { density: 2000 };

  return sharp(sharpInput)
    .ensureAlpha(0)
    .sharpen(1, 1, 3)
    .resize(64, 64, { fit: 'inside' })
    .png();
};

const getUploadsPage = () => async (ctx, next) => {
  const currenciesList = ctx?.state?.currenciesList ?? [];
  const imageName = ctx?.params?.name ?? '';
  const imageNameSplit = imageName && imageName.split('.');
  const imageNameOnly = imageNameSplit && imageNameSplit.shift();
  const imageNameOnlySplit = imageNameOnly && imageNameOnly.split('_');
  const ticker = imageNameOnlySplit && imageNameOnlySplit.shift();
  const coin = currenciesList.find((item) => item?.ticker === ticker);
  const coinImagePath = coin && coin?.icon?.url;
  const directory = path.resolve(__dirname, '../../../../client/images');
  const outputImagePath = `${directory}/cached/uploads/${imageNameOnly}.png`;
  const outputImageSvgPath = `${directory}/cached/uploads/${imageNameOnly}.svg`;
  const defaultImagePath = `${directory}/site-image-thumbnail.png`;
  const isImagePngExists = fs.existsSync(outputImagePath);
  const outputDirectoryPath = `${directory}/cached`;
  const isDirectoryPathExist = fs.existsSync(outputDirectoryPath);
  const directoryLstat = isDirectoryPathExist && fs.lstatSync(outputDirectoryPath);
  const isDirectoryExist = directoryLstat && directoryLstat.isDirectory();
  const outputDirectoryUploadsPath = `${directory}/cached/uploads`;
  const isDirectoryUploadsPathExist = fs.existsSync(outputDirectoryUploadsPath);
  const directoryUploadsLstat = isDirectoryUploadsPathExist
    && fs.lstatSync(outputDirectoryUploadsPath);
  const isDirectoryUploadsExist = directoryUploadsLstat && directoryUploadsLstat.isDirectory();

  ctx.response.set('content-type', 'image/png');

  if (!isDirectoryExist) {
    const fsCreateDirectoryData = await safeFsOperations(
      () => fs.mkdirSync(outputDirectoryPath),
    );
    if (fsCreateDirectoryData instanceof Error) {
      ctx.body = imageSharpen(defaultImagePath);
      console.error(`${LOG_NAMES.IMAGE_UPLOADS_CREATE_DIRECTORY} {code: ${fsCreateDirectoryData.code}} {message: ${fsCreateDirectoryData.message}}`);
      await next();

      return;
    }
  }

  if (!isDirectoryUploadsExist) {
    const fsCreateDirectoryUploadsData = await safeFsOperations(
      () => fs.mkdirSync(outputDirectoryUploadsPath),
    );
    if (fsCreateDirectoryUploadsData instanceof Error) {
      ctx.body = imageSharpen(defaultImagePath);
      console.error(`${LOG_NAMES.IMAGE_UPLOADS_CREATE_DIRECTORY_UPLOADS} {code: ${fsCreateDirectoryUploadsData.code}} {message: ${fsCreateDirectoryUploadsData.message}}`);
      await next();

      return;
    }
  }

  let currentImagePath = defaultImagePath;
  let readableStream;

  if (isImagePngExists) {
    currentImagePath = outputImagePath;
  } else if (coinImagePath) {
    const { data, status } = await getCurrencyImage(coinImagePath);

    if (status === 200) {
      const fsWriteFileData = await safeFsOperations(
        () => fs.promises.writeFile(outputImageSvgPath, data),
      );

      if (!(fsWriteFileData instanceof Error)) {
        currentImagePath = outputImageSvgPath;
      } else {
        console.error(`${LOG_NAMES.IMAGE_UPLOADS_WRITE_FILE} {code: ${fsWriteFileData.code}} {message: ${fsWriteFileData.message}}`);
      }
    }
  }

  const fsCreateReadStreamData = await safeFsOperations(
    () => fs.createReadStream(currentImagePath),
  );

  if (!(fsCreateReadStreamData instanceof Error)) {
    readableStream = fsCreateReadStreamData;
  } else {
    ctx.body = imageSharpen(defaultImagePath);
    await safelyRemoveFile(outputImageSvgPath, LOG_NAMES.IMAGE_UPLOADS_REMOVE_IMAGE);
    console.error(`${LOG_NAMES.IMAGE_UPLOADS_CREATE_READ_STREAM} {code: ${fsCreateReadStreamData.code}} {message: ${fsCreateReadStreamData.message}}`);
    await next();

    return;
  }

  if (!isImagePngExists) {
    let writableStream;
    const writableStreamData = await safeFsOperations(
      () => fs.createWriteStream(outputImagePath),
    );

    if (!(writableStreamData instanceof Error)) {
      writableStream = writableStreamData;
    } else {
      ctx.body = imageSharpen(defaultImagePath);
      await safelyRemoveFile(outputImageSvgPath, LOG_NAMES.IMAGE_UPLOADS_REMOVE_IMAGE);
      console.error(`${LOG_NAMES.IMAGE_UPLOADS_CREATE_WRITE_STREAM} {code: ${writableStreamData.code}} {message: ${writableStreamData.message}}`);
      await next();

      return;
    }

    const sharpResize = imageSharpen();
    const fileStream = readableStream.pipe(sharpResize);
    ctx.body = await sharpResize.toBuffer();
    fileStream.pipe(writableStream);
    await safelyRemoveFile(outputImageSvgPath, LOG_NAMES.IMAGE_UPLOADS_REMOVE_IMAGE);
  } else {
    ctx.body = readableStream;
  }

  await next();
};

export default getUploadsPage;
