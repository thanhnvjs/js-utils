/* {'a.b.c': 1} -> {a: {b: {c: 1}}} */

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

/* {a: {b: {c: 1}}} -> {a: {b: {c: 1}}}, 'a.b': {c: 1}, a.b.c': 1} */
async function flattenObject(objInput) {
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

/** 1000 -> 1.0000 */
function formatNumber(val) {
  return String(val || '').replace(/[^\d]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

/** ( readNumberToVN.doc(107000707) ); -> một trăm lẻ bảy triệu bảy trăm lẻ bảy **/
var readNumberToVN = function(){
  t=["không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"],
  r=function(r,n){
    var o="",
    a=Math.floor(r/10),
    e=r%10;
    return a > 1 ? (o=" "+t[a]+" mươi",1==e&&(o+=" mốt"))
                  : 1 == a ? (o=" mười",1==e&&(o+=" một"))
                            : n&&e>0&&(o=" lẻ"),5==e&&a>=1 ? o+=" lăm"
                                                            : 4==e&&a>=1 ? o+=" tư"
                                                                          : (e>1||1==e&&0==a)&&(o+=" "+t[e]) ,o
  },
  n=function(n,o){
    var a="",
    e=Math.floor(n/100),
    n=n%100;
    return o||e>0 ? (a=" "+t[e]+" trăm",a+=r(n,!0))
                  : a=r(n,!1),a
  },
  o=function(t,r){
    var o="",
    a=Math.floor(t/1e6),
    t=t%1e6;
    a>0&&(o=n(a,r)+" triệu",r=!0);
    var e=Math.floor(t/1e3),
    t=t%1e3;
    return e>0&&(o+=n(e,r)+" nghìn",r=!0),t>0&&(o+=n(t,r)),o
  };
  return {
    doc: function(r){
      if(0==r)
        return t[0];
      var n="",a="";
      do ty=r%1e9,r=Math.floor(r/1e9),n=r>0?o(ty,!0)+a+n:o(ty,!1)+a+n,a=" tỷ";
      while(r>0);
      return n.trim()
    }
  }
}();

eval("var readNumberToVNText=function(){ t=[\u0022kh\u00f4ng\u0022,\u0022m\u1ed9t\u0022,\u0022hai\u0022,\u0022ba\u0022,\u0022b\u1ed1n\u0022,\u0022n\u0103m\u0022,\u0022s\u00e1u\u0022,\u0022b\u1ea3y\u0022,\u0022t\u00e1m\u0022,\u0022ch\u00edn\u0022],\nr=function(r,n){\n    var o=\u0022\u0022,a=Math.floor(r\/10),e=r%10;\n    return a\u003E1?(o=\u0022 \u0022+t[a]+\u0022 m\u01b0\u01a1i\u0022,1==e&&(o+=\u0022 m\u1ed1t\u0022)):1==a?(o=\u0022 m\u01b0\u1eddi\u0022,1==e&&(o+=\u0022 m\u1ed9t\u0022)):n&&e\u003E0&&(o=\u0022 l\u1ebb\u0022),5==e&&a\u003E=1?o+=\u0022 l\u0103m\u0022:4==e&&a\u003E=1?o+=\u0022 t\u01b0\u0022:(e\u003E1||1==e&&0==a)&&(o+=\u0022 \u0022+t[e]),o},n=function(n,o){var a=\u0022\u0022,e=Math.floor(n\/100),n=n%100;return o||e\u003E0?(a=\u0022 \u0022+t[e]+\u0022 tr\u0103m\u0022,a+=r(n,!0)):a=r(n,!1),a},o=function(t,r){var o=\u0022\u0022,a=Math.floor(t\/1e6),t=t%1e6;a\u003E0&&(o=n(a,r)+\u0022 tri\u1ec7u\u0022,r=!0);var e=Math.floor(t\/1e3),t=t%1e3;return e\u003E0&&(o+=n(e,r)+\u0022 ngh\u00ecn\u0022,r=!0),t\u003E0&&(o+=n(t,r)),o};return{doc:function(r){if(0==r)return t[0];var n=\u0022\u0022,a=\u0022\u0022;do ty=r%1e9,r=Math.floor(r\/1e9),n=r\u003E0?o(ty,!0)+a+n:o(ty,!1)+a+n,a=\u0022 t\u1ef7\u0022;while(r\u003E0);return n.trim()}}}();\n( readNumberToVNText.doc(112212) );\n")
