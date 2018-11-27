// ---------- Examples

const TreeExamples = (function()
{
	let data = TreeDataMaker.makeProofTreeNode("$x \\rightarrow y$",
		[
			TreeDataMaker.makeProofTreeNode("$\\forall x, P \; x$"),
			TreeDataMaker.makeProofTreeNode("1 + 2 + 3 = :)",
			[
				TreeDataMaker.makeProofTreeNode("$x \\supset y$"),
				TreeDataMaker.makeProofTreeNode("$\\wedge$")
			]),
			TreeDataMaker.makeProofTreeNode("$\\forall x$")
		],
	"A right",
	"A left");

	let treeExample1 = TreeDataMaker.makeProofTreeNode("$(p \\wedge r) \\rightarrow (q \\wedge s) \\sum$",
		[
			TreeDataMaker.makeProofTreeNode("$q \\wedge s$",
			[
				TreeDataMaker.makeProofTreeNode("$q$",
				[
					TreeDataMaker.makeProofTreeNode("$p$",
					[
						TreeDataMaker.makeProofTreeNode("$p \\wedge r$", [], "$u$")
					],
					"$\\wedge_{E_1}$"),
					TreeDataMaker.makeProofTreeNode("$p \\rightarrow q$", null)
				],
				"$\\rightarrow_E$"),
				TreeDataMaker.makeProofTreeNode("$s$",
				[
					TreeDataMaker.makeProofTreeNode("$r$",
					[
						TreeDataMaker.makeProofTreeNode("$p \\wedge u$", [], "$u$")
					],
					"$\\wedge_{E_2}$"),
					TreeDataMaker.makeProofTreeNode("$r \\rightarrow s$", null)
				],
				"$\\wedge_E$")
			],
			"$\\wedge_I$")
		],
		"$\\rightarrow_{I^u}$");

	return {
		ex1: data,
		natded_ex1: treeExample1
	}
})();