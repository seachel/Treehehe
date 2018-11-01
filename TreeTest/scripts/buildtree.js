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
        rowStart: null
    };

    return result;
}

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
    testTrees.forEach(t => console.log(t));
})();