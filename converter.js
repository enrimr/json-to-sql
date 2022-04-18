const jsonfile = require('jsonfile');
const fs = require('fs');
const { table } = require('console');

/**
 * ===========================
 * Command line interface
 * ===========================
 */

// Extract command line arguments
const input = process.argv.splice(2);
const [jsonFilename, sqlFilename] = input;
parseIfNotExist();
/**
 * ===========================
 * Implementation
 * ===========================
 */
let tablesAreCreated = false
let tags = ['tags','tm_versions']

function parseIfNotExist(){
  fs.open(sqlFilename, 'r', function (fileNotExist, _) {
    //if (fileNotExist) {
      converter(input);
    //} else {
    //  console.log("output file already exists!");
    //}
  })
}

function converter(input) {

  // exit if json or sql files are not specified
  if (!jsonFilename || !sqlFilename) return 'Error';

  const mainTableName = 'recipes'
  const tables = [];
  const tablesComplexFields = [];
  const mainTableFields = [];
  var columns = [];
  var columnTypes = [];
  var columnInfo = [];
  var values = [];
  const valueInserts = [];
  const createTables = [];

  // use jsonfile module to read json file
  jsonfile.readFile(jsonFilename, (err, data) => {
    if (err) return console.error(err);

    if (Array.isArray(data) && data.length > 0){

      let element = data[0]
      Object.keys(element).forEach(field => {
        if (Array.isArray(element[field]) || typeof (element[field]) == "object"){
          tablesComplexFields.push(field);
        } else {
          mainTableFields.push(field)
        }
      })

      fetchTablesMainTable(tablesComplexFields);
      
    } else {
      fetchTables(data);
    }

    const source = data;
    
    for (let i = 0; i < source.length; i++) {
      var columns = [];
      var columnTypes = [];
      var columnInfo = [];
      var values = [];

      tables.forEach((tableItem, index) => {
        //const fieldKey = Object.keys(source[i])[index]
        let field = source[i][tableItem]
        if (Array.isArray(field)) {
          const mappedField = field.map((element,index) => {
            return {
              mainTableId: source[i].id,
              order: index,
              name: element
            }
          })
          parseArray(mappedField, index);
        }
        else if (typeof (field) == "object") {
          field.mainTableId = source[i].id
          parseObject(field, index); // OK!
        } else { //para los campos que son simples
          let otherFields = JSON.parse(JSON.stringify(source[i]));

          tablesComplexFields.forEach(element => {
            console.log(element)
            delete otherFields[element]
          })

          console.log(otherFields)
          parseObject(otherFields, index);
        }
      })

      tablesAreCreated = true
    }

    /*for (let i = 0; i < tables.length; i++) {
      const tableItem = source[tables[i]];
      //console.log(tableItem)
      if (Array.isArray(tableItem)) {
        parseArray(tableItem, i);
      }
      else if (typeof (tableItem) == "object") {
        parseObject(tableItem, i);
      }
    }*/
    let uniqueCreateTables = [...new Set(createTables)]
    const creates = toSql(uniqueCreateTables);
    const inserts = toSql(valueInserts);
    const combinedSql = creates.concat(`\n` + inserts)

    writeOutput(combinedSql)
  });

  function fetchTables(source) {
    for (var i in source) {
      tables.push(i);
    }
  }

  function fetchTablesMainTable(source) {
    tables.push(mainTableName)
    source.forEach(element => {
      tables.push(element)
    })
  }

  function parseArray(tableItem, index) {
    convertObject(tableItem)
    for (var i = 0; i < tableItem.length; i++) {
      convertObject(tableItem[i]);
      if (i == 1) {
        columnInfo = []
        parseColumnInfo()
        if (!tablesAreCreated) {
          createTables.push(`CREATE TABLE IF NOT EXISTS ${tables[index]} (${columnInfo})`)
        }
      }
      const query = `INSERT INTO ${tables[index]} (${columns}) VALUES (${values})`;
      valueInserts.push(query)
      columns = []
      values = []
    }
  }

  function parseObject(tableItem, index) {
    console.log('parse object')
    console.log(tableItem)
    convertObject(tableItem)
    columnInfo = []
    parseColumnInfo()
    if (!tablesAreCreated) {
      createTables.push(`CREATE TABLE IF NOT EXISTS ${tables[index]} (${columnInfo})`)
    }
    const query = `INSERT INTO ${tables[index]} (${columns}) VALUES (${values})`
    valueInserts.push(query)
  }

  function convertObject(item) {
    columns = [];
    values = [];
    for (var i in item) {
      columns.push(i);
      let value = item[i]
      if (typeof value === 'string') {
        value = "\"" + value + "\"";
      }
      if (value == null) {
        value = "\"\""
      }
      values.push(value);
    }
  }

  function parseColumnInfo() {
    console.log(columns)
    console.log(values)
    console.log("")
    for (var i = 0; i < columns.length; i++) {
      if (typeof (values[i]) == "string") {
        columnTypes = "TEXT"
        columnInfo.push(`${columns[i]} ${columnTypes}`)
      }
      else if (typeof (values[i]) == "number") {
        columnTypes = "INTEGER"
        columnInfo.push(`${columns[i]} ${columnTypes}`)
      }
    }
  }
 
  function toSql(queries) {
    return queries.join(`;\n`) + ';';
  }

  function writeOutput(combinedSql) {
    fs.writeFile(sqlFilename, combinedSql, (err2) => {
      if (err2) return console.error(err2);
      console.log('>> Done');
    });
  }
}