// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

	// Defines a Mocha unit test
	test("Something 1", () => {
		
        var tableTest = `| Header 1 | Header 2 | Header 3 |
|----|---|-|
| data1a | Data is longer than header | 1 |
| d1b | add a cell|
|lorem|ipsum|3|
| | empty outside cells
| skip| | 5 |
| six | Morbi purus | 6 |`;
        
        console.log(myExtension.format(tableTest));
        
    });
});