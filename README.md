# Graphene Editor
Simple editor to visually finetune artificial graphene samples.
The tool can be used on the web using https://jorisbarkema.github.io/Graphene-Editor/
## Data format
The data is expected to follow the following format:
```
sample_width
sample_height
TODO
TODO
atom_id x y z
atom_id x y z
...
connection_id atom1_id atom2_id
connection_id atom1_id atom2_id
...
```
For example:
```
3
3
0
0
0	-1	-2	0
1	-2	-1	0
0	0       1
```
gives two atoms at (-1, -2, 0) and (-2, -1, 0) which are connected to each other.
The values for a connection or atom must be separated by whitespace and IDs are expected to be [0, 1, ..., n)
