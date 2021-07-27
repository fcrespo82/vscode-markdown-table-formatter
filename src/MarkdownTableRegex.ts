import XRegExp = require('xregexp');
XRegExp.install("namespacing");

export const tableRegex = XRegExp(String.raw`
(?:
  (?<inlist>[-+*]|[0-9]+\.)                  # Table is inside list
  |                                          # or
  (?<indentation>[ ]+)                       # Table is indented
)?
(?<header>                                   # Header capture
  (?:[^\r\n]*?\|[^\r\n]*)+                   # Line w/ at least one pipe
  \r?\n                                      # Newline
)
(?<format>                                   # Format capture
  (?:[ :-]*?\|[ :-]*)+                       # Line w/ separators containing at least one pipe
  (?:\r?\n|$)                              # Newline
)
(?<body>
  (?:                                        # Body capture
    (?:[^\r\n]*?\|[^\r\n]*)+                 # Line w/ at least one pipe
    (?:\r?\n|$)                              # Newline
  )+
)*
`,
    'gmx',
);