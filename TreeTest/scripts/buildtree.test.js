const { buildNode } = require('./buildtree')

// use .toEqual for deep equality, otherwise .toBe

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