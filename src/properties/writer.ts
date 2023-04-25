import { createWriteStream } from 'node:fs';

export const propertiesWriter = async (propsMap: Map<String, Map<String, Map<String, String>>>) => {
    propsMap.forEach((propDomain, domainName) => {
        // create file for each prop domain
        propDomain.forEach((localeValues, locale) => {
            const propertiesFileName: string = locale !== 'default' ? `${domainName}_${locale}.properties` : `${domainName}.properties`;

            const ws = createWriteStream(propertiesFileName);

            localeValues.forEach((value, key) => {
                const line = `${!value ? '#' : ''}${key.trim()}=${value}`;
                ws.write(`${line}\n`);
            });

            ws.close();
            console.log(propertiesFileName);
        });
    });
    return;
}
