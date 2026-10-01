import villaAfter from './assets/villa-after.png';

export const PX = (id, w) => 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + (w || 900);
export const AFTER = villaAfter;

export const NAV = ['Outdoor Living', 'Renovations', 'Projects', 'Approach', 'Areas', 'Advice'];

// hour, brightness, saturate, sepia, tint r,g,b, tint strength (0 = white), glow
export const SKY = [
  [7, .9, .85, .3, 240, 190, 165, .9, 0],
  [12, 1.04, 1.05, 0, 255, 255, 255, 1, 0],
  [17, 1, 1.15, .3, 240, 185, 130, .85, 0],
  [19.8, .7, .95, .3, 150, 120, 150, .75, .25],
  [22.5, .4, .75, .15, 70, 85, 130, .7, 1]
];

// hour, label, caption
export const MOMENTS = [
  [7.5, 'FIRST LIGHT', 'Coffee on the terrace before the day begins.'],
  [13, 'MIDDAY', 'Lunch in the shade, a step from the kitchen.'],
  [16.5, 'AFTERNOON', 'The pool, the loungers, the long afternoon.'],
  [19.5, 'GOLDEN HOUR', 'Friends arrive. The outdoor kitchen takes over.'],
  [22, 'AFTER DARK', 'Lighting turns the garden into a room of its own.']
];

// Statement copy: [key] inserts an image pill, *word* is italicised
export const STATEMENT = 'A home can already be [terrace] beautiful and still have more to give. A terrace can work harder. A garden can [pool] connect to the house. A kitchen can open into the way you [kitchen] entertain. An entire villa can be rethought around the way you [living] *live *now.';
export const STATEMENT_IMAGES = {
  terrace: [AFTER, '360%', '42% 50%', 'Terrace'],
  pool: [AFTER, '240%', '62% 84%', 'Pool'],
  kitchen: [PX(1080721, 400), 'cover', 'center', 'Kitchen'],
  living: [PX(1571460, 400), 'cover', 'center', 'Living room']
};

// x %, y %, title, description
export const HOTS = [
  [62, 78, 'A natural stone pool', 'Shaped to the garden, with a beach entry and stone surround.'],
  [84, 50, 'Outdoor kitchen', 'Cooking and dining connected back to the house.'],
  [42, 54, 'Stone terrace', 'Wide enough to live on, not just walk across.'],
  [10, 86, 'Mediterranean planting', 'Lavender, olive and agapanthus for structure and privacy.'],
  [8, 42, 'Shade', 'So the garden still works in the hottest hours.']
];

// id, group, label, image, background-size, background-position, specialists, extra filter
export const TILES = [
  ['terrace', 'out', 'Terraces & outdoor living', AFTER, '360%', '42% 50%', ['Garden designer', 'Stonework']],
  ['pool', 'out', 'Pools & natural pools', AFTER, '240%', '62% 84%', ['Pool engineer', 'Landscape architect']],
  ['okitchen', 'out', 'Outdoor kitchens', AFTER, '420%', '84% 49%', ['Kitchen designer', 'MEP engineer']],
  ['planting', 'out', 'Landscaping & planting', AFTER, '320%', '6% 96%', ['Landscape architect', 'Irrigation']],
  ['shade', 'out', 'Shade & pergolas', AFTER, '380%', '2% 44%', ['Architect', 'Structural engineer']],
  ['light', 'out', 'Outdoor lighting', AFTER, '260%', '70% 50%', ['Lighting designer', 'Electrical'], 'brightness(.5) sepia(.4)'],
  ['kitchen', 'in', 'Kitchens', PX(1080721), 'cover', 'center', ['Kitchen designer', 'MEP engineer']],
  ['bath', 'in', 'Bathrooms', PX(1457847), 'cover', 'center', ['Interior designer', 'Plumbing']],
  ['interiors', 'in', 'Interiors', PX(1571460), 'cover', 'center', ['Interior designer']],
  ['villa', 'in', 'Complete villa renovation', PX(323780), 'cover', 'center', ['Architect', 'Interior designer', 'Structural engineer', 'MEP engineer']],
  ['ext', 'in', 'Extensions & reconfiguration', PX(1974596), 'cover', 'center', ['Architect', 'Structural engineer', 'Licensing']]
];

export const NUM = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven'];

export const STEPS = [
  ['01', 'UNDERSTAND', 'Property, priorities and what needs to change.'],
  ['02', 'DEVELOP', 'Concept, design and the right technical specialists.'],
  ['03', 'DEFINE', 'Scope, specification, programme and stages.'],
  ['04', 'BUILD', 'Coordinated work, reporting and decisions.'],
  ['05', 'FINISH', 'Final details, handover and aftercare.']
];

export const AREAS = ['Marbella', 'Benahavís', 'Estepona', 'Costa del Sol'];

export const ADVICE = [
  'What to decide before redesigning your outdoor space',
  'Natural pools: does the concept suit your property?',
  'Pool renovation vs replacement'
];

export const FOOTER_COLS = [
  { h: 'OUTDOOR LIVING', items: ['Outdoor Transformations', 'Landscaping & Gardens', 'Outdoor Kitchens', 'Pools & Natural Pools'] },
  { h: 'RENOVATIONS', items: ['Complete Villas', 'Interiors', 'Kitchens', 'Bathrooms'] },
  { h: 'AREAS', items: AREAS }
];
