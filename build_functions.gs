/**
 * Build Resume Functions
 * 
 * Functions specifically designed to parsing the template snippets and inserting the spreadsheet data.
 * 
 * @author        jphilbert@gmail.com (John P. Hilbert)
 */

function BuildResume() {
  LoadSnippets();
  LoadResumeData();

  var doc_tab = DocumentApp
      .getActiveDocument()
      .getActiveTab()
      .asDocumentTab();
  var doc_body = doc_tab.getBody();
  var body = snippets.BODY.copy();
  
  body_position = body.findText("{POSITION BODY}").getElement();
  body_position = body_position.getParent().getParent();
  body_position.getChild(0).removeFromParent();
  for (d in data["Position"]) {
    body_position.appendTable(AddPosition(d));
  }

  body_education = body.findText("{EDUCATION BODY}").getElement();
  body_education = body_education.getParent().getParent();
  body_education.getChild(0).removeFromParent();
  for (d in data["Education"]) {
    if (data["Education"][d]["Date - Degree"]) {
      body_education.appendTable(AddEducation(d));
    }
  }
  
  body_publication = body.findText("{PUBLICATION BODY}").getElement();
  body_publication = body_publication.getParent().getParent();
  body_publication.getChild(0).removeFromParent();
  for (d in data["Publication"]) {
    body_publication.appendTable(AddPublication(d));
  }

  body_accolade = body.findText("{ACCOLADE BODY}").getElement();
  body_accolade = body_accolade.getParent().getParent();
  body_accolade.getChild(0).removeFromParent();
  for (d in data["Accolade"]) {
    body_accolade.appendTable(AddHonor(d));
  }
  
  body_skill = body.findText("{SKILL BODY}").getElement();
  body_skill = body_skill.getParent().getParent();
  //body_skill.clear();
  body_skill.getChild(0).removeFromParent();
  body_skill.appendTable(AddSkills());

  doc_body.appendTable(body);

  return;
}

/**
 * Replaces text fields in element with data.
 *
 * This function loops over all fields in TABLE_NAME replacing placeholders in
 * ELEMENT. Placeholders are defined by {TABLE_NAME.FIELD} and fields starting
 * with "Key" are ignored. 
 *
 * @global
 *
 * @param {DocumentApp.Element}   element       the element to with placeholders to replace
 * @param {string}                table_name    table name in global Data object
 * @param {string}                table_key     the key of the row to use    
 *
 * @return {DocumentApp.Element} the altered element
 */
function ReplaceFields(element, table_name, table_key) {
  var table_data = data[table_name][table_key];
  for (var column in table_data) {
    if (column.startsWith("Key") || table_data[column] == "") continue;
    var value = table_data[column];
    
    // TODO: switch to Utilities.formatDate?
    if (value instanceof Date) value = value.toISOString().slice(0, 7);
    element.replaceText("{" + table_name + "." + column + "}", value);
  }

  return element;
}

function AddEducation(education_key) {
  var e = snippets.EDUCATION.copy();

  ReplaceFields(e, "Education", education_key);
  ReplaceFields(e, "School", data["Education"][education_key]["Key - School"]);

  return e;
}

function AddPosition(position_key) {
  var e = snippets.POSITION.copy();

  ReplaceFields(e, "Position", position_key);
  ReplaceFields(e, "Company", data["Position"][position_key]["Key - Company"]);

  var responsibility_list = e.findText("{Responsibility.Name}")
      .getElement()
      .getParent();
  var responsibility_container = responsibility_list.getParent();
  for (var key in data.Responsibility) {
    if (data.Responsibility[key]["Key - Position"] == position_key) {
      var l = responsibility_list.copy();
      var glyphType = responsibility_list.getGlyphType();
      l.replaceText("{Responsibility.Name}", data.Responsibility[key].Name);
      l.setGlyphType(glyphType);
      responsibility_container.appendListItem(l);
    }
  }
  responsibility_container.removeChild(responsibility_list);
  if (responsibility_container.getNumChildren() == 0) {
    responsibility_container.removeFromParent();
  }

  var project_container = e.findText("Projects")
      .getElement()
      .getParent()
      .getParent();
  for (var key in data.Project) {
    if (data.Project[key]["Key - Position"] == position_key) {
      project_container.appendTable(AddProject(key));
    }
  }
  if (project_container.getNumChildren() == 0) {
    project_container.removeFromParent();
  }

  return e;
}

function AddProject(project_key) {
  var e = snippets.PROJECT.copy();

  ReplaceFields(e, "Project", project_key);

  var detail_list = e.findText("{Project Detail.Name}")
      .getElement()
      .getParent();
  var detail_container = detail_list.getParent();
  for (var key in data["Project Detail"]) {
    if (data["Project Detail"][key]["Key - Project"] == project_key) {
      var l = detail_list.copy();
      l.replaceText("{Project Detail.Name}", data["Project Detail"][key].Name);
      detail_container.appendListItem(l);
    }
  }
  detail_container.removeChild(detail_list);
  if (detail_container.getNumChildren() == 0) detail_container.removeFromParent();

  return e;
}

function AddSkills() {
  // Collate and restructure the skills table
  var skills = {};
  for (var s in data["Skill"]) {
    if (!Object.keys(skills).includes(data["Skill"][s]["Category"])) {
      skills[data["Skill"][s]["Category"]] = [];
    } 
    skills[data["Skill"][s]["Category"]].push(data["Skill"][s]["Name"]);
  } 
  
  var skill_table = snippets.SKILL.copy();    // this is the table that will be
                                              // returned 
  var skill_row = skill_table.getChild(0);    // this is the row that will be
                                              // copied 

  // Loop over the categories
  for (var category in skills) {
    var e = skill_row.copy();
    e.replaceText("{Skill.Category}", category);

    var skill_list = e.findText("{Skill.Name}")
        .getElement()
        .getParent();
    var skill_column_count = e.getNumChildren() - 1; 

    for (var i = 0; i < skill_column_count; i++) {
      e.getChild(i+1).getChild(0).removeFromParent();
    }

    // Loop over the items
    for (var i = 0; i < skills[category].length; i++) {
      var l = skill_list.copy();  
      l.replaceText("{Skill.Name}", skills[category][i]);
      e.getChild((i % skill_column_count) + 1).appendListItem(l);
    } 
    
    skill_table.appendTableRow(e);
  }

  skill_table.removeChild(skill_row);         // remove the skill row template
  return skill_table;
}

function AddHonor(honor_key) {
  var e = snippets.ACCOLADE.copy();
  ReplaceFields(e, "Accolade", honor_key);
  return e;
}

function AddPublication(pub_key) {
  var e = snippets.PUBLICATION.copy();
  ReplaceFields(e, "Publication", pub_key);
  return e;
}
