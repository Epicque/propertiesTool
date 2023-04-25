import { opendir, readFile } from 'fs/promises';
import { Dir } from 'fs';
import * as path from 'path';

export const propertiesReader = async (dir: Dir) => {
    type Domains = Map<string, Map<string, Map<string, string>>>;
    /*
        {
            domain: {
                locale: {
                    key: str
                }
            }
        }
    */
    const props: Domains = new Map();
    for await (const dirEnt of dir) {
        if (dirEnt.name.includes('.properties')) {
            const fileName = dirEnt.name.split('.properties')[0];
            const entSplit = fileName.split('_');
            const domainName = entSplit[0];
            const locale = entSplit.length > 1 ? entSplit[1] : 'default'; // does not work for long locales, must use another split method
            console.log(`reading: ${dir.path}/${dirEnt.name} ...`);
            const contents = await readFile(path.resolve(dir.path, dirEnt.name), { encoding: 'utf8', flag: 'r' });
            const lines = contents.split('\n');// split new lines, should handle also windows style line return, \n is not accurate.

            const domain = getOrSet(props, domainName);
            const domainLang = getOrSet(domain, locale);
            // reading lines
            lines.forEach((line) => {
                if (!line) { // skip empty lines
                    return;
                }

                const [key, value] = line.split('=');
                // setting in domain values
                domainLang.set(key, value);
            });
        }
    }
    return props;
}

const getOrSet: any = (map: Map<any, any>, key: any, defaultValue: any = new Map()) => {
    let mapEntry = map.get(key);
    if (!mapEntry) {
        map.set(key, defaultValue);
        return map.get(key);
    }
    return mapEntry;
}
