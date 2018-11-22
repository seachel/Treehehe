
var treeContainerTag = "div";
var treeContainerClass = "tree-container";
var treeClassName = "ex1-svg"; // set by each example?
var nodesContainerTag = "g";
var nodesContainerClass = "nodes";
var nodeContainerTag = "g";
var nodeContainerClass = "node";
var nodeBackgroundTag = "rect";
var nodeBackgroundClass = "node";
var ruleTextContainerTag = "g";
var sideConditionContainerClass = "rule-text-left";
var ruleNameContainerClass = "rule-text-right";
var sideConditionBackgroundTag = "rect";
var sideConditionBackgroundClass = "rule-text-left";
var nodeIdAttr = "node-id";
var nodeTextTag = "text";
var nodeTextClass = "node-text";
var ruleTextClass = "rule-text";
var texContainerTag = "g";
var texContainerClass = "tex-container";


// Test: try making all tags unique?
// which level of g has id set? node container?
// put in program data object?

// ------------------------------ Data ------------------------------

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

// ---------- Data for tree:

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
	"$\\rightarrow$_{I^u}");


// ------------------------------ D3 ------------------------------


// ---------- Data in d3 heirarchy object

var myroot = d3.hierarchy(treeExample1); // set x0 and y0 based on svg dimensions?


// ---------- D3 tree variables and utils

var heightPerProofRow = 30;
var proofHeight = myroot.height + 1;

var treeHeight = proofHeight * heightPerProofRow;

var treeWidth = 600; // TODO: need to compute based on example

// ---------- Create tree


var mytree = d3.tree().size([treeWidth, treeHeight]);


// ---------- Initialize tree? Position elements

mytree(myroot);


// ---------- Set up DOM content

var svgheight = 400;
var svgwidth = 600;

var linkHeight = myroot.links()[0].target.y - myroot.links()[0].source.y;

var svg_ex1 = d3.select(`${treeContainerTag}.${treeContainerClass}`)
				.append('svg').style('background', 'grey')
				.classed(treeClassName, true)
				.attr('width', svgwidth)
				.attr('height', svgheight)
				.append(nodesContainerTag).classed(nodesContainerClass, true)
				.attr('transform', 'translate(0, -15)');


// ---------- create svg objects to represent data and position them

d3.select(`svg ${nodesContainerTag}.${nodesContainerClass}`)
	.selectAll(`${nodeContainerTag}.${nodeContainerClass}`)
	.data(myroot.descendants())
	.enter()
	.append(nodeContainerTag)
	.classed(nodeContainerClass, true)
	.style('overflow', 'visible')
	.attr('id', d => d.data.id)
	.attr('transform', d => `translate(${d.x}, ${svgheight - d.y})`)
	.attr('text-anchor', 'middle')
	.append(nodeBackgroundTag)
	.classed(nodeBackgroundClass, true)
	.attr(nodeIdAttr, d => d.data.id)
	.attr('fill', 'white').attr('stroke', 'green')
	.on('click', node_onclick);


// Add text
d3.selectAll(`${nodesContainerTag}.${nodesContainerClass} > ${nodeContainerTag}.${nodeContainerClass}`)
  .append(nodeTextTag)
  .classed(nodeTextClass, true)
  .attr(nodeIdAttr, d => d.data.id)
  .attr('dy', '0.35em')
  .attr('alignment-baseline', 'text-before-edge')
  .text(d => d.data.proposition)
  .on('click', node_onclick);



// Add lines
function AddProofTreeLines()
{
	d3.selectAll(`${nodeContainerTag}.${nodeContainerClass}`)
	.append('line')
	.attr('x1', d =>
	{
		if (d.children)
		{
			var leftChild = d.children[0];
			var leftChildWidth = d3.select(`${nodeContainerTag}#${leftChild.data.id}`).node().getBBox().width;
			return leftChild.x - d.x - (leftChildWidth / 2);
		}
		else
		{
			return 0;
		}
	})
	.attr('x2', d =>
	{
		if (d.children)
		{
			var rightChild = d.children[d.children.length - 1];
			var rightChildWidth = d3.select(`${nodeContainerTag}#${rightChild.data.id}`).node().getBBox().width;
			return rightChild.x - d.x + (rightChildWidth / 2);
		}
		else
		{
			return 0;
		}
	})
	.attr('y1', d => -1 * heightPerProofRow / 2)
	.attr('y2', d => -1 * heightPerProofRow / 2)
	.attr('stroke', 'black');
}


function PositionBoundingRect()
{
	d3.selectAll(`${nodeBackgroundTag}.${nodeBackgroundClass}`)
		.attr('x', d =>
		{
			return getNodeBoundingBox(d.data.id).x
		})
		.attr('y', d => getNodeBoundingBox(d.data.id).y)
		.attr('width', d => getNodeBoundingBox(d.data.id).width)
		.attr('height', d => getNodeBoundingBox(d.data.id).height);
	
	d3.selectAll(`${sideConditionBackgroundTag}.${sideConditionBackgroundClass}`)
		.attr('x', d =>
		{
			return getNodeBoundingBox(d.data.id).x
		})
		.attr('y', d => getNodeBoundingBox(d.data.id).y)
		.attr('width', d => getNodeBoundingBox(d.data.id).width)
		.attr('height', d => getNodeBoundingBox(d.data.id).height);
}

function AddLeftRightContent()
{
	// left content
	d3.selectAll(`${nodeContainerTag}.${nodeContainerClass}`)
		.append(ruleTextContainerTag)
		.classed(sideConditionBackgroundClass, true)
		.style('overflow', 'visible')
		.attr(nodeIdAttr, d => d.data.id)
		.attr('transform', d =>
		{
			var x = 0;

			if (d.children)
			{
				var leftChild = d.children[0];
				var leftChildWidth = d3.select(`${nodeContainerTag}#${leftChild.data.id}`).node().getBBox().width;
				x = leftChild.x - d.x - (leftChildWidth / 2);
			}
			return `translate(${x}, ${-1 * heightPerProofRow / 2})`
		})
		.attr('text-anchor', 'end')


	d3.selectAll(`${ruleTextContainerTag}.${sideConditionContainerClass}`)
		.append(nodeTextTag)
		.classed(ruleTextClass, true)
		.classed(nodeTextClass, true)
		.attr(nodeIdAttr, d => d.data.id)
		.attr('dy', '0.35em')
		.attr('alignment-baseline', 'alphabetical')
		.text(d => d.data.leftContent);

	// right content
	d3.selectAll(`${nodeContainerTag}.${nodeContainerClass}`)
		.append(ruleTextContainerTag)
		.classed(ruleNameContainerClass, true)
		.style('overflow', 'visible')
		.attr(nodeIdAttr, d => d.data.id)
		.attr('transform', d =>
		{
			var x = 0;

			if (d.children)
			{
				var rightChild = d.children[d.children.length - 1];
				var rightChildWidth = d3.select(`g#${rightChild.data.id}`).node().getBBox().width;
				x = rightChild.x - d.x + (rightChildWidth / 2);
			}
			return `translate(${x}, ${-1 * heightPerProofRow / 2})`
		})
		.attr('text-anchor', 'start')

	d3.selectAll(`${ruleTextContainerTag}.${ruleNameContainerClass}`)
		.append(nodeTextTag)
		.classed(ruleTextClass, true)
		.classed(nodeTextClass, true)
		.attr(nodeIdAttr, d => d.data.id)
		.attr('dy', '0.35em')
		.attr('alignment-baseline', 'alphabetical')
		.text(d => d.data.rightContent);
}

function getNodeLeftRightContentBBox(nodeId)
{
	// find text node or latex svg for node's left and right content
}


function getNodeBoundingBox(nodeId)
{
	var texNode = d3.select(`${nodeContainerTag}#${nodeId} > ${texContainerTag}.${texContainerClass}`).node();

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
		var textNodeBox = d3.select(`${nodeContainerTag}#${nodeId} > ${nodeTextTag}[${nodeIdAttr}=${nodeId}]`).node().getBBox();

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
			svg_ex1.selectAll('.node').each(function(){
				var self = d3.select(this),
					g = self.select('text>span>svg');
				
				if (g.node())
				{
				g.remove();
				self.append(texContainerTag)
					.classed(texContainerClass, true)
					.attr('width', '100%')
					// .attr('height', '100%')
					.style('overflow', 'visible')
					.on('click', node_onclick)
					// .attr('x', d =>
					// {
					// 	debugger;
					// 	d3.select(`g.node#${d.data.id}`)
					// })	// add x attribute, calculate half of width?
					// .attr('transform', `translate(50%, 0)`)
					.append(function(){
						return g.node();
					})
					.attr('width', '50%')
					.attr('x', '-25%');
				}
			});

		}, 1);
	});

	// MathJax.Hub.Queue(["Typeset", MathJax.Hub, svg_ex1.node()]);

	setTimeout(() =>
	{
		PostRender();
	});

}, 3000);
