export function lineLength(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function polylineLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += lineLength(points[i - 1], points[i]);
  }
  return total;
}

// Perpendicular distance from `point` to the line defined by lineStart→lineEnd.
function perpendicularDist(point, lineStart, lineEnd) {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return lineLength(point, lineStart);
  return Math.abs(
    dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x
  ) / len;
}

function _rdp(points, tolerance, start, end, result) {
  if (end - start < 1) return;
  let maxDist = 0;
  let maxIdx  = start;
  for (let i = start + 1; i < end; i++) {
    const d = perpendicularDist(points[i], points[start], points[end]);
    if (d > maxDist) { maxDist = d; maxIdx = i; }
  }
  if (maxDist > tolerance) {
    _rdp(points, tolerance, start, maxIdx, result);
    result.push(points[maxIdx]);
    _rdp(points, tolerance, maxIdx, end, result);
  }
}

// Ramer-Douglas-Peucker polyline simplification.
export function simplifyPolyline(points, tolerance = 8) {
  if (points.length <= 2) return points;
  const result = [points[0]];
  _rdp(points, tolerance, 0, points.length - 1, result);
  result.push(points[points.length - 1]);
  return result;
}

// Returns an axis-aligned bounding box for a line segment suitable for
// Arcade Physics static body creation.
export function segmentAABB(p1, p2, thickness) {
  const midX = (p1.x + p2.x) / 2;
  const midY = (p1.y + p2.y) / 2;
  const dx   = Math.abs(p2.x - p1.x);
  const dy   = Math.abs(p2.y - p1.y);
  // Mostly-horizontal → wide thin box; mostly-vertical → tall thin box.
  const width  = dx >= dy ? Math.max(dx, thickness) : thickness;
  const height = dx >= dy ? thickness : Math.max(dy, thickness);
  return { x: midX, y: midY, width, height };
}
