/**
 * Main Document Script
 *
 * Defines general functions such as loading data and UI
 *
 * @author        jphilbert@gmail.com (John P. Hilbert)
 */

// ID of the Resume Sheet
var resumeDataID = "1e9ndD6h_ILWKtUytFpfRDTvW0TnqUQK6OyAEKBvBsho";

// Structure holding the resume data (Sheet)
var data = {};

// Struture holding the resume elements (Doc)
var snippets = {};


function onOpen() {
  try {
    DocumentApp.getUi().createMenu('Resume')
      .addItem('Build and Append Resume to Document', 'BuildResume')
      .addItem('Remove Resume from Document', 'DeleteResume')
      .addItem('Save Resume to New File', 'SaveResume')
      .addToUi();
    
  } catch (e) {
    // TODO (Developer) - Handle exception
    console.log('Failed with error: %s', e.error);
  }
}

function DeleteResume() {
  var doc_body = DocumentApp
      .getActiveDocument()
      .getActiveTab()
      .asDocumentTab()
      .getBody();
  var nElements = doc_body.getNumChildren();
  doc_body.removeChild(doc_body.getChild(nElements-2));
}

function SaveResume() {
  var templateDoc = DocumentApp.getActiveDocument();
  var templateFile = DriveApp.getFileById(templateDoc.getId());
  
  // Remove "Template" from title and copy
  var fileName = templateDoc.getName().replace(" Template", "");
  var docID = templateFile.makeCopy(fileName).getId();

  // Remove all the elements except the last one which is the resume table
  var doc_body = DocumentApp
      .openById(docID)
      .getActiveTab()
      .asDocumentTab()
      .getBody();
  var nElements = doc_body.getNumChildren();
  for (var i = 0; i < nElements - 2; i++) {
    doc_body.getChild(0).removeFromParent();
  }

  /* var htmlOutput = HtmlService
     .createHtmlOutput('<p>A change of speed, a change of style...</p>')
     .setWidth(250)
     .setHeight(300);
     DocumentApp.getUi().showModalDialog(htmlOutput, 'My add-on');
  */

  return docID;
}


/**
 * Loads the template snippets defined in the document.
 *
 * <TODO> Description.
 *
 * @global
 *
 * @return {Object} dictionary of DocumentApp.Table
 */
function LoadSnippets() {
  var body = DocumentApp
      .getActiveDocument()
      .getActiveTab()
      .asDocumentTab()
      .getBody();
  var searchResult = null;

  // Load Snippets
  while (searchResult = body.findText("#", searchResult)) {
    var snippet_name = searchResult.getElement().getText().slice(1);
    searchResult = body.findElement(
      DocumentApp.ElementType.TABLE, searchResult);
    snippets[snippet_name] = searchResult.getElement().asTable();
    Logger.log('Loaded: ' + snippet_name);
  }

  return snippets;
}

/**
 * Loads the data tables defined in the sheet.
 *
 * <TODO> Description.
 *
 * @global
 *
 * @return {Object} dictionary of Arrays
 */
function LoadResumeData() {
  var spreadsheet = SpreadsheetApp.openById(resumeDataID);
  var sheets = spreadsheet.getSheets();

  var ignore_sheets = ["Data Dictionary", "Resume"];

  if (sheets === undefined || sheets.length === 0) {
    return;
  }

  // Loop over Sheets
  for (var s in sheets) {
    var sheet_name = sheets[s].getSheetName();

    if (ignore_sheets.includes(sheet_name)) continue;

    var values = sheets[s].getDataRange().getValues();
    data[sheet_name] = {};

    // Loop over Rows
    for (var r = 1; r < values.length; r++) {
      var key = values[r][0];
      data[sheet_name][key] = {};

      // Loop over Columns
      for (var c = 0; c < values[r].length; c++) {
        data[sheet_name][key][values[0][c]] = values[r][c];
      }
    }
  }

  return data;
}

