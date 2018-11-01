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

var leaf = buildNode("leaf conclusion");
var zeroChildren = buildNode("zero conclusion", [], "left zero", "right zero");
var oneChild = buildNode("one conclusion", ["child 1"], "left one", "right one");
var twoChildren = buildNode("two conclusion", ["child 1", "child 2"], "left two", "right two");
var threeChildren = buildNode("three conclusion", ["child 1", "child 2", "child 3"], "left three", "right three");

var testTrees = [leaf, zeroChildren, oneChild, twoChildren, threeChildren];

(function go()
{
    testTrees.forEach(t => console.log(t));
})();