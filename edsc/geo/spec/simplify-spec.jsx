/* eslint-env node, mocha */

import fs from 'fs';
import simplify from '../src/simplify.jsx';

const colorado = JSON.parse(fs.readFileSync('spec/data/Colorado.json'));
const georgia = JSON.parse(fs.readFileSync('spec/data/Georgia.json'));
const virginia = JSON.parse(fs.readFileSync('spec/data/Virginia.json'));

// To generate new test data from a shell with jq:
// less ../../doc/example-data/shapefiles/us_states.geojson |
//      jq '.features[] | select(.properties.NAME == "Colorado")
//                      | .geometry.coordinates[0]
//                      | map({lat: .[1], lng: .[0]})'

it('should respond with hello world', () => {
  console.log(colorado.length);
  console.log(simplify(colorado, 10));
  console.log(georgia.length);
  console.log(simplify(georgia, 10));
  console.log(virginia.length);
  console.log(simplify(virginia, 10));
});
