import * as path from 'path'
import { opendir } from 'fs/promises';
import { propertiesReader } from './properties/reader';
import { xmlWriter } from './xml/writer';
import { getArguments } from './util/arguments';
import { xmlReader } from './xml/reader';
import { propertiesWriter } from './properties/writer';

const lineSep = '========================================================================';
const message = `${lineSep}\n
=    EXCEL to properties files transformation tool\n
${lineSep}\n
Arguments:\n
input=the/path/you/want     | mandatory\n
output=the/path/you/want\n
${lineSep}\n
`;
console.log(message);

const args = getArguments();
console.log(args);
const mode = args.input && args.input.toLowerCase().includes('.xlsx') ? 'READ_XLSX' : 'READ_PROPERTIES';
switch (mode) {
    case 'READ_XLSX':
        const xmlPath = path.resolve(args.input);
        xmlReader(xmlPath).then((domains) => {
            // @todo need a props output path
            propertiesWriter(domains);
        });
        break;
    case 'READ_PROPERTIES':
    default:
        const propsPath = path.resolve(args.input, 'properties');
        console.log(propsPath);
        const getFiles = async (propsPath: string) => {
            return await opendir(propsPath);
        }
        // parseFiles get files array as param
        getFiles(propsPath).then((propertiesFiles) => {
            propertiesReader(propertiesFiles).then((domains) => xmlWriter(domains, { fileName: args.output }));
        });
        break;
}
