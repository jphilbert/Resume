# Resume Automation
This repository houses automation scripts to create and format my resume however its just data so it could be anyone's resume.

- [Google Document Generation](#GoogleDocument-Generation)
- [Data](#Data)
	- [Education](#Education)
	- [Experience](#Experience)
    - [Accolades and Publications](#Accolades-and-Publications)
    - [Skills](#Skills)


# Google Document Generation
The Google Scripts [main.gs](main.gs) and [build_functions.gs](build_functions.gs) should be attached to a template file with a body and other elements ![screenshot](screenshot.jpg)

A few fuctions are added to the menu of the template to facilitate merging it with with the data to produce a [complete resume](Resume%20(Basic).pdf).


# Data
The data is currently stored in a single Google Sheet, however it can be easily be switched to multiple CSV tables. As for nomenclature and standards, this is what I choose:

- Keys begin with `Key` and end with a table name
- Primary keys will be the first column followed by foreign keys
- Dates and address fields will begin with `Date` and `Address`
- Plural forms aren't use since it complicated things
- Capitalization and white spaces are used simply for readability


## Education 
```mermaid
erDiagram
Education }|--|| School : ""
Education ||--o{ Class : ""
Education { 
  str  Key-Education
  str  Key-School
  dt   Date-Start
  dt   Date-End
  str  Concentration
  str  Degree
  dt   Date-Degree
  num  GPA
}

School {
  str  Key-School
  str  Name
  str  Type
  str  Address-City
  str  Address-State
}

Class {
  str  Key-Class
  str  Key-Education
  str  Code
  str  Title
  str  Description
  dt   Date
  num  Units
  str  Grade
}
```

## Experience
```mermaid
erDiagram
Position }|--|| Company : ""
Responsibility }o--|| Position : ""
Project }o--|| Position : ""
Project_Detail }o--|| Project : ""
Position {
  str  Key-Position
  str  Key-Company
  str  Title
  str  Description
  dt   Date-Start
  dt   Date-End
  str  Supervisor
  str  Email
  str  Phone
}

Company {
  str  Key-Company
  str  Name
  str  Description
  str  Website
  str  Email
  str  Phone
  str  Address-Street
  str  Address-City
  str  Address-State
  str  Address-Zip
}

Responsibility {
  str  Key-Responsibility
  str  Key-Position
  int  Order
  str  Name
}

Project {
  str  Key-Project
  str  Key-Position
  int  Order
  str  Name
  str  Description
}

Project_Detail{
  str  Key-Project_Detail
  str  Key-Project
  int  Order
  str  Name
}
```

## Accolades and Publications
These tables are pretty similar and have their own section in a resume.
```mermaid
erDiagram
Accolade {
  str  Key-Accolade
  dt   Date
  str  Name
  str  Description
}

Publication {
  str  Key-Publication
  str  Title
  str  Abstract
  dt   Date
  str  Journal
  str  URL
}
```

## Skills
For the most part, skills are simply a categorized list. I have added another table for future use that connects a skill to another element in any other table.
```mermaid
erDiagram
Skill ||--o{ Skill_Association : ""
Skill_Association }o--|| PARENT : ""
Skill {
  str  Key-Skill
  str  Category
  str  Name
  str  Description
}

Skill_Association {
  str  Key-Skill
  str  Key-Parent
  str  Parent_Table
}
```
