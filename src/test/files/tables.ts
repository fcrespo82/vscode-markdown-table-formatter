export let testTables = [
	{
		"test":
`|header a       |header b|
|-|-|
|column a 1|column b 1|
|column a 2|column b 2|`,
		"expected":
`| header a        |  header b  |
|:----------------|:-----------|
| column a 1      | column b 1 |
| column a 2      | column b 2 |`
	},
	{
		"test":
`| Topic                      | Status    | Notes |
|----------------------------|-----------|-------|
| Is source control used?    | \`NO\`      |       |
| Are changes peer reviewed? | \`PARTIAL\` |       |`
		,
		"expected": ``
	},
	{
		"test":
`| Topic        | Status | Notes |
|--------------|--------|-------|
| Is Iot used? | \`NO\`   |       |`
		,
		"expected": ``
	}
];