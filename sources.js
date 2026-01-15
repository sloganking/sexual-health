/**
 * SOURCE DATABASE
 * 
 * Every number on this site must have a source with:
 * - url: Link to the source
 * - quote: Exact text from the source that supports the number
 * - verifiedDate: When we last ran the test suite and verified this quote exists
 * - type: 'webpage' | 'pdf' | 'abstract' (affects testability)
 * - isDerived: true if we calculated this from source data (not a direct quote)
 * - derivation: (if isDerived) explanation of how we got the number from the source
 * 
 * IMPORTANT: Run `node test-sources.js` periodically to verify links still work
 * and quotes still exist on the pages.
 */

const SOURCES = {
    // ===========================================
    // HIV SOURCES - VERIFIED ✓
    // ===========================================
    
    hiv_cdc_risk_estimates: {
        id: 'hiv_cdc_risk_estimates',
        name: 'CDC HIV Risk and Prevention Estimates',
        url: 'https://www.cdc.gov/hivpartners/php/riskandprevention/index.html',
        // Each part separated by ... must exist on the page
        quote: 'Risk per 10,000 exposures ... Receptive penile-vaginal intercourse ... 8 ... Insertive penile-vaginal intercourse ... 4',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        notes: 'VERIFIED ✓ - From the Sexual transmission risk table on the CDC page.'
    },
    
    hiv_boily_2009_meta: {
        id: 'hiv_boily_2009_meta',
        name: 'Boily et al. 2009 - Lancet - HIV Per-Act Transmission Meta-Analysis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19179227/',
        // Multi-part quote with key transmission estimates
        quote: 'systematic review and meta-analysis of observational studies of the risk of HIV-1 transmission per heterosexual contact ... female-to-male (0.04% per act [95% CI 0.01-0.14]) and male-to-female (0.08% per act [95% CI 0.06-0.11]) transmission estimates in high-income countries',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'VERIFIED ✓ - Meta-analysis of 25 studies providing per-act HIV transmission probabilities. Note: These are HIGH-INCOME country estimates without antivirals.'
    },
    
    hiv_condom_effectiveness: {
        id: 'hiv_condom_effectiveness',
        name: 'CDC - Condom Effectiveness for HIV Prevention',
        url: 'https://www.cdc.gov/hivpartners/php/riskandprevention/index.html',
        quote: 'Always using condoms, based on self-report, during sex with an HIV-positive partner reduces the risk of HIV acquisition by an estimated 80% among heterosexual men and women',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        notes: 'VERIFIED ✓ - Exact quote from CDC condom effectiveness section.'
    },
    
    // ===========================================
    // HSV-2 (Herpes) SOURCES
    // ===========================================
    
    hsv2_corey_2004: {
        id: 'hsv2_corey_2004',
        name: 'Corey et al. 2004 - NEJM - HSV-2 Transmission Study',
        url: 'https://pubmed.ncbi.nlm.nih.gov/14702423/',
        quote: 'heterosexual, monogamous couples ... eight months ... Overall, acquisition of HSV-2 was observed in 14 of the susceptible partners who received valacyclovir (1.9 percent), as compared with 27 (3.6 percent) who received placebo',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'VERIFIED ✓ - This gives baseline transmission rate of 3.6% per 8 months without antivirals.'
    },
    
    // Derived per-act rate for HSV-2 (calculated from the 8-month study data)
    hsv2_per_act_derived: {
        id: 'hsv2_per_act_derived',
        name: 'HSV-2 Per-Act Rate (Derived)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/14702423/',
        quote: 'heterosexual, monogamous couples ... eight months ... 27 (3.6 percent) who received placebo',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'transmission_8mo',
                    value: '3.6%',
                    source: 'quote',
                    highlight: '3.6 percent'
                },
                {
                    name: 'study_duration',
                    value: '8 months',
                    source: 'quote',
                    highlight: 'eight months'
                },
                {
                    name: 'sex_frequency',
                    value: '2x per week',
                    source: 'assumption',
                    note: 'Average for monogamous couples (not stated in study)'
                },
                {
                    name: 'total_acts',
                    value: '~69 acts',
                    source: 'calculated',
                    calculation: '8 months × 4.33 weeks × 2 acts/week ≈ 69 acts'
                }
            ],
            steps: [
                'From quote: transmission_8mo = 3.6%',
                'From quote: study_duration = 8 months',
                '⚠️ Assumed: sex_frequency = 2x per week (not in study)',
                'Calculated: total_acts = 8 × 4.33 × 2 ≈ 69',
                'Formula: per_act_rate = 1 - (1 - transmission_8mo)^(1/total_acts)',
                'Calculation: per_act_rate = 1 - (1 - 0.036)^(1/69)',
                'per_act_rate ≈ 0.00053 = 0.053%'
            ],
            result: {
                name: 'per_act_transmission_rate',
                value: '0.053%',
                numericValue: 0.00053
            },
            warnings: ['Sex frequency assumed (not stated in study)']
        }
    },
    
    // ===========================================
    // CHLAMYDIA SOURCES
    // ===========================================
    
    chlamydia_price_2021: {
        id: 'chlamydia_price_2021',
        name: 'Price et al. 2021 - BMJ STI - Chlamydia Per-Partnership Transmission',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33349846/',
        // Multi-part quote with key transmission estimates
        quote: 'Per-partnership transmission probabilities for Chlamydia trachomatis infection ... male-to-female transmission probabilities per partnership were 32.1% [95% credible interval (CrI) 18.4-55.9%] (Natsal-2) and 34.9% (95%CrI 22.6-54.9%) (NHANES). Female-to-male transmission probabilities were 21.4% (95%CrI 5.1-67.0%) (Natsal-2) and 4.6% (95%CrI 1.0-13.1%) (NHANES)',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'VERIFIED ✓ - Per-PARTNERSHIP (not per-act) transmission probabilities from UK and US population surveys. Note the wide credible intervals indicating uncertainty.'
    },
    
    // ===========================================
    // SYPHILIS SOURCES
    // ===========================================
    
    syphilis_schober_1983: {
        id: 'syphilis_schober_1983',
        name: 'Schober et al. 1983 - How Infectious is Syphilis?',
        url: 'https://pubmed.ncbi.nlm.nih.gov/6871650/',
        // Multi-part quote with key transmission data
        quote: 'sexual contacts of patients with primary and secondary syphilis ... 65 of 127 (51%) contacts at risk developed syphilis ... heterosexuals (17/29, 58%)',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'VERIFIED ✓ - Per-PARTNERSHIP transmission rate from contacts of infectious syphilis cases. 51% overall, 58% for heterosexuals. This is a classic study from 1983.'
    },
    
    // ===========================================
    // GONORRHEA SOURCES
    // ===========================================
    
    gonorrhea_ncbi_book: {
        id: 'gonorrhea_ncbi_book',
        name: 'NCBI Book - Partner Notification for STI Transmission Model',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK261441/',
        // Multi-part quote showing gonorrhea transmission relative to chlamydia
        quote: 'transmission probabilities for chlamydia and gonorrhoea are 38% and 62.5%, respectively ... transmission probability for gonorrhoea is assumed to be twice that of chlamydia',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        notes: 'VERIFIED ✓ - Per-PARTNERSHIP transmission probabilities from UK modeling study. Gonorrhea ~62.5% per partnership, assumed 2x chlamydia per-act.'
    },
    
    // ===========================================
    // HPV SOURCES
    // ===========================================
    
    hpv_burchell_2013: {
        id: 'hpv_burchell_2013',
        name: 'Burchell et al. 2013 - HPV Transmission in Couples',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24253288/',
        // Multi-part quote with transmission incidence rates
        quote: 'HPV type-specific transmission incidence rate was 12.3 (95% confidence interval, 7.1-19.6) per 1000 person-months for female-to-male transmission and 7.3 (95% confidence interval, 3.5-13.5) per 1000 person-months for male-to-female transmission',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'VERIFIED ✓ - Per 1000 person-months transmission rates from couples study. Note: This is incidence over time, not per-act probability.'
    },
    
    hpv_lifetime_chesson: {
        id: 'hpv_lifetime_chesson',
        name: 'Chesson et al. 2014 - HPV Lifetime Probability',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25299412/',
        // Multi-part quote with lifetime acquisition probability
        quote: 'estimated lifetime probability of acquiring human papillomavirus ... average lifetime probability of acquiring HPV among those with at least 1 opposite sex partner to be 84.6% (range, 53.6%-95.0%) for women and 91.3% (range, 69.5%-97.7%) for men',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'VERIFIED ✓ - Lifetime HPV acquisition probability. Shows HPV is extremely common - most sexually active people will get it.'
    }
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SOURCES };
} else {
    window.SOURCES = SOURCES;
}
