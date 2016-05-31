import area from './area.jsx';
import gcInterpolate from './gcInterpolate.jsx';
import simplify from './simplify.jsx';

const exported = { area, gcInterpolate, simplify };

if (window) window.edscgeo = exported;

export default exported;
