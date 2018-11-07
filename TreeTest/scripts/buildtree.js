// import { setFlagsFromString } from "v8";

// (function()
// {

    function buildTree(newRoot)
    {
        return {
            root: newRoot
        };
    }

    function buildNode(newProposition = "", newChildren = null, newLeftContent = "", newRightContent = "")
    {
        result = {
            proposition: newProposition,
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

    // return {
    //     buildTree: buildTree,
    //     buildNode: buildNode
    // };

// })();

module.exports = {
    buildNode: buildNode
};

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


var leaf1 = buildNode("leaf 1 conclusion");
var leaf2 = buildNode("leaf 2 conclusion");
var leaf3 = buildNode("leaf 3 conclusion");

var zeroChildren = buildNode("zero conclusion", [], "left zero", "right zero");
var oneChild = buildNode("one conclusion", [leaf1], "left one", "right one");
var twoChildren = buildNode("two conclusion", [leaf1, leaf2], "left two", "right two");
var threeChildren = buildNode("three conclusion", [leaf1, leaf2, leaf3], "left three", "right three");

var testTrees = [leaf1, zeroChildren, oneChild, twoChildren, threeChildren];

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