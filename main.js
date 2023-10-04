/**
 * Run this script in GitBash.  DOUBLE CHECK sourceDir AND destDirBase
 * Dryrun command: 
 *    node.exe main.js > mylog.log 2>&1
 * 
 * Actual move command (WARNING WILL MOVE FILES FOR REAL!!!)
 *    node.exe main.js --dryrun false > mylog.log 2>&1
 * 
 */
import {parseArgs} from 'node:util';  
import * as fs from 'fs';
import * as path from 'path'

const args = parseArgs({
  options: {
    dryrun: {
      type: "string",
      default: "true"
    }
  },
});

/**
 * Where the pictures that need to be moved are stored.  Pictures must have filename
 * like YYYYMMDD_<any string>.<ext> (i.e. 20230929_abc.jpg)
 *  */ 
// let sourceDir = "Y:/_TO_BE_SORTED"
let sourceDir = "y:/_TO_BE_SORTED"
/**
 * Where the pictures from sourceDir will be moved to be sorted
 */
let destDirBase = "Y:/"

confirmPathExists(sourceDir)
confirmPathExists(destDirBase)

let fileCount = 0
fs.readdirSync(sourceDir).forEach(pictureFile => {
  fileCount += 1
  let sourceFile = path.join(sourceDir, pictureFile)
  let destinationFile = getDestinationFileLocation(pictureFile)
  if (destinationFile != "skip") {
    if (args.values.dryrun == "false") {
      moveFile(sourceFile, destinationFile)      
    } else {
      console.log("DRYRUN: " + fileCount + ". " + sourceFile + " -> " + destinationFile); 
    }
  }
})

function moveFile(source, dest) {
  let destDir = path.dirname(dest)
  if (!fs.existsSync(destDir)) {
    console.log(destDir + " does not exist.  Creating...");
    fs.mkdirSync(destDir, { recursive: true })    
  }
  if (fs.existsSync(dest)) {
    console.error("ERROR: " + dest + " already exists");
  } else {
    fs.rename(source, dest, err => {
      if (err) throw err 
      console.log(fileCount + ". " + sourceFile + " -> " + destinationFile);   
    })
  }  
}

function getDestinationFileLocation(pictureFile) {
  if (isFileNameValidFormat(pictureFile)) {
    let yearStr = getYearDirectory(pictureFile)
    let monthStr = getMonthDirectory(pictureFile)
    return path.join(destDirBase, yearStr, monthStr, pictureFile)
  } else {
    console.warn("WARNING: Skipping " + pictureFile + " due to bad filename format");
    return "skip"
  }
}

function getYearDirectory(pictureFile) {
  return pictureFile.substring(0, 4)
}

function getMonthDirectory(pictureFile) {
  let month = pictureFile.substring(4, 6)
  switch (month) {
    case "01":
      return "01-January"
    case "02":
      return "02-February"
    case "03":
      return "03-March"
    case "04":
      return "04-April"
    case "05":
      return "05-May"
    case "06":
      return "06-June"
    case "07":
      return "07-July"
    case "08":
      return "08-August"
    case "09":
      return "09-September"
    case "10":
      return "10-October"
    case "11":
      return "11-November"
    case "12":
      return "12-December"
    default:
      console.log("Bad month received " + month);
      process.exit(1)
  }
}

// Validated that filename is in format YYYYMMDD_<anystring>.<ext>
function isFileNameValidFormat(filename) {
  if (/^\d\d\d\d\d\d\d\d_(\w*)\.((\w\w\w)|(\w\w\w\w))$/gm.test(filename)) {
    return true
  } 
  return false
}

function confirmPathExists(path) {
  if (fs.existsSync(path)) {
    console.log(path + " exists!");
  } else {
    console.error(path + " does not exist.  Exiting");
    process.exit(1)
  }
}