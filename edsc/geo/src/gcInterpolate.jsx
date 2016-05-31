const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const EPSILON = 0.00000001;

export default (point1, point2) => {
  const { abs, asin, sqrt, pow, sin, cos, atan2 } = Math;

  let p1 = point1;
  let p2 = point2;

  if (abs(p1.lat) === abs(p2.lat) && abs(p1.lat) === 90) return p1;

  if (p2.lng < p1.lng) [p1, p2] = [p2, p1];

  const lat1 = p1.lat * DEG_TO_RAD;
  const lon1 = p1.lng * DEG_TO_RAD;
  const lat2 = p2.lat * DEG_TO_RAD;
  const lon2 = p2.lng * DEG_TO_RAD;

  // http://williams.best.vwh.net/avform.htm#Dist
  const d = 2 * asin(sqrt(pow(sin((lat1 - lat2) / 2), 2) +
                          cos(lat1) * cos(lat2) * pow(sin((lon1 - lon2) / 2), 2)));

  // http://williams.best.vwh.net/avform.htm#Intermediate
  // This is a special case where f = 1/2 and therefore A = B, allowing us
  // to simplify a few expressions
  const AB = sin(d / 2) / sin(d);
  const x = AB * (cos(lat1) * cos(lon1) + cos(lat2) * cos(lon2));
  const y = AB * (cos(lat1) * sin(lon1) + cos(lat2) * sin(lon2));
  const z = AB * (sin(lat1) + sin(lat2));
  const lat = RAD_TO_DEG * atan2(z, sqrt(x * x + y * y));
  let lon = RAD_TO_DEG * atan2(y, x);

  // Guard against the points being the same or antipodal
  if (isNaN(lat) || isNaN(lon)) return p1;

  while (lon < p1.lng - EPSILON) lon += 360;
  while (lon < p1.lng - EPSILON) lon -= 360;

  return { lat, lng: lon };
};
