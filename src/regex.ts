import XRegExp = require('xregexp');

export const tableRegex = XRegExp(`\
( # header capture
  (?:
    (?:[^\\r\\n]*?\\|[^\\r\\n]*)       # line w/ at least one pipe
    \\ *                       # maybe trailing whitespace
  )?                          # maybe header
  (?:\\r?\\n|^)                 # newline
)
( # format capture
  (?:
    \\|\\ *(?::?-+:?|::)?\\ *            # format starting w/pipe
    |\\|?(?:\\ *(?::?-+:?|::)?\\ *\\|)+   # or separated by pipe
  )
  (?:\\ *(?::?-+:?|::)?\\ *)?           # maybe w/o trailing pipe
  \\ *                         # maybe trailing whitespace
  \\r?\\n                       # newline
)
( # body capture
  (?:
    (?:[^\\r\\n]*?\\|[^\\r\\n]*)       # line w/ at least one pipe
    \\ *                       # maybe trailing whitespace
    (?:\\r?\\n|$)               # newline
  )+ # at least one
)
`,
    'gx',
);