
// -------------------- Model --------------------

    function buildTree(newRoot, newName)
    {
        return {
            root: newRoot,
            name: newName,
            numrows: 0,
            numcols: 0,
            height: 0
        };
    }

    function buildNode(newProposition, newName, newChildren = null, newLeftContent = "", newRightContent = "")
    {
        result = {
            proposition: newProposition,
            name: newName,
            children: newChildren,
            leftContent: newLeftContent,
            rightContent: newRightContent,
            rowStart: null,
            rowEnd: null,
            colStart: null,
            colEnd: null,
            x: -1,
            y: -1,
            mod: -1,
            previousSibling: null
        };

        return result;
    }

function treeInit(rootNode)
{
    updateParentsInTree(rootNode);
    updatePreviousSiblingsInTree(rootNode);
}


// -------------------- Tree Traversal --------------------

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

// can use in preorder traversal

function updateParentsInTree(rootNode)
{
    visitNodes_preOrder(rootNode, null, null, 0, updateParent);
}

function renameTree(rootNode, treeName)
{
    visitNodes_preOrder(rootNode, updateField, ["treeName", treeName]);
}

function updatePreviousSiblingsInTree(rootNode)
{
    visitNodes_preOrder(rootNode, setPreviousSibling);
}

function writeFieldForTree_preOrder(rootNode, fieldName)
{
    visitNodes_preOrder(rootNode, logField, [fieldName]);
}

function writeFieldForTree_postOrder(rootNode, fieldName)
{
    visitNodes_postOrder(rootNode, logField, [fieldName]);
}


// -------------------- Helpers --------------------

function updateField(node, fieldName, fieldValue)
{
    if (node)
    {
        node[fieldName] = fieldValue;
    }
}

function logField(node, fieldName)
{
    console.log(node[fieldName]);
}

function updateParent(child, parent)
{
    if (child)
    {
        child.parent = parent;
    }
}

function setPreviousSibling(node)
{
    if (node.parent)
    {
        if (node.parent.children)
        {
            var indexAsChild = node.parent.children.findIndex(child => child === node);

            if (indexAsChild > 0)
            {
                node.previousSibling = node.parent.children[indexAsChild - 1];
            }
            else
            {
                node.previousSibling = null;
            }
        }
        else
        {
            console.log(`Something not set correctly in setPreviousSibling. 
            Node: ${node}`);
        }
    }
}


// -------------------- Tilford-Reingold Algorithm --------------------

function calculateInitialX(rootNode)
{
    visitNodes_postOrder(rootNode,
        function(node) {
            if (node.previousSibling)
            {
                node.x = node.previousSibling.x + 1;
            }
            else
            {
                node.x = 0;
            }
        });
}

function calculateY(rootNode)
{
    visitNodes_preOrder(rootNode, updateField, ["y"]);
}

// -------------------- Grid computations --------------------

var leafVals = {
    rows: 3,
    cols: 3
}

var zeroChildVals = {
    rows: 6,
    cols: 3
}

var oneChildVals = {
    rows: 6,
    cols: 3
}

var twoChildVals = {
    rows: 6,
    cols: 5
}

var threeChildVals = {
    rows: 6,
    cols: 7
}



function computeNodeCoordinates(node)
{
    node.rowStart = 4;
    node.rowSpan = 2;
    node.colStart = 2;

    if (node.children)
    {
        var childCount = node.children.length;

        switch (childCount)
        {
            case 0:
            case 1:
                node.colSpan = 1;
                break;
            case 2:
                node.colSpan = 3;
                // do something about node's parent's columns?
                break;
            case 3:
                node.colSpan = 5;
                // do something about node's parent's columns?
                break;
        }
    }
    else
    {
        node.colSpan = 1;
    }
}

// -------------------- Output --------------------

function writeTreeField_Terminal(rootNode, fieldName, indent = `    `)
{
    visitNodes_preOrder(rootNode, writeNodeField_Terminal, [fieldName, indent], 0);
}

function writeNodeField_Terminal(node, fieldName, indent, iterationHeight)
{
    var nodeIndent = "";

    for (var i = 0; i < iterationHeight; i++)
    {
        nodeIndent += indent;
    }

    console.log(`${nodeIndent} ${node[fieldName]}
    `);
}

function writeLeafHTML(treeName, leafName, leafObj)
{
    var leafClassContent = `${treeName}_${leafName} leaf`;
    var leafContent = `${leafObj.proposition}`;

    return `<div class="${leafClassContent}">${leafContent}</div>`;
}

function writeLeafCSS(treeName, leafName, leafObj) {}

function writeNodeHTML(treeName, leafName, nodeObj)
{
    var leafClassContent = `${treeName}_${leafName} leaf`;
    var leafContent = `${leafObj.proposition}`;

    var leftClassContent = `${treeName}_${leafName}_left rule-left rule-text`
    var leftContent = `${leafObj.leftContent}`;

    var rightClassContent = `${treeName}_${leafName}_right rule-right rule-text`
    var rightContent = `${leafObj.rightContent}`;

    return `<div class="${leftClassContent}">${leftContent}</div>
    <div class="${leafClassContent}">${leafContent}</div>
    <div class="${rightClassContent}">${rightContent}</div>`;
}

function writeNodeCSS(treeName, leafName, nodeObj) {}


// -------------------- Test Trees --------------------

var leaf1 = buildNode("leaf 1 conclusion", "leaf1");
var leaf2 = buildNode("leaf 2 conclusion", "leaf2");
var leaf3 = buildNode("leaf 3 conclusion", "leaf3");

var zeroChildren = buildNode("zero conclusion", "zero", [], "left zero", "right zero");
var oneChild = buildNode("one conclusion", "one", [leaf1], "left one", "right one");
var twoChildren = buildNode("two conclusion", "two", [leaf1, leaf2], "left two", "right two");
var threeChildren = buildNode("three conclusion", "three", [leaf1, leaf2, leaf3], "left three", "right three");

var tree2 = buildNode("A", "A",
    [
        buildNode("B", "B",
            [
                buildNode("D", "D"),
                buildNode("E", "E"),
                buildNode("F", "F")
            ],
            "B left",
            "B right"),
        buildNode("C", "C", [], "C left", "C right")
    ],
    "A left",
    "A right");

var TRexample = buildNode("O", "O",
    [
        buildNode("E", "E",
        [
            buildNode("A", "A"),
            buildNode("D", "D",
            [
                buildNode("B", "B"),
                buildNode("C", "C")
            ])
        ]),
        buildNode("F", "F", []),
        buildNode("N", "N", [
            buildNode("G", "G"),
            buildNode("M", "M",
            [
                buildNode("H", "H"),
                buildNode("I", "I"),
                buildNode("J", "J"),
                buildNode("K", "K"),
                buildNode("L", "L")
            ])
        ])
    ],)

var testTrees = [leaf1, zeroChildren, oneChild, twoChildren, threeChildren, tree2, TRexample];




// ------------------------------ Entry ------------------------------


(function go()
{
    try
    {
        testTrees.forEach(t => console.log(t));
    }
    catch (e)
    {
        console.log(e.name);
        console.log(e.message);
    }
})();

module.exports = {
    buildNode: buildNode
}