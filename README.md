# Resume Automation
This repository houses automation scripts to create and format my resume however its just data so it could be anyone's resume.

- [Data](#Data)
	- [Education](#Education)
	- [School](#School)
	- [Class](#Class)
	- [Position](#Position)
    - [Company](#Company)
    - [Responsibility](#Responsibility)
    - [Project](#Project)
    - [Project Detail](#Project-Detail)
    - [Accolade](#Accolade)
    - [Publication](#Publication)
    - [Skill](#Skill)
- [Google Document Generation](#GoogleDocument-Generation)

# Data
The data is currently stored in a single Google Sheet, however it can be easily be switched to multiple CSV tables. As for nomenclature and standards, this is what I choose:

- Keys begin with `Key` and end with a table name
- Primary keys will be the first column followed by foreign keys
- Dates and address fields will begin with `Date` and `Address`
- Plural forms aren't use since it complicated things
- Capitalization and white spaces are used simply for readability

## Education 
This table holds the root nodes of the **education** section.
 |   | Name                |
 |:-:|:--------------------|
 | 1 | **Key - Education** |
 | 2 | ***Key - School***  |
 | 3 | Date - Start        |
 | 4 | Date - End          |
 | 5 | Concentration       |
 | 6 | Degree              |
 | 7 | Date - Degree       |
 | 8 | GPA                 |

## School
**School** details related to an **education**.
 |   | Name             |
 |:-:|:-----------------|
 | 1 | **Key - School** |
 | 2 | Name             |
 | 3 | Type             |
 | 4 | Address - City   |
 | 5 | Address - State  |

## Class
**Classes** attached to an **education**.
 |   | Name                  |
 |:-:|:----------------------|
 | 1 | **Key - Class**       |
 | 2 | ***Key - Education*** |
 | 3 | Code                  |
 | 4 | Title                 |
 | 5 | Description           |
 | 6 | Date                  |
 | 7 | Units                 |
 | 8 | Grade                 |

## Position
**Positions** are the root of the experience section.
 |   | Name                |
 |:-:|:--------------------|
 | 1 | **Key - Position**  |
 | 2 | ***Key - Company*** |
 | 3 | Title               |
 | 4 | Description         |
 | 5 | Date - Start        |
 | 6 | Date - End          |
 | 7 | Supervisor          |
 | 8 | Email               |
 | 9 | Phone               |

## Company
A single **company** is attached to a **position**.
 |    | Name              |
 |:--:|:------------------|
 | 1  | **Key - Company** |
 | 2  | Name              |
 | 3  | Description       |
 | 4  | Website           |
 | 5  | Email             |
 | 6  | Phone             |
 | 7  | Address - Street  |
 | 8  | Address - City    |
 | 9  | Address - State   |
 | 10 | Address - Zip     |

## Responsibility
A **position** can have multiple **responsibilities**.
 |   | Name                     |
 |:-:|:-------------------------|
 | 1 | **Key - Responsibility** |
 | 2 | ***Key - Position***     |
 | 3 | Order                    |
 | 4 | Name                     |

## Project
A **position** can have multiple **projects**.
 |   | Name                 |
 |:-:|:---------------------|
 | 1 | **Key - Project**    |
 | 2 | ***Key - Position*** |
 | 3 | Order                |
 | 4 | Name                 |
 | 5 | Description          |

## Project Detail
A **project** can have multiple **details**.
 |   | Name                     |
 |:-:|:-------------------------|
 | 1 | **Key - Project Detail** |
 | 2 | ***Key - Project***      |
 | 3 | Order                    |
 | 4 | Name                     |

## Accolade
 |   | Name               |
 |:-:|:-------------------|
 | 1 | **Key - Accolade** |
 | 2 | Date               |
 | 3 | Name               |
 | 4 | Description        |

## Publication
 |   | Name                  |
 |:-:|:----------------------|
 | 1 | **Key - Publication** |
 | 2 | Title                 |
 | 3 | Abstract              |
 | 4 | Date                  |
 | 5 | Journal               |
 | 6 | URL                   |

## Skill
 |   | Name            |
 |:-:|:----------------|
 | 1 | **Key - Skill** |
 | 2 | Category        |
 | 3 | Name            |
 | 4 | Description     |

## Skill Association
 |   | Name               |
 |:-:|:-------------------|
 | 1 | ***Key - Skill***  |
 | 2 | ***Key - Parent*** |


# Google Document Generation
