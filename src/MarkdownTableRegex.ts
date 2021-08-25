import XRegExp = require('xregexp');
XRegExp.install("namespacing");

export const tableRegex = XRegExp(String.raw`
(?:
  (?<inlist>(?:[-+*\.]+|[0-9]+\.)[ ]*)                  # Table is inside list
  |                                          # or
  (?<indentation>[ ]+)                       # Table is indented
)?
(?<header>
  (?:[^\n]*\|[^\n]*)
)\n
(?:[ ]*?
  (?<format>
    (?:[ -:]*\|[ -:]*)+
  )\n?
)$\n?
(?<body>
  (?:
    (?:^[ ]*
      (?:[^\n]*\|[^\n]*)+
    )[\n|$]?
  )*
)
`,
	'gmx',
);