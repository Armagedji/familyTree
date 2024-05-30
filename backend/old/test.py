import pydot
import graphviz
data = [
    (1, 1, 2, 'spouse'),
    (2, 1, 3, 'parent-child'),
    (3, 1, 4, 'parent-child'),
    (4, 5, 6, 'spouse'),
    (5, 5, 7, 'parent-child'),
    (6, 5, 8, 'parent-child'),
    (7, 5, 9, 'parent-child'),
    (8, 9, 10, 'parent-child'),
    (9, 4, 7, 'spouse'),
    (10, 4, 11, 'parent-child'),
    (11, 4, 12, 'parent-child'),
    (12, 4, 13, 'parent-child'),
]
data1 = [
    (1, 1, 2, 'parent-child'),
    (2, 2, 3, 'parent-child'),
    (3, 3, 4, 'siblings'),
    (4, 5, 1, 'parent-child'),
    (5, 6, 5, 'siblings'),
    (6, 5, 7, 'spouse'),
    (7, 2, 4, 'parent-child'),
]
persons = set()
for row in data:
    persons.add(row[1])  # person_id
    persons.add(row[2])  # related_person_id

print(persons)
d = graphviz.Digraph(format='png')

for row in data:
    relation_id, person_id, related_person_id, relationship_type = row
    if relationship_type == 'siblings':
        with d.subgraph() as s:
            s.attr(rank='same')
            s.node(f'Person {person_id}')
            s.node(f'Person {related_person_id}')
    elif relationship_type == 'spouse':
        with d.subgraph() as s:
            s.attr(rank='same')
            s.node(f'Person {person_id}')
            s.node(f'Person {related_person_id}')
        d.edge(str(f'Person {person_id}'), f'Person {related_person_id}', arrowhead='none', color = "black:invis:black")
    elif relationship_type == 'parent-child':
        with d.subgraph() as s:
            s.node(f'Person {person_id}')
            s.node(f'Person {related_person_id}')
            s.edge(str(f'Person {person_id}'), f'Person {related_person_id}')
d.render(directory='doctest-output')
d.view()