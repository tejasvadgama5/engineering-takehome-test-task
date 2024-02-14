const fs = require("fs");
const csv = require("csv-parser");

const files = [
  "diagnostic_groups.csv",
  "diagnostics.csv",
  "diagnostic_metrics.csv",
  "conditions.csv",
];

const importCSVData = async (connection) => {
  try {
    for (const file of files) {
      const filePath = `./csv/${file}`;
      const tableName = file.replace(".csv", "");

      const fileStream = fs.createReadStream(filePath);
      const parser = fileStream.pipe(csv());

      const headers = await new Promise((resolve) => {
        parser.once("headers", (headerArray) => {
          resolve(headerArray);
        });
      });

      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${headers
        .map((header) => `${header} LONGTEXT`)
        .join(", ")})`;

      await connection.execute(createTableQuery);

      for await (const row of parser) {
        await connection.execute(
          `INSERT INTO ${tableName} VALUES (${Object.keys(row).reduce(
            (acc, value, index, array) => {
              return acc + (index === array.length - 1 ? "?" : "?,");
            },
            ""
          )})`,
          Object.values(row)
        );
      }
    }
  } catch (err) {
    throw err;
  }
};

const interpretPathologyReport = async (obxData, connection) => {
  try {
    if (!obxData) return;
    const data = await new Promise((resolve, reject) => {
      const query_str =
        "SELECT  `﻿name`, `oru_sonic_codes`, `standard_higher`, `standard_lower` FROM test_db.diagnostic_metrics where oru_sonic_codes != ''";
      connection.query(query_str, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    const conditionsData = await new Promise((resolve, reject) => {
      const query_str =
        "SELECT  `﻿name`, diagnostic_metrics FROM test_db.conditions";

      connection.query(query_str, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
    const fileData = [];
    obxData.forEach((item) => {
      if (Number.parseFloat(item.data["OBX.5"])) {
        fileData.push({
          oru_code: item.data["OBX.3"]["OBX.3.2"],
          value: Number.parseFloat(item.data["OBX.5"]),
        });
      }
    });
    const abnormalData = [];
    data.forEach((item) => {
      const sonicCode = item.oru_sonic_codes.split(";");
      const standardHigher = Number.parseFloat(item.standard_higher);
      const standardLower = Number.parseFloat(item.standard_lower);
      fileData.forEach((element) => {
        if (sonicCode.includes(element.oru_code)) {
          if (element.value > standardHigher || element.value < standardLower) {
            abnormalData.push({
              name: Object.values(item)[0],
              value: element.value,
              standardHigher,
              standardLower,
            });
          }
        }
      });
    });
    const finalResult = [];
    abnormalData.forEach((element) => {
      conditionsData.forEach((condition) => {
        if (condition.diagnostic_metrics.includes(element.name))
          finalResult.push({
            condition: Object.values(condition)[0],
            ...element,
          });
      });
    });
    return finalResult;
  } catch (error) {
    throw error;
  }
};

module.exports = { importCSVData, interpretPathologyReport };
