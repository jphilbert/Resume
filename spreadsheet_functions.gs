/**
 * Resume Spreadsheet Functions
 * 
 * Functions for manipulating resume data stored in a single spreadsheet.
 * 
 * @author        jphilbert@gmail.com (John P. Hilbert)
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp, SlidesApp or FormApp.
  ui.createMenu('Resume')
    .addItem('Build Data Dictionary', 'BuildDataDictionary')
    .addItem('Export Data Dictionary', 'SaveDataDictionary')
    .addItem('Export Data to CSV', 'SaveDataCSV')
    .addToUi();
}


/**
 * Gets all the data sheets in worksheet
 *
 * @return Sheet array
 * @customfunction
 */
function getDataSheets(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets()
      .filter(x => !["Data Dictionary", "INFO", "README"].includes(x.getName()));
  return sheets;
}


/**
 * List column names of each data sheet.
 *
 * @return Table with columns "Table Name", "Column ID", "Column Name"
 * @customfunction
 */
function BuildDataDictionary() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = getDataSheets();

  var allHeaders = [];
  allHeaders.push(["Table Name", "Column ID", "Column Name"]);

  for (var s in sheets) {
    var sheet = sheets[s];
    var sheet_name = sheet.getSheetName();
    var lastCol = sheet.getLastColumn();
    var headerNames = sheet.getRange(1, 1, 1, lastCol).getValues();
    
    for (var j=0; j<lastCol ; j++){
      allHeaders.push([sheet_name, j+1, headerNames[0][j]]);
    }
  }

  var data_dict = spreadsheet.getSheetByName("Data Dictionary");
  if (data_dict == null) {
    Logger.log("Data Dictionary does not exist, creating");
    data_dict = spreadsheet.insertSheet("Data Dictionary", 0);
  }

  try {
    data_dict.clear();
    data_dict.getRange(1, 1, allHeaders.length, allHeaders[0].length)
      .setValues(allHeaders);
    data_dict.autoResizeColumns(1, allHeaders[0].length);
  }
  catch (err) {
    Logger.log('Failed with error %s', err.message);
  }
  // return allHeaders;
}


/**
 * Saves each data sheet to a CSV file.
 * Exports each sheet into a sub-folder "data" of the spreadsheet. If the CSV
 file already exists, it will be trashed prior to recreating.
 *
 * @customfunction
 */
function SaveDataCSV(){
  const dataFolderName = "data";
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var id = spreadsheet.getId();
  var folders = DriveApp.getFileById(id).getParents();
  var folder = DriveApp.getRootFolder();
  if (folders.hasNext()) {
    folder = folders.next();
  }
  else {
    Logger.log("Could not get document folder, using root");
  }

  folders = folder.getFoldersByName(dataFolderName)
  if (folders.hasNext()) {
    folder = folders.next();
  }
  else {
    Logger.log(
      dataFolderName + " folder not found, creating it in " + folder.getName());
    folder = folder.createFolder(dataFolderName)
  }
  Logger.log('Data will be saved in folder "' + folder + '".');

  var sheets = getDataSheets();
  for (var s in sheets) {
    var csv = convertRangeToCsvFile(sheets[s])

    // Check if there is any data to save
    if (csv) {
      var fileName = sheets[s].getName() + ".csv"

      // Delete if exists
      var files = folder.getFilesByName(fileName);
      while (files.hasNext()) {
        var file = files.next();
        file.setTrashed(true);
      }

      // Save
      folder.createFile(fileName, csv);
    }
  }
}


/**
 * Saves the Data Dictionary to a CSV file.
 * Exports the Data Dictionary to a sub-folder "data" of the spreadsheet. If the
 CSV file already exists, it will be trashed prior to recreating. 
 *
 * @customfunction
 */
function SaveDataDictionary() {
  const dataFolderName = "data";
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var id = spreadsheet.getId();
  var folders = DriveApp.getFileById(id).getParents();
  var folder = DriveApp.getRootFolder();
  if (folders.hasNext()) {
    folder = folders.next();
  }
  else {
    Logger.log("Could not get document folder, using root");
  }

  folders = folder.getFoldersByName(dataFolderName)
  if (folders.hasNext()) {
    folder = folders.next();
  }
  else {
    Logger.log(
      dataFolderName + " folder not found, creating it in " + folder.getName());
    folder = folder.createFolder(dataFolderName)
  }
  Logger.log('Data will be saved in folder "' + folder + '".');

  var data_dict = spreadsheet.getSheetByName("Data Dictionary");
  if (data_dict == null) {
    Browser.msgBox("Data Dictionary does not exist. Build it before exporting.");
  }
  else {
    var csv = convertRangeToCsvFile(data_dict)

    // Check if there is any data to save
    if (csv) {
      var fileName = data_dict.getName() + ".csv"

      // Delete if exists
      var files = folder.getFilesByName(fileName);
      while (files.hasNext()) {
        var file = files.next();
        file.setTrashed(true);
      }

      // Save
      folder.createFile(fileName, csv);
    }
  }
}



/**
 * Converts the range into a comma-delimited string.
 * Taken from https://gist.github.com/mrkrndvs/a2c8ff518b16e9188338cb809e06ccf1
 *
 * @customfunction
 */
function convertRangeToCsvFile(sheet) {
  // get available data range in the spreadsheet
  var activeRange = sheet.getDataRange();
  try {
    var data = activeRange.getDisplayValues();
    var csvFile = undefined;

    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(",") != -1) {
            data[row][col] = "\"" + data[row][col] + "\"";
          }
        }

        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row < data.length-1) {
          csv += data[row].join(",") + "\r\n";
        }
        else {
          csv += data[row];
        }
      }
      csvFile = csv;
    }
  }
  catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
  }

  return csvFile;
}



