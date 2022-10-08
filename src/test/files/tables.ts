import MarkdownTableFormatterSettings, {MarkdownTableFormatterDefaultTableJustification, MarkdownTableFormatterDelimiterRowPadding, MarkdownTableFormatterGlobalColumnSizes} from "../../formatter/MarkdownTableFormatterSettings";

export const testTables: { id: number, input: string, expected: string, settings?: MarkdownTableFormatterSettings }[] = [
	{
		id: 0,
		input: `\
| Foo | Bar |
| - | - |
|'Baz'|Qux|`,
		expected: `\
| Foo   | Bar |
| ----- | --- |
| 'Baz' | Qux |`,
		settings: {
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.SingleApaceAlways
		}
	},
	{
		id: 1,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:||
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
| Left header     |  Center header  |    Right header | Default header  |
|:----------------|:---------------:|----------------:|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C |  Line:2 Col:D   |
| L:3 C:A         |     L:3 C:B     |         L:3 C:C |     L:3 C:D     |`,
		settings: {
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Center
		}
	},
	{
		id: 2,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
| Left header     |  Center header  |    Right header | Default header  |
|:----------------|:---------------:|----------------:|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C | Line:2 Col:D    |
| L:3 C:A         |     L:3 C:B     |         L:3 C:C | L:3 C:D         |`
	},
	{
		id: 3,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
| Left header     |  Center header  |    Right header | Default header  |
|:----------------|:---------------:|----------------:|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C |  Line:2 Col:D   |
| L:3 C:A         |     L:3 C:B     |         L:3 C:C |     L:3 C:D     |`,
		settings: {
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Center,
		}
	},
	{
		id: 4,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
| Left header     |  Center header  |    Right header |  Default header |
|:----------------|:---------------:|----------------:|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C |    Line:2 Col:D |
| L:3 C:A         |     L:3 C:B     |         L:3 C:C |         L:3 C:D |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Right,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 5,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
| Left header     |  Center header  |    Right header | Default header  |
|-----------------|:---------------:|----------------:|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C | Line:2 Col:D    |
| L:3 C:A         |     L:3 C:B     |         L:3 C:C | L:3 C:D         |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Left,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: true,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 6,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
| Left header     |  Center header  |    Right header | Default header  |
|:----------------|-----------------|----------------:|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C |  Line:2 Col:D   |
| L:3 C:A         |     L:3 C:B     |         L:3 C:C |     L:3 C:D     |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Center,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: true,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 7,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
| Left header     |  Center header  |    Right header |  Default header |
|:----------------|:---------------:|-----------------|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C |    Line:2 Col:D |
| L:3 C:A         |     L:3 C:B     |         L:3 C:C |         L:3 C:D |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Right,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: true,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 8,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
|  Left header      |   Center header   |     Right header  |  Default header   |
|:------------------|:-----------------:|------------------:|-------------------|
|  Line:1 Column:A  |  Line:1 Column:B  |  Line:1 Column:C  |  Line:1 Column:D  |
|  Line:2 Col:A     |   Line:2 Col:B    |     Line:2 Col:C  |  Line:2 Col:D     |
|  L:3 C:A          |      L:3 C:B      |          L:3 C:C  |  L:3 C:D          |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 2,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Left,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 9,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
|  Left header      |   Center header   |     Right header  |  Default header   |
|:------------------|:-----------------:|------------------:|-------------------|
|  Line:1 Column:A  |  Line:1 Column:B  |  Line:1 Column:C  |  Line:1 Column:D  |
|  Line:2 Col:A     |   Line:2 Col:B    |     Line:2 Col:C  |   Line:2 Col:D    |
|  L:3 C:A          |      L:3 C:B      |          L:3 C:C  |      L:3 C:D      |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 2,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Center,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 10,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
|  Left header      |   Center header   |     Right header  |   Default header  |
|:------------------|:-----------------:|------------------:|-------------------|
|  Line:1 Column:A  |  Line:1 Column:B  |  Line:1 Column:C  |  Line:1 Column:D  |
|  Line:2 Col:A     |   Line:2 Col:B    |     Line:2 Col:C  |     Line:2 Col:D  |
|  L:3 C:A          |      L:3 C:B      |          L:3 C:C  |          L:3 C:D  |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 2,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Right,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 11,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
 Left header     |  Center header  |    Right header | Default header  
:----------------|:---------------:|----------------:|-----------------
 Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D 
 Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C | Line:2 Col:D    
 L:3 C:A         |     L:3 C:B     |         L:3 C:C | L:3 C:D         `,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: false,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Left,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 12,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
 Left header     |  Center header  |    Right header | Default header  
:----------------|:---------------:|----------------:|-----------------
 Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D 
 Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C |  Line:2 Col:D   
 L:3 C:A         |     L:3 C:B     |         L:3 C:C |     L:3 C:D     `,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: false,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Center,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 13,
		input: `\
|Left header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
 Left header     |  Center header  |    Right header |  Default header 
:----------------|:---------------:|----------------:|-----------------
 Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D 
 Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C |    Line:2 Col:D 
 L:3 C:A         |     L:3 C:B     |         L:3 C:C |         L:3 C:D `,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: false,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Right,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameColumnSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 14,
		input: `\
|header a       |header b|
|:-|-|
|column a 1|column b 1|
|column a 2|column b 2|`,
		expected: `\
| header a   | header b   |
|:-----------|------------|
| column a 1 | column b 1 |
| column a 2 | column b 2 |`
	},
	{
		id: 15,
		input: `\
|header a       |header b|
|:-|-:|
|column a 1|column b 1|
|column a 2|column b 20|`,
		expected: `\
| header a   |    header b |
|:-----------|------------:|
| column a 1 |  column b 1 |
| column a 2 | column b 20 |`
	},
	{
		id: 16,
		input: `\
|header a       |header b|
|:-|::|
|column a 1|column b 1|
|column a 2|column b 2|`,
		expected: `\
| header a   |  header b  |
|:-----------|:----------:|
| column a 1 | column b 1 |
| column a 2 | column b 2 |`
	},
	{
		id: 17,
		input: `\
| Topic                      | Status    | Notes |
|----------------------------|-----------|-------|
| Is source control used?    | \`NO\`      |       |
| Are changes peer reviewed? | \`PARTIAL\` |       |`
		,
		expected: `\
| Topic                      | Status    | Notes |
|----------------------------|-----------|-------|
| Is source control used?    | \`NO\`      |       |
| Are changes peer reviewed? | \`PARTIAL\` |       |`
	},
	{
		id: 18,
		input: `\
| Topic        | Status | Notes |
|--------------|--------|-------|
| Is Iot used? | \`NO\`   |       |`
		,
		expected: `\
| Topic        | Status | Notes |
|--------------|--------|-------|
| Is Iot used? | \`NO\`   |       |`
	},
	{
		id: 19,
		input: `\
| a        | b | c |
|:---------|:--|:--|
| fdasdfas | x \`\\|\` y | z |`
		,
		expected: `\
| a        | b        | c |
|:---------|:---------|:--|
| fdasdfas | x \`\\|\` y | z |`
	},
	{
		id: 20,
		input: `\
|Name|Syntax|Equivalent GLSL|
|-------------------|----------------------|-----------------------|
|Negate|\`-a\`|\`-a\`|
|Not|\`nota\`|\`!a\`|
|Sine|\`sina\`|\`sin(a)\`|
|Cosine|\`cosa\`|\`cos(a)\`|
|Tangent|\`tana\`|\`tan(a)\`|
|InverseSine|\`asina\`|\`asin(a)\`|
|InverseCosine|\`acosa\`|\`acos(a)\`|
|InverseTangent|\`atana\`|\`atan(a)\`|
|InverseTangent2|\`aatanb\`|\`atan(a,b)\`|
|Exponential|\`expa\`|\`exp(a)\`|
|Logarithm|\`loga\`|\`log(a)\`|
|Exponential2|\`exp2a\`|\`exp2(a)\`|
|Logarithm2|\`log2a\`|\`log2(a)\`|
|SquareRoot|\`sqrta\`|\`sqrt(a)\`|
|InverseSquareRoot|\`inversesqrta\`|\`inversesqrt(a)\`|
|Absolute|\`absa\`|\`abs(a)\`|
|Sign|\`signa\`|\`sign(a)\`|
|Floor|\`floora\`|\`floor(a)\`|
|Ceiling|\`ceila\`|\`ceil(a)\`|
|Fractional|\`fracta\`|\`fract(a)\`|
|Multiply|\`a*b\`|\`a*b\`|
|Divide|\`a/b\`|\`a/b\`|
|Add|\`a+b\`|\`a+b\`|
|Subtract|\`a-b\`|\`a-b\`|
|LessThan|\`a<b\`|\`a<b\`|
|GreaterThan|\`a>b\`|\`a>b\`|
|LessThanEqual|\`a<=b\`|\`a<=b\`|
|GreaterThanEqual|\`a>=b\`|\`a>=b\`|
|Equal|\`aisb\`|\`a==b\`|
|NotEqual|\`anotb\`|\`a!=b\`|
|And|\`a&&b\`|\`a&&b\`|
|Or|\`a\\|\\|b\`|\`a\\|b\`|
|Exponentiate|\`apowb\`|\`pow(a,b)\`|
|Modulo|\`a%b\`|\`mod(a,b)\`|
|Minimum|\`aminb\`|\`min(a,b)\`|
|Maximum|\`amaxb\`|\`max(a,b)\`|
|Conditional|\`a?b:c\`|\`a?b:c\`|
|Clamp|\`aclampb:c\`|\`clamp(b,c,a)\`|
|Step|\`astepb\`|\`step(b,a)\`|
|SmoothStep|\`asmoothstepb:c\`|\`smoothstep(b,c,a)\`|
|LinearInterpolate|\`amixb:c\`|\`mix(b,c,a)\`|`,
		expected: `\
| Name              | Syntax           | Equivalent GLSL     |
|-------------------|------------------|---------------------|
| Negate            | \`-a\`             | \`-a\`                |
| Not               | \`nota\`           | \`!a\`                |
| Sine              | \`sina\`           | \`sin(a)\`            |
| Cosine            | \`cosa\`           | \`cos(a)\`            |
| Tangent           | \`tana\`           | \`tan(a)\`            |
| InverseSine       | \`asina\`          | \`asin(a)\`           |
| InverseCosine     | \`acosa\`          | \`acos(a)\`           |
| InverseTangent    | \`atana\`          | \`atan(a)\`           |
| InverseTangent2   | \`aatanb\`         | \`atan(a,b)\`         |
| Exponential       | \`expa\`           | \`exp(a)\`            |
| Logarithm         | \`loga\`           | \`log(a)\`            |
| Exponential2      | \`exp2a\`          | \`exp2(a)\`           |
| Logarithm2        | \`log2a\`          | \`log2(a)\`           |
| SquareRoot        | \`sqrta\`          | \`sqrt(a)\`           |
| InverseSquareRoot | \`inversesqrta\`   | \`inversesqrt(a)\`    |
| Absolute          | \`absa\`           | \`abs(a)\`            |
| Sign              | \`signa\`          | \`sign(a)\`           |
| Floor             | \`floora\`         | \`floor(a)\`          |
| Ceiling           | \`ceila\`          | \`ceil(a)\`           |
| Fractional        | \`fracta\`         | \`fract(a)\`          |
| Multiply          | \`a*b\`            | \`a*b\`               |
| Divide            | \`a/b\`            | \`a/b\`               |
| Add               | \`a+b\`            | \`a+b\`               |
| Subtract          | \`a-b\`            | \`a-b\`               |
| LessThan          | \`a<b\`            | \`a<b\`               |
| GreaterThan       | \`a>b\`            | \`a>b\`               |
| LessThanEqual     | \`a<=b\`           | \`a<=b\`              |
| GreaterThanEqual  | \`a>=b\`           | \`a>=b\`              |
| Equal             | \`aisb\`           | \`a==b\`              |
| NotEqual          | \`anotb\`          | \`a!=b\`              |
| And               | \`a&&b\`           | \`a&&b\`              |
| Or                | \`a\\|\\|b\`         | \`a\\|b\`              |
| Exponentiate      | \`apowb\`          | \`pow(a,b)\`          |
| Modulo            | \`a%b\`            | \`mod(a,b)\`          |
| Minimum           | \`aminb\`          | \`min(a,b)\`          |
| Maximum           | \`amaxb\`          | \`max(a,b)\`          |
| Conditional       | \`a?b:c\`          | \`a?b:c\`             |
| Clamp             | \`aclampb:c\`      | \`clamp(b,c,a)\`      |
| Step              | \`astepb\`         | \`step(b,a)\`         |
| SmoothStep        | \`asmoothstepb:c\` | \`smoothstep(b,c,a)\` |
| LinearInterpolate | \`amixb:c\`        | \`mix(b,c,a)\`        |`
	},
	{
		id: 21,
		input: `\
|Small a|Small b|
|:-|:-|
|L:1 C:A|L:1 C:B|

|Large header a|Large header b|
|:-|:-|
|Line:1 Column:A|Line:1 Column:B|`,
		expected: `\
| Small a         | Small b         |
|:----------------|:----------------|
| L:1 C:A         | L:1 C:B         |

| Large header a  | Large header b  |
|:----------------|:----------------|
| Line:1 Column:A | Line:1 Column:B |`
	},
	{
		id: 22,
		input: `\
|Small a|Small b|Small c|
|:-|:-|:-|
|L:1 C:A|L:1 C:B|L:1 C:C|

|Large header a|Large header b|
|:-|:-|
|Line:1 Column:A|Line:1 Column:B|`,
		expected: `\
| Small a         | Small b         | Small c |
|:----------------|:----------------|:--------|
| L:1 C:A         | L:1 C:B         | L:1 C:C |

| Large header a  | Large header b  |
|:----------------|:----------------|
| Line:1 Column:A | Line:1 Column:B |`
	},
	{
		id: 23,
		input: `\
|Small a|Small b|Small c|
|:-|:-|:-|
|L:1 C:A|L:1 C:B|L:1 C:C|

|Large header a|Large header b|
|:-|:-|
|Line:1 Column:A|Line:1 Column:B|`,
		expected: `\
| Small a   | Small b   | Small c   |
|:----------|:----------|:----------|
| L:1 C:A   | L:1 C:B   | L:1 C:C   |

| Large header a  | Large header b  |
|:----------------|:----------------|
| Line:1 Column:A | Line:1 Column:B |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Left,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameTableSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 24,
		input: `\
| Topic| Status| Notes |
|:---|:----|:-|
| Is source control used?| NO| |
| Are changes peer reviewed? | PARTIAL | |

| Topic| Status|
|:-|:--|
| Is Iot used?| NO|`,
		expected: `\
| Topic                      | Status  | Notes |
|:---------------------------|:--------|:------|
| Is source control used?    | NO      |       |
| Are changes peer reviewed? | PARTIAL |       |

| Topic                    | Status            |
|:-------------------------|:------------------|
| Is Iot used?             | NO                |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Left,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameTableSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 25,
		input: `\
| Topic| Status| Notes |
|:---|:----|:-|
| Is source control used?| NO| |
| Are changes peer reviewed? | PARTIAL | |

| Topic| Status|
|:-|:--|
| Is Iot used?| NO|`,
		expected: `\
|  Topic                       |  Status   |  Notes  |
|:-----------------------------|:----------|:--------|
|  Is source control used?     |  NO       |         |
|  Are changes peer reviewed?  |  PARTIAL  |         |

|  Topic                      |  Status              |
|:----------------------------|:---------------------|
|  Is Iot used?               |  NO                  |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 2,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Left,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameTableSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 26,
		input: `\
|1eft header|Center header |Right header|Default header|
|:-|::|-:|-|
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|

| Topic                      | Status    | Notes |
|----------------------------|-----------|-------|
| Is source control used?    | NO        |       |
| Are changes peer reviewed? | PARTIAL   |       |`
		, expected: `\
| 1eft header     |  Center header  |    Right header | Default header  |
|:----------------|:---------------:|----------------:|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    |  Line:2 Col:B   |    Line:2 Col:C | Line:2 Col:D    |
| L:3 C:A         |     L:3 C:B     |         L:3 C:C | L:3 C:D         |

| Topic                               | Status          | Notes         |
|-------------------------------------|-----------------|---------------|
| Is source control used?             | NO              |               |
| Are changes peer reviewed?          | PARTIAL         |               |`,
		settings: {
			enable: true,
			enableSort: true,
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: MarkdownTableFormatterDefaultTableJustification.Left,
			markdownGrammarScopes: ['markdown'],
			limitLastColumnWidth: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: MarkdownTableFormatterGlobalColumnSizes.SameTableSize,
			delimiterRowPadding: MarkdownTableFormatterDelimiterRowPadding.None,
			allowEmptyRows: true
		}
	},
	{
		id: 27,
		input: `\
| a | b |
|------------|---------------|
| 1234567890 | 1234567890 |`,
		expected: `\
| a          | b          |
|------------|------------|
| 1234567890 | 1234567890 |`
	},
	{
		id: 28,
		input: `\
|  |  |
|------------|---------------|
| 1234567890 | 1234567890 |`,
		expected: `\
|            |            |
|------------|------------|
| 1234567890 | 1234567890 |`
	},
	{
		id: 29,
		input: `\
| Text | Result |
|----------|-------------------|
| \`\` $\` \`\` | text before match |`,
		expected: `\
| Text     | Result            |
|----------|-------------------|
| \`\` $\` \`\` | text before match |`
	},
	{
		id: 30,
		input: `\
|a|
|-|
|a|`,
		expected: `\
| a |
|---|
| a |`
	},
	{
		id: 31,
		input: `\
| symbol | name
|-|-
| " | quote
| « | left-pointing double angle quote
| \` | backtick`,
		expected: `\
| symbol | name                             |
|--------|----------------------------------|
| "      | quote                            |
| «      | left-pointing double angle quote |
| \`      | backtick                         |`
	},
	{
		id: 32,
		input: `\
* Stuff:
  |One|Two|Three|
  |---|---|-----|
  |'1'|'2'|'3'|`,
		expected: `\
* Stuff:
  | One | Two | Three |
  |-----|-----|-------|
  | '1' | '2' | '3'   |`
	},
	{
		id: 33,
		input: `\
1. One | Two | Three
   --- | --- | -----
   '1' | '2' | '3'`,
		expected: `\
1. | One | Two | Three |
   |-----|-----|-------|
   | '1' | '2' | '3'   |`
	},
	{
		id: 34,
		input: `\
* |One|Two|Three|
  |---|---|-----|
  |'1'|'2'|'3'|`,
		expected: `\
* | One | Two | Three |
  |-----|-----|-------|
  | '1' | '2' | '3'   |`
	},
	{
		id: 35,
		input: `\
|abc|def|
|---|---|
|bar|baz|
> bar`,
		expected: `\
| abc | def |
|-----|-----|
| bar | baz |
> bar`
	},
	{
		id: 36,
		input: `\
| abc | def |
| ------ | -------- |`,
		expected: `\
| abc | def |
|-----|-----|`
	},
	{
		id: 37,
		input: `\
  | f\\|oo  |
  | ------ |
  | b \`\\|\` az |
  | b **\\|** im |`,
		expected: `\
  | f\\|oo       |
  |-------------|
  | b \`\\|\` az   |
  | b **\\|** im |`
	},
	{
		id: 38,
		input: `\
// Not a table
| abc | def |
| --- |
| bar |`,
		expected: `\
// Not a table
| abc | def |
| --- |
| bar |`
	},
	{
		id: 39,
		input: `\
| abc | def |
| --- | --- |
| bar |
| bar | baz | boo |`,
		expected: `\
| abc | def |
|-----|-----|
| bar |     |
| bar | baz |`
	},
	{
		id: 40,
		input: `\
	(Paragraph omitted) blah blah blah:

	with mask:
		# x y and out are all 16-bit so are subdivided at:
		# |      mask[0]     mask[1]     mask[3]         |
		# |  0-3    |    4-7    |   8-11    |   12-15    |
		x = PartitionedSignal(16)    # identical except for mask
		y = PartitionedSignal(16)    # identical except for mask
		out = PartitionedSignal(16)  # identical except for mask`,
		expected: `\
	(Paragraph omitted) blah blah blah:

	with mask:
		# x y and out are all 16-bit so are subdivided at:
		# |      mask[0]     mask[1]     mask[3]         |
		# |  0-3    |    4-7    |   8-11    |   12-15    |
		x = PartitionedSignal(16)    # identical except for mask
		y = PartitionedSignal(16)    # identical except for mask
		out = PartitionedSignal(16)  # identical except for mask`,
	}
];