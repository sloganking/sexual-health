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
        verificationNote: 'Verified against CDC HIV Risk and Prevention Estimates page',
        rates: {
            mtf: {
                value: 0.0008,  // 8 per 10,000 = 0.08%
                sourceId: 'hiv_cdc_risk_estimates'
            },
            ftm: {
                value: 0.0004,  // 4 per 10,000 = 0.04%
                sourceId: 'hiv_cdc_risk_estimates'
            }
        },
        condomEffectiveness: {
            value: null,  // Need to find verified source for condom effectiveness
            sourceId: null
        },
        source: 'CDC HIV Risk and Prevention Estimates',
        sourceUrl: 'https://www.cdc.gov/hivpartners/php/riskandprevention/index.html',
        notes: 'Rates assume detectable viral load. Undetectable = Untransmittable (U=U).'
    },
    
    hsv2: {
        name: 'Herpes (HSV-2)',
        verified: false,
        verificationNote: 'Sources not yet verified - do not use',
        rates: {
            mtf: { value: null, sourceId: null },
            ftm: { value: null, sourceId: null }
        },
        condomEffectiveness: { value: null, sourceId: null },
        source: 'UNVERIFIED',
        sourceUrl: '#',
        notes: 'Data temporarily unavailable - sources being verified.'
    },
    
    hpv: {
        name: 'HPV',
        verified: false,
        verificationNote: 'Sources not yet verified - do not use',
        rates: {
            mtf: { value: null, sourceId: null },
            ftm: { value: null, sourceId: null }
        },
        condomEffectiveness: { value: null, sourceId: null },
        source: 'UNVERIFIED',
        sourceUrl: '#',
        notes: 'Data temporarily unavailable - sources being verified.'
    },
    
    chlamydia: {
        name: 'Chlamydia',
        verified: false,
        verificationNote: 'Wrong PMID was cited - need to find correct source',
        rates: {
            mtf: { value: null, sourceId: null },
            ftm: { value: null, sourceId: null }
        },
        condomEffectiveness: { value: null, sourceId: null },
        source: 'UNVERIFIED',
        sourceUrl: '#',
        notes: 'Data temporarily unavailable - sources being verified.'
    },
    
    gonorrhea: {
        name: 'Gonorrhea',
        verified: false,
        verificationNote: 'Sources not yet verified - do not use',
        rates: {
            mtf: { value: null, sourceId: null },
            ftm: { value: null, sourceId: null }
        },
        condomEffectiveness: { value: null, sourceId: null },
        source: 'UNVERIFIED',
        sourceUrl: '#',
        notes: 'Data temporarily unavailable - sources being verified.'
    },
    
    syphilis: {
        name: 'Syphilis',
        verified: false,
        verificationNote: 'Sources not yet verified - do not use',
        rates: {
            mtf: { value: null, sourceId: null },
            ftm: { value: null, sourceId: null }
        },
        condomEffectiveness: { value: null, sourceId: null },
        source: 'UNVERIFIED',
        sourceUrl: '#',
        notes: 'Data temporarily unavailable - sources being verified.'
    }
};

// ============================================
// CITABLE NUMBERS SYSTEM
// ============================================

/**
 * Create a citable number span with hover tooltip
 * @param {string} displayText - The text to display (e.g., "0.08%")
 * @param {string} sourceId - The ID in the SOURCES object
 * @returns {string} HTML string for the citable element
 */
function createCitableNumber(displayText, sourceId) {
    if (!window.SOURCES || !window.SOURCES[sourceId]) {
        console.warn(`Source not found: ${sourceId}`);
        return displayText;
    }
    
    const source = window.SOURCES[sourceId];
    const escapedQuote = source.quote.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const verifiedDate = source.verifiedDate || source.accessDate || 'Unknown';
    const isDerived = source.isDerived || false;
    const typeLabel = isDerived ? 'derived' : 'direct';
    const typeDisplay = isDerived ? 'Calculated' : 'Direct quote';
    
    let derivationHtml = '';
    if (isDerived && source.derivation) {
        const escapedDerivation = source.derivation.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        derivationHtml = `
            <div class="cite-tooltip-derivation">
                <span class="cite-tooltip-derivation-label">How we calculated this:</span>
                ${escapedDerivation.replace(/\n/g, '<br>')}
            </div>`;
    }
    
    return `<span class="citable" data-source="${sourceId}">
        ${displayText}
        <span class="cite-tooltip">
            <span class="cite-tooltip-source">
                ${source.name}
                <span class="cite-tooltip-type ${typeLabel}">${typeDisplay}</span>
            </span>
            <span class="cite-tooltip-quote">"${escapedQuote}"</span>
            ${derivationHtml}
            <a href="${source.url}" target="_blank" class="cite-tooltip-link">View source →</a>
            <span class="cite-tooltip-meta">Last verified: ${verifiedDate}</span>
        </span>
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
        this.updateCalculation();
    }
    
    initElements() {
        // Input elements
        this.stiSelect = document.getElementById('sti-select');
        this.directionSelect = document.getElementById('direction-select');
        this.condomSelect = document.getElementById('condom-select');
        this.frequencyInput = document.getElementById('frequency-input');
        this.durationInput = document.getElementById('duration-input');
        
        // Display elements
        this.frequencyValue = document.getElementById('frequency-value');
        this.durationValue = document.getElementById('duration-value');
        this.perActRate = document.getElementById('per-act-rate');
        this.adjustedRate = document.getElementById('adjusted-rate');
        this.rateSource = document.getElementById('rate-source');
        this.resultDuration = document.getElementById('result-duration');
        this.resultProbability = document.getElementById('result-probability');
        this.resultExplanation = document.getElementById('result-explanation-text');
        
        // Chart
        this.chartCanvas = document.getElementById('risk-chart');
    }
    
    bindEvents() {
        this.stiSelect.addEventListener('change', () => this.updateCalculation());
        this.directionSelect.addEventListener('change', () => this.updateCalculation());
        this.condomSelect.addEventListener('change', () => this.updateCalculation());
        
        this.frequencyInput.addEventListener('input', () => {
            this.frequencyValue.textContent = this.getFrequencyLabel(parseInt(this.frequencyInput.value));
            this.updateCalculation();
        });
        
        this.durationInput.addEventListener('input', () => {
            this.durationValue.textContent = this.durationInput.value;
            this.updateCalculation();
        });
    }
    
    getFrequencyLabel(value) {
        if (value <= 7) {
            return value;
        } else if (value <= 14) {
            return `${Math.round(value / 7)}×/day`;
        } else {
            return `${Math.round(value / 7)}×/day`;
        }
    }
    
    updateCalculation() {
        const sti = this.stiSelect.value;
        const direction = this.directionSelect.value;
        const useCondom = this.condomSelect.value === 'condom';
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
        const condomEff = typeof stiData.condomEffectiveness === 'object'
            ? stiData.condomEffectiveness.value
            : stiData.condomEffectiveness;
        const adjustedRateValue = useCondom 
            ? adjustForCondom(baseRate, condomEff) 
            : baseRate;
        
        // Update rate display with citable sources
        const rateSourceId = typeof stiData.rates[direction] === 'object' 
            ? stiData.rates[direction].sourceId 
            : null;
        const condomSourceId = typeof stiData.condomEffectiveness === 'object'
            ? stiData.condomEffectiveness.sourceId
            : null;
        
        if (rateSourceId && window.SOURCES && window.SOURCES[rateSourceId]) {
            this.perActRate.innerHTML = createCitableNumber(
                `${(baseRate * 100).toFixed(3)}%`, 
                rateSourceId
            );
        } else {
            this.perActRate.textContent = `${(baseRate * 100).toFixed(3)}%`;
        }
        
        // Show adjusted rate with condom source if applicable
        if (useCondom && condomSourceId && window.SOURCES && window.SOURCES[condomSourceId]) {
            this.adjustedRate.innerHTML = createCitableNumber(
                `${(adjustedRateValue * 100).toFixed(3)}%`,
                condomSourceId
            );
        } else {
            this.adjustedRate.textContent = `${(adjustedRateValue * 100).toFixed(3)}%`;
        }
        
        this.rateSource.textContent = stiData.source;
        this.rateSource.href = stiData.sourceUrl;
        
        // Generate timeline data
        const timeline = generateRiskTimeline(adjustedRateValue, frequency, months);
        
        // Update chart
        this.updateChart(timeline, stiData.name, useCondom);
        
        // Update result summary
        const finalRisk = timeline[timeline.length - 1].risk;
        const totalEncounters = timeline[timeline.length - 1].encounters;
        
        this.resultDuration.textContent = months;
        this.resultProbability.textContent = `${(finalRisk * 100).toFixed(1)}%`;
        
        // Color code the result
        this.resultProbability.style.color = this.getRiskColor(finalRisk);
        
        // Generate explanation
        this.resultExplanation.innerHTML = this.generateExplanation(
            stiData, adjustedRateValue, totalEncounters, finalRisk, useCondom, months
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
        this.rateSource.textContent = 'Pending verification';
        this.rateSource.href = '#';
        
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
    
    generateExplanation(stiData, perActRisk, encounters, totalRisk, useCondom, months) {
        const percentage = (totalRisk * 100).toFixed(1);
        const perActPercent = (perActRisk * 100).toFixed(3);
        
        let riskLevel;
        if (totalRisk < 0.05) riskLevel = 'relatively low';
        else if (totalRisk < 0.20) riskLevel = 'moderate';
        else if (totalRisk < 0.50) riskLevel = 'significant';
        else riskLevel = 'very high';
        
        let html = `With a per-act risk of <strong>${perActPercent}%</strong>`;
        if (useCondom) html += ` (after condom protection)`;
        html += `, and approximately <strong>${encounters} encounters</strong> over ${months} month${months > 1 ? 's' : ''}, `;
        html += `your cumulative risk of contracting ${stiData.name} is <strong>${riskLevel}</strong>.`;
        
        if (stiData.notes) {
            html += `<br><br><em>Note: ${stiData.notes}</em>`;
        }
        
        return html;
    }
    
    updateChart(timeline, stiName, useCondom) {
        const labels = timeline.map(d => `Month ${d.month}`);
        const data = timeline.map(d => (d.risk * 100).toFixed(2));
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        const ctx = this.chartCanvas.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0.02)');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${stiName} Risk${useCondom ? ' (with condom)' : ''}`,
                    data: data,
                    borderColor: '#f59e0b',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#0a0b0d',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
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
                                size: 12
                            },
                            boxWidth: 12,
                            padding: 20
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
                            label: function(context) {
                                return `Risk: ${context.parsed.y}%`;
                            },
                            afterLabel: function(context) {
                                const dataPoint = timeline[context.dataIndex];
                                return `(~${dataPoint.encounters} encounters)`;
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
                            callback: function(value) {
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
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
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
