/**
 * Know Your Numbers - STI Risk Calculator
 * 
 * All transmission rates are sourced from peer-reviewed studies.
 * See the methodology section for full citations.
 */

// ============================================
// STI TRANSMISSION DATA
// ============================================

const STI_DATA = {
    hiv: {
        name: 'HIV',
        // Per-act transmission rates (decimal)
        // Source: CDC, Boily et al. 2009
        rates: {
            mtf: 0.0008,  // 0.08% male-to-female
            ftm: 0.0004   // 0.04% female-to-male
        },
        // Condom effectiveness (reduction factor)
        condomEffectiveness: 0.80,  // 80% reduction
        source: 'CDC HIV Risk',
        sourceUrl: 'https://www.cdc.gov/hiv/risk/index.html',
        notes: 'Rates assume detectable viral load. Undetectable = Untransmittable (U=U).'
    },
    
    hsv2: {
        name: 'Herpes (HSV-2)',
        // Annual rates converted to per-act based on ~100 acts/year
        // Source: Mertz et al. 1992, Corey et al. 2004
        rates: {
            mtf: 0.001,   // ~0.1% per act (10% annual / ~100 acts)
            ftm: 0.0004   // ~0.04% per act (4% annual / ~100 acts)
        },
        condomEffectiveness: 0.30,  // 30% reduction (skin-to-skin transmission)
        source: 'Mertz et al. 1992',
        sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/1656936/',
        notes: 'Daily antivirals reduce risk by additional 50%. Avoiding outbreaks further reduces risk.'
    },
    
    hpv: {
        name: 'HPV',
        // Per-act estimates are highly variable
        // Source: Burchell et al. 2011, Winer et al. 2006
        rates: {
            mtf: 0.10,    // ~10% (conservative estimate)
            ftm: 0.10     // ~10% (symmetric assumption)
        },
        condomEffectiveness: 0.70,  // 70% reduction
        source: 'Burchell et al. 2011',
        sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/21774844/',
        notes: 'Vaccination prevents most dangerous strains. 90% of infections clear within 2 years.'
    },
    
    chlamydia: {
        name: 'Chlamydia',
        // Source: Price et al. 2011 (JRSS)
        rates: {
            mtf: 0.125,   // 12.5% male-to-female
            ftm: 0.075    // ~7.5% female-to-male
        },
        condomEffectiveness: 0.65,  // 65% reduction
        source: 'Price et al. 2011',
        sourceUrl: 'https://academic.oup.com/jrsssa/article/174/4/975/7077900',
        notes: 'Easily cured with antibiotics. Often asymptomatic - get tested regularly.'
    },
    
    gonorrhea: {
        name: 'Gonorrhea',
        // Source: Hooper et al. 1978, various epidemiological studies
        rates: {
            mtf: 0.60,    // 60% male-to-female (range 50-70%)
            ftm: 0.22     // 22% female-to-male (range 20-25%)
        },
        condomEffectiveness: 0.60,  // 60% reduction
        source: 'Hooper et al. 1978',
        sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/7775396/',
        notes: 'Extremely high transmission rate. Antibiotic resistance is increasing concern.'
    },
    
    syphilis: {
        name: 'Syphilis',
        // Per contact with primary sore
        // Source: CDC, Tuite et al. 2018
        rates: {
            mtf: 0.30,    // 30% (primary stage with sore)
            ftm: 0.30     // 30% (symmetric)
        },
        condomEffectiveness: 0.50,  // ~50% (sore may not be covered)
        source: 'CDC Syphilis Overview',
        sourceUrl: 'https://www.cdc.gov/syphilis/about/index.html',
        notes: 'Transmission varies dramatically by stage. Highest risk during primary stage (chancre).'
    }
};

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
        const baseRate = stiData.rates[direction];
        const adjustedRateValue = useCondom 
            ? adjustForCondom(baseRate, stiData.condomEffectiveness) 
            : baseRate;
        
        // Update rate display
        this.perActRate.textContent = `${(baseRate * 100).toFixed(3)}%`;
        this.adjustedRate.textContent = `${(adjustedRateValue * 100).toFixed(3)}%`;
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
