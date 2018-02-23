"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XRegExp = require("xregexp");
exports.tableRegex = XRegExp(`\
( # header capture
  (?:
    (?:[^\\r\\n]*?\\|[^\\r\\n]*)       # line w/ at least one pipe
    \\ *                       # maybe trailing whitespace
  )?                          # maybe header
  (?:\\r?\\n|^)                 # newline
)
( # format capture
  (?:
    \\|\\ *(?::?-+:?|::)\\ *            # format starting w/pipe
    |\\|?(?:\\ *(?::?-+:?|::)\\ *\\|)+   # or separated by pipe
  )
  (?:\\ *(?::?-+:?|::)\\ *)?           # maybe w/o trailing pipe
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
`, 'gx');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVnZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBb0M7QUFFdkIsUUFBQSxVQUFVLEdBQUcsT0FBTyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F3QmpDLEVBQ0csSUFBSSxDQUNQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWFJlZ0V4cCA9IHJlcXVpcmUoJ3hyZWdleHAnKTtcblxuZXhwb3J0IGNvbnN0IHRhYmxlUmVnZXggPSBYUmVnRXhwKGBcXFxuKCAjIGhlYWRlciBjYXB0dXJlXG4gICg/OlxuICAgICg/OlteXFxcXHJcXFxcbl0qP1xcXFx8W15cXFxcclxcXFxuXSopICAgICAgICMgbGluZSB3LyBhdCBsZWFzdCBvbmUgcGlwZVxuICAgIFxcXFwgKiAgICAgICAgICAgICAgICAgICAgICAgIyBtYXliZSB0cmFpbGluZyB3aGl0ZXNwYWNlXG4gICk/ICAgICAgICAgICAgICAgICAgICAgICAgICAjIG1heWJlIGhlYWRlclxuICAoPzpcXFxccj9cXFxcbnxeKSAgICAgICAgICAgICAgICAgIyBuZXdsaW5lXG4pXG4oICMgZm9ybWF0IGNhcHR1cmVcbiAgKD86XG4gICAgXFxcXHxcXFxcICooPzo6Py0rOj98OjopXFxcXCAqICAgICAgICAgICAgIyBmb3JtYXQgc3RhcnRpbmcgdy9waXBlXG4gICAgfFxcXFx8Pyg/OlxcXFwgKig/Ojo/LSs6P3w6OilcXFxcICpcXFxcfCkrICAgIyBvciBzZXBhcmF0ZWQgYnkgcGlwZVxuICApXG4gICg/OlxcXFwgKig/Ojo/LSs6P3w6OilcXFxcICopPyAgICAgICAgICAgIyBtYXliZSB3L28gdHJhaWxpbmcgcGlwZVxuICBcXFxcICogICAgICAgICAgICAgICAgICAgICAgICAgIyBtYXliZSB0cmFpbGluZyB3aGl0ZXNwYWNlXG4gIFxcXFxyP1xcXFxuICAgICAgICAgICAgICAgICAgICAgICAjIG5ld2xpbmVcbilcbiggIyBib2R5IGNhcHR1cmVcbiAgKD86XG4gICAgKD86W15cXFxcclxcXFxuXSo/XFxcXHxbXlxcXFxyXFxcXG5dKikgICAgICAgIyBsaW5lIHcvIGF0IGxlYXN0IG9uZSBwaXBlXG4gICAgXFxcXCAqICAgICAgICAgICAgICAgICAgICAgICAjIG1heWJlIHRyYWlsaW5nIHdoaXRlc3BhY2VcbiAgICAoPzpcXFxccj9cXFxcbnwkKSAgICAgICAgICAgICAgICMgbmV3bGluZVxuICApKyAjIGF0IGxlYXN0IG9uZVxuKVxuYCxcbiAgICAnZ3gnLFxuKTsiXX0=