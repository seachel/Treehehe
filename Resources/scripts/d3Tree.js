// ------------------------------ Program and layout variables ------------------------------

const webvars = {
	treeContainerTag: "div",
	treeContainerClass: "tree-container",
	treeClassName: "tree-svg",
	nodesContainerTag: "g",
	nodesContainerClass: "nodes",
	nodeContainerTag: "g",
	nodeContainerClass: "node",
	backgroundTag: "rect",
	ruleTextContainerTag: "g",
	sideConditionClass: "rule-text-left",
	ruleNameClass: "rule-text-right",
	nodeIdAttr: "node-id",
	nodeTextTag: "text",
	nodeTextClass: "node-text",
	ruleTextClass: "rule-text",
	ruleTextLeftClass: "rule-text-left",
	ruleTextRightClass: "rule-text-right",
	texContainerTag: "g",
	texContainerClass: "tex-container",
	focusRectClass: "focus-rect",
	visitedRectClass: "visited-rect",
	navButtonTag: "div",
	forwardButtonClass: "btn-forward",
	backButtonClass: "btn-backward",
	treeNotesClass: "tree-selection",
	treeNoteTag: "div"
}

const selectors = {
	nodeElementSelector: `${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`,
	textLeftElementSelector: `${webvars.ruleTextContainerTag}.${webvars.ruleTextLeftClass}`,
	textRightElementSelector: `${webvars.ruleTextContainerTag}.${webvars.ruleTextRightClass}`
}

let stylingvars = {
	nodePadding: 5,
	propositionBorderThickness: 3,
	propositionBackgroundHeight: 25,
	heightPerProofRow: 35,
	texShift: -30 // need to be set for every example?
};

// ------------------------------ Tree Data ------------------------------


TreeDataMaker = (function()
{
	let id = 0;

	let makeNodeId = () =>
	{
		id++;
		return `node${id}`;
	}

	let makeTreeId = () =>
	{
		id++;
		return `tree${id}`;
	}

	function makeNode(proposition, children = null, ruleName = "", sideCondition = "")
	{
		let nodeId = makeNodeId();

		let result = {
			name: nodeId,
			proposition: proposition,
			children: children,
			id: nodeId,
			ruleName: ruleName,
			sideCondition: sideCondition
		}

		if (children === null)
		{
			result["isPremise"] = true;
		}

		return result;
	}

	function makeTree(root, noteLines = [])
	{
		return {
			root: root,
			id: makeTreeId(),
			noteLines: noteLines
		};
	}

	return {
		makeNode: makeNode,
		makeTree: makeTree
	};
})();


// ---------- Examples

const TreeExamples = (function()
{
	let dataRoot = TreeDataMaker.makeNode("$x \\rightarrow y$",
		[
			TreeDataMaker.makeNode("$\\forall x, P \; x$"),
			TreeDataMaker.makeNode("1 + 2 + 3 = :)",
			[
				TreeDataMaker.makeNode("$x \\supset y$"),
				TreeDataMaker.makeNode("$\\wedge$")
			]),
			TreeDataMaker.makeNode("$\\forall x$")
		],
	"A right",
	"A left");

	let natded_ex1Root = TreeDataMaker.makeNode("$(p \\wedge q) \\rightarrow r$",
		[
			TreeDataMaker.makeNode("$r$",
			[
				TreeDataMaker.makeNode("$p$",
				[
					TreeDataMaker.makeNode("$p \\wedge q$", [], "$u$")
				],
				"$\\wedge_{E_1}$"),
				TreeDataMaker.makeNode("$p \\rightarrow r$",
				[
					TreeDataMaker.makeNode("$(p \\rightarrow r) \\wedge (q \\rightarrow r)$")
				],
				"$\\wedge_{E_1}$")
			],
			"$\\rightarrow_E$")
		],
		"$\\rightarrow_{I^u}$"
	);

	let natded_ex1 = TreeDataMaker.makeTree(natded_ex1Root)


	let natded_ex2Root = TreeDataMaker.makeNode("$p \\wedge (q \\wedge r)$",
		[
			TreeDataMaker.makeNode("$p$",
			[
				TreeDataMaker.makeNode("$p \\wedge q$",
				[
					TreeDataMaker.makeNode("$(p \\wedge q) \\wedge r$")
				],
				"$\\wedge_{E_1}$")
			],
			"$\\wedge_{E_1}$"),
			TreeDataMaker.makeNode("$q \\wedge r$",
			[
				TreeDataMaker.makeNode("$q$",
				[
					TreeDataMaker.makeNode("$p \\wedge q$",
					[
						TreeDataMaker.makeNode("$(p \\wedge q) \\wedge r$")
					],
					"$\\wedge_{E_1}$")
				],
				"$\\wedge_{E_2}$"),
				TreeDataMaker.makeNode("$r$",
				[
					TreeDataMaker.makeNode("$(p \\wedge q) \\wedge r$")
				],
				"$\\wedge_{E_2}$")
			],
			"$\\wedge_I$")
		],
		"$\\wedge_I$"
	);

	let natded_ex2 = TreeDataMaker.makeTree(natded_ex2Root);


	let natded_ex3Root = TreeDataMaker.makeNode("$(p \\wedge r) \\rightarrow (q \\wedge s)$",
		[
			TreeDataMaker.makeNode("$q \\wedge s$",
			[
				TreeDataMaker.makeNode("$q$",
				[
					TreeDataMaker.makeNode("$p$",
					[
						TreeDataMaker.makeNode("$p \\wedge r$", [], "$u$")
					],
					"$\\wedge_{E_1}$"),
					TreeDataMaker.makeNode("$p \\rightarrow q$", null)
				],
				"$\\rightarrow_E$"),
				TreeDataMaker.makeNode("$s$",
				[
					TreeDataMaker.makeNode("$r$",
					[
						TreeDataMaker.makeNode("$p \\wedge r$", [], "$u$")
					],
					"$\\wedge_{E_2}$"),
					TreeDataMaker.makeNode("$r \\rightarrow s$", null)
				],
				"$\\wedge_E$")
			],
			"$\\wedge_I$")
		],
		"$\\rightarrow_{I^u}$");

	let natded_ex3 = TreeDataMaker.makeTree(natded_ex3Root);

	let natded_ex4Root = TreeDataMaker.makeNode("$q \\wedge p$",
		[
			TreeDataMaker.makeNode("$q$",
			[
				TreeDataMaker.makeNode("$p \\wedge q$")
			],
			"$\\wedge_{E_2}$"),
			TreeDataMaker.makeNode("$p$",
			[
				TreeDataMaker.makeNode("$p \\wedge q$")
			],
			"$\\wedge_{E_1}$")
		],
		"$\\wedge_I$");

	let natded_ex4 = TreeDataMaker.makeTree(natded_ex4Root);

	let logprog_ex1Root = TreeDataMaker.makeNode("$\\Sigma ; \\mathcal{P} \\vdash \\exists M, \\mathrm{length} \\; (1 :: 2 :: 3 :: [ \\, ]) \\; M$",
		[
			TreeDataMaker.makeNode("$\\Sigma ; \\mathcal{P} \\vdash \\mathrm{length} \\; (1 :: 2 :: [ \\, ]) \\; t$",
			[
				TreeDataMaker.makeNode("$\\Sigma ; \\mathcal{P} \\vdash \\mathrm{length} \\; (2 :: 3 :: [ \\, ]) \\; t_0$",
				[
					TreeDataMaker.makeNode("$\\Sigma ; \\mathcal{P} \\vdash \\mathrm{length} \\; (3 :: [ \\, ]) \\; t_1$",
					[
						TreeDataMaker.makeNode("$\\Sigma ; \\mathcal{P} \\vdash \\mathrm{length} \\; [ \\, ] \\; t_2$",
						[],
						"$\\mathrm{backchain}_{P_2}$",
						"$t_2 = 0$")
					],
					"$\\mathrm{backchain}_{P_1}$",
					"$t_1 = 1 + t_2$")
				],
				"$\\mathrm{backchain}_{P_1}$",
				"$t_0 = 1 + t_1$")
			],
			"$\\mathrm{backchain}_{P_1}$",
			"$t = 1 + t_0$"),
			TreeDataMaker.makeNode("$\\Sigma ; \\emptyset \\models t : \\mathrm{nat}$")
		],
		"$\\exists_R$"
	);

	let logprog_ex1 = TreeDataMaker.makeTree(logprog_ex1Root,
		[

		]);


	let selectedExample = TreeDataMaker.makeTree(natded_ex1Root);

	function setSelectedExample(selection)
	{
		selectedExample = selection;
	}

	function getSelectedExample()
	{
		return selectedExample;
	}

	return {
		examples:
			[
				natded_ex1,
				natded_ex2,
				natded_ex3,
				natded_ex4,
				logprog_ex1
			],
		setSelectedExample: setSelectedExample,
		getSelectedExample: getSelectedExample
	};
})();
// whole thing in a module, with function `setTree` that makes a new tree builder and reruns MathJax? anything else?
let currentTreeBuilder = TreeBuilder(TreeExamples.getSelectedExample());

function UpdateTreeSelection(selectedTree)
{
	currentTreeBuilder = TreeBuilder(selectedTree);
	currentInteractionManager = InteractionManager(); // better way to do this?

	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	// MathJax.Callback.Queue("MathJaxSVGManipulation");
	setTimeout(MathJaxSVGManipulation, 500);
}

function TreeBuilder(selectedTree)
{
	// clear previous svg?
	d3.select(`${webvars.treeContainerTag}.${webvars.treeContainerClass} > svg`).remove();

	// ------------------------------ D3 ------------------------------

	// ---------- Data in d3 heirarchy object

	let myroot = d3.hierarchy(selectedTree.root); // set x0 and y0 based on svg dimensions?


	// ---------- D3 tree variables and utils

	let proofHeight = myroot.height + 1;

	let treeHeight = proofHeight * stylingvars.heightPerProofRow;

	let treeWidth = 900; // TODO: need to compute based on example


	// ---------- Create tree

	let mytree = d3.tree().size([treeWidth, treeHeight]);


	// ---------- Initialize tree? Position elements

	mytree(myroot);

	let linkHeight = myroot.links()[0].target.y - myroot.links()[0].source.y;


	// ---------- Set up DOM content

	let svgheight = treeHeight + ((proofHeight + 1) * 2 * stylingvars.nodePadding);
	let svgwidth = treeWidth;


	let svgtree = AddSVGTreeAndNodesContainer();

	AddTreeSelectionNotes()

	function AddTreeSelectionNotes()
	{
		var selectionNotes = d3.select(`.${webvars.treeNotesClass}`);

		selectedTree.noteLines.forEach(line =>
			{
				selectionNotes.append(`${webvars.treeNode}`).text(line);
			});
	}

	AddNodeGroupsAndBackground();

	AddPropositionText();

	AddLeftRightContent();

	//#region Tree Set-up Functions
	function AddSVGTreeAndNodesContainer()
	{
		return d3.select(`${webvars.treeContainerTag}.${webvars.treeContainerClass}`)
					.append('svg').style('background', 'grey')
					.classed(webvars.treeClassName, true)
					.attr('width', svgwidth)
					.attr('height', svgheight)
					.style('overflow', 'visible')
					.append(webvars.nodesContainerTag)
					.classed(webvars.nodesContainerClass, true)
					.attr('transform', `translate(0, ${stylingvars.texShift})`);
	}

	function AddNodeGroupsAndBackground()
	{
		d3.select(`svg ${webvars.nodesContainerTag}.${webvars.nodesContainerClass}`)
			.selectAll(`${selectors.nodeElementSelector}`)
			.data(myroot.descendants())
			.enter()
			.append(webvars.nodeContainerTag)
			.classed(webvars.nodeContainerClass, true)
			.style('overflow', 'visible')
			.attr(webvars.nodeIdAttr, d => d.data.id)
			.attr('transform', d => `translate(${d.x}, ${svgheight - d.y})`)
			.attr('text-anchor', 'middle')
			.append(webvars.backgroundTag)
			.classed(webvars.nodeContainerClass, true)
			.attr(webvars.nodeIdAttr, d => d.data.id)
			.on('click', node_onclick);
	}

	function AddPropositionText()
	{
		d3.selectAll(`${webvars.nodesContainerTag}.${webvars.nodesContainerClass} > ${selectors.nodeElementSelector}`)
			.append(webvars.nodeTextTag)
			.classed(webvars.nodeTextClass, true)
			.attr(webvars.nodeIdAttr, d => d.data.id)
			.attr('dy', '0.35em')
			.attr('alignment-baseline', 'mathematical')
			.text(d => d.data.proposition)
			.on('click', node_onclick);
	}

	function AddLeftRightContent()
	{
		// left content
		d3.selectAll(`${selectors.nodeElementSelector}`)
			.append(webvars.ruleTextContainerTag)
			.classed(webvars.sideConditionClass, true)
			.classed(webvars.ruleTextClass, true)
			.style('overflow', 'visible')
			.attr(webvars.nodeIdAttr, d => d.data.id)
			.attr('text-anchor', 'start')
			.append(webvars.backgroundTag)
			.classed(webvars.ruleTextClass, true)
			.classed(webvars.ruleTextLeftClass, true)
			.attr(webvars.nodeIdAttr, d => d.data.id);

		d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.sideConditionClass}`)
			.append(webvars.nodeTextTag)
			.classed(webvars.ruleTextClass, true)
			.classed(webvars.nodeTextClass, true)
			.attr(webvars.nodeIdAttr, d => d.data.id)
			.attr('dy', '0.35em')
			.attr('alignment-baseline', 'mathematical')
			.text(d => d.data.sideCondition);

		// right content
		d3.selectAll(`${selectors.nodeElementSelector}`)
			.append(webvars.ruleTextContainerTag)
			.classed(webvars.ruleNameClass, true)
			.classed(webvars.ruleTextClass, true)
			.style('overflow', 'visible')
			.attr(webvars.nodeIdAttr, d => d.data.id)
			.attr('text-anchor', 'start')
			.append(webvars.backgroundTag)
			.classed(webvars.ruleTextClass, true)
			.classed(webvars.ruleTextRightClass, true)
			.attr(webvars.nodeIdAttr, d => d.data.id);

		d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleNameClass}`)
			.append(webvars.nodeTextTag)
			.classed(webvars.ruleTextClass, true)
			.classed(webvars.nodeTextClass, true)
			.attr(webvars.nodeIdAttr, d => d.data.id)
			.attr('dy', '0.35em')
			.attr('alignment-baseline', 'mathematical')
			.text(d => d.data.ruleName);
	}
	//#endregion

	function PostRenderProposition()
	{
		PositionPropositionBoundingRect();
		AddProofTreeLines();
	}

	function PostRenderRuleText()
	{
		PositionRuleTextBoundingRect();
		PositionRightContent();
		PositionLeftContent();
	}

	//#region Post-TeX Render Tree Manipulation Functions
	function AddProofTreeLines()
	{
		d3.selectAll(`${selectors.nodeElementSelector}`)
		.append('line')
		.attr('x1', d =>
		{
			return getRuleDisplayLRBound(d).left;
		})
		.attr('x2', d =>
		{
			return getRuleDisplayLRBound(d).right;
		})
		.attr('y1', d => ruleCenterY)
		.attr('y2', d => ruleCenterY)
		.attr('stroke', 'black');
	}

	function PositionPropositionBoundingRect()
	{
		d3.selectAll(`${webvars.backgroundTag}.${webvars.nodeContainerClass}`)
			.attr('x', d =>
			{
				return getPropositionBounds(d.data.id).x - stylingvars.nodePadding
			})
			.attr('y', d =>
			{
				var bounds = getPropositionBounds(d.data.id);
				return bounds.y - ((stylingvars.propositionBackgroundHeight - bounds.height) / 2);
			})
			.attr('width', d => getPropositionBounds(d.data.id).width + 2 * stylingvars.nodePadding)
			.attr('height', d => stylingvars.propositionBackgroundHeight);
	}


	function PositionRuleTextBoundingRect()
	{
		d3.selectAll(`${webvars.backgroundTag}.${webvars.sideConditionClass}`)
			.filter(d =>
			{
				let bounds = getLeftContentBounds(d.data.id);
				return bounds.x != bounds.y;
			})
			.attr('x', d =>
			{
				return getLeftContentBounds(d.data.id).x - stylingvars.nodePadding;
			})
			.attr('y', d => getLeftContentBounds(d.data.id).y - stylingvars.nodePadding)
			.attr('width', d => getLeftContentBounds(d.data.id).width + 2 * stylingvars.nodePadding)
			.attr('height', d => getLeftContentBounds(d.data.id).height + 2 * stylingvars.nodePadding);

		d3.selectAll(`${webvars.backgroundTag}.${webvars.ruleNameClass}`)
			.filter(d =>
			{
				let bounds = getRightContentBounds(d.data.id);
				return bounds.x != bounds.y;
			})
			.attr('x', d =>
			{
				return getRightContentBounds(d.data.id).x - stylingvars.nodePadding;
			})
			.attr('y', d => getRightContentBounds(d.data.id).y - stylingvars.nodePadding)
			.attr('width', d => getRightContentBounds(d.data.id).width + 2 * stylingvars.nodePadding)
			.attr('height', d => getRightContentBounds(d.data.id).height + 2 *  stylingvars.nodePadding);
	}

	var ruleCenterY = -1 * (linkHeight / 2) + stylingvars.nodePadding + stylingvars.propositionBorderThickness;

	function PositionRightContent()
	{
		d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleNameClass}`)
			.attr('transform', d =>
			{
				let x = getRuleDisplayLRBound(d).right;

				return `translate(${x + stylingvars.nodePadding},
								${ruleCenterY - stylingvars.nodePadding - stylingvars.propositionBorderThickness})`
			});
	}

	function PositionLeftContent()
	{
		d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.sideConditionClass}`)
			.attr('transform', d =>
			{
				let selector = `${selectors.textLeftElementSelector}[${webvars.nodeIdAttr}=${d.data.id}]`;
				let width = getVisualItemBounds(d.data.id, selector).width;

				let x = getRuleDisplayLRBound(d).left - width;


				return `translate(${x - stylingvars.nodePadding},
								${ruleCenterY - stylingvars.nodePadding - stylingvars.propositionBorderThickness})`
			});
	}

	//#endregion

	//#region Bounds Computation

	function getRuleDisplayLRBound(hierarchyObj)
	{
		let id = hierarchyObj.data.id;

		let currentPropBB = getPropositionBounds(id)

		let result = {
			left: currentPropBB.x,
			right: currentPropBB.x + currentPropBB.width
		};

		if (hierarchyObj.children)
		{
			if (hierarchyObj.children.length > 0)
			{
				let firstChild = hierarchyObj.children[0];
				let firstChildPropBB = getPropositionBounds(firstChild.data.id);

				let xDiffLeft = hierarchyObj.x - firstChild.x;

				if (xDiffLeft > 0 ||
					((xDiffLeft == 0) && (firstChildPropBB.x < currentPropBB.x)))
				{
					result.left -= xDiffLeft + (firstChildPropBB.width / 2) - (currentPropBB.width / 2);
				}

				let lastChild = hierarchyObj.children[hierarchyObj.children.length - 1];
				let lastChildPropBB = getPropositionBounds(lastChild.data.id);

				let xDiffRight = lastChild.x - hierarchyObj.x;

				if (xDiffRight >= 0 && (lastChild.x + lastChildPropBB.width >= hierarchyObj.x + currentPropBB.width))
				{
					result.right += xDiffLeft + (lastChildPropBB.width / 2) - (currentPropBB.width / 2);
				}
			}
		}
		else if (hierarchyObj.data.isPremise)
		{
			result.right = result.left;
		}

		// add padding
		if (result.right != result.left)
		{
			result.left -= stylingvars.nodePadding;
			result.right += stylingvars.nodePadding;
		}

		return result;
	}

	function getVisualItemBounds(nodeId, itemContainerSelector)
	{
		let texNode = d3.select(`${itemContainerSelector}[${webvars.nodeIdAttr}=${nodeId}] > ${webvars.texContainerTag}.${webvars.texContainerClass}`).node();

		if (texNode)
		{
			let boundingBox = texNode.getBBox();

			return {
				x: boundingBox.x,
				y: boundingBox.y,
				width: boundingBox.width,
				height: boundingBox.height
			};
		}
		else
		{
			// position rect based on text
			let textNodeBox = d3.select(`${itemContainerSelector}[${webvars.nodeIdAttr}=${nodeId}]
										 > ${webvars.nodeTextTag}[${webvars.nodeIdAttr}=${nodeId}]`)
								.node()
								.getBBox();

			return {
				x: textNodeBox.x,
				y: textNodeBox.y,
				width: textNodeBox.width,
				height: textNodeBox.height
			};
		}
	}


	function getPropositionBounds(nodeId)
	{
		return getVisualItemBounds(nodeId, selectors.nodeElementSelector);
	}

	function getLeftContentBounds(nodeId)
	{
		return getVisualItemBounds(nodeId, selectors.textLeftElementSelector);
	}

	function getRightContentBounds(nodeId)
	{
		return getVisualItemBounds(nodeId, selectors.textRightElementSelector);
	}
	//#endregion

	function getSelectedTree()
	{
		return selectedTree;
	}

	function getSelectedHRoot()
	{
		return myroot;
	}

	return {
		svgtree: svgtree,
		getSelectedTree: getSelectedTree,
		getSelectedHRoot: getSelectedHRoot,
		treeWidth: treeWidth,
		treeHeight: treeHeight,
		postRenderProposition: PostRenderProposition,
		postRenderRuleText: PostRenderRuleText
	};
}


// ---------- Interaction

let currentInteractionManager = InteractionManager();

function InteractionManager()
{// pass selector for selection panel? or separate this out?
	var myIterator = makeTreeIterator(currentTreeBuilder.getSelectedHRoot(), visitNodes_preOrder, focusNode);

	d3.select(`${webvars.navButtonTag}.${webvars.forwardButtonClass}`)
		.on('click', myIterator.next);

	d3.select(`${webvars.navButtonTag}.${webvars.backButtonClass}`)
		.on('click', myIterator.previous);

	function focusNode(selectedHNode)
	{
		updateSelectionPanel(selectedHNode);
		updateSelectionStyle(selectedHNode);
	}

	function updateSelectionStyle(selectedHNode)
	{
		var selectedId = selectedHNode.data.id;
	// need previously visited, but after, to lose visited status? or have a different kind of visited status?
		d3.selectAll(`${webvars.backgroundTag}.${webvars.focusRectClass}`)
			.classed(`${webvars.visitedRectClass}`, true)
			.classed(`${webvars.focusRectClass}`, false);

		d3.selectAll(`${webvars.backgroundTag}.${webvars.nodeContainerClass}[${webvars.nodeIdAttr}=${selectedId}]`)
			.classed(`${webvars.focusRectClass}`, true);

		d3.selectAll(`${webvars.backgroundTag}.${webvars.nodeContainerClass}`)
			.filter(d => d.data.id != selectedId)
			.classed(`${webvars.focusRectClass}`, false);
	}

	function updateSelectionPanel(selectedHNode)
	{
		// make sure anything previously in the panel is cleared
		d3.select(`.tree-selection`)
			.text(selectedHNodeOutput(selectedHNode));

		MathJax.Hub.Typeset();
	}

	function selectedHNodeOutput(selectedHNode)
	{
		return `id: ${selectedHNode.data.id},
		proposition: ${selectedHNode.data.proposition},
		rule name: ${selectedHNode.data.ruleName},
		side conditions: ${selectedHNode.data.sideCondition}`
	}

	// Bad: how to make sure the callbacks have the correct type?
	function makeTreeIterator(root, traversalFn, nodeCallback)
	{
		let nodesInOrder = [];

		traversalFn(root, n => nodesInOrder.push(n));

		let nextIndex = -1;
		let iterationCount = 0;
		let end = nodesInOrder.length - 1;

		const rangeIterator = {
			next: function()
			{
				let result;

				if (nextIndex < end) {
					nextIndex += 1;
					iterationCount++;

					result = { value: nextIndex, done: false, start: false };

					if (nodeCallback)
					{
						nodeCallback(nodesInOrder[nextIndex])
					}
				}
				else
				{
					result = { value: iterationCount, done: true, start: false };
				}

				return result;
			},
			previous: function()
			{
				let result;

				if (nextIndex > 0) {
					nextIndex -= 1;
					iterationCount--;

					result = { value: nextIndex, done: false, start: false };

					if (nodeCallback)
					{
						nodeCallback(nodesInOrder[nextIndex]);
					}
				}
				else
				{
					result = { value: iterationCount, done: false, start: true };
				}

				return result;
			},
			nodeArray: nodesInOrder
		};

		return rangeIterator;
	}

	return {
		iterator: myIterator,
		focusNode: focusNode
	}
};


// ---------- Tree Traversal

function visitNodes_postOrder(rootNode, nodeCallback, nodeCallbackArgs = [], iterationHeight = 0, childCallback = null, childCallbackArgs = [])
{
	if (rootNode.children)
	{
		if (rootNode.children.length > 0)
		{
			rootNode.children.forEach(child =>
			{
				if (childCallback)
				{
					childCallback(child, rootNode, ...childCallbackArgs);
				}
				visitNodes_postOrder(child, nodeCallback, nodeCallbackArgs, iterationHeight + 1, childCallback, childCallbackArgs);
			});
		}
	}

	if (nodeCallback)
	{
		nodeCallback(rootNode, ...nodeCallbackArgs, iterationHeight);
	}

	iterationHeight++;
}

function visitNodes_preOrder(rootNode, nodeCallback = null, nodeCallbackArgs = [], iterationHeight = 0, childCallback = null, childCallbackArgs = [])
{
	if (nodeCallback)
	{
		nodeCallback(rootNode, ...nodeCallbackArgs, iterationHeight);
	}

	if (rootNode.children)
	{
		if (rootNode.children.length > 0)
		{
			rootNode.children.forEach(child =>
			{
				if (childCallback)
				{
					childCallback(child, rootNode, ...childCallbackArgs);
				}
				visitNodes_preOrder(child, nodeCallback, nodeCallbackArgs, iterationHeight + 1, childCallback, childCallbackArgs);
			});
		}
	}

	iterationHeight++;
}


// ------------------------------ Event handlers ------------------------------

function node_onclick(selectedHNode)
{
	currentInteractionManager.focusNode(selectedHNode);
}

function exampleSelect_onchange(selectNode)
{
	var treeId = selectNode.children[selectNode.selectedIndex].label;

	UpdateTreeSelection(TreeExamples.examples.find(e => e.id == treeId));
}


// ------------------------------ MathJax ------------------------------
function MathJaxSVGManipulation()
{
	currentTreeBuilder.svgtree.selectAll(`${selectors.nodeElementSelector}`).each(function(){
		let self = d3.select(this),
			g = self.select(`${webvars.nodeTextTag} > span > svg`);

		if (g.node())
		{
			g.remove();
			self.append(webvars.texContainerTag)
				.classed(webvars.texContainerClass, true)
				.attr('width', '100%')
				.style('overflow', 'visible')
				// .attr('dominant-baseline', 'middle')
				.on('click', node_onclick)
				.append(function(){
					return g.node();
				})
				// .attr('dominant-baseline', 'middle')
				.attr('width', '50%')
				.attr('x', '-25%');
		}
	});

	currentTreeBuilder.postRenderProposition();

	currentTreeBuilder.svgtree.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleTextClass}`).each(function(){
		let self = d3.select(this),
			g = self.select(`${webvars.nodeTextTag} > span > svg`);

		if (g.node())
		{
			g.remove();
			self.append(webvars.texContainerTag)
				.classed(webvars.texContainerClass, true)
				.attr('width', '100%')
				.style('overflow', 'visible')
				.on('click', node_onclick)
				.append(function(){
					return g.node();
				});
		}
	});

	currentTreeBuilder.postRenderRuleText();
}

// scrolling
let scrollNode = d3.select('.scroll-container').node();
let scrollContainerWidth = scrollNode.clientWidth;
let scrollContainerHeight = scrollNode.clientHeight;
scrollNode.scrollTo((currentTreeBuilder.treeWidth - scrollContainerWidth) / 2, currentTreeBuilder.treeHeight - scrollContainerHeight);

TreeExamples.examples.forEach(e =>
	{
		d3.select('.example-list')
			.append('option')
			.attr('label', e.id)
			// .on('select', UpdateTreeSelection)
			// .on('focus', UpdateTreeSelection)
			.text(e.root.proposition);
	})


// d3.select('.example-list')
// 	.on(change, UpdateTreeSelection);