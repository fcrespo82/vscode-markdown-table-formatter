import XRegExp = require('xregexp');
XRegExp.install("namespacing");
export const tableRegex = XRegExp(String.raw`
(?<header>                                # header capture
  ^                                       # line start
  (?:[^\r\n]*?\|[^\r\n]*)                 # line w/ at least one pipe
  $                                       # line end
  (?:\r?\n)                               # newline
)?                                        # optional header
(?<format>                                # format capture
  ^                                       # line start
  (?:[:-]*?\|[:-]*)+                      # line containing separator items w/ at least one pipe
  \s*                                     # maybe trailing whitespace
  $                                       # line end
  (?:\r?\n)?                              # newline
)
(?<body>                                  # body capture
  (?:
    (?:[^\r\n]*?\|[^\r\n]*)               # line w/ at least one pipe
    \s*?                                  # maybe trailing whitespace
    (?:\r?\n|^|$)?                        # newline
  )+                                      # at least one
)
`,
  'gmx',
);