import XRegExp = require('xregexp');
XRegExp.install("namespacing");

export const tableRegex = XRegExp(String.raw`
(?:
  (?<inlist>(?:[-+*\.]+|[0-9]+[ ]?[-\)\.])[ ]*)
  |
  (?<indentation>[ ]+)
)?
(?<header>
  (?:[^\n]*\|[^\n]*)
)\n
(?:[ ]*?
  (?<format>
    (?:[ -:]*\|[ -:]*)+
  )\r?\n?
)$\r?\n?
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