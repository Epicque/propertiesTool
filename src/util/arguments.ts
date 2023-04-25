type o = {
    [key: string]: string
}

export const getArguments = () => {
    const argsArr = process.argv.splice(2);
    const argsObject : o =  argsArr.reduce((o: o, a: string) => {
        const arg: Array<string> = a.split('=');
        const key: string = arg[0];
        o[key] = arg[1];
        return o;
    }, {});

    if (!Object.hasOwnProperty.call(argsObject, 'input')) {
        throw('Missing "input" argument, please provide a valid xml file path or props folder path');
    }

    return argsObject;
}
