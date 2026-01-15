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
        quote: 'Risk per 10,000 exposures ... Receptive penile-vaginal intercourse ... 8 ... Insertive penile-vaginal intercourse ... 4',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: true,  // Technically we're extracting and converting
        derivation: {
            variables: [
                {
                    name: 'risk_mtf_per_10k',
                    value: '8 per 10,000',
                    source: 'quote',
                    highlight: '8'
                },
                {
                    name: 'risk_ftm_per_10k',
                    value: '4 per 10,000',
                    source: 'quote',
                    highlight: '4'
                }
            ],
            steps: [
                'From quote: risk_mtf_per_10k = 8 per 10,000 exposures',
                'From quote: risk_ftm_per_10k = 4 per 10,000 exposures',
                'Convert: per_act_mtf = 8 ÷ 10,000 = 0.0008 = 0.08%',
                'Convert: per_act_ftm = 4 ÷ 10,000 = 0.0004 = 0.04%'
            ],
            result: {
                name: 'per_act_transmission_rate',
                value: '0.08% (M→F) / 0.04% (F→M)'
            }
        }
    },
    
    hiv_boily_2009_meta: {
        id: 'hiv_boily_2009_meta',
        name: 'Boily et al. 2009 - Lancet - HIV Per-Act Transmission Meta-Analysis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19179227/',
        quote: 'systematic review and meta-analysis of observational studies of the risk of HIV-1 transmission per heterosexual contact ... female-to-male (0.04% per act [95% CI 0.01-0.14]) and male-to-female (0.08% per act [95% CI 0.06-0.11]) transmission estimates in high-income countries',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'per_act_ftm',
                    value: '0.04%',
                    source: 'quote',
                    highlight: '0.04% per act'
                },
                {
                    name: 'per_act_mtf',
                    value: '0.08%',
                    source: 'quote',
                    highlight: '0.08% per act'
                }
            ],
            steps: [
                'From quote: per_act_ftm = 0.04% (female-to-male)',
                'From quote: per_act_mtf = 0.08% (male-to-female)',
                'Note: These are high-income country estimates'
            ],
            result: {
                name: 'per_act_transmission_rate',
                value: '0.08% (M→F) / 0.04% (F→M)'
            }
        }
    },
    
    hiv_condom_effectiveness: {
        id: 'hiv_condom_effectiveness',
        name: 'CDC - Condom Effectiveness for HIV Prevention',
        url: 'https://www.cdc.gov/hivpartners/php/riskandprevention/index.html',
        quote: 'Always using condoms, based on self-report, during sex with an HIV-positive partner reduces the risk of HIV acquisition by an estimated 80% among heterosexual men and women',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'risk_reduction',
                    value: '80%',
                    source: 'quote',
                    highlight: '80%'
                },
                {
                    name: 'population',
                    value: 'heterosexual men and women',
                    source: 'quote',
                    highlight: 'heterosexual men and women'
                },
                {
                    name: 'usage_type',
                    value: 'consistent use (self-reported)',
                    source: 'quote',
                    highlight: 'Always using condoms, based on self-report'
                }
            ],
            steps: [
                'From quote: risk_reduction = 80%',
                'From quote: applies to heterosexual couples',
                'Note: Based on self-reported "always" use',
                'Calculation: protected_rate = base_rate × (1 - 0.80)'
            ],
            result: {
                name: 'condom_risk_reduction',
                value: '80%'
            }
        }
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
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'study_duration',
                    value: '8 months',
                    source: 'quote',
                    highlight: 'eight months'
                },
                {
                    name: 'placebo_transmission',
                    value: '3.6%',
                    source: 'quote',
                    highlight: '3.6 percent'
                },
                {
                    name: 'valacyclovir_transmission',
                    value: '1.9%',
                    source: 'quote',
                    highlight: '1.9 percent'
                }
            ],
            steps: [
                'From quote: study_duration = 8 months',
                'From quote: placebo_transmission = 3.6% over 8 months',
                'From quote: valacyclovir_transmission = 1.9% over 8 months',
                'Reduction with antivirals: (3.6 - 1.9) / 3.6 = 47%'
            ],
            result: {
                name: 'transmission_over_8_months',
                value: '3.6% (no treatment) / 1.9% (with antivirals)'
            }
        }
    },
    
    hsv2_condom_effectiveness: {
        id: 'hsv2_condom_effectiveness',
        name: 'Martin et al. 2009 - HSV-2 Condom Effectiveness',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4725379/',
        quote: 'Condoms were 96% effective at preventing HSV-2 transmission from men to women and 65% effective from women to men',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                {
                    name: 'effectiveness_mtf',
                    value: '96%',
                    source: 'quote',
                    highlight: '96%'
                },
                {
                    name: 'effectiveness_ftm',
                    value: '65%',
                    source: 'quote',
                    highlight: '65%'
                }
            ],
            steps: [
                'From quote: condom effectiveness M→F = 96%',
                'From quote: condom effectiveness F→M = 65%'
            ],
            result: {
                name: 'condom_effectiveness',
                value: '96% (M→F) / 65% (F→M)'
            },
            warnings: [
                'Study conducted in HIV-discordant couples',
                'Using average (80.5%) for calculator since direction not always known'
            ]
        }
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
        quote: 'Per-partnership transmission probabilities for Chlamydia trachomatis infection ... male-to-female transmission probabilities per partnership were 32.1% [95% credible interval (CrI) 18.4-55.9%] (Natsal-2) and 34.9% (95%CrI 22.6-54.9%) (NHANES). Female-to-male transmission probabilities were 21.4% (95%CrI 5.1-67.0%) (Natsal-2) and 4.6% (95%CrI 1.0-13.1%) (NHANES)',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'Per-PARTNERSHIP rates - see chlamydia_ncbi_per_act for per-act rates'
    },
    
    chlamydia_ncbi_per_act: {
        id: 'chlamydia_ncbi_per_act',
        name: 'NCBI Book - Chlamydia Per-Act Transmission',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK261441/',
        quote: 'the per-partnership transmission probabilities for chlamydia and gonorrhoea are 38% and 62.5%, respectively ... the per-sex act transmission probability is uniformly distributed between 6% and 16.7% ... the per-sex act transmission probability for gonorrhoea is assumed to be twice that of chlamydia',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'per_act_range',
                    value: '6% to 16.7%',
                    source: 'quote',
                    highlight: '6% and 16.7%'
                },
                {
                    name: 'gonorrhea_relation',
                    value: '2× chlamydia',
                    source: 'quote',
                    highlight: 'twice that of chlamydia'
                }
            ],
            steps: [
                'From quote: per-sex act rate = 6% to 16.7%',
                'From quote: gonorrhoea per-act = "twice that of chlamydia"',
                '⚠️ INFERENCE: The 6-16.7% must be for chlamydia (since gonorrhoea is defined relative to it)',
                'Midpoint: (6 + 16.7) / 2 = 11.35%'
            ],
            result: {
                name: 'per_act_transmission_rate',
                value: '~11% (range 6-17%)'
            },
            warnings: [
                '⚠️ Rate being for chlamydia is INFERRED, not explicitly stated',
                'Wide range reflects uncertainty',
                'Study does not distinguish M→F vs F→M'
            ]
        }
    },
    
    // ===========================================
    // SYPHILIS SOURCES
    // ===========================================
    
    syphilis_ashm_per_act: {
        id: 'syphilis_ashm_per_act',
        name: 'ASHM Contact Tracing Guidelines - Syphilis Per-Act Transmission',
        url: 'https://contacttracing.ashm.org.au/syphilis/',
        quote: 'transmission per act of unprotected intercourse Early syphilis (primary, secondary, early latent): >20 %',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'per_act_early_syphilis',
                    value: '>20%',
                    source: 'quote',
                    highlight: '>20 %'
                },
                {
                    name: 'applicable_stages',
                    value: 'primary, secondary, early latent',
                    source: 'quote',
                    highlight: 'primary, secondary, early latent'
                }
            ],
            steps: [
                'From quote: per-act transmission = >20% for early syphilis',
                'From quote: applies to primary, secondary, early latent stages',
                'Using 20% as conservative estimate (lower bound of >20%)'
            ],
            result: {
                name: 'per_act_transmission_rate',
                value: '>20% (early syphilis)'
            },
            warnings: [
                'Applies ONLY to early syphilis (primary, secondary, early latent)',
                'Late latent and tertiary syphilis are usually not infectious',
                'Rate is stated as ">20%" - using 20% as conservative estimate'
            ]
        }
    },
    
    syphilis_schober_1983: {
        id: 'syphilis_schober_1983',
        name: 'Schober et al. 1983 - How Infectious is Syphilis?',
        url: 'https://pubmed.ncbi.nlm.nih.gov/6871650/',
        quote: 'sexual contacts of patients with primary and secondary syphilis ... 65 of 127 (51%) contacts at risk developed syphilis ... heterosexuals (17/29, 58%)',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'Per-PARTNERSHIP rate - see syphilis_ashm_per_act for per-act rates'
    },
    
    // ===========================================
    // GONORRHEA SOURCES
    // ===========================================
    
    gonorrhea_ncbi_book: {
        id: 'gonorrhea_ncbi_book',
        name: 'NCBI Book - Partner Notification for STI Transmission Model',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK261441/',
        quote: 'the per-partnership transmission probabilities for chlamydia and gonorrhoea are 38% and 62.5%, respectively ... the per-sex act transmission probability is uniformly distributed between 6% and 16.7% ... the per-sex act transmission probability for gonorrhoea is assumed to be twice that of chlamydia',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'per_act_range',
                    value: '6% to 16.7%',
                    source: 'quote',
                    highlight: '6% and 16.7%'
                },
                {
                    name: 'gonorrhea_is_2x_chlamydia',
                    value: '2× chlamydia',
                    source: 'quote',
                    highlight: 'twice that of chlamydia'
                },
                {
                    name: 'chlamydia_per_act',
                    value: '6% to 16.7%',
                    source: 'inference',
                    highlight: '⚠️ INFERRED: 6-16.7% must be chlamydia since gonorrhea is relative to it'
                }
            ],
            steps: [
                'From quote: per-sex act rate = 6% to 16.7%',
                'From quote: gonorrhea per-act = "twice that of chlamydia"',
                '⚠️ INFERENCE: 6-16.7% must be for chlamydia',
                'Chlamydia midpoint: (6 + 16.7) / 2 = 11.4%',
                'Gonorrhea = 2 × 11.4% = 22.8%'
            ],
            result: {
                name: 'per_act_transmission_rate',
                value: '~23% (range 12-33%)'
            },
            warnings: [
                '⚠️ Chlamydia rate is INFERRED, not explicitly stated',
                'Wide range due to uncertainty (12-33%)',
                'Gonorrhea derived as 2× chlamydia per model assumption'
            ]
        }
    },
    
    // ===========================================
    // HPV SOURCES
    // ===========================================

    hpv_hitch_2021: {
        id: 'hpv_hitch_2021',
        name: 'Malagón et al. 2021 - HITCH Cohort HPV Transmission Rates',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8012224/',
        quote: 'The estimated median transmission rate from an HPV-positive to a negative partner was 4.2 ... per 100 person–months. The transmission rate from men to women was 3.5 ... and from women to men was 5.6 ... per 100 person–months.',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'mtf_rate_per_100_person_months',
                    value: '3.5 per 100 person–months',
                    source: 'quote',
                    highlight: '3.5'
                },
                {
                    name: 'ftm_rate_per_100_person_months',
                    value: '5.6 per 100 person–months',
                    source: 'quote',
                    highlight: '5.6'
                },
                {
                    name: 'assumed_sex_frequency',
                    value: '2× per week',
                    source: 'assumption',
                    note: 'Assumed average sexual frequency; not stated in study'
                },
                {
                    name: 'acts_per_month',
                    value: '~8.66 acts/month',
                    source: 'calculated',
                    calculation: '2 acts/week × 4.33 weeks/month ≈ 8.66 acts/month'
                }
            ],
            steps: [
                'From quote: mtf_rate = 3.5 per 100 person–months',
                'From quote: ftm_rate = 5.6 per 100 person–months',
                'Convert: mtf_monthly_rate = 3.5 ÷ 100 = 0.035',
                'Convert: ftm_monthly_rate = 5.6 ÷ 100 = 0.056',
                '⚠️ Assumed: 2 sex acts/week ≈ 8.66 acts/month',
                'Formula: per_act = 1 - (1 - monthly_rate)^(1/acts_per_month)',
                'Calculation: mtf_per_act = 1 - (1 - 0.035)^(1/8.66) ≈ 0.0041',
                'Calculation: ftm_per_act = 1 - (1 - 0.056)^(1/8.66) ≈ 0.0066'
            ],
            result: {
                name: 'per_act_transmission_rate',
                value: '~0.41% (M→F) / ~0.66% (F→M)'
            },
            warnings: [
                '⚠️ Assumes 2 sex acts per week; study does not report frequency',
                'Uses person–month rates as monthly probabilities (approximation)'
            ]
        }
    },
    
    hpv_burchell_2013: {
        id: 'hpv_burchell_2013',
        name: 'Burchell et al. 2013 - HPV Transmission in Couples',
        url: 'https://pubmed.ncbi.nlm.nih.gov/24253288/',
        quote: 'HPV type-specific transmission incidence rate was 12.3 (95% confidence interval, 7.1-19.6) per 1000 person-months for female-to-male transmission and 7.3 (95% confidence interval, 3.5-13.5) per 1000 person-months for male-to-female transmission',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'ftm_incidence',
                    value: '12.3 per 1000 person-months',
                    source: 'quote',
                    highlight: '12.3'
                },
                {
                    name: 'mtf_incidence',
                    value: '7.3 per 1000 person-months',
                    source: 'quote',
                    highlight: '7.3'
                }
            ],
            steps: [
                'From quote: ftm_incidence = 12.3 per 1000 person-months',
                'From quote: mtf_incidence = 7.3 per 1000 person-months',
                'Convert: ~1.2% per month (F→M), ~0.7% per month (M→F)',
                '⚠️ Note: This is incidence rate, not per-act probability'
            ],
            result: {
                name: 'monthly_incidence_rate',
                value: '~1.2% (F→M) / ~0.7% (M→F) per month'
            },
            warnings: ['This is incidence over time, not per-act probability', 'HPV is extremely common - most people will acquire it']
        }
    },
    
    hpv_lifetime_chesson: {
        id: 'hpv_lifetime_chesson',
        name: 'Chesson et al. 2014 - HPV Lifetime Probability',
        url: 'https://pubmed.ncbi.nlm.nih.gov/25299412/',
        quote: 'estimated lifetime probability of acquiring human papillomavirus ... average lifetime probability of acquiring HPV among those with at least 1 opposite sex partner to be 84.6% (range, 53.6%-95.0%) for women and 91.3% (range, 69.5%-97.7%) for men',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        isDerived: true,
        derivation: {
            variables: [
                {
                    name: 'lifetime_prob_women',
                    value: '84.6%',
                    source: 'quote',
                    highlight: '84.6%'
                },
                {
                    name: 'lifetime_prob_men',
                    value: '91.3%',
                    source: 'quote',
                    highlight: '91.3%'
                }
            ],
            steps: [
                'From quote: lifetime_prob_women = 84.6%',
                'From quote: lifetime_prob_men = 91.3%',
                'Applies to: those with at least 1 opposite sex partner',
                '⚠️ This is LIFETIME probability, not per-act'
            ],
            result: {
                name: 'lifetime_acquisition_probability',
                value: '84.6% (women) / 91.3% (men)'
            },
            warnings: ['This is LIFETIME probability, not per-act or per-partnership', 'Most sexually active people will acquire HPV at some point']
        }
    },
    
    // ===========================================
    // CONDOM EFFECTIVENESS SOURCES
    // ===========================================
    
    syphilis_condom_effectiveness: {
        id: 'syphilis_condom_effectiveness',
        name: 'PMC Review - Condom Effectiveness for Syphilis',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4660551/',
        quote: 'syphilis transmission is reduced 29% for typical use ... It is reduced 50-71% when condoms are used 100% of the time correctly',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                {
                    name: 'typical_use_reduction',
                    value: '29%',
                    source: 'quote',
                    highlight: '29%'
                },
                {
                    name: 'consistent_use_reduction',
                    value: '50-71%',
                    source: 'quote',
                    highlight: '50-71%'
                }
            ],
            steps: [
                'From quote: typical_use_reduction = 29%',
                'From quote: consistent_use_reduction = 50-71% (when used 100% of the time correctly)',
                'Using midpoint of consistent use range: (50 + 71) / 2 = 60.5%'
            ],
            result: {
                name: 'condom_effectiveness',
                value: '60.5% (consistent use, midpoint of 50-71% range)'
            },
            warnings: [
                '⚠️ Wide range (50-71%) reflects uncertainty in the data',
                '⚠️ Syphilis can transmit through sores not covered by condom',
                '⚠️ Typical use (29%) much lower than consistent correct use (50-71%)'
            ]
        }
    },
    
    hpv_condom_effectiveness: {
        id: 'hpv_condom_effectiveness',
        name: 'MDedge - Condoms Prevent HPV Transmission Study',
        url: 'https://community.the-hospitalist.org/content/condoms-found-prevent-hpv-transmission',
        quote: 'Women whose sexual partners consistently used condoms were 70% less likely to acquire genital human papillomavirus infection than were those whose partners did not',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                {
                    name: 'risk_reduction',
                    value: '70%',
                    source: 'quote',
                    highlight: '70%'
                }
            ],
            steps: [
                'From quote: consistent condom use resulted in 70% less likely to acquire HPV',
                'This is a risk reduction percentage, so effectiveness = 70%'
            ],
            result: {
                name: 'condom_effectiveness',
                value: '70%'
            },
            warnings: [
                '⚠️ Study focused on female acquisition from male partners',
                '⚠️ HPV can transmit through skin contact not covered by condom'
            ]
        }
    }
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SOURCES };
} else {
    window.SOURCES = SOURCES;
}
