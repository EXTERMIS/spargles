// Google-style Metric/Imperial converter

const units = {
    metric: {
        length: [
            { name: 'Yoctometer', abbr: 'ym', toBase: v => v * 1e-24, fromBase: v => v / 1e-24 },
            { name: 'Zeptometer', abbr: 'zm', toBase: v => v * 1e-21, fromBase: v => v / 1e-21 },
            { name: 'Attometer', abbr: 'am', toBase: v => v * 1e-18, fromBase: v => v / 1e-18 },
            { name: 'Femtometer', abbr: 'fm', toBase: v => v * 1e-15, fromBase: v => v / 1e-15 },
            { name: 'Picometer', abbr: 'pm', toBase: v => v * 1e-12, fromBase: v => v / 1e-12 },
            { name: 'Nanometer', abbr: 'nm', toBase: v => v * 1e-9, fromBase: v => v / 1e-9 },
            { name: 'Micrometer', abbr: 'µm', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
            { name: 'Millimeter', abbr: 'mm', toBase: v => v * 1e-3, fromBase: v => v / 1e-3 },
            { name: 'Centimeter', abbr: 'cm', toBase: v => v * 1e-2, fromBase: v => v / 1e-2 },
            { name: 'Decimeter', abbr: 'dm', toBase: v => v * 1e-1, fromBase: v => v / 1e-1 },
            { name: 'Meter', abbr: 'm', toBase: v => v, fromBase: v => v },
            { name: 'Decameter', abbr: 'dam', toBase: v => v * 1e1, fromBase: v => v / 1e1 },
            { name: 'Hectometer', abbr: 'hm', toBase: v => v * 1e2, fromBase: v => v / 1e2 },
            { name: 'Kilometer', abbr: 'km', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
        ],
        area: [
            { name: 'Square yoctometer', abbr: 'ym²', toBase: v => v * 1e-48, fromBase: v => v / 1e-48 },
            { name: 'Square zeptometer', abbr: 'zm²', toBase: v => v * 1e-42, fromBase: v => v / 1e-42 },
            { name: 'Square attometer', abbr: 'am²', toBase: v => v * 1e-36, fromBase: v => v / 1e-36 },
            { name: 'Square femtometer', abbr: 'fm²', toBase: v => v * 1e-30, fromBase: v => v / 1e-30 },
            { name: 'Square picometer', abbr: 'pm²', toBase: v => v * 1e-24, fromBase: v => v / 1e-24 },
            { name: 'Square nanometer', abbr: 'nm²', toBase: v => v * 1e-18, fromBase: v => v / 1e-18 },
            { name: 'Square micrometer', abbr: 'µm²', toBase: v => v * 1e-12, fromBase: v => v / 1e-12 },
            { name: 'Square millimeter', abbr: 'mm²', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
            { name: 'Square centimeter', abbr: 'cm²', toBase: v => v * 1e-4, fromBase: v => v / 1e-4 },
            { name: 'Square decimeter', abbr: 'dm²', toBase: v => v * 1e-2, fromBase: v => v / 1e-2 },
            { name: 'Square meter', abbr: 'm²', toBase: v => v, fromBase: v => v },
            { name: 'Are', abbr: 'a', toBase: v => v * 100, fromBase: v => v / 100 },
            { name: 'Hectare', abbr: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
            { name: 'Square kilometer', abbr: 'km²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
        ],
        volume: [
            { name: 'Cubic yoctometer', abbr: 'ym³', toBase: v => v * 1e-72, fromBase: v => v / 1e-72 },
            { name: 'Cubic zeptometer', abbr: 'zm³', toBase: v => v * 1e-63, fromBase: v => v / 1e-63 },
            { name: 'Cubic attometer', abbr: 'am³', toBase: v => v * 1e-54, fromBase: v => v / 1e-54 },
            { name: 'Cubic femtometer', abbr: 'fm³', toBase: v => v * 1e-45, fromBase: v => v / 1e-45 },
            { name: 'Cubic picometer', abbr: 'pm³', toBase: v => v * 1e-36, fromBase: v => v / 1e-36 },
            { name: 'Cubic nanometer', abbr: 'nm³', toBase: v => v * 1e-27, fromBase: v => v / 1e-27 },
            { name: 'Cubic micrometer', abbr: 'µm³', toBase: v => v * 1e-18, fromBase: v => v / 1e-18 },
            { name: 'Cubic millimeter', abbr: 'mm³', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
            { name: 'Cubic centimeter', abbr: 'cm³', toBase: v => v * 1e-3, fromBase: v => v / 1e-3 },
            { name: 'Milliliter', abbr: 'mL', toBase: v => v * 1e-3, fromBase: v => v / 1e-3 },
            { name: 'Centiliter', abbr: 'cL', toBase: v => v * 1e-2, fromBase: v => v / 1e-2 },
            { name: 'Deciliter', abbr: 'dL', toBase: v => v * 1e-1, fromBase: v => v / 1e-1 },
            { name: 'Liter', abbr: 'L', toBase: v => v, fromBase: v => v },
            { name: 'Cubic decimeter', abbr: 'dm³', toBase: v => v, fromBase: v => v },
            { name: 'Decaliter', abbr: 'daL', toBase: v => v * 1e1, fromBase: v => v / 1e1 },
            { name: 'Hectoliter', abbr: 'hL', toBase: v => v * 1e2, fromBase: v => v / 1e2 },
            { name: 'Cubic meter', abbr: 'm³', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
            { name: 'Kiloliter', abbr: 'kL', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
        ],
        mass: [
            { name: 'Yoctogram', abbr: 'yg', toBase: v => v * 1e-27, fromBase: v => v / 1e-27 },
            { name: 'Zeptogram', abbr: 'zg', toBase: v => v * 1e-24, fromBase: v => v / 1e-24 },
            { name: 'Attogram', abbr: 'ag', toBase: v => v * 1e-21, fromBase: v => v / 1e-21 },
            { name: 'Femtogram', abbr: 'fg', toBase: v => v * 1e-18, fromBase: v => v / 1e-18 },
            { name: 'Picogram', abbr: 'pg', toBase: v => v * 1e-15, fromBase: v => v / 1e-15 },
            { name: 'Nanogram', abbr: 'ng', toBase: v => v * 1e-12, fromBase: v => v / 1e-12 },
            { name: 'Microgram', abbr: 'µg', toBase: v => v * 1e-9, fromBase: v => v / 1e-9 },
            { name: 'Milligram', abbr: 'mg', toBase: v => v * 1e-6, fromBase: v => v / 1e-6 },
            { name: 'Centigram', abbr: 'cg', toBase: v => v * 1e-5, fromBase: v => v / 1e-5 },
            { name: 'Decigram', abbr: 'dg', toBase: v => v * 1e-4, fromBase: v => v / 1e-4 },
            { name: 'Gram', abbr: 'g', toBase: v => v * 1e-3, fromBase: v => v / 1e-3 },
            { name: 'Decagram', abbr: 'dag', toBase: v => v * 1e-2, fromBase: v => v / 1e-2 },
            { name: 'Hectogram', abbr: 'hg', toBase: v => v * 1e-1, fromBase: v => v / 1e-1 },
            { name: 'Kilogram', abbr: 'kg', toBase: v => v, fromBase: v => v },
            { name: 'Megagram / tonne', abbr: 'Mg/t', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
        ],
        force: [
            { name: 'Newton', abbr: 'N', toBase: v => v, fromBase: v => v },
            { name: 'Kilonewton', abbr: 'kN', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
        ],
        pressure: [
            { name: 'Pascal', abbr: 'Pa', toBase: v => v, fromBase: v => v },
            { name: 'Kilopascal', abbr: 'kPa', toBase: v => v * 1e3, fromBase: v => v / 1e3 },
            { name: 'Megapascal', abbr: 'MPa', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
        ],
        temperature: [
            { name: 'Kelvin', abbr: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
            { name: 'Degree Celsius', abbr: '°C', toBase: v => v, fromBase: v => v },
        ],
        speed: [
            { name: 'Meter per second', abbr: 'm/s', toBase: v => v, fromBase: v => v },
            { name: 'Kilometer per hour', abbr: 'km/h', toBase: v => v * (1000/3600), fromBase: v => v / (1000/3600) },
        ],
        time: [
            { name: 'Second', abbr: 's', toBase: v => v, fromBase: v => v },
            { name: 'Minute', abbr: 'min', toBase: v => v * 60, fromBase: v => v / 60 },
            { name: 'Hour', abbr: 'h', toBase: v => v * 3600, fromBase: v => v / 3600 },
            { name: 'Day', abbr: 'd', toBase: v => v * 86400, fromBase: v => v / 86400 },
            { name: 'Week', abbr: 'wk', toBase: v => v * 604800, fromBase: v => v / 604800 },
            { name: 'Year', abbr: 'yr', toBase: v => v * 31557600, fromBase: v => v / 31557600 },
        ],
    },
    imperial: {
        length: [
            { name: 'Thou (mil)', abbr: 'th', toBase: v => v * 0.0000254, fromBase: v => v / 0.0000254 },
            { name: 'Inch', abbr: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
            { name: 'Hand (hh)', abbr: 'hh', toBase: v => v * 0.1016, fromBase: v => v / 0.1016 },
            { name: 'Foot', abbr: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
            { name: 'Yard', abbr: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
            { name: 'Chain', abbr: 'ch', toBase: v => v * 20.1168, fromBase: v => v / 20.1168 },
            { name: 'Furlong', abbr: 'fur', toBase: v => v * 201.168, fromBase: v => v / 201.168 },
            { name: 'Mile', abbr: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
            { name: 'League', abbr: 'lea', toBase: v => v * 4828.032, fromBase: v => v / 4828.032 },
        ],
        area: [
            { name: 'Square inch', abbr: 'in²', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
            { name: 'Square foot', abbr: 'ft²', toBase: v => v * 0.09290304, fromBase: v => v / 0.09290304 },
            { name: 'Square yard', abbr: 'yd²', toBase: v => v * 0.83612736, fromBase: v => v / 0.83612736 },
            { name: 'Perch/Rod/Pole', abbr: 'rd', toBase: v => v * 25.29285264, fromBase: v => v / 25.29285264 },
            { name: 'Rood', abbr: 'rood', toBase: v => v * 1011.7141056, fromBase: v => v / 1011.7141056 },
            { name: 'Acre', abbr: 'ac', toBase: v => v * 4046.8564224, fromBase: v => v / 4046.8564224 },
            { name: 'Square mile', abbr: 'mi²', toBase: v => v * 2589988.110336, fromBase: v => v / 2589988.110336 },
        ],
        volume: [
            // Imperial fluid ounce = 28.4130625 mL = 0.0284130625 L
            { name: 'Fluid ounce', abbr: 'fl oz', toBase: v => v * 0.0284130625, fromBase: v => v / 0.0284130625 },
            { name: 'Gill', abbr: 'gi', toBase: v => v * 0.1420653125, fromBase: v => v / 0.1420653125 },
            { name: 'Pint', abbr: 'pt', toBase: v => v * 0.56826125, fromBase: v => v / 0.56826125 },
            { name: 'Quart', abbr: 'qt', toBase: v => v * 1.1365225, fromBase: v => v / 1.1365225 },
            { name: 'Gallon', abbr: 'gal', toBase: v => v * 4.54609, fromBase: v => v / 4.54609 },
        ],
        mass: [
            { name: 'Grain', abbr: 'gr', toBase: v => v * 0.00006479891, fromBase: v => v / 0.00006479891 },
            { name: 'Dram', abbr: 'dr', toBase: v => v * 0.0017718451953125, fromBase: v => v / 0.0017718451953125 },
            { name: 'Ounce', abbr: 'oz', toBase: v => v * 0.028349523125, fromBase: v => v / 0.028349523125 },
            { name: 'Pound', abbr: 'lb', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
            { name: 'Stone', abbr: 'st', toBase: v => v * 6.35029318, fromBase: v => v / 6.35029318 },
            { name: 'Quarter', abbr: 'qr', toBase: v => v * 12.70058636, fromBase: v => v / 12.70058636 },
            { name: 'Hundredweight', abbr: 'cwt', toBase: v => v * 50.80234544, fromBase: v => v / 50.80234544 },
            { name: 'Ton (long ton)', abbr: 'ton', toBase: v => v * 1016.0469088, fromBase: v => v / 1016.0469088 },
        ],
        force: [
            { name: 'Pound-force', abbr: 'lbf', toBase: v => v * 4.4482216152605, fromBase: v => v / 4.4482216152605 },
        ],
        pressure: [
            { name: 'Pound per square inch', abbr: 'psi', toBase: v => v * 6894.757293168, fromBase: v => v / 6894.757293168 },
        ],
        temperature: [
            { name: 'Degree Fahrenheit', abbr: '°F', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
        ],
        speed: [
            { name: 'Foot per second', abbr: 'ft/s', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
            { name: 'Mile per hour', abbr: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
        ],
        time: [
            { name: 'Second', abbr: 's', toBase: v => v, fromBase: v => v },
            { name: 'Minute', abbr: 'min', toBase: v => v * 60, fromBase: v => v / 60 },
            { name: 'Hour', abbr: 'h', toBase: v => v * 3600, fromBase: v => v / 3600 },
            { name: 'Day', abbr: 'd', toBase: v => v * 86400, fromBase: v => v / 86400 },
            { name: 'Week', abbr: 'wk', toBase: v => v * 604800, fromBase: v => v / 604800 },
            { name: 'Year', abbr: 'yr', toBase: v => v * 31557600, fromBase: v => v / 31557600 },
        ],
    },
    devin: {
        length: [
            // Dan System (Set A)
            { name: 'Dan', abbr: 'Dn', toBase: v => v * 0.0174625, fromBase: v => v / 0.0174625 },
            { name: 'Dant', abbr: 'Dnt', toBase: v => v * 0.174625, fromBase: v => v / 0.174625 },
            { name: 'Didant', abbr: 'Ddt', toBase: v => v * 17.4625, fromBase: v => v / 17.4625 },
            { name: 'Dedant', abbr: 'Det', toBase: v => v * 174.625, fromBase: v => v / 174.625 },
            // Dit System (Set B)
            { name: 'Dit', abbr: 'Dt', toBase: v => v * 0.026035, fromBase: v => v / 0.026035 },
            { name: 'Dul', abbr: 'Dl', toBase: v => v * 0.26035, fromBase: v => v / 0.26035 },
            { name: 'Didul', abbr: 'Dil', toBase: v => v * 26.035, fromBase: v => v / 26.035 },
            { name: 'Dedul', abbr: 'Ddl', toBase: v => v * 260.35, fromBase: v => v / 260.35 },
            // Dep System (Set C)
            { name: 'Dep', abbr: 'Dp', toBase: v => v * 0.0155575, fromBase: v => v / 0.0155575 }, // 0.6125 in = 0.0155575 m
            { name: 'Deep', abbr: 'Dpp', toBase: v => v * 0.16313, fromBase: v => v / 0.16313 },
            { name: 'Dideep', abbr: 'Ddp', toBase: v => v * 16.956, fromBase: v => v / 16.956 },
            { name: 'Dedeep', abbr: 'Dedp', toBase: v => v * 169.56, fromBase: v => v / 169.56 },
        ],
        time: [
            { name: 'SPEEN', abbr: 'SPEEN', toBase: v => v * 12, fromBase: v => v / 12 }, // 1 SPEEN = 12 seconds
            { name: 'Mega SPEEN', abbr: 'MSPEEN', toBase: v => v * 1200, fromBase: v => v / 1200 }, // 1 Mega SPEEN = 1200 seconds
        ],
        volume: [
            { name: 'Doth', abbr: 'Dh', toBase: v => v * 0.01136524, fromBase: v => v / 0.01136524 },
            { name: 'Douth', abbr: 'Dth', toBase: v => v * 0.1136524, fromBase: v => v / 0.1136524 },
            { name: 'Diller', abbr: 'Dll', toBase: v => v * 11.36524, fromBase: v => v / 11.36524 },
            { name: 'Dilver', abbr: 'Dlv', toBase: v => v * 113.6524, fromBase: v => v / 113.6524 },
            { name: 'Dullic (Cubic Dul)', abbr: 'Dl³', toBase: v => v * 0.0176505, fromBase: v => v / 0.0176505 },
            { name: 'Dantic (Cubic Dant)', abbr: 'Dnt³', toBase: v => v * 0.005325, fromBase: v => v / 0.005325 },
            { name: 'Deepic (Cubic Deep)', abbr: 'Dep³', toBase: v => v * 0.0037562, fromBase: v => v / 0.0037562 },
        ],
        speed: [
            { name: 'Dant per SPEEN', abbr: 'Dnt/SPEEN', toBase: v => (v * 0.0174625) / 12, fromBase: v => v * 12 / 0.0174625 },
            { name: 'Dul per SPEEN', abbr: 'Dl/SPEEN', toBase: v => (v * 0.26035) / 12, fromBase: v => v * 12 / 0.26035 },
            { name: 'Deep per SPEEN', abbr: 'Dep/SPEEN', toBase: v => (v * 0.155575) / 12, fromBase: v => v * 12 / 0.155575 },
        ],
        mass: [
              // Devin System (Mass) in kg, rounded to three decimals
              { name: 'Dev', abbr: 'Dv', toBase: v => v * 0.054, fromBase: v => v / 0.054 },
              { name: 'Devi', abbr: 'Dvi', toBase: v => v * 0.536, fromBase: v => v / 0.536 },
              { name: 'Devin', abbr: 'Dvn', toBase: v => v * 53.637, fromBase: v => v / 53.637 },
              { name: 'Didevin', abbr: 'Ddv', toBase: v => v * 5363.095, fromBase: v => v / 5363.095 },
              { name: 'Dedevin', abbr: 'Ddvn', toBase: v => v * 53630.950, fromBase: v => v / 53630.950 },
        ],
    }
};

// Default: Metric to Imperial
let fromSystem = 'metric';
let toSystem = 'imperial';

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const to = params.get('to');
    const valid = ['imperial', 'metric', 'devin'];
    if (valid.includes(from) && valid.includes(to)) {
        fromSystem = from;
        toSystem = to;
    }
}

function populateUnitSelects() {
    const inputUnit = document.getElementById('input-unit');
    const outputUnit = document.getElementById('output-unit');
    // Save current values
    const prevInputVal = inputUnit.value;
    const prevOutputVal = outputUnit.value;
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';

    // Map each sectionKey to a broad category
    const sectionCategory = {
        // Metric/Imperial/Devin keys
        length: 'Length',
        area: 'Length',
        volume: 'Volume',
        volume_liquid: 'Volume',
        volume_dry: 'Volume',
        mass: 'Mass',
        force: 'Mass', // Not used for conversion, but grouped
        pressure: 'Mass', // Not used for conversion, but grouped
        time: 'Time',
        speed: 'Speed',
        temperature: 'Temperature',
    };
    function addOptGroup(select, label, unitsArr, sectionKey) {
        const group = document.createElement('optgroup');
        group.label = label;
        // If select is input-unit, check output-unit's selected section, and vice versa
        unitsArr.forEach((u, i) => {
            const opt = document.createElement('option');
            opt.value = sectionKey + ':' + i;
            opt.textContent = `${u.name} (${u.abbr})`;
            group.appendChild(opt);
        });
        select.appendChild(group);
    }

    function fillImperial(select, sys) {
        for (const section of [
            ['Length (Distance)', 'length'],
            ['Area', 'area'],
            ['Volume', 'volume'],
            ['Mass / Weight', 'mass'],
            ['Force', 'force'],
            ['Pressure', 'pressure'],
            ['Temperature', 'temperature'],
            ['Speed', 'speed'],
            ['Time', 'time'],
        ]) {
            const [label, key] = section;
            if (units[sys][key]) {
                addOptGroup(select, label, units[sys][key], key);
            }
        }
    }

    function fillMetric(select, sys) {
        for (const section of [
            ['Length (Distance)', 'length'],
            ['Area', 'area'],
            ['Volume', 'volume'],
            ['Mass / Weight', 'mass'],
            ['Force', 'force'],
            ['Pressure', 'pressure'],
            ['Temperature', 'temperature'],
            ['Speed', 'speed'],
            ['Time', 'time'],
        ]) {
            const [label, key] = section;
            if (units[sys][key]) {
                addOptGroup(select, label, units[sys][key], key);
            }
        }
    }

    function fillDevin(select) {
        // Only show Devin units that have a conversion to metric/imperial (i.e., have toBase)
        for (const section of [
            ['Length', 'length'],
            ['Volume', 'volume'],
            ['Mass / Weight', 'mass'],
            ['Time', 'time'],
            ['Speed', 'speed'],
        ]) {
            const [label, key] = section;
            if (units.devin[key]) {
                // Only show if toBase is defined and not NaN
                const filtered = units.devin[key].filter(u => typeof u.toBase === 'function' && !isNaN(u.toBase(1)));
                if (filtered.length > 0) addOptGroup(select, label, filtered, key);
            }
        }
    }

    // Helper to filter only compatible sections for devin conversions
    function fillImperialDevinCompatible(select) {
        for (const section of [
            ['Length (Distance)', 'length'],
            ['Volume', 'volume'],
            ['Mass / Weight', 'mass'],
            ['Time', 'time'],
            ['Speed', 'speed'],
        ]) {
            const [label, key] = section;
            if (units.imperial[key]) {
                addOptGroup(select, label, units.imperial[key], key);
            }
        }
    }
    function fillMetricDevinCompatible(select) {
        for (const section of [
            ['Length (Distance)', 'length'],
            ['Volume', 'volume'],
            ['Mass / Weight', 'mass'],
            ['Time', 'time'],
            ['Speed', 'speed'],
        ]) {
            const [label, key] = section;
            if (units.metric[key]) {
                addOptGroup(select, label, units.metric[key], key);
            }
        }
    }

    if (fromSystem === 'imperial' && toSystem === 'devin') {
        fillImperialDevinCompatible(inputUnit);
    } else if (fromSystem === 'imperial') {
        fillImperial(inputUnit, 'imperial');
    } else if (fromSystem === 'devin') {
        fillDevin(inputUnit);
    } else if (fromSystem === 'metric' && toSystem === 'devin') {
        fillMetricDevinCompatible(inputUnit);
    } else {
        fillMetric(inputUnit, 'metric');
    }

    if (toSystem === 'imperial' && fromSystem === 'devin') {
        fillImperialDevinCompatible(outputUnit);
    } else if (toSystem === 'imperial') {
        fillImperial(outputUnit, 'imperial');
    } else if (toSystem === 'devin') {
        fillDevin(outputUnit);
    } else if (toSystem === 'metric' && fromSystem === 'devin') {
        fillMetricDevinCompatible(outputUnit);
    } else {
        fillMetric(outputUnit, 'metric');
    }
}

function convert() {
    const inputValue = parseFloat(document.getElementById('input-value').value);
    const inputUnitVal = document.getElementById('input-unit').value;
    const outputUnitVal = document.getElementById('output-unit').value;
    if (isNaN(inputValue)) {
        document.getElementById('output-value').textContent = '0';
        return;
    }
    let fromUnit, toUnit, fromSection, toSection;
    if (fromSystem === 'imperial') {
        [fromSection, idx] = inputUnitVal.split(':');
        fromUnit = units.imperial[fromSection][idx];
    } else if (fromSystem === 'devin') {
        [fromSection, idx] = inputUnitVal.split(':');
        fromUnit = units.devin[fromSection][idx];
    } else {
        [fromSection, idx] = inputUnitVal.split(':');
        fromUnit = units.metric[fromSection][idx];
    }
    if (toSystem === 'imperial') {
        [toSection, idx] = outputUnitVal.split(':');
        toUnit = units.imperial[toSection][idx];
    } else if (toSystem === 'devin') {
        [toSection, idx] = outputUnitVal.split(':');
        toUnit = units.devin[toSection][idx];
    } else {
        [toSection, idx] = outputUnitVal.split(':');
        toUnit = units.metric[toSection][idx];
    }
    // Allow cross-section conversion for all 'Volume' categories
    const isVolume = section => ['volume'].includes(section);
    if (!fromUnit || !toUnit || (
        fromSection !== toSection && !(isVolume(fromSection) && isVolume(toSection))
    )) {
        document.getElementById('output-value').textContent = 'Err';
        return;
    }
    let baseValue = fromUnit.toBase(inputValue);
    let result = toUnit.fromBase(baseValue);
    // Special case for temperature
    if ((fromUnit.abbr === '°C' && toUnit.abbr === '°F')) {
        result = toUnit.fromBase(inputValue);
    } else if ((fromUnit.abbr === '°F' && toUnit.abbr === '°C')) {
        result = toUnit.toBase(inputValue);
    }
    document.getElementById('output-value').textContent = +result.toFixed(6);
}

document.addEventListener('DOMContentLoaded', () => {
    getUrlParams();
    populateUnitSelects();

    // Set default units: inches for imperial, centimeters for metric
    function setDefaultUnit(select, system) {
        let found = false;
        for (let i = 0; i < select.options.length; i++) {
            const opt = select.options[i];
            if (system === 'imperial' && opt.textContent.toLowerCase().includes('inch')) {
                select.selectedIndex = i;
                found = true;
                break;
            }
            if (system === 'metric' && opt.textContent.toLowerCase().includes('centimeter')) {
                select.selectedIndex = i;
                found = true;
                break;
            }
        }
        // fallback: first option
        if (!found) select.selectedIndex = 0;
    }

    setDefaultUnit(document.getElementById('input-unit'), fromSystem);
    setDefaultUnit(document.getElementById('output-unit'), toSystem);

    convert();
    document.getElementById('input-value').addEventListener('input', convert);
    document.getElementById('input-unit').addEventListener('change', convert);
    document.getElementById('output-unit').addEventListener('change', convert);
    document.getElementById('output-unit').addEventListener('change', function() {
        const inputUnit = document.getElementById('input-unit');
        const outputUnit = document.getElementById('output-unit');
        const selectedSection = outputUnit.value.split(':')[0];
        const inputSection = inputUnit.value.split(':')[0];
        if (selectedSection !== inputSection || inputUnit.options[inputUnit.selectedIndex].disabled) {
            // Only repopulate input unit, not both
            const prevVal = inputUnit.value;
            const outputVal = outputUnit.value;
            inputUnit.innerHTML = '';
            populateUnitSelects();
            outputUnit.value = outputVal;
            // Select first enabled input option in the new section
            for (let i = 0; i < inputUnit.options.length; i++) {
                if (!inputUnit.options[i].disabled && inputUnit.options[i].value.split(':')[0] === selectedSection) {
                    inputUnit.selectedIndex = i;
                    break;
                }
            }
        }
        convert();
    });
});
