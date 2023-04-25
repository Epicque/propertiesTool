import * as Excel from 'exceljs';

// need row + cell / column mapping = { fr_FR : { key : value, k2: v2} }
// double map ?

/*
{
    domain_name: {
        country_Code: {
            key: value,
            key2: value2,
            ...
        }
    }
}
*/

export const xmlReader = async (filePath: string) => {
    const workbook = new Excel.Workbook();
    const content = await workbook.xlsx.readFile(filePath);
    const domains: Map<String, Map<String, Map<String, String>>> = new Map();
    content.worksheets.forEach((worksheet) => {
        let languagesMap: Map<String, String> = new Map();
        let languages: Map<String, Map<String, String>> = new Map();
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                // { fr_FR: { key, value }}
                row.eachCell((cell, cellNumber) => {
                    if (cellNumber === 1) return;
                    if (!cell.value) return;
                    languagesMap.set(cellNumber.toString(), cell.value.toString());
                    languages.set(cell.value.toString(), new Map());
                });
                return;
            }

            let currentKey: String = '';

            // add cell value in given language map for row key
            row.eachCell({ includeEmpty: true }, (cell, cellNumber) => {
                if (cellNumber === 1) {
                    currentKey = cell.value?.toString() || '';
                    return;
                }
                const cellLanguage: String = languagesMap.get(cell.col.toString()) || '';
                languages.get(cellLanguage)?.set(currentKey, cell.value?.toString() || '');
            });
        });
        domains.set(worksheet.name, languages);
    });
    return domains;
}
