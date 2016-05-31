import area from './area.jsx';

// Calculate the significance of the spherical triangle formed between the given points
// Points with the lowest weights will be removed by the simplification algorithm. Currently
// the weight is just the area of the triangle.
const triangleWeight = (p0, p1, p2) => {
  let result = area([p0, p1, p2]);
  if (result > 2 * Math.PI) result = Math.abs(4 * Math.PI - result);
  return result;
};

// Note: If the below O(N^3) code proves slow, it can be made to be O(N*lg(N)) by
//   1. Only re-calculating weights of points adjacent to removed points
//   2. Using a min-heap to track which weight is smallest
export default (points, desiredCount) => {
  const result = points.slice(0);
  while (result.length > desiredCount) {
    let minIndex = -1;
    let minWeight = Infinity;
    const len = result.length;
    for (let i = 0; i < len; i++) {
      const weight = triangleWeight(
        result[i],
        result[(i + 1) % len],
        result[(i + 2) % len]
      );
      if (weight < minWeight) {
        minIndex = (i + 1) % len;
        minWeight = weight;
      }
    }
    result.splice(minIndex, 1);
  }
  return result;
};
