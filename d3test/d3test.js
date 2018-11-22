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
	nodeBackgroundClass: "node",
	ruleTextContainerTag: "g",
	sideConditionClass: "rule-text-left",
	ruleNameClass: "rule-text-right",
	nodeIdAttr: "node-id",
	nodeTextTag: "text",
	nodeTextClass: "node-text",
	ruleTextClass: "rule-text",
	texContainerTag: "g",
	texContainerClass: "tex-container"	
}

// ------------------------------ Tree Data ------------------------------

var id = 0;

var makeId = () => {
	id++;
	return `node${id}`;
}

function makeNode(name, proposition, children = [], leftContent = "", rightContent = "")
{
	return {
    	name: name,
	    proposition: proposition,
		children: children,
		id: makeId(),
		leftContent: leftContent,
		rightContent: rightContent
	};
}

function makeProofTreeNode(proposition, children = [], ruleName = "", sideCondition = "")
{
	var nodeId = makeId();

	return {
		name: nodeId,
		proposition: proposition,
		children: children,
		id: nodeId,
		ruleName: ruleName,
		sideCondition: sideCondition
	};
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

var data = makeNode("A ofg dlfgh dlfkgjh ", "$x \\rightarrow y$",
	[
		makeNode("B dfgh fdgh fgdh ", "$\\forall x, P \; x$"),
		makeNode("C ser ser seh", "1 + 2 + 3 = :)",
		[
			makeNode("E blah blah doop", '$x \\supset y$'),
			makeNode("F wut wot lsdkjf", "$\\wedge$")
		]),
		makeNode("D fyuk yfk fy", "$\\forall x$")
	],
  "A left",
  "A right");

var treeExample1 = makeNode("A", "$(p \\wedge r) \\rightarrow (q \\wedge s)$",
	[
		makeNode("B", "$q \\wedge s$",
		[
			makeNode("C", "$q$",
			[
				makeNode("D", "$p$",
				[
					makeNode("E", "$p \\wedge r$", [], "$u$")
				],
				"$\\wedge_{E_1}$"),
				makeNode("F", "$p \\rightarrow q$", null)
			]),
			makeNode("G", "$s$",
			[
				makeNode("H", "$r$",
				[
					makeNode("I", "$p \\wedge u$", [], "$u$")
				],
				"$\\wedge_{E_2}$"),
				makeNode("J", "$r \\rightarrow s$", null)
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

var treeWidth = 700; // TODO: need to compute based on example

// ---------- Create tree


var mytree = d3.tree().size([treeWidth, treeHeight]);


// ---------- Initialize tree? Position elements

mytree(myroot);


// ---------- Set up DOM content

var svgheight = 400;
var svgwidth = 700;

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
	.attr('fill', 'white').attr('stroke', 'green')
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
	.attr('y1', d => -1 * heightPerProofRow / 2)
	.attr('y2', d => -1 * heightPerProofRow / 2)
	.attr('stroke', 'black');
}


function PositionBoundingRect()
{
	d3.selectAll(`${webvars.backgroundTag}.${webvars.nodeBackgroundClass}`)
		.attr('x', d =>
		{
			return getPropositionBoundingBox(d.data.id).x
		})
		.attr('y', d => getPropositionBoundingBox(d.data.id).y)
		.attr('width', d => getPropositionBoundingBox(d.data.id).width)
		.attr('height', d => getPropositionBoundingBox(d.data.id).height);
	
	// d3.selectAll(`${webvars.backgroundTag}.${webvars.sideConditionClass}`)
	// 	.attr('x', d =>
	// 	{
	// 		return getPropositionBoundingBox(d.data.id).x
	// 	})
	// 	.attr('y', d => getPropositionBoundingBox(d.data.id).y)
	// 	.attr('width', d => getPropositionBoundingBox(d.data.id).width)
	// 	.attr('height', d => getPropositionBoundingBox(d.data.id).height);
}

function AddLeftRightContent()
{
	// left content
	d3.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
		.append(webvars.ruleTextContainerTag)
		.classed(webvars.sideConditionClass, true)
		.classed(webvars.ruleTextClass, true)
		.style('overflow', 'visible')
		.attr(webvars.nodeIdAttr, d => d.data.id)
		.attr('transform', d =>
		{
			var x = getRuleDisplayLRBound(d).left;

			return `translate(${x}, ${-1 * heightPerProofRow / 2})`
		})
		.attr('text-anchor', 'end')


	d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.sideConditionClass}`)
		.append(webvars.nodeTextTag)
		.classed(webvars.ruleTextClass, true)
		.classed(webvars.nodeTextClass, true)
		.attr(webvars.nodeIdAttr, d => d.data.id)
		.attr('dy', '0.35em')
		.attr('alignment-baseline', 'alphabetical')
		.text(d => d.data.leftContent);

	// right content
	d3.selectAll(`${webvars.nodeContainerTag}.${webvars.nodeContainerClass}`)
		.append(webvars.ruleTextContainerTag)
		.classed(webvars.ruleNameClass, true)
		.classed(webvars.ruleTextClass, true)
		.style('overflow', 'visible')
		.attr(webvars.nodeIdAttr, d => d.data.id)
		.attr('transform', d =>
		{
			var x = getRuleDisplayLRBound(d).right;

			return `translate(${x}, ${-1 * heightPerProofRow / 2})`
		})
		.attr('text-anchor', 'start')

	d3.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleNameClass}`)
		.append(webvars.nodeTextTag)
		.classed(webvars.ruleTextClass, true)
		.classed(webvars.nodeTextClass, true)
		.attr(webvars.nodeIdAttr, d => d.data.id)
		.attr('dy', '0.35em')
		.attr('alignment-baseline', 'alphabetical')
		.text(d => d.data.rightContent);
}

function getNodeLeftRightContentBBox(nodeId)
{
	// find text node or latex svg for node's left and right content
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

			if (xDiffLeft > 0)
			{
				result.left -= xDiffLeft;
			}

			//result.left = Math.min(result.left, firstChildPropBB.x);

			var lastChild = hierarchyObj.children[hierarchyObj.children.length - 1];
			var lastChildPropBB = getPropositionBoundingBox(lastChild.data.id);

			var xDiffRight = lastChild.x - hierarchyObj.x;

			if (xDiffRight > 0)
			{
				result.right += xDiffLeft;
			}

			// result.right = Math.max(result.right, firstChildPropBB.x + lastChildPropBB.width);
		}
	}
	else
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

var index = 0;
var colors = ['blue', 'red', 'yellow', 'white'];

function node_onclick(selectedHNode)
{
	d3.select('body').style('background', colors[index])

	if (index == (colors.length - 1))
	{
		index = 0;
	}
	else
	{
		index++;
	}

	d3.select(`.tree-selection`)
		.text(selectedHNodeOutput(selectedHNode));
	
	MathJax.Hub.Typeset();
}

function selectedHNodeOutput(selectedHNode)
{
	return `id: ${selectedHNode.data.id},
	proposition: ${selectedHNode.data.proposition},
	rule name: ${selectedHNode.data.rightContent},
	side conditions: ${selectedHNode.data.leftContent}`
}


function PostRender()
{
	AddProofTreeLines();
	AddLeftRightContent();
	PositionBoundingRect();
}

setTimeout(() =>
{
	MathJax.Hub.Register.StartupHook("End", function() {
		setTimeout(() => {
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

		}, 1);
	});

	// MathJax.Hub.Queue(["Typeset", MathJax.Hub, svgtree.node()]);

	setTimeout(() =>
	{
		PostRender();
	}, 1);

	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

}, 1000);

// setTimeout(() => {
// 	svgtree.selectAll(`${webvars.ruleTextContainerTag}.${webvars.ruleTextClass}`).each(function(){
// 		var self = d3.select(this),
// 			g = self.select(`${webvars.nodeTextTag} > span > svg`);

// 		if (g.node())
// 		{
// 			g.remove();
// 			self.append(webvars.texContainerTag)
// 				.classed(webvars.texContainerClass, true)
// 				.attr('width', '100%')
// 				.style('overflow', 'visible')
// 				.on('click', node_onclick)
// 				.append(function(){
// 					return g.node();
// 				})
// 				// .attr('width', '50%')
// 				// .attr('x', '-25%');
// 		}
// 	});

// }, 1500);

function MathJaxRuleText()
{
	setTimeout(() =>
	{
		MathJax.Hub.Register.StartupHook("End", function() {
			setTimeout(() => {
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
							})
							// .attr('width', '50%')
							// .attr('x', '-25%');
					}
				});

			}, 1);
		});
	}, 1500); // this timeout length must be after previous one
}