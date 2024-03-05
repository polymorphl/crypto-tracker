const fs = require('fs');
const { join } = require('path');
const { parse } = require('csv-parse');

function extraireContenuCSV_TSV(contenu: string) {
  // Expression régulière optimisée pour détecter le contenu CSV ou TSV
  const regex =
    /(?:[^,"\n\r]*|"[^"]*")(?:,|\t)(?:[^,"\n\r]*|"[^"]*")(?:,|\t)(?:[^,"\n\r]*|"[^"]*")(?:,|\t)(?:[^,"\n\r]*|"[^"]*")(?:,|\t)(?:[^,"\n\r]*|"[^"]*")(?:,|\t)(?:[^,"\n\r]*|"[^"]*")(?:,|\t)(?:[^,"\n\r]*|"[^"]*")(?:,|\t)(?:[^,"\n\r]*|"[^"]*")(?:,|\t)(?:[^,"\n\r]*|"[^"]*")(?=\n|$)/gm;

  // Recherche de correspondances dans le contenu
  const correspondances = contenu.match(regex);

  // Retourne les correspondances trouvées
  return correspondances;
}

const filename =
  'Coinbase-59f9967cd257ec016a3d06ad-TransactionsHistoryReport-2021-04-21-15-09-10.csv';
// Exemple d'utilisation de la fonction avec votre contenu
const contenu = fs.readFileSync(
  join(__dirname, '..', '..', 'tmp/' + filename),
  'utf-8'
);

const partiesCSV_TSV = extraireContenuCSV_TSV(contenu);
let records: any = [];
const parser = parse({
  // trim: true,
  // delimiter: ',',
  skip_empty_lines: true,
  columns: true,
});

parser.on('readable', function () {
  let record;
  while ((record = parser.read()) !== null) {
    // console.log('NL', record);
    records.push(record);
  }
});
parser.on('error', function (err: any) {
  console.log({ err });
  // return reject(err);
});
parser.on('end', function () {
  console.log({ recordsSize: records.length });
  fs.writeFileSync('tmp/coinbase-debug.json', JSON.stringify(records, null, 2));
  // return resolve(records);
});
// console.log(JSON.stringify(partiesCSV_TSV, null, 2));
if (partiesCSV_TSV?.length) {
  fs.writeFileSync('tmp/coinbase-debug.csv', partiesCSV_TSV.join('\n'));
  const data = fs.readFileSync('tmp/coinbase-debug.csv', 'utf-8');
  // console.log(data);
  parser.write(data);
  parser.end();
}
