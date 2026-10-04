(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const MAP_WIDTH = 1120;
  const MAP_HEIGHT = 760;
  const FLOORS = [1, 2, 3, 4];
  const FLOOR_NAMES = { 1: '1-qavat', 2: '2-qavat', 3: '3-qavat', 4: '4-qavat' };
  const AREAS = [
    { id: 'north', name: 'North Garden', color: '#60b7a5', bounds: { x: 92, y: 76, w: 936, h: 147 }, center: { x: 560, y: 150 } },
    { id: 'east', name: 'East Broadway', color: '#eba855', bounds: { x: 760, y: 242, w: 283, h: 320 }, center: { x: 900, y: 402 } },
    { id: 'south', name: 'South Avenue', color: '#ef8a72', bounds: { x: 92, y: 580, w: 936, h: 96 }, center: { x: 560, y: 625 } },
    { id: 'west', name: 'West Market', color: '#8993d3', bounds: { x: 77, y: 242, w: 283, h: 320 }, center: { x: 220, y: 402 } },
    { id: 'central', name: 'Central Parkway', color: '#86a5cb', bounds: { x: 380, y: 242, w: 360, h: 320 }, center: { x: 560, y: 408 } },
  ];
  const AREA_BY_ID = Object.fromEntries(AREAS.map((area) => [area.id, area]));

  // Sample tenants and unit numbers keep the MVP self-contained; the map is explicitly marked as schematic.
  const STORES = [
    { id: 'hm-1188', name: 'H&M', unit: '1188', floor: 1, zone: 'north', x: 265, y: 174, kind: 'shopping', category: 'Moda', description: 'Kundalik kiyimlar va aksessuarlar.' },
    { id: 'lego-1268', name: 'LEGO Store', unit: '1268', floor: 1, zone: 'north', x: 560, y: 174, kind: 'shopping', category: 'O‘yinchoqlar', description: 'LEGO to‘plamlari, sovg‘alar va ijodiy o‘yinlar.' },
    { id: 'nordstrom-1205', name: 'Nordstrom', unit: '1205', floor: 1, zone: 'north', x: 855, y: 174, kind: 'shopping', category: 'Do‘kon', description: 'Moda, go‘zallik va kundalik xaridlar.' },
    { id: 'apple-1012', name: 'Apple', unit: '1012', floor: 1, zone: 'west', x: 215, y: 367, kind: 'shopping', category: 'Elektronika', description: 'Apple qurilmalari, aksessuarlar va yordam.' },
    { id: 'sephora-1124', name: 'Sephora', unit: '1124', floor: 1, zone: 'west', x: 215, y: 475, kind: 'shopping', category: 'Go‘zallik', description: 'Kosmetika, parvarish vositalari va atirlar.' },
    { id: 'macys-1701', name: "Macy's", unit: '1701', floor: 1, zone: 'east', x: 905, y: 367, kind: 'shopping', category: 'Do‘kon', description: 'Kiyim-kechak, uy-ro‘zg‘or va sovg‘alar.' },
    { id: 'mms-1102', name: "M&M'S World", unit: '1102', floor: 1, zone: 'east', x: 905, y: 475, kind: 'shopping', category: 'Sovg‘alar', description: 'Rang-barang shirinliklar va esdalik sovg‘alari.' },
    { id: 'starbucks-1046', name: 'Starbucks', unit: '1046', floor: 1, zone: 'south', x: 360, y: 630, kind: 'food', category: 'Qahvaxona', description: 'Qahva va yengil tamaddi uchun qulay bekat.' },
    { id: 'nike-1481', name: 'Nike', unit: '1481', floor: 1, zone: 'south', x: 760, y: 630, kind: 'shopping', category: 'Sport', description: 'Sport kiyimlari, poyabzal va aksessuarlar.' },
    { id: 'nickelodeon-01', name: 'Nickelodeon Universe', unit: 'NU-01', floor: 1, zone: 'central', x: 560, y: 420, kind: 'entertainment', category: 'Ko‘ngilochar maskan', description: 'Mall markazidagi yopiq tematik istirohat bog‘i.' },

    { id: 'aritzia-2210', name: 'Aritzia', unit: '2210', floor: 2, zone: 'north', x: 265, y: 174, kind: 'shopping', category: 'Moda', description: 'Ayollar kiyimlari va zamonaviy kundalik uslub.' },
    { id: 'zara-2244', name: 'ZARA', unit: '2244', floor: 2, zone: 'north', x: 560, y: 174, kind: 'shopping', category: 'Moda', description: 'Kiyim-kechak, poyabzal va aksessuarlar.' },
    { id: 'lululemon-2465', name: 'lululemon', unit: '2465', floor: 2, zone: 'north', x: 855, y: 174, kind: 'shopping', category: 'Sport', description: 'Yoga va mashg‘ulotlar uchun sport kiyimlari.' },
    { id: 'hm-2124', name: 'H&M', unit: '2124', floor: 2, zone: 'west', x: 215, y: 367, kind: 'shopping', category: 'Moda', description: 'Kundalik kiyimlar va aksessuarlar.' },
    { id: 'nike-2316', name: 'Nike', unit: '2316', floor: 2, zone: 'west', x: 215, y: 475, kind: 'shopping', category: 'Sport', description: 'Sport kiyimlari, poyabzal va aksessuarlar.' },
    { id: 'barnes-2257', name: 'Barnes & Noble', unit: '2257', floor: 2, zone: 'east', x: 905, y: 367, kind: 'shopping', category: 'Kitoblar', description: 'Kitoblar, o‘yinlar va sovg‘alar.' },
    { id: 'american-girl-2302', name: 'American Girl', unit: '2302', floor: 2, zone: 'east', x: 905, y: 475, kind: 'shopping', category: 'O‘yinchoqlar', description: 'Qo‘g‘irchoqlar, kitoblar va ijodiy tajribalar.' },
    { id: 'chipotle-2350', name: 'Chipotle', unit: '2350', floor: 2, zone: 'south', x: 360, y: 630, kind: 'food', category: 'Restoran', description: 'Tez tayyorlanadigan Meksika uslubidagi taomlar.' },
    { id: 'build-a-bear-2420', name: 'Build-A-Bear', unit: '2420', floor: 2, zone: 'south', x: 760, y: 630, kind: 'shopping', category: 'O‘yinchoqlar', description: 'O‘zingizga mos yumshoq o‘yinchoq yarating.' },

    { id: 'build-a-bear-3204', name: 'Build-A-Bear', unit: '3204', floor: 3, zone: 'north', x: 360, y: 174, kind: 'shopping', category: 'O‘yinchoqlar', description: 'O‘zingizga mos yumshoq o‘yinchoq yarating.' },
    { id: 'auntie-3053', name: "Auntie Anne's", unit: '3053', floor: 3, zone: 'north', x: 760, y: 174, kind: 'food', category: 'Yengil tamaddi', description: 'Yangi pishirilgan pretzel va yengil tamaddi.' },
    { id: 'k1-speed-3230', name: 'K1 Speed', unit: '3230', floor: 3, zone: 'west', x: 215, y: 367, kind: 'entertainment', category: 'Ko‘ngilochar maskan', description: 'Yopiq trassada karting haydash.' },
    { id: 'crayola-3308', name: 'Crayola Experience', unit: '3308', floor: 3, zone: 'central', x: 460, y: 420, kind: 'entertainment', category: 'Oilaviy tajriba', description: 'Ranglar, ijod va oilaviy mashg‘ulotlar olami.' },
    { id: 'sea-life-3412', name: 'SEA LIFE Minnesota', unit: '3412', floor: 3, zone: 'central', x: 660, y: 420, kind: 'entertainment', category: 'Akvarium', description: 'Suv osti hayoti bilan tanishish uchun akvarium.' },
    { id: 'rainforest-3165', name: 'Rainforest Cafe', unit: '3165', floor: 3, zone: 'east', x: 905, y: 367, kind: 'food', category: 'Restoran', description: 'Tropik mavzudagi restoran va oilaviy ovqatlanish.' },
    { id: 'bubba-3121', name: 'Bubba Gump Shrimp Co.', unit: '3121', floor: 3, zone: 'east', x: 905, y: 475, kind: 'food', category: 'Restoran', description: 'Dengiz mahsulotlari va Amerika taomlari.' },
    { id: 'escape-game-3244', name: 'The Escape Game', unit: '3244', floor: 3, zone: 'south', x: 360, y: 630, kind: 'entertainment', category: 'Ko‘ngilochar maskan', description: 'Jamoa bilan jumboqlarni yechib, xonadan chiqing.' },
    { id: 'dairy-3301', name: 'Dairy Queen', unit: '3301', floor: 3, zone: 'south', x: 760, y: 630, kind: 'food', category: 'Shirinliklar', description: 'Muzqaymoq, desert va tezkor yeguliklar.' },

    { id: 'fair-4045', name: 'The Fair on 4', unit: '4045', floor: 4, zone: 'north', x: 360, y: 174, kind: 'entertainment', category: 'Ko‘ngilochar maskan', description: 'O‘yinlar, attraksionlar va ko‘ngilochar mashg‘ulotlar.' },
    { id: 'smaaash-4102', name: 'SMAAASH', unit: '4102', floor: 4, zone: 'north', x: 760, y: 174, kind: 'entertainment', category: 'Ko‘ngilochar maskan', description: 'Faol hordiq, sport o‘yinlari va guruhlar uchun mashg‘ulotlar.' },
    { id: 'moose-mountain-4314', name: 'Moose Mountain Golf', unit: '4314', floor: 4, zone: 'west', x: 215, y: 367, kind: 'entertainment', category: 'Mini golf', description: 'Oilaviy yopiq mini-golf maydoni.' },
    { id: 'flyover-4300', name: 'FlyOver America', unit: '4300', floor: 4, zone: 'central', x: 460, y: 420, kind: 'entertainment', category: 'Ko‘ngilochar maskan', description: 'Amerika bo‘ylab parvoz taassurotini beruvchi simulyator.' },
    { id: 'cmx-4201', name: 'CMX Odyssey', unit: '4201', floor: 4, zone: 'central', x: 660, y: 420, kind: 'entertainment', category: 'Kinoteatr', description: 'Film tomosha qilish va hordiq uchun kinoteatr.' },
    { id: 'hard-rock-4012', name: 'Hard Rock Cafe', unit: '4012', floor: 4, zone: 'east', x: 905, y: 367, kind: 'food', category: 'Restoran', description: 'Musiqa ruhidagi restoran va esdalik buyumlari.' },
    { id: 'dave-busters-4209', name: "Dave & Buster's", unit: '4209', floor: 4, zone: 'east', x: 905, y: 475, kind: 'entertainment', category: 'O‘yinlar va restoran', description: 'Arkad o‘yinlari va ovqatlanish bir joyda.' },
    { id: 'museum-store-4225', name: 'Museum Store', unit: '4225', floor: 4, zone: 'south', x: 360, y: 630, kind: 'shopping', category: 'Sovg‘alar', description: 'Esdalik sovg‘alari va kundalik buyumlar.' },
    { id: 'margaritaville-4110', name: 'Margaritaville', unit: '4110', floor: 4, zone: 'south', x: 760, y: 630, kind: 'food', category: 'Restoran', description: 'Dam olish muhitidagi restoran va ichimliklar.' },
  ];
  const STORE_BY_ID = Object.fromEntries(STORES.map((store) => [store.id, store]));
  const FLOOR_STORES = Object.fromEntries(FLOORS.map((floor) => [floor, STORES.filter((store) => store.floor === floor)]));

  const ORIGINS = [
    { id: 'west-entry', name: 'West Market kirishi', floor: 1, x: 100, y: 250, node: 'west-north' },
    { id: 'north-entry', name: 'North Garden kirishi', floor: 1, x: 560, y: 250, node: 'north-center' },
    { id: 'east-entry', name: 'East Broadway kirishi', floor: 1, x: 1020, y: 250, node: 'east-north' },
    { id: 'south-entry', name: 'South Avenue kirishi', floor: 1, x: 560, y: 560, node: 'south-center' },
  ];
  const NETWORK_NODES = [
    { id: 'west-north', x: 100, y: 250 },
    { id: 'west-junction', x: 350, y: 250 },
    { id: 'north-center', x: 560, y: 250 },
    { id: 'east-junction', x: 770, y: 250 },
    { id: 'east-north', x: 1020, y: 250 },
    { id: 'west-middle', x: 350, y: 405 },
    { id: 'east-middle', x: 770, y: 405 },
    { id: 'west-lift', x: 350, y: 560 },
    { id: 'south-center', x: 560, y: 560 },
    { id: 'east-escalator', x: 770, y: 560 },
    { id: 'center-top', x: 560, y: 322 },
    { id: 'center-left-top', x: 395, y: 322 },
    { id: 'center-right-top', x: 725, y: 322 },
    { id: 'center-left-bottom', x: 395, y: 510 },
    { id: 'center-right-bottom', x: 725, y: 510 },
  ];
  const NETWORK_EDGES = [
    ['west-north', 'west-junction'], ['west-junction', 'north-center'], ['north-center', 'east-junction'], ['east-junction', 'east-north'],
    ['west-junction', 'west-middle'], ['west-middle', 'west-lift'],
    ['east-junction', 'east-middle'], ['east-middle', 'east-escalator'],
    ['west-lift', 'south-center'], ['south-center', 'east-escalator'],
    ['north-center', 'center-top'], ['center-top', 'center-left-top'], ['center-top', 'center-right-top'],
    ['center-left-top', 'center-left-bottom'], ['center-left-bottom', 'center-right-bottom'], ['center-right-bottom', 'center-right-top'],
    ['center-left-bottom', 'west-lift'], ['center-right-bottom', 'east-escalator'],
  ];
  const CONNECTORS = [
    { id: 'west-lift', label: 'Lift', cost: 54 },
    { id: 'east-escalator', label: 'Eskalator', cost: 43 },
  ];

  const state = {
    floor: 1,
    selectedStoreId: null,
    activeZone: null,
    route: null,
    viewBox: { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT },
    favorites: loadFavorites(),
    messageTimer: 0,
    toastTimer: 0,
    isPanning: false,
    dragStart: null,
    suppressZoneClick: false,
  };

  const refs = {
    floorList: document.getElementById('floorList'),
    areaList: document.getElementById('areaList'),
    nearbyZones: document.getElementById('nearbyZones'),
    map: document.getElementById('mallMap'),
    world: document.getElementById('mapWorld'),
    mapStage: document.getElementById('mapStage'),
    floorTitle: document.getElementById('mapFloorTitle'),
    placeCount: document.getElementById('mapPlaceCount'),
    searchBox: document.getElementById('searchBox'),
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    clearSearchButton: document.getElementById('clearSearchButton'),
    originSelect: document.getElementById('originSelect'),
    destinationSelect: document.getElementById('destinationSelect'),
    routeButton: document.getElementById('routeButton'),
    routeResult: document.getElementById('routeResult'),
    detailPanel: document.getElementById('detailPanel'),
    mapMessage: document.getElementById('mapMessage'),
    toast: document.getElementById('toast'),
    savedButton: document.getElementById('savedButton'),
  };

  function loadFavorites() {
    try {
      const value = JSON.parse(localStorage.getItem('market-ai-favorites') || '[]');
      return new Set(Array.isArray(value) ? value.filter((id) => typeof id === 'string') : []);
    } catch (_error) {
      return new Set();
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem('market-ai-favorites', JSON.stringify([...state.favorites]));
    } catch (_error) {
      showToast('Saqlangan joylarni qurilmada saqlab bo‘lmadi.');
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  }

  function svgElement(tag, attributes = {}, text = null) {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text !== null) node.textContent = text;
    return node;
  }

  function iconSvg(kind, color = 'currentColor') {
    const paths = {
      shopping: '<path d="M4.2 7.5h11.6l-.9 9H5.1l-.9-9Z"/><path d="M7 7.5a3 3 0 0 1 6 0"/>',
      food: '<path d="M5 3.5v5.8M7.5 3.5v5.8M10 3.5v5.8M7.5 9.3v7.2M15.2 3.5v13"/><path d="M15.2 3.5c2.3 1.4 2.3 4.2 0 5.4"/>',
      entertainment: '<path d="m10 2.7 2.1 4.4 4.9.7-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L3 7.8l4.9-.7L10 2.7Z"/>',
    };
    return `<svg viewBox="0 0 20 20" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind] || paths.shopping}</svg>`;
  }

  function storeTheme(kind) {
    if (kind === 'food') return { color: '#d88b39', bg: '#fff1df' };
    if (kind === 'entertainment') return { color: '#e47765', bg: '#fff0ec' };
    return { color: '#169a84', bg: '#e8f7f3' };
  }

  function buildStaticControls() {
    refs.floorList.innerHTML = FLOORS.map((floor) => `
      <button class="floor-button${floor === state.floor ? ' is-active' : ''}" type="button" data-floor="${floor}" aria-label="${FLOOR_NAMES[floor]}" aria-pressed="${floor === state.floor}">
        <strong>${floor}</strong><span>QAVAT</span>
      </button>`).join('');

    const areaButtons = AREAS.map((area) => `
      <button class="area-button" type="button" data-area="${area.id}" style="--area-color:${area.color}" aria-label="${escapeHTML(area.name)} hududini xaritada ko‘rsatish">
        <i class="area-swatch" aria-hidden="true"></i><span>${escapeHTML(area.name)}</span>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8h8m-3-3 3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`).join('');
    refs.areaList.innerHTML = areaButtons;
    refs.nearbyZones.innerHTML = AREAS.map((area) => `
      <button class="nearby-zone" type="button" data-area="${area.id}" style="--area-color:${area.color}"><i aria-hidden="true"></i>${escapeHTML(area.name)}</button>`).join('');

    refs.originSelect.innerHTML = ORIGINS.map((origin) => `<option value="${origin.id}">${escapeHTML(origin.name)}</option>`).join('');
    refs.destinationSelect.innerHTML = '<option value="">Do‘konni tanlang...</option>' + FLOORS.map((floor) => {
      const options = FLOOR_STORES[floor].map((store) => `<option value="${store.id}">${escapeHTML(store.name)} · ${escapeHTML(store.unit)}</option>`).join('');
      return `<optgroup label="${FLOOR_NAMES[floor]}">${options}</optgroup>`;
    }).join('');
  }

  function render() {
    renderFloorControls();
    renderMap();
    renderDetails();
    renderRouteResult();
    updateRouteButton();
  }

  function renderFloorControls() {
    refs.floorList.querySelectorAll('[data-floor]').forEach((button) => {
      const active = Number(button.dataset.floor) === state.floor;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-area]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.area === state.activeZone);
    });
    refs.floorTitle.textContent = FLOOR_NAMES[state.floor];
    const count = FLOOR_STORES[state.floor].length;
    refs.placeCount.textContent = `${count} ta joy`;
  }

  function drawBuildingBase(layer) {
    const defs = svgElement('defs');
    const shadow = svgElement('filter', { id: 'soft-shadow', x: '-25%', y: '-25%', width: '150%', height: '160%' });
    shadow.append(svgElement('feDropShadow', { dx: 0, dy: 3, stdDeviation: 3, 'flood-color': '#223c57', 'flood-opacity': .09 }));
    defs.append(shadow);
    layer.append(defs);
    layer.append(svgElement('rect', { x: 0, y: 0, width: MAP_WIDTH, height: MAP_HEIGHT, fill: '#f8fafb' }));
    layer.append(svgElement('rect', { x: 55, y: 38, width: 1010, height: 684, rx: 36, fill: '#fff', stroke: '#e1e8ed', 'stroke-width': 1.4 }));
    layer.append(svgElement('rect', { x: 65, y: 48, width: 990, height: 664, rx: 29, fill: '#f5f7f8', stroke: '#eef1f3', 'stroke-width': 1 }));

    const fills = {
      north: '#fbf6ed', west: '#eef3f8', central: '#f0f3f6', east: '#eef3f8', south: '#fbf6ed',
    };
    const zoneRects = {
      north: [92, 76, 936, 147, 19],
      west: [77, 242, 283, 320, 18],
      central: [380, 242, 360, 320, 18],
      east: [760, 242, 283, 320, 18],
      south: [92, 580, 936, 96, 18],
    };
    Object.entries(zoneRects).forEach(([id, [x, y, width, height, radius]]) => {
      const rect = svgElement('rect', {
        x, y, width, height, rx: radius, fill: fills[id], stroke: '#e8edf0', 'stroke-width': 1,
        class: `map-zone${state.activeZone === id ? ' is-zone-active' : ''}`,
        'data-zone': id, tabindex: '0', role: 'button', 'aria-label': AREA_BY_ID[id].name,
      });
      layer.append(rect);
    });

    // Walkways: a simple, legible schematic network around the central park.
    const corridorPaths = [
      'M 100 250 H 1020',
      'M 350 250 V 560',
      'M 770 250 V 560',
      'M 350 560 H 770',
      'M 560 250 V 322',
      'M 395 322 H 725 V 510 H 395 Z',
      'M 395 510 L 350 560',
      'M 725 510 L 770 560',
    ];
    corridorPaths.forEach((d) => layer.append(svgElement('path', { d, fill: 'none', stroke: '#e8dfd1', 'stroke-width': 31, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })));
    corridorPaths.forEach((d) => layer.append(svgElement('path', { d, fill: 'none', stroke: '#fffdfa', 'stroke-width': 23, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })));

    // Small storefront outlines make each wing read like an indoor concourse.
    const shopBlocks = [];
    for (let x = 120; x < 1000; x += 47) {
      shopBlocks.push([x, 83, 37, 17], [x, 199, 37, 16]);
    }
    for (let y = 270; y < 550; y += 38) {
      shopBlocks.push([91, y, 17, 27], [329, y, 16, 27], [775, y, 16, 27], [1010, y, 17, 27]);
    }
    for (let x = 120; x < 1000; x += 47) shopBlocks.push([x, 596, 37, 16], [x, 644, 37, 16]);
    shopBlocks.forEach(([x, y, width, height]) => layer.append(svgElement('rect', { x, y, width, height, rx: 4, fill: '#fff', stroke: '#e6ebee', 'stroke-width': 1 })));

    const zoneLabels = [
      { id: 'north', name: 'North Garden', x: 560, y: 111, kicker: 'NORTH WING', anchor: 'middle' },
      { id: 'west', name: 'West Market', x: 220, y: 292, kicker: 'WEST WING', anchor: 'middle' },
      { id: 'east', name: 'East Broadway', x: 900, y: 292, kicker: 'EAST WING', anchor: 'middle' },
      { id: 'central', name: 'Central Parkway', x: 560, y: 305, kicker: 'MALL CENTER', anchor: 'middle' },
      { id: 'south', name: 'South Avenue', x: 560, y: 602, kicker: 'SOUTH WING', anchor: 'middle' },
    ];
    zoneLabels.forEach((label) => {
      layer.append(svgElement('text', { x: label.x, y: label.y - 10, 'text-anchor': label.anchor, class: 'zone-kicker' }, label.kicker));
      layer.append(svgElement('text', { x: label.x, y: label.y + 9, 'text-anchor': label.anchor, class: 'zone-name' }, label.name));
    });

    // Central attraction area (present across the floor schematics).
    layer.append(svgElement('rect', { x: 437, y: 349, width: 246, height: 145, rx: 27, fill: '#e4f5f2', stroke: '#c9e9e1', 'stroke-width': 1.5 }));
    layer.append(svgElement('path', { d: 'M 450 380 C 472 355, 501 357, 518 376 S 558 397, 575 376 S 625 355, 666 382', fill: 'none', stroke: '#d0eee7', 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
    layer.append(svgElement('path', { d: 'M 451 462 C 478 483, 500 481, 521 460 S 561 438, 583 459 S 628 486, 667 456', fill: 'none', stroke: '#d0eee7', 'stroke-width': 2.5, 'stroke-linecap': 'round' }));
    layer.append(svgElement('circle', { cx: 560, cy: 420, r: 22, fill: '#fff', stroke: '#d9eee9', 'stroke-width': 1.2 }));
    layer.append(svgElement('circle', { cx: 560, cy: 420, r: 16, fill: '#ff9b57' }));
    layer.append(svgElement('path', { d: 'm560 409 2.8 7.4 7.8.3-6.1 4.8 2.1 7.5-6.6-4.2-6.6 4.2 2.1-7.5-6.1-4.8 7.8-.3L560 409Z', fill: '#fff' }));
    layer.append(svgElement('text', { x: 560, y: 461, 'text-anchor': 'middle', fill: '#318f80', 'font-size': 10, 'font-weight': 800 }, 'Nickelodeon Universe'));
    layer.append(svgElement('text', { x: 560, y: 476, 'text-anchor': 'middle', fill: '#7aa89f', 'font-size': 7, 'font-weight': 700, 'letter-spacing': 1 }, 'THEME PARK'));

    // Two vertical circulation points connect the four floor maps.
    drawConnector(layer, 350, 560, 'LIFT', '#7696c6');
    drawConnector(layer, 770, 560, 'ESCALATOR', '#ce9b50');
    drawEntrance(layer, 100, 250, 'WEST');
    drawEntrance(layer, 560, 250, 'NORTH');
    drawEntrance(layer, 1020, 250, 'EAST');
    drawEntrance(layer, 560, 560, 'SOUTH');
  }

  function drawConnector(layer, x, y, label, color) {
    layer.append(svgElement('circle', { cx: x, cy: y, r: 12, fill: '#fff', stroke: '#dfe7eb', 'stroke-width': 1.2 }));
    layer.append(svgElement('circle', { cx: x, cy: y, r: 8, fill: color }));
    if (label === 'LIFT') {
      layer.append(svgElement('path', { d: `M ${x - 3} ${y + 3} v-6 m0 0 -2 2 m2-2 2 2 M ${x + 3} ${y - 3} v6 m0 0 -2-2 m2 2 2-2`, fill: 'none', stroke: '#fff', 'stroke-width': 1.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    } else {
      layer.append(svgElement('path', { d: `M ${x - 3} ${y + 3} h6 m0 0 -2-2 m2 2 -2 2 M ${x + 3} ${y - 3} h-6 m0 0 2-2 m-2 2 2 2`, fill: 'none', stroke: '#fff', 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    }
    layer.append(svgElement('text', { x, y: y + 25, 'text-anchor': 'middle', fill: '#8190a0', 'font-size': 6.5, 'font-weight': 800, 'letter-spacing': .7 }, label));
  }

  function drawEntrance(layer, x, y, label) {
    layer.append(svgElement('circle', { cx: x, cy: y, r: 7, fill: '#fff', stroke: '#cbd5dc', 'stroke-width': 1.2 }));
    layer.append(svgElement('circle', { cx: x, cy: y, r: 3.5, fill: '#19a98f' }));
    const offset = label === 'WEST' ? 11 : label === 'EAST' ? -11 : 0;
    const anchor = label === 'WEST' ? 'start' : label === 'EAST' ? 'end' : 'middle';
    const labelY = label === 'NORTH' ? y - 13 : label === 'SOUTH' ? y + 14 : y + 3;
    layer.append(svgElement('text', { x: x + offset, y: labelY, 'text-anchor': anchor, fill: '#8d9aa8', 'font-size': 6.5, 'font-weight': 800, 'letter-spacing': .8 }, `${label} ENTRANCE`));
  }

  function renderMap() {
    refs.world.replaceChildren();
    drawBuildingBase(refs.world);
    if (state.route) drawRouteOverlay(refs.world);
    FLOOR_STORES[state.floor].forEach((store) => refs.world.append(makeStoreMarker(store)));
    refs.map.setAttribute('viewBox', `${state.viewBox.x} ${state.viewBox.y} ${state.viewBox.w} ${state.viewBox.h}`);
    refs.map.setAttribute('aria-label', `${FLOOR_NAMES[state.floor]} — do‘konlar va hududlarning sxematik xaritasi`);
  }

  function makeStoreMarker(store) {
    const theme = storeTheme(store.kind);
    const selected = state.selectedStoreId === store.id;
    const g = svgElement('g', {
      class: `poi-marker${selected ? ' is-selected' : ''}`,
      transform: `translate(${store.x} ${store.y})`,
      'data-store-id': store.id,
      tabindex: '0',
      role: 'button',
      'aria-label': `${store.name}, unit ${store.unit}, ${FLOOR_NAMES[store.floor]}, ${AREA_BY_ID[store.zone].name}`,
    });
    g.append(svgElement('title', {}, `${store.name} · ${store.unit} · ${FLOOR_NAMES[store.floor]}`));
    g.append(svgElement('rect', { x: -65, y: -21, width: 130, height: 42, rx: 11, class: 'poi-card', filter: 'url(#soft-shadow)' }));
    g.append(svgElement('circle', { cx: -47, cy: 0, r: 11.5, fill: theme.bg }));
    const iconGroup = svgElement('g', { transform: 'translate(-55 -8)', class: 'poi-symbol', stroke: theme.color });
    if (store.kind === 'food') {
      iconGroup.append(svgElement('path', { d: 'M3 1v5m2-5v5m2-5v5M5 6v8m6-13v13' }));
      iconGroup.append(svgElement('path', { d: 'M11 1c2 1.2 2 3.8 0 5' }));
    } else if (store.kind === 'entertainment') {
      iconGroup.append(svgElement('path', { d: 'm8 1.5 1.8 3.7 4.1.6-3 2.8.7 4.1-3.6-1.9-3.6 1.9.7-4.1-3-2.8 4.1-.6L8 1.5Z' }));
    } else {
      iconGroup.append(svgElement('path', { d: 'M2 5h12l-1 9H3L2 5Z M5 5a3 3 0 0 1 6 0' }));
    }
    g.append(iconGroup);
    const shortName = store.name.length > 17 ? `${store.name.slice(0, 15)}…` : store.name;
    g.append(svgElement('text', { x: -30, y: -2, class: 'poi-name' }, shortName));
    g.append(svgElement('text', { x: -30, y: 10, class: 'poi-unit' }, `UNIT ${store.unit}`));
    if (selected) g.append(svgElement('circle', { cx: 51, cy: -14, r: 3.5, class: 'poi-dot', fill: '#19a98f' }));
    return g;
  }

  function drawRouteOverlay(layer) {
    const route = state.route;
    if (!route) return;
    const segments = route.segments.filter((segment) => segment.floor === state.floor && segment.points.length > 0);
    segments.forEach((segment) => {
      const d = segment.points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
      layer.append(svgElement('path', { d, class: 'route-underlay' }));
      layer.append(svgElement('path', { d, class: 'route-line' }));
      if (segment.floor === route.start.floor) {
        layer.append(svgElement('circle', { cx: route.start.x, cy: route.start.y, r: 12, class: 'route-endpoint-ring' }));
        layer.append(svgElement('circle', { cx: route.start.x, cy: route.start.y, r: 7, class: 'route-endpoint route-endpoint-start' }));
        addRouteLabel(layer, route.start.x + 13, route.start.y - 17, 'BOSHLANISH');
      }
      if (segment.floor === route.destination.floor) {
        layer.append(svgElement('circle', { cx: route.destination.x, cy: route.destination.y, r: 12, class: 'route-endpoint-ring' }));
        layer.append(svgElement('circle', { cx: route.destination.x, cy: route.destination.y, r: 7, class: 'route-endpoint route-endpoint-finish' }));
        addRouteLabel(layer, route.destination.x + 13, route.destination.y - 17, 'MANZIL');
      }
    });
  }

  function addRouteLabel(layer, x, y, label) {
    const width = label === 'BOSHLANISH' ? 58 : 42;
    layer.append(svgElement('rect', { x, y: y - 9, width, height: 16, rx: 6, class: 'route-point-label' }));
    layer.append(svgElement('text', { x: x + 5, y: y + 2, class: 'route-point-text' }, label));
  }

  function renderDetails() {
    const store = state.selectedStoreId ? STORE_BY_ID[state.selectedStoreId] : null;
    if (!store) {
      refs.detailPanel.innerHTML = `
        <div class="detail-empty">
          <span class="empty-illustration" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m3 7 6-3 6 3 6-3v14l-6 3-6-3-6 3V7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4.4v13.8M15 7v13.8" stroke="currentColor" stroke-width="1.6"/></svg></span>
          <h2>Xaritadan joy tanlang</h2>
          <p>Do‘kon belgisini bosing yoki qidiruvdan nom va unit raqamini kiriting.</p>
          <div class="detail-instruction"><span>↗</span> Do‘kon haqida batafsil ma’lumot</div>
        </div>`;
      return;
    }
    const theme = storeTheme(store.kind);
    const favorite = state.favorites.has(store.id);
    refs.detailPanel.innerHTML = `
      <div class="detail-topline">
        <div class="detail-identity">
          <span class="detail-store-icon" style="--detail-color:${theme.color};--detail-bg:${theme.bg}">${iconSvg(store.kind)}</span>
          <div class="detail-name-block"><h2>${escapeHTML(store.name)}</h2><span class="unit-tag">UNIT ${escapeHTML(store.unit)}</span></div>
        </div>
        <button class="favorite-button${favorite ? ' is-favorite' : ''}" type="button" data-favorite="${store.id}" aria-label="${favorite ? 'Saqlanganlardan olib tashlash' : 'Saqlanganlarga qo‘shish'}" aria-pressed="${favorite}" title="${favorite ? 'Saqlanganlardan olib tashlash' : 'Saqlash'}">${favorite ? '♥' : '♡'}</button>
      </div>
      <p class="detail-description">${escapeHTML(store.description)}</p>
      <div class="detail-meta">
        <div class="detail-meta-row"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 3.5h12v13H4v-13Z" stroke="currentColor" stroke-width="1.4"/><path d="M7 3.5v13m6-13v13M4 8h3m6 0h3m-12 4h3m6 0h3" stroke="currentColor" stroke-width="1.2"/></svg><span>${FLOOR_NAMES[store.floor]}</span></div>
        <div class="detail-meta-row"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.2 8.2c0 4.6-6.2 9.2-6.2 9.2S3.8 12.8 3.8 8.2a6.2 6.2 0 1 1 12.4 0Z" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="8.2" r="2" stroke="currentColor" stroke-width="1.4"/></svg><span>${escapeHTML(AREA_BY_ID[store.zone].name)}</span></div>
        <div class="detail-meta-row"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m10 2.7 2 4.1 4.6.7-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.7 2-4.1Z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/></svg><span>${escapeHTML(store.category)}</span></div>
      </div>
      <button class="primary-button detail-route-button" type="button" data-route-to="${store.id}"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="5.5" cy="15" r="2" stroke="currentColor" stroke-width="1.5"/><circle cx="14.5" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/><path d="M7.5 15h2.2a2.5 2.5 0 0 0 2.5-2.5V9.5A2.5 2.5 0 0 1 14.7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg> Shu joyga yo‘nalish</button>`;
  }

  function updateRouteButton() {
    refs.routeButton.disabled = !refs.destinationSelect.value;
  }

  function renderRouteResult() {
    const route = state.route;
    if (!route) {
      refs.routeResult.hidden = true;
      refs.routeResult.innerHTML = '';
      return;
    }
    refs.routeResult.hidden = false;
    const connectors = [...new Set(route.transitions.map((transition) => transition.name))].join(' + ');
    const floorLabel = route.floorChanges === 0 ? 'Bir qavat' : `${route.floorChanges} marta · ${connectors}`;
    const steps = route.floors.map((floor) => FLOOR_NAMES[floor]).join(' → ');
    const floorButtons = route.floors.map((floor) => `
      <button class="route-floor-button${state.floor === floor ? ' is-active' : ''}" type="button" data-route-floor="${floor}" aria-pressed="${state.floor === floor}">${FLOOR_NAMES[floor]}</button>`).join('');
    refs.routeResult.innerHTML = `
      <div class="route-result-top"><div><strong>${escapeHTML(route.destination.name)}</strong><small>${escapeHTML(route.origin.name)} → ${escapeHTML(steps)}</small></div>
        <div class="route-stats"><span class="route-stat"><strong>${route.minutes}</strong><span>daqiqa</span></span><span class="route-stat"><strong>${route.meters} m</strong><span>taxminiy</span></span></div>
      </div>
      <div class="route-floor-label">YO‘NALISH QAVATLARI · ${escapeHTML(floorLabel.toUpperCase())}</div>
      <div class="route-floor-buttons">${floorButtons}</div>
      <button class="clear-route-button" type="button" id="clearRouteButton">Yo‘nalishni tozalash</button>`;
  }

  function renderSearchResults(query) {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) {
      closeSearchResults();
      return;
    }
    const matches = STORES.filter((store) => normalize(`${store.name} ${store.unit} ${FLOOR_NAMES[store.floor]} ${AREA_BY_ID[store.zone].name}`).includes(normalizedQuery)).slice(0, 8);
    const content = matches.length ? matches.map((store) => {
      const theme = storeTheme(store.kind);
      return `<button class="search-result" type="button" role="option" aria-selected="false" data-search-store="${store.id}" style="--result-color:${theme.color};--result-bg:${theme.bg}">
        <span class="result-icon">${iconSvg(store.kind, theme.color)}</span>
        <span class="result-copy"><strong>${escapeHTML(store.name)}</strong><small>${FLOOR_NAMES[store.floor]} · ${escapeHTML(AREA_BY_ID[store.zone].name)}</small></span>
        <span class="result-unit">${escapeHTML(store.unit)}</span>
      </button>`;
    }).join('') : '<div class="search-empty">Mos joy topilmadi. Do‘kon nomi yoki unit raqamini tekshiring.</div>';
    refs.searchResults.innerHTML = `<div class="search-results-label">${matches.length ? `NATIJALAR · ${matches.length}` : 'QIDIRUV'}</div>${content}`;
    refs.searchResults.hidden = false;
    refs.searchInput.setAttribute('aria-expanded', 'true');
    refs.clearSearchButton.hidden = false;
  }

  function normalize(value) {
    return String(value).toLocaleLowerCase('uz').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function closeSearchResults() {
    refs.searchResults.hidden = true;
    refs.searchInput.setAttribute('aria-expanded', 'false');
  }

  function chooseStore(storeId, { focus = true } = {}) {
    const store = STORE_BY_ID[storeId];
    if (!store) return;
    if (state.route && state.route.destination.id !== store.id) state.route = null;
    state.selectedStoreId = store.id;
    state.activeZone = store.zone;
    refs.destinationSelect.value = store.id;
    if (state.floor !== store.floor) {
      state.floor = store.floor;
      state.viewBox = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };
    }
    if (focus) focusView(store.x, store.y, 760);
    render();
    closeSearchResults();
    if (refs.searchInput.value) refs.searchInput.value = '';
    refs.clearSearchButton.hidden = true;
  }

  function setFloor(floor, { keepView = false } = {}) {
    if (!FLOORS.includes(floor)) return;
    if (state.floor === floor) {
      if (!keepView) resetViewBox();
      render();
      return;
    }
    state.floor = floor;
    state.activeZone = null;
    if (!keepView) state.viewBox = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };
    render();
  }

  function focusView(cx, cy, width = 760) {
    const boundedWidth = Math.max(350, Math.min(MAP_WIDTH, width));
    const height = boundedWidth * MAP_HEIGHT / MAP_WIDTH;
    const x = Math.max(0, Math.min(MAP_WIDTH - boundedWidth, cx - boundedWidth / 2));
    const y = Math.max(0, Math.min(MAP_HEIGHT - height, cy - height / 2));
    state.viewBox = { x, y, w: boundedWidth, h: height };
  }

  function focusArea(areaId) {
    const area = AREA_BY_ID[areaId];
    if (!area) return;
    state.activeZone = areaId;
    focusView(area.center.x, area.center.y, areaId === 'north' || areaId === 'south' ? 820 : 680);
    render();
    showMapMessage(`${area.name} hududi`);
  }

  function resetViewBox() {
    state.viewBox = { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT };
    renderMap();
  }

  function zoomAt(clientX, clientY, factor) {
    const box = state.viewBox;
    const rect = refs.map.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width;
    const py = (clientY - rect.top) / rect.height;
    const anchorX = box.x + px * box.w;
    const anchorY = box.y + py * box.h;
    const nextWidth = Math.max(290, Math.min(MAP_WIDTH, box.w * factor));
    const nextHeight = nextWidth * MAP_HEIGHT / MAP_WIDTH;
    const x = anchorX - px * nextWidth;
    const y = anchorY - py * nextHeight;
    state.viewBox = {
      x: Math.max(0, Math.min(MAP_WIDTH - nextWidth, x)),
      y: Math.max(0, Math.min(MAP_HEIGHT - nextHeight, y)),
      w: nextWidth,
      h: nextHeight,
    };
    renderMap();
  }

  function showMapMessage(message) {
    refs.mapMessage.textContent = message;
    refs.mapMessage.hidden = false;
    window.clearTimeout(state.messageTimer);
    state.messageTimer = window.setTimeout(() => { refs.mapMessage.hidden = true; }, 2300);
  }

  function showToast(message) {
    refs.toast.textContent = message;
    refs.toast.classList.add('is-visible');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => refs.toast.classList.remove('is-visible'), 2500);
  }

  function buildGraph() {
    const nodes = new Map();
    const edges = new Map();
    const addNode = (node) => {
      nodes.set(node.id, node);
      if (!edges.has(node.id)) edges.set(node.id, []);
    };
    const addEdge = (a, b, weight = null, kind = 'walk') => {
      const nodeA = nodes.get(a);
      const nodeB = nodes.get(b);
      if (!nodeA || !nodeB) return;
      const distance = weight === null ? Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y) : weight;
      edges.get(a).push({ to: b, weight: distance, kind });
      edges.get(b).push({ to: a, weight: distance, kind });
    };

    FLOORS.forEach((floor) => {
      NETWORK_NODES.forEach((node) => addNode({ ...node, id: `f${floor}-${node.id}`, floor }));
      NETWORK_EDGES.forEach(([a, b]) => addEdge(`f${floor}-${a}`, `f${floor}-${b}`));
    });
    FLOORS.slice(0, -1).forEach((floor) => {
      CONNECTORS.forEach((connector) => addEdge(`f${floor}-${connector.id}`, `f${floor + 1}-${connector.id}`, connector.cost, connector.label));
    });
    return { nodes, edges, addNode, addEdge };
  }

  function createRoute(originId, storeId) {
    const origin = ORIGINS.find((entry) => entry.id === originId) || ORIGINS[0];
    const destination = STORE_BY_ID[storeId];
    if (!destination) return null;
    const graph = buildGraph();
    const startId = '__start__';
    const finishId = '__finish__';
    graph.addNode({ id: startId, floor: origin.floor, x: origin.x, y: origin.y });
    graph.addNode({ id: finishId, floor: destination.floor, x: destination.x, y: destination.y });
    connectNearest(graph, startId, origin.floor, origin.x, origin.y);
    connectNearest(graph, finishId, destination.floor, destination.x, destination.y);

    const distances = new Map([[startId, 0]]);
    const previous = new Map();
    const unvisited = new Set(graph.nodes.keys());
    while (unvisited.size) {
      let current = null;
      let best = Infinity;
      for (const id of unvisited) {
        const distance = distances.get(id) ?? Infinity;
        if (distance < best) { current = id; best = distance; }
      }
      if (current === null || best === Infinity || current === finishId) break;
      unvisited.delete(current);
      for (const edge of graph.edges.get(current) || []) {
        if (!unvisited.has(edge.to)) continue;
        const candidate = best + edge.weight;
        if (candidate < (distances.get(edge.to) ?? Infinity)) {
          distances.set(edge.to, candidate);
          previous.set(edge.to, current);
        }
      }
    }

    const pathIds = [];
    let cursor = finishId;
    while (cursor) {
      pathIds.unshift(cursor);
      if (cursor === startId) break;
      cursor = previous.get(cursor);
    }
    if (pathIds[0] !== startId) return null;
    const path = pathIds.map((id) => graph.nodes.get(id));
    const segments = [];
    path.forEach((node) => {
      let segment = segments[segments.length - 1];
      if (!segment || segment.floor !== node.floor) {
        segment = { floor: node.floor, points: [] };
        segments.push(segment);
      }
      const lastPoint = segment.points[segment.points.length - 1];
      if (!lastPoint || lastPoint.x !== node.x || lastPoint.y !== node.y) segment.points.push({ x: node.x, y: node.y });
    });
    const floors = [...new Set(path.map((node) => node.floor))];
    const transitions = [];
    path.forEach((node, index) => {
      if (index === 0 || path[index - 1].floor === node.floor) return;
      const connectorId = path[index - 1].id.replace(/^f\d+-/, '');
      const connector = CONNECTORS.find((entry) => entry.id === connectorId);
      transitions.push({ from: path[index - 1].floor, to: node.floor, name: connector?.label || 'Lift' });
    });
    const floorChanges = transitions.length;
    const rawDistance = distances.get(finishId) || 0;
    const meters = Math.max(35, Math.round(rawDistance * 1.15));
    return {
      origin,
      destination,
      start: { floor: origin.floor, x: origin.x, y: origin.y },
      segments,
      floors,
      transitions,
      floorChanges,
      meters,
      minutes: Math.max(1, Math.ceil(meters / 78)),
    };
  }

  function connectNearest(graph, temporaryId, floor, x, y) {
    const candidates = [...graph.nodes.values()].filter((node) => node.floor === floor && node.id !== temporaryId);
    candidates.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
    if (candidates.length) graph.addEdge(temporaryId, candidates[0].id);
  }

  function drawRoute() {
    const storeId = refs.destinationSelect.value;
    if (!storeId) return;
    const route = createRoute(refs.originSelect.value, storeId);
    if (!route) {
      showToast('Yo‘nalish topilmadi. Boshqa boshlang‘ich nuqtani tanlang.');
      return;
    }
    state.route = route;
    state.selectedStoreId = route.destination.id;
    state.activeZone = route.destination.zone;
    state.floor = route.destination.floor;
    const relevantPoints = route.segments.filter((segment) => segment.floor === state.floor).flatMap((segment) => segment.points);
    if (relevantPoints.length) {
      const center = relevantPoints.reduce((sum, point) => ({ x: sum.x + point.x / relevantPoints.length, y: sum.y + point.y / relevantPoints.length }), { x: 0, y: 0 });
      focusView(center.x, center.y, 800);
    }
    render();
    showMapMessage(`Yo‘nalish tayyor · ${route.meters} m atrofida`);
  }

  function focusRouteFloor(floor) {
    if (!state.route || !state.route.floors.includes(floor)) return;
    state.floor = floor;
    const segment = state.route.segments.find((entry) => entry.floor === floor);
    if (segment?.points.length) {
      const center = segment.points.reduce((sum, point) => ({ x: sum.x + point.x / segment.points.length, y: sum.y + point.y / segment.points.length }), { x: 0, y: 0 });
      focusView(center.x, center.y, 820);
    }
    render();
  }

  function toggleFavorite(storeId) {
    if (state.favorites.has(storeId)) {
      state.favorites.delete(storeId);
      showToast('Saqlangan joylardan olib tashlandi.');
    } else {
      state.favorites.add(storeId);
      showToast('Joy saqlanganlarga qo‘shildi.');
    }
    saveFavorites();
    renderDetails();
    renderSavedPopover();
  }

  function renderSavedPopover() {
    const popover = document.getElementById('savedPopover');
    const list = document.getElementById('savedList');
    if (!popover || !list) return;
    const savedStores = [...state.favorites].map((id) => STORE_BY_ID[id]).filter(Boolean);
    if (!savedStores.length) {
      list.innerHTML = '<div class="saved-empty">Hali saqlangan joy yo‘q.<br>Do‘kon ma’lumotlaridagi ♡ tugmasini bosing.</div>';
      return;
    }
    list.innerHTML = savedStores.map((store) => `
      <button class="saved-item" type="button" data-saved-store="${store.id}">
        <span class="saved-heart">♥</span><span><strong>${escapeHTML(store.name)}</strong><small>${FLOOR_NAMES[store.floor]} · ${escapeHTML(store.unit)}</small></span><span class="saved-arrow">↗</span>
      </button>`).join('');
  }

  function setSavedPopoverVisible(visible) {
    const popover = document.getElementById('savedPopover');
    if (!popover) return;
    popover.hidden = !visible;
    refs.savedButton.setAttribute('aria-expanded', String(visible));
    if (visible) renderSavedPopover();
  }

  function toggleSavedPopover() {
    const popover = document.getElementById('savedPopover');
    if (popover) setSavedPopoverVisible(popover.hidden);
  }

  function handleMapPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest('.poi-marker')) return;
    state.dragStart = { x: event.clientX, y: event.clientY, viewBox: { ...state.viewBox }, moved: false };
    refs.map.setPointerCapture?.(event.pointerId);
  }

  function handleMapPointerMove(event) {
    if (!state.dragStart) return;
    const dxPixels = event.clientX - state.dragStart.x;
    const dyPixels = event.clientY - state.dragStart.y;
    if (Math.abs(dxPixels) + Math.abs(dyPixels) > 4) state.dragStart.moved = true;
    if (!state.dragStart.moved) return;
    const rect = refs.map.getBoundingClientRect();
    const start = state.dragStart.viewBox;
    const x = Math.max(0, Math.min(MAP_WIDTH - start.w, start.x - dxPixels * start.w / rect.width));
    const y = Math.max(0, Math.min(MAP_HEIGHT - start.h, start.y - dyPixels * start.h / rect.height));
    state.viewBox = { ...start, x, y };
    refs.map.classList.add('is-panning');
    refs.map.setAttribute('viewBox', `${x} ${y} ${start.w} ${start.h}`);
  }

  function handleMapPointerUp() {
    if (!state.dragStart) return;
    if (state.dragStart.moved) {
      state.suppressZoneClick = true;
      window.setTimeout(() => { state.suppressZoneClick = false; }, 80);
    }
    state.dragStart = null;
    refs.map.classList.remove('is-panning');
  }

  function registerEvents() {
    refs.floorList.addEventListener('click', (event) => {
      const button = event.target.closest('[data-floor]');
      if (button) setFloor(Number(button.dataset.floor));
    });

    document.addEventListener('click', (event) => {
      const areaButton = event.target.closest('[data-area]');
      if (areaButton) focusArea(areaButton.dataset.area);
      const storeMarker = event.target.closest('[data-store-id]');
      if (storeMarker) chooseStore(storeMarker.dataset.storeId, { focus: false });
      const searchResult = event.target.closest('[data-search-store]');
      if (searchResult) chooseStore(searchResult.dataset.searchStore);
      const routeDestination = event.target.closest('[data-route-to]');
      if (routeDestination) {
        refs.destinationSelect.value = routeDestination.dataset.routeTo;
        updateRouteButton();
        document.getElementById('routeCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
        drawRoute();
      }
      const favoriteButton = event.target.closest('[data-favorite]');
      if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite);
      const routeFloor = event.target.closest('[data-route-floor]');
      if (routeFloor) focusRouteFloor(Number(routeFloor.dataset.routeFloor));
      const savedStore = event.target.closest('[data-saved-store]');
      if (savedStore) {
        setSavedPopoverVisible(false);
        chooseStore(savedStore.dataset.savedStore);
      }
      if (event.target.closest('#clearRouteButton')) {
        state.route = null;
        render();
      }
      if (event.target.closest('#closeSavedButton')) setSavedPopoverVisible(false);
      if (!event.target.closest('.search-box') && !event.target.closest('[data-quick-query]')) closeSearchResults();
      if (!event.target.closest('.topbar-right')) setSavedPopoverVisible(false);
    });

    refs.searchInput.addEventListener('input', (event) => renderSearchResults(event.currentTarget.value));
    refs.searchInput.addEventListener('focus', () => {
      if (refs.searchInput.value.trim()) renderSearchResults(refs.searchInput.value);
    });
    refs.clearSearchButton.addEventListener('click', () => {
      refs.searchInput.value = '';
      refs.clearSearchButton.hidden = true;
      closeSearchResults();
      refs.searchInput.focus();
    });
    document.querySelectorAll('[data-quick-query]').forEach((button) => button.addEventListener('click', () => {
      refs.searchInput.value = button.dataset.quickQuery;
      refs.searchInput.focus();
      renderSearchResults(button.dataset.quickQuery);
    }));
    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        refs.searchInput.focus();
      }
      if (event.key === 'Escape') {
        closeSearchResults();
        setSavedPopoverVisible(false);
      }
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.map-zone')) {
        event.preventDefault();
        focusArea(event.target.dataset.zone);
      }
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.poi-marker')) {
        event.preventDefault();
        chooseStore(event.target.dataset.storeId, { focus: false });
      }
    });

    refs.destinationSelect.addEventListener('change', () => {
      updateRouteButton();
      const selectedId = refs.destinationSelect.value;
      if (!selectedId) return;
      if (state.route && state.route.destination.id !== selectedId) state.route = null;
      const store = STORE_BY_ID[selectedId];
      state.selectedStoreId = selectedId;
      state.activeZone = store.zone;
      if (state.floor !== store.floor) state.floor = store.floor;
      render();
    });
    refs.routeButton.addEventListener('click', drawRoute);
    refs.originSelect.addEventListener('change', () => {
      if (state.route) {
        state.route = null;
        render();
      }
    });
    document.getElementById('zoomInButton').addEventListener('click', () => {
      const rect = refs.map.getBoundingClientRect();
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, .78);
    });
    document.getElementById('zoomOutButton').addEventListener('click', () => {
      const rect = refs.map.getBoundingClientRect();
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 1.28);
    });
    document.getElementById('resetMapButton').addEventListener('click', () => {
      state.activeZone = null;
      resetViewBox();
      showMapMessage('Butun xarita ko‘rsatilmoqda');
    });
    document.getElementById('mapNavButton').addEventListener('click', () => {
      document.querySelector('.map-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('routeNavButton').addEventListener('click', () => {
      document.getElementById('routeCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
      refs.destinationSelect.focus({ preventScroll: true });
    });
    document.getElementById('helpButton').addEventListener('click', () => showToast('Xaritani sudrab ko‘ring, +/− bilan masshtablang. Do‘kon yoki unit raqamini qidiring.'));
    refs.savedButton.addEventListener('click', toggleSavedPopover);
    refs.map.addEventListener('click', (event) => {
      if (state.suppressZoneClick) return;
      const zone = event.target.closest('[data-zone]');
      if (zone) focusArea(zone.dataset.zone);
    });
    refs.map.addEventListener('wheel', (event) => {
      event.preventDefault();
      zoomAt(event.clientX, event.clientY, event.deltaY < 0 ? .88 : 1.14);
    }, { passive: false });
    refs.map.addEventListener('pointerdown', handleMapPointerDown);
    refs.map.addEventListener('pointermove', handleMapPointerMove);
    refs.map.addEventListener('pointerup', handleMapPointerUp);
    refs.map.addEventListener('pointercancel', handleMapPointerUp);
  }

  buildStaticControls();
  render();
  registerEvents();
})();
