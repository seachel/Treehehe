// module for whole file; module for node bounds computation?

// ------------------------------ Program and layout variables ------------------------------

var webvars = {
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
	backButtonClass: "btn-backward"
}

var stylingvars = {
	nodePadding: 5,
	texShift: -30 // need to be set for every example?
};

// ------------------------------ Tree Data ------------------------------

var id = 0;

var makeId = () => {
	id++;
	return `node${id}`;
}

function makeProofTreeNode(proposition, children = [], ruleName = "", sideCondition = "")
{
	var nodeId = makeId();

	var result = {
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


// ---------- Examples

var data = makeProofTreeNode("$x \\rightarrow y$",
	[
		makeProofTreeNode("$\\forall x, P \; x$"),
		makeProofTreeNode("1 + 2 + 3 = :)",
		[
			makeProofTreeNode("$x \\supset y$"),
			makeProofTreeNode("$\\wedge$")
		]),
		makeProofTreeNode("$\\forall x$")
	],
  "A right",
  "A left");

var treeExample1 = makeProofTreeNode("$(p \\wedge r) \\rightarrow (q \\wedge s)$",
	[
		makeProofTreeNode("$q \\wedge s$",
		[
			makeProofTreeNode("$q$",
			[
				makeProofTreeNode("$p$",
				[
					makeProofTreeNode("$p \\wedge r$", [], "$u$")
				],
				"$\\wedge_{E_1}$"),
				makeProofTreeNode("$p \\rightarrow q$", null)
			],
			"$\\rightarrow_E$"),
			makeProofTreeNode("$s$",
			[
				makeProofTreeNode("$r$",
				[
					makeProofTreeNode("$p \\wedge u$", [], "$u$")
				],
				"$\\wedge_{E_2}$"),
				makeProofTreeNode("$r \\rightarrow s$", null)
			],
			"$\\wedge_E$")
		],
		"$\\wedge_I$")
	],
	"$\\rightarrow_{I^u}$");


var selectedTree = treeExample1;

// ------------------------------ D3 ------------------------------


// ---------- Data in d3 heirarchy object

var myroot = d3.hierarchy(selectedTree); // set x0 and y0 based on svg dimensions?


// ---------- D3 tree variables and utils

var heightPerProofRow = 30;
var proofHeight = myroot.height + 1;

var treeHeight = proofHeight * heightPerProofRow;

var treeWidth = 900; // TODO: need to compute based on example

// ---------- Create tree


var mytree = d3.tree().size([treeWidth, treeHeight]);


// ---------- Initialize tree? Position elements

mytree(myroot);


// ---------- Set up DOM content

var svgheight = treeHeight + (proofHeight * 2 * stylingvars.nodePadding);
var svgwidth = treeWidth;

var linkHeight = myroot.links()[0].target.y - myroot.links()[0].source.y;

var svgtree = d3.select(`${webvars.treeContainerTag}.${webvars.treeContainerClass}`)
				.append('svg').style('background', 'grey')
				.classed(webvars.treeClassName, true)
				.attr('width', svgwidth)
				.attr('height', svgheight)
				.append(webvars.nodesContainerTag).classed(webvars.nodesContainerClass, true)
				.attr('transform', `translate(0, ${stylingvars.texShift})`);


// ---------- create svg objects to represent data and position them

d3.select(`svg ${webvars.nodesContainerTag}.${webvars.nodesContainerClass}`)
	.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
	.data(myroot.descendants())
	.enter()
	.append(webvars.nodeContainerTag)
	.classed(webvars.nodeContainerClass, true)
	.style('overflow', 'visible')
	.attr('node-id', d => d.data.id)
	.attr('transform', d => `translate(${d.x}, ${svgheight - d.y})`)
	.attr('text-anchor', 'middle')
	.append(webvars.backgroundTag)
	.classed(webvars.nodeContainerClass, true)
	.attr(webvars.nodeIdAttr, d => d.data.id)
	.on('click', node_onclick);


// Add text
d3.selectAll(`${webvars.nodesContainerTag}.${webvars.nodesContainerClass} > ${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
  .append(webvars.nodeTextTag)
  .classed(webvars.nodeTextClass, true)
  .attr(webvars.nodeIdAttr, d => d.data.id)
  .attr('dy', '0.35em')
  .attr('alignment-baseline', 'text-before-edge')
  .text(d => d.data.proposition)
  .on('click', node_onclick);

// Add left and right content
AddLeftRightContent();


// ------------------------------ Functions to Update and Add to Tree Layout

function AddProofTreeLines()
{
	d3.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
	.append('line')
	.attr('x1', d =>
	{
		return getRuleDisplayLRBound(d).left;
	})
	.attr('x2', d =>
	{
		return getRuleDisplayLRBound(d).right;
	})
	.attr('y1', d => -1 * heightPerProofRow / 2 + 5)
	.attr('y2', d => -1 * heightPerProofRow / 2 + 5)
	.attr('stroke', 'black');
}


function PositionPropositionBoundingRect()
{
	d3.selectAll(`${webvars.backgroundTag}.${webvars.nodeContainerClass}`)
		.attr('x', d =>
		{
			return getPropositionBounds(d.data.id).x - stylingvars.nodePadding
		})
		.attr('y', d => getPropositionBounds(d.data.id).y - stylingvars.nodePadding)
		.attr('width', d => getPropositionBounds(d.data.id).width + 2 * stylingvars.nodePadding)
		.attr('height', d => getPropositionBounds(d.data.id).height + 2 * stylingvars.nodePadding);
}


function PositionRuleTextBoundingRect()
{
	d3.selectAll(`${webvars.backgroundTag}.${webvars.sideConditionClass}`)
		.attr('x', d =>
		{
			return getLeftContentBounds(d.data.id).x
		})
		.attr('y', d => getLeftContentBounds(d.data.id).y)
		.attr('width', d => getLeftContentBounds(d.data.id).width)
		.attr('height', d => getLeftContentBounds(d.data.id).height);

	d3.selectAll(`${webvars.backgroundTag}.${webvars.ruleNameClass}`)
		.attr('x', d =>
		{
			return getRightContentBounds(d.data.id).x
		})
		.attr('y', d => getRightContentBounds(d.data.id).y)
		.attr('width', d => getRightContentBounds(d.data.id).width)
		.attr('height', d => getRightContentBounds(d.data.id).height);
}

function AddLeftRightContent()
{
	d3.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
		.append(webvars.ruleTextContainerTag)
		.classed(webvars.sideConditionClass, true)
		.classed(webvars.ruleTextClass, true)
		.style('overflow', 'visible')
		.attr(webvars.nodeIdAttr, d => d.data.id)
		.attr('text-anchor', 'end')
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
		.attr('alignment-baseline', 'alphabetical')
		.text(d => d.data.sideCondition);

	// right content
	d3.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
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
		.attr('alignment-baseline', 'alphabetical')
		.text(d => d.data.ruleName);
}

var ruleTextYPosition = -1 * heightPerProofRow / 2;

function PositionLeftRightContent()
{
	// left content
	d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.sideConditionClass}`)
		.attr('transform', d =>
		{
			var x = getRuleDisplayLRBound(d).left;

			return `translate(${x - stylingvars.nodePadding}, ${ruleTextYPosition})`
		});

	// right content
	d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleNameClass}`)
		.attr('transform', d =>
		{
			var x = getRuleDisplayLRBound(d).right;

			return `translate(${x + stylingvars.nodePadding}, ${ruleTextYPosition})`
		});
}


function getRuleDisplayLRBound(hierarchyObj)
{
	var id = hierarchyObj.data.id;

	var currentPropBB = getPropositionBounds(id)

	var result = {
		left: currentPropBB.x,
		right: currentPropBB.x + currentPropBB.width
	};

	if (hierarchyObj.children)
	{
		if (hierarchyObj.children.length > 0)
		{
			var firstChild = hierarchyObj.children[0];
			var firstChildPropBB = getPropositionBounds(firstChild.data.id);

			var xDiffLeft = hierarchyObj.x - firstChild.x;

			if (xDiffLeft > 0 ||
				((xDiffLeft == 0) && (firstChildPropBB.x < currentPropBB.x)))
			{
				result.left -= xDiffLeft + (firstChildPropBB.width / 2) - (currentPropBB.width / 2);
			}

			var lastChild = hierarchyObj.children[hierarchyObj.children.length - 1];
			var lastChildPropBB = getPropositionBounds(lastChild.data.id);

			var xDiffRight = lastChild.x - hierarchyObj.x;

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
	var texNode = d3.select(`${itemContainerSelector}[${webvars.nodeIdAttr}=${nodeId}] > ${webvars.texContainerTag}.${webvars.texContainerClass}`).node();

	if (texNode)
	{
		var boundingBox = texNode.getBBox();

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
		var textNodeBox = d3.select(`${itemContainerSelector}[${webvars.nodeIdAttr}=${nodeId}]
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


var nodeElementSelector = `${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`;
var textLeftElementSelector = `${webvars.ruleTextContainerTag}.${webvars.ruleTextLeftClass}`;
var textRightElementSelector = `${webvars.ruleTextContainerTag}.${webvars.ruleTextRightClass}`;

function getPropositionBounds(nodeId)
{
	return getVisualItemBounds(nodeId, nodeElementSelector);
}

function getLeftContentBounds(nodeId)
{
	return getVisualItemBounds(nodeId, textLeftElementSelector);
}

function getRightContentBounds(nodeId)
{
	return getVisualItemBounds(nodeId, textRightElementSelector);
}


// ---------- Interaction

var myIterator = makeTreeIterator(myroot, visitNodes_preOrder, focusNode);

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

function node_onclick(selectedHNode)
{
	focusNode(selectedHNode);
}

function selectedHNodeOutput(selectedHNode)
{
	return `id: ${selectedHNode.data.id},
	proposition: ${selectedHNode.data.proposition},
	rule name: ${selectedHNode.data.ruleName},
	side conditions: ${selectedHNode.data.sideCondition}`
}


function PostRenderProposition()
{
	AddProofTreeLines();
	PositionLeftRightContent();
	PositionPropositionBoundingRect();
}

function PostRenderRuleText()
{
	// PositionLeftRightBackground();
	PositionRuleTextBoundingRect();
}

function MathJaxSVGManipulation()
{
	svgtree.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`).each(function(){
		var self = d3.select(this),
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
				})
				.attr('width', '50%')
				.attr('x', '-25%');
		}
	});

	PostRenderProposition();

	svgtree.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleTextClass}`).each(function(){
		var self = d3.select(this),
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

	PostRenderRuleText();
}

// scrolling
var scrollNode = d3.select('.scroll-container').node();
var scrollContainerWidth = scrollNode.clientWidth;
var scrollContainerHeight = scrollNode.clientHeight;
scrollNode.scrollTo((treeWidth - scrollContainerWidth) / 2, treeHeight - scrollContainerHeight);