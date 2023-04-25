import * as Excel from 'exceljs';

/**
 * Generate xml to be used as source for contribution
 * @param domains 
 */
export const xmlWriter = async (domains: any, options: {fileName:String}) => {
    const workbook = new Excel.Workbook();
    workbook.creator = 'properties tool';
    const domainKeys = domains.keys();
    for (let domainKey of domainKeys) {
        /*
        Domain =
        {
            'global' => Map(3) {
                'default' => Map(2) {
                'adummyprop' => 'A dummy value',
                'bdummy' => 'B dummy value'
                },
                'de' => Map(2) { 'adummyprop' => 'Ein Kartoffel', '#bdummy' => '' },
                'fr' => Map(2) {
                'adummyprop' => 'Une valeur d’exemple',
                'bdummy' => 'Une autre valeur d’exemple'
                }
            }
        }
         */
        const domain = domains.get(domainKey);
        if (!domain) {
            continue;
        }
        const languages = Array.from(domain.keys());
        languages.unshift(''); // add empty cell at row start
        // create worksheet for the current Domain
        const sheet = workbook.addWorksheet(domainKey);
        // first row is the languages list
        sheet.addRow(languages);
        // read lines from domain

        // ver 0.1 default key must exist
        const defaultDomainProps = domain.get('default');
        defaultDomainProps?.forEach((value: string, key: string, map: Map<string, string>) => {
            const elts = languages.map((language)=> {
                if (language === '') { // is the first column
                    return key;
                }
                return domain.get(language)?.get(key) || '';
            });
            sheet.addRow(elts);
        });
    };
    const xlsxFileName = options.fileName || 'properties';
    console.log(`writing: ${xlsxFileName}.xlsx ...`);
    await workbook.xlsx.writeFile(`${xlsxFileName}.xlsx`);
}
