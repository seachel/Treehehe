let vars = {
	rulesContainerClass: 'rules-container'
};

function Rule(conclusion, premises = [], ruleName = "", sideCondition = "")
{
	return {
		conclusion: conclusion,
		premises: premises,
		ruleName: ruleName,
		sideCondition: sideCondition
	};
}

function Rule_Tex(conclusion, premises = [], ruleName = "", textRuleName = "")
{
	return {
		conclusion: conclusion,
		premises: premises,
		ruleName: ruleName,
		textRuleName: textRuleName
	};
}

const RuleSets = (function()
{
	let naturalDeduction =
	[
		Rule("$P_1 \\wedge P_2$", ["$P_1$", "$P_2$"], "$\\wedge_I$"),
		Rule("$P_1$", ["$P_1 \\wedge P_2$"], "$\\wedge_{E_1}$"),
		Rule("$P_2$", ["$P_1 \\wedge P_2$"], "$\\wedge_{E_2}$")
		// Rule("$P_1 \\rightarrow P_2$", [{ contents: ["$P_1$", "$\\vdots$", "$P_2$"], justification: "$u$" }], "$\\rightarrow_{I^u}$"),
		// Rule("$P_2$", ["$P_1$", "$P_1 \\rightarrow P_2$"], "$\\rightarrow_E$")
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

function writeRuleHTML_Tex(rule)
{
	// div for the rule name
	// div content is latex with "infer" command
	// div class is rule-(rule name)

	var classStr = `rule-${rule.textRuleName}`;

	var ruleText = `\$\\infer[${rule.ruleName}]\{${rule.conclusion}\}\{${rule.premises ? rule.premises.join(" & ") : ""}\}\$`;

	var ruleContainer = d3.select(`.${vars.rulesContainerClass}`)
							.append('div')
							.classed(classStr, true)
							.classed('rule', true)
							.text(ruleText);
}

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
							.classed(classStr, true)
							.classed('rule', true);

	for (let i = 0; i < rule.premises.length; i++)
	{
		var premise = rule.premises[i];

		if (premise.contents)
		{
			var premiseContainer = ruleContainer.append('div')
												.classed('premise-container', true)
												.classed(`premise${i + 1}`, true)
												.classed('leaf', true);

			for (let j = 0; j < premise.contents.length; j++)
			{
				premiseContainer.append('div')
					// .classed('leaf', true)
					// .classed(`premise${i + 1}`, true)
					.text(premise.contents[j]);
			}
		}
		else
		{
			ruleContainer.append('div')
					.classed('leaf', true)
					.classed(`premise${i + 1}`, true)
					.text(premise);
		}
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