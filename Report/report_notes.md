

Dec 13 goals:

- ~~start writing initial thoughts on intro (note form?)~~

- ~~summary of paper in intro~~

- ~~objective for readers of paper~~

- ~~more on tool description~~

- ~~try to finish tool description and user tasks section~~



Dec 17 goals:

- ~~finish first draft of Technology (describing modifications and challenges)~~

- ~~start writing tutorial (moved from Dec 13)~~

- tutorial and examples (moved from Dec 13)

- ~~list of terms for glossary or special note~~

- discussion: first draft (future work, in particular)


Dec 18 goals:

- review and make notes on presentation that are not already included

- introduction: first draft

- infovis elements: first draft

- conclusion: first draft


Dec 19 goals:

- figures / graphics

- begin review for final draft


Dec 20 goals:

- tool updates

- final draft



===

- todo: merge in presentation notes?
- todo: omit proposal notes that are no longer relevant

Proposal notes:
---


Reading review:

- Herman et al. paper: techniques for visualizing trees
  * TR algorithm: visually rooted tree, unlike other space-saving layouts;
    + proof tree drawings must adhere to a specific structure
    + inverted so root is at the bottom
    + TR vertically aligns nodes at the same depth in a proof
  * incremental exploration and navigation to display only a subtree (future work)
  * focus+context?
- Ware: colour in visualization
  * used to highlight focused node
  * in proof walk-through, explain and justify colouring of nodes in past, colouring of children
    + want reader to focus mostly on focused node, slightly on future, not at all on past
- Figueiras taxonomy of interaction
  * we use abstract/elaborate (future), select, overview/explore
- Duval discussion of opinions on visualizations
  * interaction elevates visualization to provide comprehension, etc
- Lin and Yang facets of proof comprehension
- Yie et al. on processes for gaining insight
  * discuss how each process leads to insight in this project



Problem domain:

- proofs important in logic
- proof trees are constructs that show the structure of an argument
- proof trees are an artifact: aid in reasoning, method of documentation

~ reuse paragraph?


Use of visualization:

- size issue: digital version eliminates bounds
- static, declarative object: interaction helps with operational comprehension (plus selection panel)
- hide detail to improve proof comprehension (future work now?)


Design outline (approach):

- description of inference rules (for intro or logic background or conclusion)
- sequent
- natural deduction examples come from Huth and Ryan
- in TR algorithm, can depend on root of tree being in the same location
- discussion of traversal choice


Design outline (technology):

- mention GitHub pages?
- discuss data representation (JSON objects containing...)
- HTML for page content, CSS for styling, JS for behaviour (in intro to this section)
- responsiveness attempted, using Flexbox for page layout
- design not tested on small devices
- tested on most recent version of chrome (state version)
- embed LaTeX in HTML with MathJax
- LaTeX only used for content of nodes, not whole tree