import gcInterpolate from './gcInterpolate.jsx';

const DEG_TO_RAD = Math.PI / 180;

export default (origLatLngs) => {
  if (origLatLngs.length < 3) return 0;

  // This algorithm is an approximation to area.  For some polygons, particularly large and narrow
  // ones, it will produce incorrect results causing us to think they have clockwise points when
  // their points are counterclockwise.
  // The algorithm to deal with this exactly is complex and slow (see PDF below).  For our purposes,
  // we want to eliminate cases that may cause real problems.  Below, we add the midpoint for long
  // arcs to our list of latlngs.  Doing so means we'll see fewer problems but we'll be doing
  // more calculations.
  // If polygons still cause problems, interpolate more :)

  const latLngs = [];
  let len = origLatLngs.length;
  for (let i = 0; i < len; i++) {
    const latlngA = origLatLngs[i];
    const latlngB = origLatLngs[(i + 1) % len];
    latLngs.push(latlngA);
    if (Math.abs(latlngA.lat - latlngB.lat) > 20 || Math.abs(latlngA.lng - latlngB.lng) > 20) {
      latLngs.push(gcInterpolate(latlngA, latlngB));
    }
  }

  // http://trs-new.jpl.nasa.gov/dspace/bitstream/2014/40409/3/JPL%20Pub%2007-3%20%20w%20Errata.pdf
  // Page 7

  const PI = Math.PI;

  let crossesMeridian = false;
  let sum = 0;
  len = latLngs.length;
  for (let i = 0; i < len; i++) {
    const latlngA = latLngs[i];
    const latlngB = latLngs[(i + 1) % len];
    const latlngC = latLngs[(i + 2) % len];

    const thetaA = latlngA.lng * DEG_TO_RAD;
    let thetaB = latlngB.lng * DEG_TO_RAD;
    let thetaC = latlngC.lng * DEG_TO_RAD;
    const phiB = latlngB.lat * DEG_TO_RAD;

    if (Math.abs(thetaB - thetaA) > PI) {
      crossesMeridian = !crossesMeridian;
      if (thetaB > thetaA) thetaB -= 2 * Math.PI;
      else thetaB += 2 * Math.PI;
    }

    if (Math.abs(thetaC - thetaB) > PI) {
      crossesMeridian = !crossesMeridian;
      if (thetaC > thetaB) thetaC -= 2 * Math.PI;
      else thetaC += 2 * Math.PI;
    }

    sum += (thetaC - thetaA) * Math.sin(phiB);
  }

  if (crossesMeridian) sum = 4 * Math.PI + sum;
  let area = -sum / 2;
  if (area < 0) area = 4 * Math.PI + area;
  return area;
};
