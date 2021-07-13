function dotToObject(originalObject) {
  var result = Object.keys(originalObject).sort().reduce(
    (obj, key) => { 
      
      let currentObj = obj;
      
      if (key.indexOf(".") !== -1) {

        let keys = key.split("."),
          i, l = Math.max(1, keys.length - 1),
          singleKey;
    
          for (i = 0; i < l; ++i) {
            singleKey = keys[i];
            currentObj[singleKey] = currentObj[singleKey] || {};
            currentObj = currentObj[singleKey];
          }
          
          currentObj[keys[i]] = originalObject[key];
      } else {
        currentObj[key] = originalObject[key];
      }
      return obj;
    }, 
    {}
  );
  return result;
}

async flattenObject(objInput) {
  const ignoreKeys = ['_index', '_score', '_type', '_doc'];
  const ignoreMixKeys = ['_id', '_source',]
  const _flattenObject = (obj, prefix) =>
    Object.keys(obj).reduce((acc, k) => {
      const pre = prefix && prefix.length ? prefix + '.' : '';
      const ignore = (ignoreKeys.indexOf(k) >= 0 && pre) || k.indexOf('.') >= 0;
      if (
        !ignore &&
        typeof obj[k] === 'object' &&
        !Array.isArray(obj[k]) &&
        obj[k] !== null &&
        Object.keys(obj[k]).length > 0
      ) {

        let mixKey = {};
        if (ignoreMixKeys.indexOf(k) < 0) {
          mixKey = {
            [pre + k]: (({ _index, _score, _type, _doc, ...o }) => o)(obj[k])
          };
        } 
        Object.assign(acc, mixKey, _flattenObject(obj[k], pre + k));
      }
      else if (!ignore) {
        acc[pre + k] = obj[k];
      }

      return acc;
    }, {});
  return _flattenObject(objInput);
}
