export let tableJustification: { [key: string]: string } = {
	Left: ':-',
	Center: '::',
	Right: '-:'
};

export let addTailPipes = (str: string) => {
	return `|${str}|`;
};

export let joinCells = (arr: string[]) => {
	return arr.join('|');
};

export let stripHeaderTailPipes = (line: string | undefined): string => {
	return line!.trim().replace(/(^\||\|$)/g, '');
};

export let splitCells = (str: string) => {
    var items: string[] = [];
    var nested = false;
    var buffer: string = '';
    var nestedDepth = 0;
    for (var i = 0; i <= str.length; i++) {
        if ((str[i] === '|' && !nested) || i === str.length) {
            if (buffer.length >= 0) {
                items.push(buffer);
                buffer = '';
                continue;
            }
        } else if (nested && str[i] === '`') {
            buffer += str[i];
            var nestedCount = 1
            for (var j = i + 1; j <= str.length - i; j++) {
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

            var nestedCount = 1
            for (var j = i + 1; j <= str.length - i; j++) {
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

export let fixJustification = (cell: string) => {
	const trimmed = cell.trim();
	if (trimmed === "") {
		return "--";
	}
	const first = trimmed[0];
	const last = trimmed[trimmed.length - 1];
	const ends = (first || ':') + (last || '-');
	return ends;
};