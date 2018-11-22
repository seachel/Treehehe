d3.select('h3').style('color', 'red');
d3.select('h3').style('font-size', '30px');



var mystuff = ["chair", "blanket", "tree", "$\\forall b \\rightarrow \\leftarrow$"]

d3.select('ul').classed("testrm", false)
	.selectAll('li')
	.data(mystuff)
	.enter()
	.append('li')
	.append('div').classed('test', true)
	.text(d => d)
	.append('div')
	.text(d => d[0]);


// ------------------------------ Trees ------------------------------

// d3.layout.tree();

var id = 0;

function makeNode(name, proposition, children = [], leftContent = "", rightContent = "")
{
	id++;

	return {
    	name: name,
	    proposition: proposition,
		children: children,
		id: `node${id}`,
		leftContent: leftContent,
		rightContent: rightContent
	}
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


// ---------- Data in d3 heirarchy object

var myroot = d3.hierarchy(treeExample1); // set x0 and y0 based on svg dimensions?


// ---------- Create tree

var heightPerProofRow = 30;
var proofHeight = myroot.height + 1;

var treeHeight = proofHeight * heightPerProofRow;

var treeWidth = 600;

var mytree = d3.tree().size([treeWidth, treeHeight]);


// ---------- Initialize tree? Position elements

mytree(myroot);


// ---------- Set up DOM content

var svgheight = 400;
var svgwidth = 600;

var linkHeight = myroot.links()[0].target.y - myroot.links()[0].source.y;

var svg_ex1 = d3.select('div.tree-container')
				.append('svg').style('background', 'grey')
				.classed('ex1-svg', true)
				.attr('width', svgwidth)
				.attr('height', svgheight)
				.append('g').classed('nodes', true)
				.attr('transform', 'translate(0, -15)');


// ---------- create svg objects to represent data and position them

d3.select('svg g.nodes')
	.selectAll('g.node')
	.data(myroot.descendants())
	.enter()
	.append('g')
	.classed('node', true)
	.style('overflow', 'visible')
	.attr('id', d => d.data.id)
	.attr('transform', d => `translate(${d.x}, ${svgheight - d.y})`)
	.attr('text-anchor', 'middle')
	.append('rect')
	.classed('node', true)
	.attr('node-id', d => d.data.id)
	.attr('fill', 'white').attr('stroke', 'green')
	.on('click', node_onclick);


// Add text
d3.selectAll('g.nodes>g.node')
  .append('text')
  .classed('node-text', true)
  .attr('node-id', d => d.data.id)
  .attr('dy', '0.35em')
  .attr('alignment-baseline', 'text-before-edge')
  .text(d => d.data.proposition)
  .on('click', node_onclick);


// Add lines
function AddProofTreeLines()
{
	d3.selectAll('g.node')
	.append('line')
	.attr('x1', d =>
	{
		if (d.children)
		{
			var leftChild = d.children[0];
			var leftChildWidth = d3.select(`g#${leftChild.data.id}`).node().getBBox().width;
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
			var rightChildWidth = d3.select(`g#${rightChild.data.id}`).node().getBBox().width;
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
	d3.selectAll('rect.node')
		.attr('x', d =>
		{
			return getNodeBoundingBox(d.data.id).x
		})
		.attr('y', d => getNodeBoundingBox(d.data.id).y)
		.attr('width', d => getNodeBoundingBox(d.data.id).width)
		.attr('height', d => getNodeBoundingBox(d.data.id).height);
	
	d3.selectAll('rect.rule-text-left')
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
	d3.selectAll('g.node')
		.append('g')
		.classed('rule-text-left', true)
		.style('overflow', 'visible')
		.attr('node-id', d => d.data.id)
		.attr('transform', d =>
		{
			var x = 0;

			if (d.children)
			{
				var leftChild = d.children[0];
				var leftChildWidth = d3.select(`g#${leftChild.data.id}`).node().getBBox().width;
				x = leftChild.x - d.x - (leftChildWidth / 2);
			}
			return `translate(${x}, ${-1 * heightPerProofRow / 2})`
		})
		.attr('text-anchor', 'end')


	d3.selectAll('g.rule-text-left')
		.append('text')
		.classed('rule-text', true)
		.classed('node-text', true)
		.attr('node-id', d => d.data.id)
		.attr('dy', '0.35em')
		.attr('alignment-baseline', 'alphabetical')
		.text(d => d.data.leftContent);

	// right content
	d3.selectAll('g.node')
		.append('g')
		.classed('rule-text-right', true)
		.style('overflow', 'visible')
		.attr('node-id', d => d.data.id)
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
		
	d3.selectAll('g.rule-text-right')
		.append('text')
		.classed('rule-text', true)
		.classed('node-text', true)
		.attr('node-id', d => d.data.id)
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
	var texNode = d3.select(`g#${nodeId}>g.tex-container`).node();

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
		var textNodeBox = d3.select(`g#${nodeId}>text[node-id=${nodeId}]`).node().getBBox();

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



// --- Other SVG example

d3.selectAll('g.item')
	.append('text')
	.text(function(d, i) {
	return i + 1;
	})
	.style('text-anchor', 'middle')
	.attr('y', 50)
	.attr('x', 30);




// // -------------------- Collapsible tree example --------------------

// var treeData =
//   {
//     "name": "Top Level",
//     "children": [
//       { 
//         "name": "Level 2: A",
//         "children": [
// 		 	{
// 			  "name": "Son of A",
// 				"children" :
// 				[
// 					{ "name" : "grandchild 1 of A" },
// 					{ "name" : "grandchild 2 of A" },
// 					{ "name" : "grandchild 3 of A" },
// 					{ "name" : "grandchild 4 of A" },
// 					{ "name" : "grandchild 5 of A" },
// 					{ "name" : "grandchild 6 of A" },
// 					{ "name" : "grandchild 7 of A" },
// 					{ "name" : "grandchild 8 of A" }
// 				]
// 			},
//         	{
// 				"name": "Daughter of A",
// 				"children" :
// 				[
// 					{ "name" : "$\\exists x$" }
// 				]
// 			}
//         ]
//       },
//       { "name": "Level 2: B" }
//     ]
//   };


// // Set the dimensions and margins of the diagram
// var margin = {top: 20, right: 90, bottom: 30, left: 90},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;


// // append the svg object to the body of the page
// // appends a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// var svg = d3.select("body").append("svg").classed("main-svg", true)
//     .style("background", "lavender").style('margin', '100px')
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate("
//           + margin.left + "," + margin.top + ")");

// var i = 0,
//     duration = 750,
//     root;


// // declares a tree layout and assigns the size
// var treemap = d3.tree().size([width, height]);

// // Assigns parent, children, height, depth
// root = d3.hierarchy(treeData, function(d) { return d.children; });
// root.x0 = height / 2;
// root.y0 = 0;


// // Collapse after the second level
// //root.children.forEach(collapse);

// update(root);

// // Collapse the node and all it's children
// function collapse(d) {
//   if(d.children) {
//     d._children = d.children
//     d._children.forEach(collapse)
//     d.children = null
//   }
// }

// // Pretty much everything happens here...
// function update(source) {

//   // Assigns the x and y position for the nodes
//   var treeData = treemap(root);

//   // Compute the new tree layout.
//   var nodes = treeData.descendants(),
//       links = treeData.descendants().slice(1);

//   // Normalize for fixed-depth.
//   nodes.forEach(function(d){ d.y = d.depth * 180});

//   // ****************** Nodes section ***************************

//   // Update the nodes...
//   var node = svg.selectAll('g.node')
//       .data(nodes, function(d) {return d.id || (d.id = ++i); });

//   // Enter any new modes at the parent's previous position.
//   var nodeEnter = node.enter().append('g')
//       .attr('class', 'node')
//       .attr("transform", function(d) {
//         return "translate(" + source.y0 + "," + source.x0 + ")";
//     })
//     .on('click', click);

//   // Add Circle for the nodes
//   nodeEnter.append('circle')
//       .attr('class', 'node')
//       .attr('r', 1e-6)
//       .style("fill", function(d) {
//           return d._children ? "lightsteelblue" : "#fff";
//       });

//   // Add labels for the nodes
//   nodeEnter.append('text')
// 	  .attr("class", "node-txt")
//       .attr("dy", ".35em")
//       .attr("x", function(d) {
//           return d.children || d._children ? -13 : 13;
//       })
//       .attr("text-anchor", function(d) {
//           return d.children || d._children ? "end" : "start";
//       }) // change location of text
//       .text(function(d) { return d.data.name; });

//   // UPDATE
//   var nodeUpdate = nodeEnter.merge(node);

//   // Transition to the proper position for the node
//   nodeUpdate.transition()
//     .duration(duration)
//     .attr("transform", function(d) { 
//         return "translate(" + d.y + "," + d.x + ")";
//      });

//   // Update the node attributes and style
//   nodeUpdate.select('circle.node')
//     .attr('r', 10)
//     .style("fill", function(d) {
//         return d._children ? "lightsteelblue" : "#fff";
//     })
//     .attr('cursor', 'pointer');


//   // Remove any exiting nodes
//   var nodeExit = node.exit().transition()
//       .duration(duration)
//       .attr("transform", function(d) {
//           return "translate(" + source.y + "," + source.x + ")";
//       })
//       .remove();

//   // On exit reduce the node circles size to 0
//   nodeExit.select('circle')
//     .attr('r', 1e-6);

//   // On exit reduce the opacity of text labels
//   nodeExit.select('text')
//     .style('fill-opacity', 1e-6);


//   // Store the old positions for transition.
//   nodes.forEach(function(d){
//     d.x0 = d.x;
//     d.y0 = d.y;
//   });

//   // Creates a curved (diagonal) path from parent to the child nodes
//   function diagonal(s, d) {

//     path = `M ${s.y} ${s.x}
//             C ${(s.y + d.y) / 2} ${s.x},
//               ${(s.y + d.y) / 2} ${d.x},
//               ${d.y} ${d.x}`

//     return path
//   }

//   // Toggle children on click.
//   function click(d) {
//     if (d.children) {
//         d._children = d.children;
//         d.children = null;
//       } else {
//         d.children = d._children;
//         d._children = null;
//       }
//     update(d);
//   }


setTimeout(() => {
	
	// MathJax.Hub.Config({
	// 	tex2jax: {
	// 	inlineMath: [ ['$','$'], ["\\(","\\)"] ],
  //   processEscapes: true,
  //   delayStartupUntil: onload
	// 	}
  // });

// need this startup hook for each svg

//   MathJax.Hub.Register.StartupHook("End", function() {
// 		setTimeout(() => {
// 			svg.selectAll('.node').each(function(){
//         var self = d3.select(this),
//             g = self.select('text>span>svg');
        
//         if (g.node())
//         {
//           g.remove();
//           self.append(function(){
//             return g.node();
//           });
//         }
// 			});
// 		}, 1);
// 		});
  
    MathJax.Hub.Register.StartupHook("End", function() {
      setTimeout(() => {
        svg_ex1.selectAll('.node').each(function(){
          var self = d3.select(this),
              g = self.select('text>span>svg');
          
          if (g.node())
          {
            g.remove();
			self.append('g')
				.classed('tex-container', true)
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
