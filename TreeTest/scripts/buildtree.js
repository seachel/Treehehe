
// -------------------- Model --------------------

    function buildTree(newRoot)
    {
        return {
            root: newRoot
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
            colEnd: null
        };

        return result;
    }


// -------------------- Tree Traversal --------------------

function visitNodes(rootNode, nodeCallback, nodeCallbackArgs = [], childCallback = null, childCallbackArgs = [])
{
    if (nodeCallback)
    {
        nodeCallback(rootNode, ...nodeCallbackArgs);
    }

    if (rootNode.children && (rootNode.children.length > 0))
    {
        rootNode.children.forEach(child =>
            {
                if (childCallback)
                {
                    childCallback(child, rootNode, ...childCallbackArgs);
                }
                visitNodes(child, nodeCallback, nodeCallbackArgs, childCallback, childCallbackArgs);
            });
    }
}

function updateParentsInTree(rootNode)
{
    visitNodes(rootNode, null, null, updateParent)
}

function renameTree(rootNode, treeName)
{
    visitNodes(rootNode, updateField, ["treeName", treeName]);
}



// -------------------- Helpers --------------------

function updateField(node, fieldName, fieldValue)
{
    if (node)
    {
        node[fieldName] = fieldValue;
    }
}

function updateParent(child, parent)
{
    if (child)
    {
        child.parent = parent;
    }
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

// difference between rows?


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
                buildNode("E", "E")
            ],
            "B left",
            "B right"),
        buildNode("C", "C", [], "C left", "C right")
    ],
    "A left",
    "A right");

var testTrees = [leaf1, zeroChildren, oneChild, twoChildren, threeChildren, tree2];
















