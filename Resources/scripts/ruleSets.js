let vars = {
	rulesContainerClass: 'rules-container'
};

function Rule(conclusion, premises = [], ruleName = [], sideCondition = [])
{
	return {
		conclusion: conclusion,
		premises: premises,
		ruleName: ruleName,
		sideCondition: sideCondition
	};
}

const RuleSets = (function()
{
	let naturalDeduction =
	[
		Rule("$A \\wedge B$", ["$A$", "$B$"], "$\\wedge_I$")
	];

	return {
		naturalDeduction: naturalDeduction,
		logicProgramming: []
	}
})();

(function setSelectedTreeRules()
{
	RuleSets.naturalDeduction.forEach(rule =>
	{
		writeRuleHTML(rule);
	});
})()

function writeRuleHTML(rule)
{
	let classStr = "tree_";

	switch(rule.premises.length)
	{
		case 0:
			classStr += "zero-child";
			break;
		case 1:
			classStr += "one-child";
			break;
		case 2:
			classStr += "two-child"
			break;
		default:
			//do something... error?
	}

	var ruleContainer = d3.select(`.${vars.rulesContainerClass}`)
							.append('div')
							.classed('tree_two-child', true)
							.classed('tree', true);

	for (let i = 0; i < rule.premises.length; i++)
	{
		ruleContainer.append('div')
				.classed('leaf', true)
				.classed(`premise${i + 1}`, true)
				.text(rule.premises[i]);
	}

	ruleContainer.append('div')
				.classed('root', true)
				.classed('conclusion', true)
				.text(rule.conclusion);

	ruleContainer.append('div')
				.classed('rule-text', true)
				.classed('side-condition', true)
				.text(rule.sideCondition);

	ruleContainer.append('div')
				.classed('rule-text', true)
				.classed('rule-name', true)
				.text(rule.ruleName);
}

function writeTwoPremiseRuleHTML(conclusion, premise1, premise2, ruleName = "", sideCondition = "")
{
	var ruleContainer = d3.select(`${vars.rulesContainerClass}`)
							.append('div')
							.classed('tree_two-child', true)
							.classed('tree', true);

	ruleContainer.append('div')
				.classed('leaf', true)
				.text(premise1);


	ruleContainer.append('div')
				.classed('leaf', true)
				.text(premise2);

	ruleContainer.append('div')
				.classed('node', true)
				.text(conclusion);

	ruleContainer.append('div')
				.classed('rule-text', true)
				.classed('rule-left', true)
				.text(sideCondition);

	ruleContainer.append('div')
				.classed('rule-text', true)
				.classed('rule-right', true)
				.text(ruleName);
}