const { buildTree, buildNode } = require('./buildtree')

// use .toEqual for deep equality, otherwise .toBe

test('test initializing a tree with the `buildTree` function',
    () =>
    {
        var root = buildNode("root prop", "root name");
        var name = "test tree";
        expect(buildTree(root, name)).toEqual(
            {
                root: root,
                name: name,
                numrows: 0,
                numcols: 0,
                height: 0
            }
        )
    });

test('test initializing a leaf with the `buildNode` function',
    () =>
    {
        var leafProp = "some prop";
        var leafName = "some name";
        expect(buildNode(leafProp, leafName)).toEqual(
            {
                proposition: leafProp,
                name: leafName,
                children: null,
                leftContent: "",
                rightContent: "",
                rowStart: null,
                rowEnd: null,
                colStart: null,
                colEnd: null,
                x: -1,
                y: -1,
                mod: -1,
                previousSibling: null
            }
        )
    })