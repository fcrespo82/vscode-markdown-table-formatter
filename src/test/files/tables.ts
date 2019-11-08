
export let testTables = [
	{
		input: `\
|Left header|Center header |Right header|Default header|
|||||
|Line:1 Column:A|Line:1 Column:B|Line:1 Column:C|Line:1 Column:D|
|Line:2 Col:A|Line:2 Col:B|Line:2 Col:C|Line:2 Col:D|
|L:3 C:A|L:3 C:B|L:3 C:C|L:3 C:D|`,
		expected: `\
| Left header     | Center header   | Right header    | Default header  |
|-----------------|-----------------|-----------------|-----------------|
| Line:1 Column:A | Line:1 Column:B | Line:1 Column:C | Line:1 Column:D |
| Line:2 Col:A    | Line:2 Col:B    | Line:2 Col:C    | Line:2 Col:D    |
| L:3 C:A         | L:3 C:B         | L:3 C:C         | L:3 C:D         |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
| L:3 C:A         |     L:3 C:B     |         L:3 C:C | L:3 C:D         |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Center',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Right',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: true,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Center',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: true,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Right',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: true,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 2,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 2,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Center',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 2,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Right',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: false,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: false,
			defaultTableJustification: 'Center',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: false,
			defaultTableJustification: 'Right',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
		input: `\
|header a       |header b|
|:-|-|
|column a 1|column b 1|
|column a 2|column b 2|`,
		expected: `\
| header a   | header b   |
|:-----------|------------|
| column a 1 | column b 1 |
| column a 2 | column b 2 |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
		input: `\
|header a       |header b|
|:-|-:|
|column a 1|column b 1|
|column a 2|column b 20|`,
		expected: `\
| header a   |    header b |
|:-----------|------------:|
| column a 1 |  column b 1 |
| column a 2 | column b 20 |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
		input: `\
|header a       |header b|
|:-|::|
|column a 1|column b 1|
|column a 2|column b 2|`,
		expected: `\
| header a   |  header b  |
|:-----------|:----------:|
| column a 1 | column b 1 |
| column a 2 | column b 2 |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
| Are changes peer reviewed? | \`PARTIAL\` |       |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
		input: `\
| Topic        | Status | Notes |
|--------------|--------|-------|
| Is Iot used? | \`NO\`   |       |`
		,
		expected: `\
| Topic        | Status | Notes |
|--------------|--------|-------|
| Is Iot used? | \`NO\`   |       |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
		input: `\
| a        | b | c |
|:---------|:--|:--|
| fdasdfas | x \`|\` y | z |`
		,
		expected: `\
| a        | b       | c |
|:---------|:--------|:--|
| fdasdfas | x \`|\` y | z |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
|Or|\`a||b\`|\`a|b\`|
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
| Or                | \`a||b\`           | \`a|b\`               |
| Exponentiate      | \`apowb\`          | \`pow(a,b)\`          |
| Modulo            | \`a%b\`            | \`mod(a,b)\`          |
| Minimum           | \`aminb\`          | \`min(a,b)\`          |
| Maximum           | \`amaxb\`          | \`max(a,b)\`          |
| Conditional       | \`a?b:c\`          | \`a?b:c\`             |
| Clamp             | \`aclampb:c\`      | \`clamp(b,c,a)\`      |
| Step              | \`astepb\`         | \`step(b,a)\`         |
| SmoothStep        | \`asmoothstepb:c\` | \`smoothstep(b,c,a)\` |
| LinearInterpolate | \`amixb:c\`        | \`mix(b,c,a)\`        |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
| Line:1 Column:A | Line:1 Column:B |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
| Line:1 Column:A | Line:1 Column:B |`,
		settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same table size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same table size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 2,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same table size',
			delimiterRowPadding: 'None'
		}
	},
	{
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
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same table size',
			delimiterRowPadding: 'None'
		}
	},
	{
		input: `\
|------------|---------------|
| 1234567890 | 1234567890 |`,
		expected: `\
|------------|------------|
| 1234567890 | 1234567890 |`,
				settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
	{
		input: `\
|  |  |
|------------|---------------|
| 1234567890 | 1234567890 |`,
		expected: `\
|            |            |
|------------|------------|
| 1234567890 | 1234567890 |`,
				settings: {
			spacePadding: 1,
			keepFirstAndLastPipes: true,
			defaultTableJustification: 'Left',
			markdownGrammarScopes: ['markdown'],
			limitLastColumnPadding: false,
			removeColonsIfSameAsDefault: false,
			globalColumnSizes: 'Same column size',
			delimiterRowPadding: 'None'
		}
	},
];