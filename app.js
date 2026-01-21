/**
 * Know Your Numbers - STI Risk Calculator
 * 
 * All transmission rates are sourced from peer-reviewed studies.
 * Every number links to its source with an exact quote.
 */

// ============================================
// STI TRANSMISSION DATA (with source references)
// ============================================

/**
 * STI DATA
 * 
 * IMPORTANT: Only STIs with verified: true have passed source verification.
 * Unverified STIs are disabled in the calculator until sources are confirmed.
 */
const STI_DATA = {
    hiv: {
        name: 'HIV',
        verified: true,  // VERIFIED 2025-01-14
        verificationNote: 'Verified against CDC HIV Risk and Prevention Estimates page + Boily 2009 meta-analysis',
        rateType: 'per-act',  // This is a per-act transmission rate
        rates: {
            mtf: {
                value: 0.0008,  // 8 per 10,000 = 0.08% receptive vaginal
                sourceId: 'hiv_cdc_risk_estimates'
            },
            ftm: {
                value: 0.0004,  // 4 per 10,000 = 0.04% insertive vaginal
                sourceId: 'hiv_cdc_risk_estimates'
            }
        },
        condomEffectiveness: {
            value: 0.80,  // 80% risk reduction
            sourceId: 'hiv_condom_effectiveness'
        },
        preventatives: [
            {
                id: 'prep',
                name: 'Partner without the STI takes daily Truvada or Descovy (PrEP)',
                shortName: 'Daily PrEP',
                actor: 'uninfected',
                category: 'daily',
                value: 0.99,  // ~99% reduction
                sourceId: 'hiv_prep_effectiveness',
                note: 'Prescription pills (Truvada/Descovy) taken daily by the partner without HIV'
            },
            {
                id: 'uu',
                name: 'Partner with the STI takes daily ART and has suppressed virus',
                shortName: 'ART (U=U)',
                actor: 'infected',
                category: 'daily',
                value: 1.0,  // 100% reduction (effectively zero transmission)
                sourceId: 'hiv_viral_suppression',
                note: 'Antiretroviral therapy (ART) suppresses HIV to undetectable — cannot transmit (U=U)'
            },
            {
                id: 'cabotegravir',
                name: 'Partner without the STI receives Apretude injection (every 2 months)',
                shortName: 'Apretude',
                actor: 'uninfected',
                category: 'injectable',
                value: 0.99,  // Superior to oral PrEP; using same 99% efficacy
                sourceId: 'cabotegravir_hptn083',
                note: 'Cabotegravir injection every 2 months — 66% better than daily pills in trials'
            },
            {
                id: 'lenacapavir',
                name: 'Partner without the STI receives Sunlenca injection (every 6 months)',
                shortName: 'Sunlenca',
                actor: 'uninfected',
                category: 'injectable',
                value: 0.99,  // ~100% efficacy in PURPOSE 1 trial
                sourceId: 'lenacapavir_purpose1',
                note: 'Lenacapavir injection twice yearly — 100% efficacy in women\'s trial (FDA approved June 2025)'
            }
        ],
        source: 'CDC HIV Risk and Prevention Estimates',
        sourceUrl: 'https://www.cdc.gov/hivpartners/php/riskandprevention/index.html',
        notes: 'Per-act rates assuming detectable viral load. U=U eliminates transmission. PrEP reduces risk by ~99%.'
    },

    hsv2: {
        name: 'Herpes (HSV-2)',
        verified: true,  // VERIFIED 2026-01-20
        verificationNote: 'Derived from Corey 2004 (3.6% over 8 months). Magaret 2016 rate (2.85%) is during shedding only - not representative of overall risk.',
        rateType: 'per-act-derived',  // Derived from Corey 2004 partnership data
        rates: {
            mtf: {
                // Derived from Corey 2004: 3.6% over 8 months ≈ 69 acts
                // per_act = 1 - (1 - 0.036)^(1/69) ≈ 0.00053
                value: 0.00053,  // 0.053% per act (derived from 8-month study)
                sourceId: 'hsv2_per_act_derived',
                isDerived: true,
                note: 'Derived: 3.6% over 8 months → ~0.053% per act (assumes 2x/week)'
            },
            ftm: {
                value: 0.00053,  // Using same rate; F→M likely similar or lower
                sourceId: 'hsv2_per_act_derived',
                isDerived: true,
                note: 'F→M rate not directly stated; using M→F as estimate'
            }
        },
        condomEffectiveness: {
            // Direction-specific effectiveness from Martin 2009
            mtf: { value: 0.96, sourceId: 'hsv2_condom_effectiveness' },  // 96% effective M→F
            ftm: { value: 0.65, sourceId: 'hsv2_condom_effectiveness' },  // 65% effective F→M
            value: 0.805,  // Fallback average
            sourceId: 'hsv2_condom_effectiveness',
            isUnverified: false,
            note: '96% effective M→F, 65% effective F→M'
        },
        preventatives: [
            {
                id: 'valacyclovir',
                name: 'Partner with the STI takes daily valacyclovir',
                shortName: 'Valacyclovir',
                actor: 'infected',
                category: 'daily',
                value: 0.47,  // ~47% reduction (consistent with Corey study)
                sourceId: 'hsv2_corey_2004',
                note: 'Daily suppressive antiviral taken by the partner with HSV-2'
            }
        ],
        source: 'Corey et al. 2004 - NEJM',
        sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/14702423/',
        notes: 'Per-act rate ~0.053% (derived from 3.6% over 8 months). Condoms 96% effective M→F, 65% F→M. Daily antivirals reduce transmission by ~47%.'
    },

    hpv: {
        name: 'HPV',
        verified: true,  // VERIFIED 2025-01-14
        verificationNote: 'Verified against HITCH cohort (Malagón 2021) with assumptions',
        rateType: 'per-act-derived',  // Derived from person-month rates with assumptions
        rates: {
            // Derived from per 100 person–month rates with assumed sex frequency
            mtf: {
                value: 0.0041,  // ~0.41% per act (assumes 2x/week)
                sourceId: 'hpv_hitch_2021',
                isDerived: true,
                note: 'Derived from 3.5 per 100 person-months with assumed frequency'
            },
            ftm: {
                value: 0.0066,  // ~0.66% per act (assumes 2x/week)
                sourceId: 'hpv_hitch_2021',
                isDerived: true,
                note: 'Derived from 5.6 per 100 person-months with assumed frequency'
            }
        },
        condomEffectiveness: {
            value: 0.70,  // 70% reduction with consistent use
            sourceId: 'hpv_condom_effectiveness',
            isUnverified: false,
            note: '70% reduction with consistent condom use'
        },
        preventatives: [
            {
                id: 'hpv_vaccine',
                name: 'Partner without the STI has received HPV vaccine (Gardasil 9)',
                shortName: 'HPV Vaccine',
                actor: 'uninfected',
                category: 'vaccine',
                value: 0.88,  // 88% reduction in HPV infections at population level
                sourceId: 'hpv_vaccine_cdc_impact',
                note: 'Gardasil 9 provides 88%+ protection against HPV types that cause most cancers and warts (lifetime protection, 2-3 dose series)'
            }
        ],
        source: 'Malagón et al. 2021 (HITCH cohort)',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8012224/',
        notes: 'Per-act rates derived from person–month transmission rates. Condoms 70% effective. Vaccine is most effective prevention.'
    },

    chlamydia: {
        name: 'Chlamydia',
        verified: true,  // VERIFIED 2025-01-14
        verificationNote: 'Verified against NCBI Book NBK261441 for per-act rates',
        rateType: 'per-act',  // Now using per-act rate from NCBI book
        rates: {
            // Per-ACT rate: 6-16.7%, midpoint ~11%
            mtf: {
                value: 0.114,  // ~11% per act (range 6-17%)
                sourceId: 'chlamydia_ncbi_per_act',
                isDerived: true,
                note: 'Midpoint of 6-16.7% range'
            },
            ftm: {
                value: 0.114,  // Same rate (study didn't distinguish direction)
                sourceId: 'chlamydia_ncbi_per_act',
                isDerived: true,
                note: 'Midpoint of 6-16.7% range (no M→F vs F→M distinction)'
            }
        },
        condomEffectiveness: {
            value: 0.60,  // 60% reduction with correct and consistent use
            sourceId: 'chlamydia_condom_effectiveness',
            isUnverified: false,
            note: '60% reduction with correct and consistent condom use'
        },
        preventatives: [
            {
                id: 'doxypep',
                name: 'Partner without the STI takes DoxyPEP within 72h after sex (MSM/TGW only)',
                shortName: 'DoxyPEP',
                actor: 'uninfected',
                category: 'post',
                value: 0.88,  // ~88% reduction for chlamydia in NEJM trial
                sourceId: 'doxypep_nejm_2023',
                note: '200mg doxycycline within 72h after sex. Only for MSM/TGW. Max 1 dose/day. ⚠️ POST-exposure, not daily.'
            }
        ],
        source: 'NCBI Book - Partner Notification Model',
        sourceUrl: 'https://www.ncbi.nlm.nih.gov/books/NBK261441/',
        notes: 'Per-act rate ~11% (range 6-17%). Condoms 60% effective. Easily curable with antibiotics.'
    },

    gonorrhea: {
        name: 'Gonorrhea',
        verified: true,  // VERIFIED 2026-01-16
        verificationNote: 'Verified against Kirkcaldy et al. 2019 - direct per-act measurements',
        rateType: 'per-act',  // DIRECT per-act measurement from Kirkcaldy 2019
        rates: {
            // Per-ACT rate from Kirkcaldy 2019: M→F 50%, F→M 20%
            mtf: {
                value: 0.50,  // 50% per act (DIRECT measurement)
                sourceId: 'gonorrhea_kirkcaldy_2019',
                isDerived: false,
                note: 'Direct estimate: ~50% penile-to-vaginal per act'
            },
            ftm: {
                value: 0.20,  // 20% per act (DIRECT measurement)
                sourceId: 'gonorrhea_kirkcaldy_2019',
                isDerived: false,
                note: 'Direct estimate: ~20% vaginal-to-penile per act'
            }
        },
        condomEffectiveness: {
            value: 0.90,  // 90% reduction with correct and consistent use
            sourceId: 'gonorrhea_condom_effectiveness',
            isUnverified: false,
            note: '90% reduction with correct and consistent condom use'
        },
        preventatives: [
            {
                id: 'doxypep',
                name: 'Partner without the STI takes DoxyPEP within 72h after sex (MSM/TGW only)',
                shortName: 'DoxyPEP',
                actor: 'uninfected',
                category: 'post',
                value: 0.55,  // ~55% reduction for gonorrhea (lower due to antibiotic resistance)
                sourceId: 'doxypep_nejm_2023',
                note: '200mg doxycycline within 72h after sex. Only 55% effective for gonorrhea due to resistance. ⚠️ POST-exposure.'
            }
        ],
        source: 'Kirkcaldy et al. 2019 - Sex Health',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7064409/',
        notes: 'Per-act rate 50% M→F, 20% F→M. Condoms 90% effective. Curable with antibiotics (but resistance growing).'
    },

    syphilis: {
        name: 'Syphilis',
        verified: true,  // VERIFIED 2025-01-14
        verificationNote: 'Verified against ASHM Contact Tracing Guidelines',
        rateType: 'per-act',  // Per-act rate from ASHM
        rates: {
            // Per-ACT rate: >20% for early syphilis (using 20% as conservative estimate)
            mtf: {
                value: 0.20,  // >20% per act for early syphilis
                sourceId: 'syphilis_ashm_per_act',
                isDerived: false,
                note: '>20% per act for early syphilis (primary, secondary, early latent)'
            },
            ftm: {
                value: 0.20,  // Same rate (source doesn't distinguish direction)
                sourceId: 'syphilis_ashm_per_act',
                isDerived: false,
                note: '>20% per act for early syphilis (no M→F vs F→M distinction)'
            }
        },
        condomEffectiveness: {
            value: 0.605,  // Midpoint of 50-71% range for consistent correct use
            sourceId: 'syphilis_condom_effectiveness',
            isUnverified: false,
            note: '50-71% reduction with consistent correct use (60.5% midpoint)'
        },
        preventatives: [
            {
                id: 'doxypep',
                name: 'Partner without the STI takes DoxyPEP within 72h after sex (MSM/TGW only)',
                shortName: 'DoxyPEP',
                actor: 'uninfected',
                category: 'post',
                value: 0.87,  // ~87% reduction for syphilis in NEJM trial
                sourceId: 'doxypep_nejm_2023',
                note: '200mg doxycycline within 72h after sex. Only for MSM/TGW. Max 1 dose/day. ⚠️ POST-exposure, not daily.'
            }
        ],
        source: 'ASHM Contact Tracing Guidelines',
        sourceUrl: 'https://contacttracing.ashm.org.au/syphilis/',
        notes: 'Per-act rate >20% for EARLY syphilis. Condoms 50-71% effective (can transmit through uncovered sores). Curable with antibiotics.'
    }
};

// ============================================
// CITABLE NUMBERS SYSTEM
// ============================================

/**
 * Generate a URL with text fragment to highlight the quoted text
 * Uses the Text Fragments API: url#:~:text=encoded_text
 * 
 * @param {string} baseUrl - The source URL
 * @param {string} quote - The quote text to highlight
 * @returns {string} URL with text fragment
 */
function generateTextFragmentUrl(baseUrl, quote) {
    if (!quote || !baseUrl) return baseUrl;

    // Check if quote has omission markers (...)
    // If so, create multiple text fragments to highlight each section
    const parts = quote.split(/\s*\.\.\.\s*/).filter(p => p.trim().length > 0);

    if (parts.length > 1) {
        // Multiple sections with omissions — use multiple &text= fragments
        const fragments = parts.map(part => {
            let cleanPart = part.replace(/\s+/g, ' ').trim();
            // Keep more of each part (up to 300 chars each)
            if (cleanPart.length > 300) {
                const lastSpace = cleanPart.lastIndexOf(' ', 300);
                cleanPart = lastSpace > 100 ? cleanPart.substring(0, lastSpace) : cleanPart.substring(0, 300);
            }
            return encodeURIComponent(cleanPart);
        });
        return baseUrl + '#:~:text=' + fragments.join('&text=');
    }

    // Single continuous quote — use as much as possible (up to 500 chars)
    let cleanQuote = quote
        .replace(/\s+/g, ' ')
        .trim();

    if (cleanQuote.length > 500) {
        const lastSpace = cleanQuote.lastIndexOf(' ', 500);
        cleanQuote = lastSpace > 200 ? cleanQuote.substring(0, lastSpace) : cleanQuote.substring(0, 500);
    }

    return baseUrl + `#:~:text=${encodeURIComponent(cleanQuote)}`;
}

/**
 * Create a citable number span with hover tooltip
 * Shows step-by-step derivation for calculated values
 * 
 * @param {string} displayText - The text to display (e.g., "0.08%")
 * @param {string} sourceId - The ID in the SOURCES object
 * @returns {string} HTML string for the citable element
 */
function createCitableNumber(displayText, sourceId) {
    if (!window.SOURCES || !window.SOURCES[sourceId]) {
        console.warn(`Source not found: ${sourceId}`);
        return `<span class="citable-unverified">${displayText} <span style="color:#f59e0b;">⚠️</span></span>`;
    }

    const source = window.SOURCES[sourceId];
    const verifiedDate = source.verifiedDate || 'Unknown';
    const isDerived = source.isDerived || false;

    // Format quote: highlight parts that correspond to variables
    let formattedQuote = source.quote
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/\s*\.\.\.\s*/g, ' <span class="quote-ellipsis">···</span> ');

    // If there's a derivation with variables, highlight them in the quote
    if (isDerived && source.derivation && source.derivation.variables) {
        source.derivation.variables.forEach(v => {
            if (v.highlight && v.source === 'quote') {
                const regex = new RegExp(`(${v.highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                formattedQuote = formattedQuote.replace(regex,
                    `<span class="quote-highlight" title="${v.name} = ${v.value}">$1</span>`);
            }
        });
    }

    // Generate URL with text fragment to jump to quote
    const fragmentUrl = generateTextFragmentUrl(source.url, source.quote);

    let contentHtml = '';

    if (isDerived && source.derivation) {
        // DERIVED VALUE - Show step-by-step
        const d = source.derivation;

        // Variables section
        let varsHtml = '<div class="derive-variables">';
        varsHtml += '<div class="derive-section-title">📋 Extracted Variables</div>';
        d.variables.forEach(v => {
            let icon = '';
            let varClass = '';
            if (v.source === 'quote') {
                icon = '📖';
                varClass = 'var-from-quote';
            } else if (v.source === 'assumption') {
                icon = '⚠️';
                varClass = 'var-assumed';
            } else if (v.source === 'calculated') {
                icon = '🔢';
                varClass = 'var-calculated';
            }
            varsHtml += `<div class="derive-var ${varClass}">
                <span class="derive-var-icon">${icon}</span>
                <span class="derive-var-name">${v.name}</span> = 
                <span class="derive-var-value">${v.value}</span>
                ${v.note ? `<span class="derive-var-note">(${v.note})</span>` : ''}
            </div>`;
        });
        varsHtml += '</div>';

        // Steps section
        let stepsHtml = '<div class="derive-steps">';
        stepsHtml += '<div class="derive-section-title">🧮 Calculation</div>';
        d.steps.forEach((step, i) => {
            const isWarning = step.startsWith('⚠️');
            stepsHtml += `<div class="derive-step ${isWarning ? 'step-warning' : ''}">${step}</div>`;
        });
        stepsHtml += '</div>';

        // Result section
        let resultHtml = '<div class="derive-result">';
        resultHtml += `<span class="derive-result-name">${d.result.name}</span> = `;
        resultHtml += `<span class="derive-result-value">${d.result.value}</span>`;
        resultHtml += '</div>';

        // Warnings
        let warningsHtml = '';
        if (d.warnings && d.warnings.length > 0) {
            warningsHtml = '<div class="derive-warnings">';
            d.warnings.forEach(w => {
                warningsHtml += `<div class="derive-warning">⚠️ ${w}</div>`;
            });
            warningsHtml += '</div>';
        }

        contentHtml = `
            <div class="cite-tooltip-source">
                ${source.name}
                <span class="cite-tooltip-type derived">Calculated</span>
            </div>
            <div class="cite-tooltip-quote">"${formattedQuote}"</div>
            ${varsHtml}
            ${stepsHtml}
            ${resultHtml}
            ${warningsHtml}
            <a href="${fragmentUrl}" target="_blank" class="cite-tooltip-link">View source →</a>
            <span class="cite-tooltip-meta">Last verified: ${verifiedDate}</span>
        `;
    } else {
        // DIRECT VALUE - Show simple quote
        contentHtml = `
            <div class="cite-tooltip-source">
                ${source.name}
                <span class="cite-tooltip-type direct">Direct quote</span>
            </div>
            <div class="cite-tooltip-quote">"${formattedQuote}"</div>
            <a href="${fragmentUrl}" target="_blank" class="cite-tooltip-link">View source →</a>
            <span class="cite-tooltip-meta">Last verified: ${verifiedDate}</span>
        `;
    }

    return `<span class="citable" data-source="${sourceId}">
        ${displayText}
        <span class="cite-tooltip">${contentHtml}</span>
    </span>`;
}

/**
 * Get the source info for a given STI and rate type
 */
function getSourceInfo(stiKey, rateType, direction = null) {
    const stiData = STI_DATA[stiKey];
    if (!stiData) return null;

    if (rateType === 'transmission' && direction) {
        const rateData = stiData.rates[direction];
        if (typeof rateData === 'object' && rateData.sourceId) {
            return window.SOURCES ? window.SOURCES[rateData.sourceId] : null;
        }
    } else if (rateType === 'condom') {
        const condomData = stiData.condomEffectiveness;
        if (typeof condomData === 'object' && condomData.sourceId) {
            return window.SOURCES ? window.SOURCES[condomData.sourceId] : null;
        }
    }
    return null;
}

// ============================================
// CALCULATOR LOGIC
// ============================================

/**
 * Calculate cumulative transmission probability
 * Formula: P = 1 - (1 - r)^n
 * 
 * @param {number} perActRisk - Risk per sexual encounter (0-1)
 * @param {number} encounters - Total number of encounters
 * @returns {number} Cumulative probability (0-1)
 */
function calculateCumulativeRisk(perActRisk, encounters) {
    if (perActRisk >= 1) return 1;
    if (perActRisk <= 0 || encounters <= 0) return 0;
    return 1 - Math.pow(1 - perActRisk, encounters);
}

/**
 * Adjust base risk for condom use
 * 
 * @param {number} baseRisk - Unprotected risk per act
 * @param {number} effectiveness - Condom effectiveness (0-1)
 * @returns {number} Adjusted risk
 */
function adjustForCondom(baseRisk, effectiveness) {
    return baseRisk * (1 - effectiveness);
}

/**
 * Generate risk data points for chart
 * 
 * @param {number} perActRisk - Risk per encounter
 * @param {number} frequency - Encounters per week
 * @param {number} months - Duration in months
 * @returns {Array} Array of {month, risk} objects
 */
function generateRiskTimeline(perActRisk, frequency, months) {
    const dataPoints = [];
    const encountersPerMonth = frequency * 4.33; // ~4.33 weeks per month

    for (let month = 0; month <= months; month++) {
        const totalEncounters = Math.round(encountersPerMonth * month);
        const risk = calculateCumulativeRisk(perActRisk, totalEncounters);
        dataPoints.push({
            month: month,
            risk: risk,
            encounters: totalEncounters
        });
    }

    return dataPoints;
}

// ============================================
// UI CONTROLLER
// ============================================

class RiskCalculator {
    constructor() {
        this.chart = null;
        this.initElements();
        this.bindEvents();
        this.syncLabelsWithSliders();
        this.updateCalculation();
    }

    syncLabelsWithSliders() {
        // Sync labels with actual slider values (browsers may restore cached values)
        this.frequencyValue.textContent = this.getFrequencyLabel(parseInt(this.frequencyInput.value));
        this.durationValue.textContent = this.durationInput.value;
    }

    initElements() {
        // Input elements
        this.stiSelect = document.getElementById('sti-select');
        this.directionSelect = document.getElementById('direction-select');
        this.frequencyInput = document.getElementById('frequency-input');
        this.durationInput = document.getElementById('duration-input');

        // Preventatives container
        this.preventativesContainer = document.getElementById('preventatives-container');
        this.preventativeSelects = {};  // Holds select elements keyed by actor group
        this.preventativeDetails = {};  // Holds detail containers keyed by actor group

        // Display elements
        this.frequencyValue = document.getElementById('frequency-value');
        this.durationValue = document.getElementById('duration-value');
        this.perActRate = document.getElementById('per-act-rate');
        this.adjustedRate = document.getElementById('adjusted-rate');
        this.rateReduction = document.getElementById('rate-reduction');
        this.resultDuration = document.getElementById('result-duration');
        this.resultProbability = document.getElementById('result-probability');
        this.resultExplanation = document.getElementById('result-explanation-text');

        // Chart
        this.chartCanvas = document.getElementById('risk-chart');
    }

    bindEvents() {
        this.stiSelect.addEventListener('change', () => {
            this.updatePreventativesUI();
            this.updateCalculation();
        });
        this.directionSelect.addEventListener('change', () => this.updateCalculation());

        this.frequencyInput.addEventListener('input', () => {
            this.frequencyValue.textContent = this.getFrequencyLabel(parseInt(this.frequencyInput.value));
            this.updateCalculation();
        });

        this.durationInput.addEventListener('input', () => {
            this.durationValue.textContent = this.durationInput.value;
            this.updateCalculation();
        });

        // Initial preventatives UI
        this.updatePreventativesUI();
    }

    updatePreventativesUI() {
        const sti = this.stiSelect.value;
        const stiData = STI_DATA[sti];

        // Clear existing controls
        this.preventativesContainer.innerHTML = '';
        this.preventativeSelects = {};
        this.preventativeDetails = {};

        if (!stiData || !stiData.preventatives || stiData.preventatives.length === 0) {
            return;
        }

        const groups = {
            infected: [],
            uninfected: [],
            both: []
        };

        stiData.preventatives.forEach(prev => {
            const actor = prev.actor || 'both';
            if (!groups[actor]) groups[actor] = [];
            groups[actor].push(prev);
        });

        const groupOrder = ['infected', 'uninfected', 'both'];
        const groupLabels = {
            infected: 'Medication for partner with the STI',
            uninfected: 'Prevention for partner without the STI',
            both: 'Prevention for both partners'
        };

        groupOrder.forEach(groupKey => {
            const items = groups[groupKey];
            if (!items || items.length === 0) return;

            const selectId = `preventative-select-${groupKey}`;
            const groupDiv = document.createElement('div');
            groupDiv.className = 'input-group preventative-select-group';
            groupDiv.innerHTML = `
                <label for="${selectId}">${groupLabels[groupKey]}</label>
                <select id="${selectId}" class="preventative-select"></select>
                <div class="preventative-detail" id="${selectId}-detail"></div>
            `;

            const select = groupDiv.querySelector(`#${selectId}`);
            const optionsHtml = [
                '<option value="">None</option>',
                ...items.map(item => `<option value="${item.id}">${item.shortName}</option>`)
            ].join('');
            select.innerHTML = optionsHtml;

            // Default to first option so preventatives show by default
            select.value = items[0].id;

            const detail = groupDiv.querySelector(`#${selectId}-detail`);

            this.preventativeSelects[groupKey] = select;
            this.preventativeDetails[groupKey] = detail;

            select.addEventListener('change', () => {
                this.renderPreventativeDetail(groupKey);
                this.updateCalculation();
            });

            this.preventativesContainer.appendChild(groupDiv);
            this.renderPreventativeDetail(groupKey);
        });
    }

    getPreventativeIcon(prev) {
        if (prev.category === 'vaccine' || prev.category === 'injectable') return '💉';
        if (prev.category === 'post') return '⏱️';
        return '💊';
    }

    renderPreventativeDetail(groupKey) {
        const select = this.preventativeSelects[groupKey];
        const detail = this.preventativeDetails[groupKey];
        if (!select || !detail) return;

        const selectedId = select.value;
        if (!selectedId) {
            detail.innerHTML = '<span class="preventative-none">No medication selected</span>';
            return;
        }

        const stiData = STI_DATA[this.stiSelect.value];
        const selected = stiData.preventatives.find(prev => prev.id === selectedId);
        if (!selected) {
            detail.innerHTML = '';
            return;
        }

        const reductionPercent = Math.round(selected.value * 100);
        const reductionBadge = `<span class="reduction-badge">${createCitableNumber(`${reductionPercent}% reduction`, selected.sourceId)}</span>`;
        const icon = this.getPreventativeIcon(selected);

        detail.innerHTML = `
            <div class="preventative-detail-main">
                <span class="preventative-selected">${icon} ${selected.name}</span>
                ${reductionBadge}
            </div>
            <div class="preventative-note">${selected.note}</div>
        `;
    }

    getEnabledPreventatives() {
        const sti = this.stiSelect.value;
        const stiData = STI_DATA[sti];

        if (!stiData || !stiData.preventatives) return [];

        const selected = [];
        Object.values(this.preventativeSelects).forEach(select => {
            if (!select || !select.value) return;
            const match = stiData.preventatives.find(prev => prev.id === select.value);
            if (match) selected.push(match);
        });

        return selected;
    }

    getFrequencyLabel(value) {
        if (value < 7) {
            return value;
        } else {
            // Show times per week, plus per-day equivalent
            const perDay = (value / 7).toFixed(1);
            return `${value} (${perDay}×/day)`;
        }
    }

    updateCalculation() {
        const sti = this.stiSelect.value;
        const direction = this.directionSelect.value;
        const frequency = parseInt(this.frequencyInput.value);
        const months = parseInt(this.durationInput.value);

        const stiData = STI_DATA[sti];

        // Check if this STI has verified data
        if (!stiData.verified || !stiData.rates[direction].value) {
            this.showUnverifiedMessage(stiData);
            return;
        }

        // Handle both old format (number) and new format (object with value)
        const baseRate = typeof stiData.rates[direction] === 'object'
            ? stiData.rates[direction].value
            : stiData.rates[direction];

        // Get direction-specific condom effectiveness if available
        let condomEff;
        let condomSourceId;
        const condomData = stiData.condomEffectiveness;
        if (typeof condomData === 'object' && condomData[direction] && condomData[direction].value !== undefined) {
            // Direction-specific effectiveness (e.g., HSV-2: 96% M→F, 65% F→M)
            condomEff = condomData[direction].value;
            condomSourceId = condomData[direction].sourceId;
        } else if (typeof condomData === 'object') {
            condomEff = condomData.value;
            condomSourceId = condomData.sourceId;
        } else {
            condomEff = condomData;
            condomSourceId = null;
        }

        // Calculate condom-adjusted rate
        const withCondomRate = adjustForCondom(baseRate, condomEff);

        // Get enabled preventatives and calculate combined effectiveness
        const enabledPreventatives = this.getEnabledPreventatives();
        const hasPreventatives = enabledPreventatives.length > 0;

        // Calculate combined preventative effectiveness (multiplicative)
        // E.g., PrEP (99%) + U=U (100%) = 1 - (1-0.99)*(1-1.0) = 100%
        let combinedPreventativeEff = 0;
        if (hasPreventatives) {
            let remainingRisk = 1;
            enabledPreventatives.forEach(prev => {
                remainingRisk *= (1 - prev.value);
            });
            combinedPreventativeEff = 1 - remainingRisk;
        }

        // Calculate preventative-adjusted rates
        const withPreventativeRate = hasPreventatives ? adjustForCondom(baseRate, combinedPreventativeEff) : null;
        const withBothRate = hasPreventatives ? adjustForCondom(withCondomRate, combinedPreventativeEff) : null;

        // Update rate display with citable sources
        const rateSourceId = typeof stiData.rates[direction] === 'object'
            ? stiData.rates[direction].sourceId
            : null;
        // condomSourceId already defined above with direction-specific logic

        if (rateSourceId && window.SOURCES && window.SOURCES[rateSourceId]) {
            this.perActRate.innerHTML = createCitableNumber(
                `${(baseRate * 100).toFixed(3)}%`,
                rateSourceId
            );
        } else {
            this.perActRate.textContent = `${(baseRate * 100).toFixed(3)}%`;
        }

        // Check if condom data is verified
        // condomData already defined above
        const isCondomUnverified = typeof condomData === 'object' && condomData.isUnverified;

        // Show the with-condom rate (only if we have a verified source)
        if (condomSourceId && window.SOURCES && window.SOURCES[condomSourceId]) {
            this.adjustedRate.innerHTML = createCitableNumber(
                `${(withCondomRate * 100).toFixed(3)}%`,
                condomSourceId
            );
            // Show the reduction percentage
            const reductionPercent = (condomEff * 100).toFixed(0);
            this.rateReduction.textContent = `(${reductionPercent}% reduction)`;
        } else if (isCondomUnverified) {
            // Don't show unverified data - show "no data" message
            this.adjustedRate.innerHTML = `<span class="rate-no-data">No verified data</span>`;
            this.rateReduction.textContent = '';
        } else {
            this.adjustedRate.textContent = `${(withCondomRate * 100).toFixed(3)}%`;
            const reductionPercent = (condomEff * 100).toFixed(0);
            this.rateReduction.textContent = `(${reductionPercent}% reduction)`;
        }

        // Generate timelines for all scenarios
        const hasVerifiedCondomData = condomSourceId && window.SOURCES && window.SOURCES[condomSourceId];

        const timelineUnprotected = generateRiskTimeline(baseRate, frequency, months);
        const timelineCondom = hasVerifiedCondomData
            ? generateRiskTimeline(withCondomRate, frequency, months)
            : null;
        const timelinePreventative = hasPreventatives
            ? generateRiskTimeline(withPreventativeRate, frequency, months)
            : null;
        const timelineBoth = (hasPreventatives && hasVerifiedCondomData)
            ? generateRiskTimeline(withBothRate, frequency, months)
            : null;

        // Build preventative label for chart
        const preventativeLabel = enabledPreventatives.length > 0
            ? enabledPreventatives.map(p => p.shortName).join(' + ')
            : 'Preventatives';

        // Update chart with all relevant lines
        this.updateChart({
            unprotected: timelineUnprotected,
            condom: timelineCondom,
            preventative: timelinePreventative,
            both: timelineBoth
        }, stiData.name, {
            hasCondomData: hasVerifiedCondomData,
            hasPreventativeData: hasPreventatives,
            preventativeLabel: preventativeLabel
        });

        // Update result summary - show risks
        const finalRiskUnprotected = timelineUnprotected[timelineUnprotected.length - 1].risk;
        const finalRiskCondom = timelineCondom ? timelineCondom[timelineCondom.length - 1].risk : null;
        const finalRiskPreventative = timelinePreventative ? timelinePreventative[timelinePreventative.length - 1].risk : null;
        const finalRiskBoth = timelineBoth ? timelineBoth[timelineBoth.length - 1].risk : null;
        const totalEncounters = timelineUnprotected[timelineUnprotected.length - 1].encounters;

        this.resultDuration.textContent = months;

        // Show risks in the result
        if (hasPreventatives && finalRiskBoth !== null) {
            // Show full progression: unprotected → best protection
            this.resultProbability.innerHTML = `
                <span class="risk-unprotected">${(finalRiskUnprotected * 100).toFixed(1)}%</span>
                <span class="risk-arrow">→</span>
                <span class="risk-antiviral">${(finalRiskBoth * 100).toFixed(1)}%</span>
            `;
        } else if (finalRiskCondom !== null) {
            this.resultProbability.innerHTML = `
                <span class="risk-unprotected">${(finalRiskUnprotected * 100).toFixed(1)}%</span>
                <span class="risk-arrow">→</span>
                <span class="risk-protected">${(finalRiskCondom * 100).toFixed(1)}%</span>
            `;
        } else {
            this.resultProbability.textContent = `${(finalRiskUnprotected * 100).toFixed(1)}%`;
            this.resultProbability.style.color = this.getRiskColor(finalRiskUnprotected);
        }

        // Generate explanation
        this.resultExplanation.innerHTML = this.generateExplanation(
            stiData, baseRate, withCondomRate, totalEncounters,
            finalRiskUnprotected, finalRiskCondom, finalRiskPreventative, finalRiskBoth,
            hasVerifiedCondomData, hasPreventatives,
            combinedPreventativeEff, preventativeLabel, months
        );
    }

    getRiskColor(risk) {
        if (risk < 0.05) return '#10b981';      // Low - green
        if (risk < 0.20) return '#f59e0b';      // Moderate - amber
        if (risk < 0.50) return '#f97316';      // High - orange
        return '#ef4444';                        // Very high - red
    }

    showUnverifiedMessage(stiData) {
        // Clear the chart
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // Show unavailable message in chart area
        const ctx = this.chartCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.chartCanvas.width, this.chartCanvas.height);
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Data not yet available', this.chartCanvas.width / 2, this.chartCanvas.height / 2 - 20);
        ctx.font = '13px Outfit, sans-serif';
        ctx.fillText('Sources being verified', this.chartCanvas.width / 2, this.chartCanvas.height / 2 + 10);

        // Update rate displays
        this.perActRate.innerHTML = '<span style="color: #f59e0b;">⚠ Unverified</span>';
        this.adjustedRate.innerHTML = '<span style="color: #f59e0b;">⚠ Unverified</span>';
        this.rateReduction.textContent = '';

        // Update result
        this.resultProbability.textContent = 'N/A';
        this.resultProbability.style.color = '#6b7280';
        this.resultExplanation.innerHTML = `
            <strong style="color: #f59e0b;">⚠ Data Unavailable</strong><br>
            The transmission data for ${stiData.name} has not been verified yet. 
            We only display numbers that have been confirmed against their original sources.
            <br><br>
            <em>Reason: ${stiData.verificationNote || 'Sources pending verification'}</em>
        `;
    }

    generateExplanation(stiData, baseRate, withCondomRate, encounters,
        riskUnprotected, riskCondom, riskPreventative, riskBoth,
        hasCondomData, hasPreventativeData, preventativeEff, preventativeLabel, months) {
        const unprotectedPercent = (riskUnprotected * 100).toFixed(1);

        const getRiskLevel = (risk) => {
            if (risk < 0.05) return 'relatively low';
            if (risk < 0.20) return 'moderate';
            if (risk < 0.50) return 'significant';
            return 'very high';
        };

        let html = `Over <strong>${months} month${months > 1 ? 's' : ''}</strong> (~${encounters} encounters):<br>`;
        html += `<span style="color:#ef4444;">No protection:</span> <strong>${unprotectedPercent}%</strong> risk (${getRiskLevel(riskUnprotected)})`;

        if (hasCondomData && riskCondom !== null) {
            const condomPercent = (riskCondom * 100).toFixed(1);
            html += `<br><span style="color:#10b981;">Condom only:</span> <strong>${condomPercent}%</strong> risk (${getRiskLevel(riskCondom)})`;
        }

        if (hasPreventativeData && riskPreventative !== null) {
            const preventativePercent = (riskPreventative * 100).toFixed(1);
            html += `<br><span style="color:#8b5cf6;">${preventativeLabel} only:</span> <strong>${preventativePercent}%</strong> risk (${getRiskLevel(riskPreventative)})`;
        }

        if (hasPreventativeData && hasCondomData && riskBoth !== null) {
            const bothPercent = (riskBoth * 100).toFixed(1);
            const totalReduction = riskUnprotected > 0
                ? ((riskUnprotected - riskBoth) / riskUnprotected * 100).toFixed(0)
                : 100;
            html += `<br><span style="color:#06b6d4;">Condom + ${preventativeLabel}:</span> <strong>${bothPercent}%</strong> risk (${getRiskLevel(riskBoth)})`;
            html += `<br><em>Combined protection reduces your cumulative risk by ~${totalReduction}%</em>`;
        } else if (hasCondomData && riskCondom !== null) {
            const reduction = ((riskUnprotected - riskCondom) / riskUnprotected * 100).toFixed(0);
            html += `<br><em>Condoms reduce your cumulative risk by ~${reduction}%</em>`;
        }

        if (stiData.notes) {
            html += `<br><br><em>Note: ${stiData.notes}</em>`;
        }

        return html;
    }

    updateChart(timelines, stiName, options) {
        const { unprotected, condom, preventative, both } = timelines;
        const { hasCondomData, hasPreventativeData, preventativeLabel } = options;

        // Labels show month and encounter count
        const labels = unprotected.map(d => {
            if (d.month === 0) return 'Start';
            return `Mo ${d.month} (${d.encounters})`;
        });

        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.chartCanvas.getContext('2d');

        // Create gradients for each line type
        const gradientUnprotected = ctx.createLinearGradient(0, 0, 0, 300);
        gradientUnprotected.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
        gradientUnprotected.addColorStop(1, 'rgba(239, 68, 68, 0.02)');

        const gradientCondom = ctx.createLinearGradient(0, 0, 0, 300);
        gradientCondom.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
        gradientCondom.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

        const gradientAntiviral = ctx.createLinearGradient(0, 0, 0, 300);
        gradientAntiviral.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
        gradientAntiviral.addColorStop(1, 'rgba(139, 92, 246, 0.02)');

        const gradientBoth = ctx.createLinearGradient(0, 0, 0, 300);
        gradientBoth.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
        gradientBoth.addColorStop(1, 'rgba(6, 182, 212, 0.02)');

        // Build datasets - always show unprotected
        const datasets = [
            {
                label: 'No Protection',
                data: unprotected.map(d => (d.risk * 100).toFixed(2)),
                borderColor: '#ef4444',
                backgroundColor: gradientUnprotected,
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#0a0b0d',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
            }
        ];

        // Add condom line if data available
        if (hasCondomData && condom) {
            datasets.push({
                label: 'Condom Only',
                data: condom.map(d => (d.risk * 100).toFixed(2)),
                borderColor: '#10b981',
                backgroundColor: gradientCondom,
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#0a0b0d',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
            });
        }

        // Add preventative-only line if enabled
        if (hasPreventativeData && preventative) {
            datasets.push({
                label: `${preventativeLabel} Only`,
                data: preventative.map(d => (d.risk * 100).toFixed(2)),
                borderColor: '#8b5cf6',
                backgroundColor: gradientAntiviral,
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#0a0b0d',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                borderDash: [5, 5]  // Dashed line to distinguish
            });
        }

        // Add combined protection line if both available
        if (hasPreventativeData && hasCondomData && both) {
            datasets.push({
                label: `Condom + ${preventativeLabel}`,
                data: both.map(d => (d.risk * 100).toFixed(2)),
                borderColor: '#06b6d4',
                backgroundColor: gradientBoth,
                borderWidth: 2.5,
                fill: true,  // Fill only the lowest line
                tension: 0.3,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#0a0b0d',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5
            });
        }

        // Store timelines for tooltip access
        this._timelines = timelines;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#9ca3af',
                            font: {
                                family: "'Outfit', sans-serif",
                                size: 11
                            },
                            boxWidth: 10,
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'line'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1a1d26',
                        titleColor: '#e8e9ec',
                        bodyColor: '#9ca3af',
                        borderColor: '#2d3139',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                            family: "'Outfit', sans-serif",
                            size: 14,
                            weight: '600'
                        },
                        bodyFont: {
                            family: "'JetBrains Mono', monospace",
                            size: 13
                        },
                        callbacks: {
                            title: (tooltipItems) => {
                                const index = tooltipItems[0].dataIndex;
                                const dataPoint = unprotected[index];
                                if (dataPoint.month === 0) return 'Start (0 sex acts)';
                                return `Month ${dataPoint.month} (${dataPoint.encounters} sex acts)`;
                            },
                            label: function (context) {
                                return `${context.dataset.label}: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                family: "'Outfit', sans-serif",
                                size: 11
                            },
                            maxTicksLimit: 12
                        }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                family: "'JetBrains Mono', monospace",
                                size: 11
                            },
                            callback: function (value) {
                                return value + '%';
                            },
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }
}

// ============================================
// SMOOTH SCROLLING & NAV
// ============================================

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// ============================================
// MOBILE NAVIGATION
// ============================================

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('active');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav')) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll when menu open
    }
}

function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// ============================================
// MOBILE TOOLTIP HANDLING
// ============================================

function initMobileTooltips() {
    // On touch devices, toggle tooltips on tap instead of hover
    if (!('ontouchstart' in window)) return;

    let activeTooltip = null;

    document.addEventListener('click', (e) => {
        // If clicking on a link inside the tooltip, let it through!
        const clickedLink = e.target.closest('a.cite-tooltip-link');
        if (clickedLink) {
            // Allow the link to work - don't prevent default
            return;
        }

        const citable = e.target.closest('.citable, .citable-unverified');

        if (citable) {
            e.preventDefault();
            e.stopPropagation();

            // Close any other open tooltip
            if (activeTooltip && activeTooltip !== citable) {
                activeTooltip.classList.remove('tooltip-active');
            }

            // Toggle this tooltip
            citable.classList.toggle('tooltip-active');
            activeTooltip = citable.classList.contains('tooltip-active') ? citable : null;
        } else {
            // Clicked outside - close any open tooltip
            if (activeTooltip) {
                activeTooltip.classList.remove('tooltip-active');
                activeTooltip = null;
            }
        }
    });
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator
    const calculator = new RiskCalculator();

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Initialize mobile navigation
    initMobileNav();

    // Initialize mobile tooltips
    initMobileTooltips();

    // Log data sources for transparency
    console.log('📊 Know Your Numbers - STI Risk Calculator');
    console.log('Data sources:', Object.entries(STI_DATA).map(([key, data]) => ({
        sti: data.name,
        source: data.source,
        url: data.sourceUrl
    })));
});

// Export for testing/debugging
window.STI_DATA = STI_DATA;
window.calculateCumulativeRisk = calculateCumulativeRisk;
window.adjustForCondom = adjustForCondom;
