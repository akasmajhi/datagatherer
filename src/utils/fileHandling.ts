import {
  createWriteStream,
  createReadStream,
  unlinkSync,
  existsSync,
} from "fs";
import * as path from "path";
import * as unzipper from "unzipper";
import logger from "./logger";
const log = logger.log;
const moduleName: string = __filename.slice(
  __dirname.length + 1,
  __filename.length - 3
);

/**
 *
 * @param {String} fileNameWithPath.
 * @returns true if the file exists and false otherwise.
 */
export const isFileExisting = (fileNameWithPath: string): boolean => {
  const logAppend: string = `${moduleName}:isFileExisting:`;
  try {
    if (existsSync(fileNameWithPath)) {
      log(`${logAppend}: file: [${fileNameWithPath}] is existing!`, "debug");
      return true;
    }
    log(`${logAppend}: file: [${fileNameWithPath}] is NOT existing!`, "debug");
  } catch (err) {
    log(`${logAppend}: file: [${fileNameWithPath}] resulted in error`, "error");
    throw err;
  }
  return false;
};

/**
 * deletes the ZIP file with the supplied name
 * @param {String} zipFileName - The zip file to be deleted.
 */
const deleteZipFile = (zipFileName: string) => {
  const logAppend: string = `${moduleName}:deleteZipFile:`;
  log(`${logAppend} Going to delete file: [${zipFileName}]`, "debug");
  try {
    unlinkSync(zipFileName);
  } catch (err) {
    log(`${logAppend} Error Encountered [${err}]`, "error");
  }
};

/**
 *
 */
export const unzipFile = (DATA_DIR: string, zipFileName: string) => {
  const logAppend: string = `${moduleName}:unzipFile:`;
  const filePath = path.join(DATA_DIR, zipFileName);
  log(
    `${logAppend} Into unzipFile. Unzipping file: [${filePath}] to path: [${DATA_DIR}]`,
    "debug"
  );
  // zlib.Unzip(readFile(filePath));
  createReadStream(filePath)
    .pipe(unzipper.Parse())
    .on("entry", (entry) => {
      var fileName = entry.path;
      var type = entry.type; // 'Directory' or 'File'
      if (/\/$/.test(fileName)) {
        return;
      }
      log(`${logAppend} [FILE]: ${fileName} type: ${type}`, "debug");
      // TODO: probably also needs the security check
      const dest = createWriteStream(
        path.join(DATA_DIR, zipFileName.substring(0, zipFileName.length - 4))
      );
      entry.pipe(dest);
      // Now delete the ZIP file.
      dest.on("close", () => {
        //log(`unzipFile: Calling the delete file function.`);
        deleteZipFile(path.join(DATA_DIR, zipFileName));
      });
      // NOTE: To ignore use entry.autodrain() instead of entry.pipe()
    });
};
