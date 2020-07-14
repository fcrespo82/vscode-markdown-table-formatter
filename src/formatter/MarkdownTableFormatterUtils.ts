export const tableJustification: { [key: string]: string } = {
    Left: ':-',
    Center: '::',
    Right: '-:'
};

export const addTailPipes = (str: string): string => {
    return `|${str}|`;
};

export const joinCells = (arr: string[]): string => {
    return arr.join('|');
};

export const stripHeaderTailPipes = (line: string | undefined): string => {
    return line?.trim().replace(/(^\||\|$)/g, '') ?? "";
};

export const splitCells = (str: string): string[] => {
    const items: string[] = [];
    let nested = false;
    let buffer = '';
    let nestedDepth = 0;
    for (let i = 0; i <= str.length; i++) {
        if ((str[i] === '|' && !nested) || i === str.length) {
            if (buffer.length >= 0) {
                items.push(buffer);
                buffer = '';
                continue;
            }
        } else if (nested && str[i] === '`') {
            buffer += str[i];
            let nestedCount = 1
            for (let j = i + 1; j <= str.length - i; j++) {
                if (str[j] === '`') {
                    nestedCount += 1;
                    i++
                    buffer += str[i]
                } else {
                    break
                }
            }
            if (nestedDepth === nestedCount) {
                nestedDepth = 0
                nested = false
            }
        } else if (!nested && str[i] === '`') {
            buffer += str[i];

            let nestedCount = 1
            for (let j = i + 1; j <= str.length - i; j++) {
                if (str[j] === '`') {
                    nestedCount += 1;
                    i++
                    buffer += str[i]
                } else {
                    break
                }
            }
            if (nestedCount > nestedDepth) {
                nestedDepth = nestedCount
            }
            if (str[i + 1] !== '`') {
                nested = true;
            }
        } else {
            buffer += str[i];
        }
    }
    return items;
};

export const fixJustification = (cell: string): string => {
    const trimmed = cell.trim();
    if (trimmed === "") {
        return "--";
    }
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    const ends = (first || ':') + (last || '-');
    return ends;
};