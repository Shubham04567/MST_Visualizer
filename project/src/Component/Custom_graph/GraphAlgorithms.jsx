
// Find root of the set containing element with given index (with path compression)

export function findByRank(parent, idx) {
    if (parent[idx] === idx) return idx;
    return (parent[idx] = findByRank(parent, parent[idx]));
}
  
 
// Union two sets by rank (balancing the tree height)

export function unionByRank(parent, rank, idx1, idx2) {
    let parent1 = findByRank(parent, idx1);
    let parent2 = findByRank(parent, idx2);

    if (parent1 !== parent2) {
        if (rank[parent1] > rank[parent2]) {
            parent[parent2] = parent1;
        } else if (rank[parent1] < rank[parent2]) {
            parent[parent1] = parent2;
        } else {
            rank[parent1] += 1;
            parent[parent2] = parent1;
        }
    }
}
