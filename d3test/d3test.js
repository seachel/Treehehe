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
	nodeBackgroundClass: "node-rect",
	ruleTextContainerTag: "g",
	sideConditionClass: "rule-text-left",
	ruleNameClass: "rule-text-right",
	nodeIdAttr: "node-id",
	nodeTextTag: "text",
	nodeTextClass: "node-text",
	ruleTextClass: "rule-text",
	texContainerTag: "g",
	texContainerClass: "tex-container",
	focusRectClass: "focus-rect",
	visitedRectClass: "visited-rect",
	nodePadding: 5
}

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

function logNodeDimensions()
{
	visitNodes_preOrder(myroot, writeNodeDimensions);
}

function writeNodeDimensions(node)
{ // if has a tex node, then use that one, getBBox and getBoundingClientRect

	var texNode = d3.select(`${webvars.nodeContainerTag}#${node.data.id} > ${webvars.texContainerTag}.${webvars.texContainerClass}`).node();
	
	var boundingBoxCrop = {
		x: -1,
		y: -1,
		width: -1,
		height: -1
	}

	var clientBoundingRect = {
		x: -1,
		y: -1,
		width: -1,
		height: -1
	}

	var treeDataFields = {
		x: node.x,
		y: node.y
	}

	if (texNode)
	{
		var texNodeBBox = texNode.getBBox();

		boundingBoxCrop.x = texNodeBBox.x;
		boundingBoxCrop.y = texNodeBBox.y;
		boundingBoxCrop.width = texNodeBBox.width;
		boundingBoxCrop.height = texNodeBBox.height;

		var texNodeBRect = texNode.getBoundingClientRect();

		clientBoundingRect.x = texNodeBRect.x;
		clientBoundingRect.y = texNodeBRect.y;
		clientBoundingRect.width = texNodeBRect.width;
		clientBoundingRect.height = texNodeBRect.height;
	}
	else
	{
		// position rect based on text
		var textNodeBox = d3.select(`${webvars.nodeContainerTag}#${node.data.id}
									 > ${webvars.nodeTextTag}[${webvars.nodeIdAttr}=${node.data.id}]`)
							.node()
							.getBBox();

		boundingBoxCrop.x = textNodeBox.x;
		boundingBoxCrop.y = textNodeBox.y;
		boundingBoxCrop.width = textNodeBox.width;
		boundingBoxCrop.height = textNodeBox.height;

		var textNodeBRect = d3.select(`${webvars.nodeContainerTag}#${node.data.id}
									 > ${webvars.nodeTextTag}[${webvars.nodeIdAttr}=${node.data.id}]`)
							.node()
							.getBoundingClientRect();

		clientBoundingRect.x = textNodeBRect.x;
		clientBoundingRect.y = textNodeBRect.y;
		clientBoundingRect.width = textNodeBRect.width;
		clientBoundingRect.height = textNodeBRect.height;
	}



	console.log(`proposition: ${node.proposition}
	BBox: ${JSON.stringify(boundingBoxCrop)}
	ClientRect: ${JSON.stringify(clientBoundingRect)}
	Tree data fields: ${JSON.stringify(treeDataFields)}`);
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
			]),
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

var svgheight = 400;
var svgwidth = treeWidth;

var linkHeight = myroot.links()[0].target.y - myroot.links()[0].source.y;

var svgtree = d3.select(`${webvars.treeContainerTag}.${webvars.treeContainerClass}`)
				.append('svg').style('background', 'grey')
				.classed(webvars.treeClassName, true)
				.attr('width', svgwidth)
				.attr('height', svgheight)
				.append(webvars.nodesContainerTag).classed(webvars.nodesContainerClass, true)
				.attr('transform', 'translate(0, -30)');


// ---------- create svg objects to represent data and position them

d3.select(`svg ${webvars.nodesContainerTag}.${webvars.nodesContainerClass}`)
	.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
	.data(myroot.descendants())
	.enter()
	.append(webvars.nodeContainerTag)
	.classed(webvars.nodeContainerClass, true)
	.style('overflow', 'visible')
	.attr('id', d => d.data.id)
	.attr('transform', d => `translate(${d.x}, ${svgheight - d.y})`)
	.attr('text-anchor', 'middle')
	.append(webvars.backgroundTag)
	.classed(webvars.nodeBackgroundClass, true)
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


function PositionBoundingRect()
{
	d3.selectAll(`${webvars.backgroundTag}.${webvars.nodeBackgroundClass}`)
		.attr('x', d =>
		{
			return getPropositionBoundingBox(d.data.id).x - webvars.nodePadding
		})
		.attr('y', d => getPropositionBoundingBox(d.data.id).y - webvars.nodePadding)
		.attr('width', d => getPropositionBoundingBox(d.data.id).width + 2 * webvars.nodePadding)
		.attr('height', d => getPropositionBoundingBox(d.data.id).height + 2 * webvars.nodePadding);
	
	// d3.selectAll(`${webvars.backgroundTag}.${webvars.sideConditionClass}`)
	// 	.attr('x', d =>
	// 	{
	// 		return getPropositionBoundingBox(d.data.id).x
	// 	})
	// 	.attr('y', d => getPropositionBoundingBox(d.data.id).y)
	// 	.attr('width', d => getPropositionBoundingBox(d.data.id).width)
	// 	.attr('height', d => getPropositionBoundingBox(d.data.id).height);
}
// split this into AddLeftRightContent and PositionLeftRightContent
function AddLeftRightContent()
{
	d3.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
		.append(webvars.ruleTextContainerTag)
		.classed(webvars.sideConditionClass, true)
		.classed(webvars.ruleTextClass, true)
		.style('overflow', 'visible')
		.attr(webvars.nodeIdAttr, d => d.data.id)
		.attr('text-anchor', 'end');

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
		.attr('text-anchor', 'start');

	d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleNameClass}`)
		.append(webvars.nodeTextTag)
		.classed(webvars.ruleTextClass, true)
		.classed(webvars.nodeTextClass, true)
		.attr(webvars.nodeIdAttr, d => d.data.id)
		.attr('dy', '0.35em')
		.attr('alignment-baseline', 'alphabetical')
		.text(d => d.data.ruleName);
}

function PositionLeftRightContent()
{
	// left content
	d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.sideConditionClass}`)
		.attr('transform', d =>
		{
			var x = getRuleDisplayLRBound(d).left;

			return `translate(${x}, ${-1 * heightPerProofRow / 2})`
		});

	// right content
	d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleNameClass}`)
		.attr('transform', d =>
		{
			var x = getRuleDisplayLRBound(d).right;

			return `translate(${x}, ${-1 * heightPerProofRow / 2})`
		});
}


function getRuleDisplayLRBound(hierarchyObj)
{
	var id = hierarchyObj.data.id;

	var currentPropBB = getPropositionBoundingBox(id)

	var result = {
		left: currentPropBB.x,
		right: currentPropBB.x + currentPropBB.width
	};

	if (hierarchyObj.children)
	{
		if (hierarchyObj.children.length > 0)
		{
			var firstChild = hierarchyObj.children[0];
			var firstChildPropBB = getPropositionBoundingBox(firstChild.data.id);

			var xDiffLeft = hierarchyObj.x - firstChild.x;

			if (xDiffLeft > 0 ||
				((xDiffLeft == 0) && (firstChildPropBB.x < currentPropBB.x)))
			{
				result.left -= xDiffLeft + (firstChildPropBB.width / 2) - (currentPropBB.width / 2);
			}

			var lastChild = hierarchyObj.children[hierarchyObj.children.length - 1];
			var lastChildPropBB = getPropositionBoundingBox(lastChild.data.id);

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

	return result;
}


function getPropositionBoundingBox(nodeId)
{
	var texNode = d3.select(`${webvars.nodeContainerTag}#${nodeId} > ${webvars.texContainerTag}.${webvars.texContainerClass}`).node();

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
		var textNodeBox = d3.select(`${webvars.nodeContainerTag}#${nodeId}
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


// ---------- Interaction

function focusNode(selectedHNode)
{
	// any need to hold id of focused node as program state?
	updateSelectionPanel(selectedHNode);
	updateSelectionStyle(selectedHNode);
}

function updateSelectionStyle(selectedHNode)
{
	var selectedId = selectedHNode.data.id;

	// if previously selected and will no longer be selected and we are in walkthrough mode, remove focused class and add previously focused class

	d3.selectAll(`${webvars.backgroundTag}.${webvars.nodeBackgroundClass}[${webvars.nodeIdAttr}=${selectedId}]`)
		.classed(`${webvars.focusRectClass}`, true);


	d3.selectAll(`${webvars.backgroundTag}.${webvars.nodeBackgroundClass}`)
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

var nodesInOrder = [];

function makeTreeIterator()
{
	visitNodes_postOrder(myroot, n => nodesInOrder.push(n));
	// return an object containing:
	//  - a function `next`, which returns an object containing:
	//    * `value`, representing next item
	//    * `done`, which is true when all elements consumed, else false

	// use a range iterator on an array holding the list of values in order?
}

// Tree traversal:
//  - build array of nodes to visit in the desired order; use traversal functions to construct this
//  - will need field for the currently focused node?
//    * use iterator?
// will need id instead of node to be passed?

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


function PostRender()
{
	AddProofTreeLines();
	PositionLeftRightContent();
	PositionBoundingRect();
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

		PostRender();

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
	});
}