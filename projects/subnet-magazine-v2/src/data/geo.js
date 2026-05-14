/* =================================================================
   SUBNET MAGAZINE — GEOGRAPHY
   -----------------------------------------------------------------
   Hand-authored country borders + label positions, kept tight so we
   can ship the data as part of the bundle without an external map
   library. Borders are stored as (lng, lat) closed polylines; the
   chart renders only the visible-hemisphere portion each frame.

   Country labels carry a `weight` (display priority — 1 = always
   show big, 2 = medium, 3 = only when zoomed).

   US state labels: 8 major states by validator activity (CA, TX,
   NY, FL, IL, PA, WA, VA). Shown when their longitude is on the
   front hemisphere.
   ================================================================= */

/** Country boundary polylines (lng, lat), simplified to ~10–14 verts. */
export const COUNTRY_BORDERS = [
  /* Continental US (lower 48, very approximate) */
  { name:'USA', poly:[
    [-125,49],[-114,49],[-104,49],[-95,49],[-87,48],[-82,46],[-77,45],[-68,45],
    [-67,44],[-71,42],[-74,40],[-75,38],[-77,35],[-81,32],[-84,30],[-87,30],
    [-89,29],[-93,29],[-97,26],[-100,26],[-103,29],[-108,32],[-114,32],
    [-117,33],[-119,34],[-121,36],[-123,38],[-124,40],[-124,46],[-125,49]
  ]},
  { name:'CANADA', poly:[
    [-141,69],[-128,70],[-110,70],[-95,73],[-78,73],[-65,65],[-55,52],
    [-66,47],[-79,43],[-83,42],[-87,48],[-95,49],[-114,49],[-125,49],
    [-130,55],[-138,60],[-141,69]
  ]},
  { name:'MEXICO', poly:[
    [-117,32],[-108,32],[-103,29],[-99,26],[-97,21],[-93,16],[-89,15],
    [-87,21],[-90,25],[-97,26],[-100,26],[-108,32],[-117,32]
  ]},
  { name:'BRAZIL', poly:[
    [-73,5],[-60,5],[-50,5],[-35,-5],[-35,-15],[-40,-22],[-48,-25],
    [-55,-30],[-58,-30],[-58,-22],[-65,-15],[-73,-10],[-73,5]
  ]},
  { name:'ARGENTINA', poly:[
    [-72,-23],[-65,-22],[-58,-25],[-58,-35],[-62,-40],[-65,-45],
    [-71,-50],[-72,-45],[-72,-23]
  ]},
  { name:'UK', poly:[
    [-6,58],[-2,58],[1,52],[1,50],[-4,49],[-6,52],[-6,58]
  ]},
  { name:'FRANCE', poly:[
    [-5,49],[3,51],[7,49],[8,47],[7,43],[3,42],[-2,43],[-5,49]
  ]},
  { name:'GERMANY', poly:[
    [6,54],[15,54],[14,51],[12,48],[9,47],[7,49],[6,52],[6,54]
  ]},
  { name:'SPAIN', poly:[
    [-9,44],[-1,44],[3,42],[3,38],[-2,36],[-9,37],[-9,44]
  ]},
  { name:'ITALY', poly:[
    [7,46],[13,46],[14,42],[18,40],[15,37],[10,44],[7,46]
  ]},
  { name:'RUSSIA', poly:[
    [27,68],[60,75],[100,76],[140,72],[175,68],[175,60],[140,55],
    [125,53],[110,52],[90,50],[80,50],[65,50],[55,55],[40,55],
    [30,60],[27,68]
  ]},
  { name:'CHINA', poly:[
    [75,40],[88,45],[105,42],[120,45],[131,45],[125,33],[120,25],
    [110,20],[100,22],[88,28],[78,35],[75,40]
  ]},
  { name:'INDIA', poly:[
    [68,24],[78,30],[88,28],[92,27],[88,22],[80,12],[77,8],[73,17],
    [68,24]
  ]},
  { name:'JAPAN', poly:[
    [130,34],[140,37],[145,44],[141,46],[133,34],[130,34]
  ]},
  { name:'S. KOREA', poly:[
    [126,38],[129,38],[129,35],[127,34],[126,38]
  ]},
  { name:'INDONESIA', poly:[
    [95,5],[105,5],[115,3],[125,1],[135,-1],[140,-1],[140,-8],
    [120,-8],[105,-8],[95,-2],[95,5]
  ]},
  { name:'AUSTRALIA', poly:[
    [113,-22],[130,-12],[145,-10],[152,-25],[150,-37],[143,-39],
    [130,-32],[115,-32],[113,-22]
  ]},
  { name:'S. AFRICA', poly:[
    [18,-29],[28,-22],[32,-25],[30,-30],[25,-34],[18,-34],[18,-29]
  ]},
  { name:'EGYPT', poly:[
    [25,31],[35,31],[35,22],[25,22],[25,31]
  ]},
  { name:'SAUDI', poly:[
    [36,30],[50,28],[55,22],[45,12],[40,17],[36,30]
  ]},
  { name:'NIGERIA', poly:[
    [2,4],[15,4],[14,13],[2,12],[2,4]
  ]},
  { name:'TURKEY', poly:[
    [26,42],[44,41],[44,37],[36,36],[26,36],[26,42]
  ]},
  { name:'IRAN', poly:[
    [44,39],[60,39],[63,30],[55,25],[48,28],[44,39]
  ]},
];

/** Country labels — name + center (lat, lng) + priority. */
export const COUNTRY_LABELS = [
  { name:'UNITED STATES', lat: 39, lng: -98,  pr: 1 },
  { name:'CANADA',        lat: 58, lng:-106,  pr: 1 },
  { name:'MEXICO',        lat: 23, lng:-102,  pr: 2 },
  { name:'BRAZIL',        lat:-10, lng: -55,  pr: 1 },
  { name:'ARGENTINA',     lat:-35, lng: -65,  pr: 2 },
  { name:'UK',            lat: 54, lng:  -2,  pr: 2 },
  { name:'FRANCE',        lat: 47, lng:   2,  pr: 2 },
  { name:'GERMANY',       lat: 51, lng:  10,  pr: 2 },
  { name:'SPAIN',         lat: 40, lng:  -3,  pr: 3 },
  { name:'ITALY',         lat: 43, lng:  12,  pr: 3 },
  { name:'RUSSIA',        lat: 60, lng:  95,  pr: 1 },
  { name:'CHINA',         lat: 35, lng: 105,  pr: 1 },
  { name:'INDIA',         lat: 22, lng:  78,  pr: 1 },
  { name:'JAPAN',         lat: 36, lng: 138,  pr: 2 },
  { name:'S. KOREA',      lat: 37, lng: 128,  pr: 3 },
  { name:'INDONESIA',     lat: -2, lng: 118,  pr: 2 },
  { name:'AUSTRALIA',     lat:-25, lng: 135,  pr: 1 },
  { name:'S. AFRICA',     lat:-29, lng:  25,  pr: 2 },
  { name:'EGYPT',         lat: 27, lng:  30,  pr: 3 },
  { name:'SAUDI ARABIA',  lat: 24, lng:  45,  pr: 3 },
  { name:'NIGERIA',       lat: 10, lng:   8,  pr: 3 },
  { name:'TURKEY',        lat: 39, lng:  35,  pr: 3 },
  { name:'IRAN',          lat: 32, lng:  53,  pr: 3 },
];

/** Top US states by validator activity (center lat, lng). */
export const US_STATES = [
  { code:'CA', name:'California', lat:37.2, lng:-119.5, validators: 168 },
  { code:'TX', name:'Texas',      lat:31.0, lng: -99.9, validators:  92 },
  { code:'NY', name:'New York',   lat:42.8, lng: -75.5, validators:  88 },
  { code:'FL', name:'Florida',    lat:28.0, lng: -82.0, validators:  64 },
  { code:'IL', name:'Illinois',   lat:40.0, lng: -89.0, validators:  46 },
  { code:'WA', name:'Washington', lat:47.5, lng:-120.0, validators:  41 },
  { code:'PA', name:'Pennsylvania', lat:40.9, lng:-77.5, validators:38 },
  { code:'VA', name:'Virginia',   lat:37.8, lng: -78.5, validators:  34 },
];
