// Taken from https://github.com/mapbox/mapbox-gl-js/blob/7e87d7c05c541f98e06df2bc08b96e931ace9549/src/util/util.js#L296-L314
const deepEqual = (a, b) => {
   if (Array.isArray(a)) {
       if (!Array.isArray(b) || a.length !== b.length) return false;
       for (let i = 0; i < a.length; i++) {
           if (!deepEqual(a[i], b[i])) return false;
       }
       return true;
   }
   if (typeof a === 'object' && a !== null && b !== null) {
       if (!(typeof b === 'object')) return false;
       const keys = Object.keys(a);
       if (keys.length !== Object.keys(b).length) return false;
       for (const key in a) {
           if (!deepEqual(a[key], b[key])) return false;
       }
       return true;
   }
   return a === b;
};

export default deepEqual
