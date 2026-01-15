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
        // DATA IS FROM TABLE 1 - not a prose quote (cannot be text-searched)
        quote: 'From Table 1: "Use of condoms" Risk Ratio = 0.04 for susceptible women, 0.35 for susceptible men',
        isTableData: true,  // Flag that this is table data, not prose
        manuallyVerified: true,  // Table data cannot be automatically verified
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: true,  // Derived: effectiveness = 1 - risk ratio
        derivation: {
            variables: [
                {
                    name: 'risk_ratio_mtf',
                    value: '0.04',
                    source: 'table',
                    note: 'Table 1: Susceptible women → Use of condoms → Risk Ratio 0.04 (.01, .16)'
                },
                {
                    name: 'risk_ratio_ftm',
                    value: '0.35',
                    source: 'table',
                    note: 'Table 1: Susceptible men → Use of condoms → Risk Ratio 0.35 (.12, 1.04)'
                }
            ],
            steps: [
                'From Table 1: risk_ratio_mtf = 0.04 (susceptible women)',
                'From Table 1: risk_ratio_ftm = 0.35 (susceptible men)',
                'Convert: effectiveness_mtf = 1 - 0.04 = 0.96 = 96%',
                'Convert: effectiveness_ftm = 1 - 0.35 = 0.65 = 65%'
            ],
            result: {
                name: 'condom_effectiveness',
                value: '96% (M→F) / 65% (F→M)'
            },
            warnings: [
                '⚠️ Data is from Table 1, not prose text',
                'Study conducted in HIV-discordant couples',
                'F→M result (0.35) was not statistically significant (p=.060)'
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
    },
    
    gonorrhea_condom_effectiveness: {
        id: 'gonorrhea_condom_effectiveness',
        name: 'Crosby et al. 2004 - JAMA Pediatrics - Condom Effectiveness for Gonorrhea',
        url: 'https://jamanetwork.com/journals/jamapediatrics/fullarticle/486033',
        quote: 'We found that correct and consistent use of condoms reduced the risk of gonorrhea by 90%',
        verifiedDate: '2025-01-14',
        manuallyVerified: true,  // JAMA uses Cloudflare which blocks all automated requests - verified manually by user
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                {
                    name: 'risk_reduction',
                    value: '90%',
                    source: 'quote',
                    highlight: '90%'
                }
            ],
            steps: [
                'From quote: correct and consistent condom use reduced gonorrhea risk by 90%',
                'This is a risk reduction percentage, so effectiveness = 90%'
            ],
            result: {
                name: 'condom_effectiveness',
                value: '90%'
            },
            warnings: []
        }
    },
    
    chlamydia_condom_effectiveness: {
        id: 'chlamydia_condom_effectiveness',
        name: 'Crosby et al. 2004 - JAMA Pediatrics - Condom Effectiveness for Chlamydia',
        url: 'https://jamanetwork.com/journals/jamapediatrics/fullarticle/486033',
        quote: 'We found that correct and consistent use of condoms reduced the risk of chlamydial infection by 60%',
        verifiedDate: '2025-01-14',
        manuallyVerified: true,  // JAMA uses Cloudflare which blocks all automated requests - verified manually by user
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                {
                    name: 'risk_reduction',
                    value: '60%',
                    source: 'quote',
                    highlight: '60%'
                }
            ],
            steps: [
                'From quote: correct and consistent condom use reduced chlamydia risk by 60%',
                'This is a risk reduction percentage, so effectiveness = 60%'
            ],
            result: {
                name: 'condom_effectiveness',
                value: '60%'
            },
            warnings: []
        }
    },
    
    // ===========================================
    // TESTING WINDOW PERIOD SOURCES
    // ===========================================
    
    // Chlamydia/Gonorrhea window period
    chlamydia_gonorrhea_window_nhs: {
        id: 'chlamydia_gonorrhea_window_nhs',
        name: 'NHS Sexual Health Oxfordshire - STI Incubation Periods',
        url: 'https://www.sexualhealthoxfordshire.nhs.uk/sti/incubation-periods/',
        quote: 'We usually say to wait ... 2 weeks for chlamydia and gonorrhoea',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'chlamydia_window', value: '2 weeks', source: 'quote', highlight: '2 weeks for chlamydia' },
                { name: 'gonorrhea_window', value: '2 weeks', source: 'quote', highlight: '2 weeks for chlamydia and gonorrhoea' }
            ],
            steps: ['From quote: chlamydia window = 2 weeks', 'From quote: gonorrhea window = 2 weeks'],
            result: { name: 'window_period', value: '2 weeks for chlamydia and gonorrhea' },
            warnings: []
        }
    },
    
    // Syphilis window period - using NHS source (same as chlamydia/gonorrhea)
    syphilis_window_nhs: {
        id: 'syphilis_window_nhs',
        name: 'NHS Sexual Health Oxfordshire - STI Incubation Periods',
        url: 'https://www.sexualhealthoxfordshire.nhs.uk/sti/incubation-periods/',
        quote: 'We usually say to wait ... 4 weeks for syphilis and HIV',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'syphilis_window', value: '4 weeks', source: 'quote', highlight: '4 weeks for syphilis' }
            ],
            steps: ['From quote: syphilis window = 4 weeks'],
            result: { name: 'window_period', value: '4 weeks' },
            warnings: ['NHS also notes: "in some circumstance you also need a test at 3 months"']
        }
    },
    
    // Herpes window period - antibody test
    hsv_window_cdc: {
        id: 'hsv_window_cdc',
        name: 'CDC - Herpes Testing',
        url: 'https://www.cdc.gov/herpes/testing/index.html',
        quote: 'After exposure, it can take up to 16 weeks or more for current tests to detect infection',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'hsv_antibody_window', value: 'up to 16 weeks', source: 'quote', highlight: 'up to 16 weeks' }
            ],
            steps: ['From quote: HSV antibody test window = up to 16 weeks'],
            result: { name: 'window_period', value: 'Up to 16 weeks for antibody test' },
            warnings: ['This is for antibody blood tests; swab of active sore can detect immediately']
        }
    },
    
    // HPV testing info
    hpv_testing_cdc: {
        id: 'hpv_testing_cdc',
        name: 'CDC - About Genital HPV Infection',
        url: 'https://www.cdc.gov/sti/about/about-genital-hpv-infection.html',
        quote: 'There is no test to find out a person\'s "HPV status." Also, there is no approved HPV test to find HPV in the mouth or throat. There are HPV tests that can screen for cervical cancer. Healthcare providers only use these tests for screening women aged 30 years and older.',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'hpv_general_test', value: 'No test exists', source: 'quote', highlight: 'There is no test to find out a person\'s "HPV status."' },
                { name: 'hpv_cervical_screening', value: 'Women 30+', source: 'quote', highlight: 'screening women aged 30 years and older' }
            ],
            steps: ['From quote: No general HPV status test exists', 'HPV cervical screening available for women 30+'],
            result: { name: 'hpv_testing', value: 'No general test; cervical screening for women 30+' },
            warnings: []
        }
    },
    
    // CDC recommendation against routine herpes screening
    hsv_no_routine_screening_cdc: {
        id: 'hsv_no_routine_screening_cdc',
        name: 'CDC - Herpes Screening Recommendations',
        url: 'https://www.cdc.gov/herpes/testing/index.html',
        quote: 'CDC does not recommend herpes testing for people without symptoms in most situations. This is because of the limits of a herpes blood test and the possibility of a wrong test result.',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'hsv_screening_recommendation', value: 'Not recommended without symptoms', source: 'quote', highlight: 'does not recommend herpes testing for people without symptoms' }
            ],
            steps: ['CDC recommends against routine herpes screening for asymptomatic people'],
            result: { name: 'screening_policy', value: 'Herpes is NOT included in routine STI panels' },
            warnings: ['Testing IS recommended if you have symptoms']
        }
    },
    
    hiv_window_period_cdc: {
        id: 'hiv_window_period_cdc',
        name: 'CDC - HIV Testing Window Periods',
        url: 'https://www.cdc.gov/hiv/testing/index.html',
        quote: 'A NAT can usually detect HIV 10 to 33 days after exposure ... An antigen/antibody lab test using blood from a vein can usually detect HIV 18 to 45 days after exposure ... A rapid antigen/antibody test done with blood from a finger stick can usually detect HIV 18 to 90 days after exposure ... Antibody tests can usually detect HIV 23 to 90 days after exposure',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        isDerived: false,
        derivation: {
            variables: [
                {
                    name: 'nat_window',
                    value: '10-33 days',
                    source: 'quote',
                    highlight: '10 to 33 days'
                },
                {
                    name: 'lab_antigen_antibody_window',
                    value: '18-45 days',
                    source: 'quote',
                    highlight: '18 to 45 days'
                },
                {
                    name: 'rapid_antigen_antibody_window',
                    value: '18-90 days',
                    source: 'quote',
                    highlight: '18 to 90 days'
                },
                {
                    name: 'antibody_window',
                    value: '23-90 days',
                    source: 'quote',
                    highlight: '23 to 90 days'
                }
            ],
            steps: [
                'NAT (Nucleic Acid Test): 10-33 days',
                'Antigen/antibody lab test (blood draw): 18-45 days',
                'Rapid antigen/antibody test (finger stick): 18-90 days',
                'Antibody test (most rapid/self-tests): 23-90 days'
            ],
            result: {
                name: 'hiv_window_periods',
                value: 'Varies by test type: 10-33 days (NAT) to 23-90 days (antibody)'
            },
            warnings: []
        }
    },
    
    // ===========================================
    // HEPATITIS B SOURCES - VERIFIED ✓
    // ===========================================
    
    // Hepatitis B condom effectiveness
    hepb_condom_effectiveness: {
        id: 'hepb_condom_effectiveness',
        name: 'PMC Review - Condom Effectiveness for Hepatitis B',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4660551/',
        quote: 'The condom offers maximum protection (more than 90%) against HIV, Hepatitis B virus and N.Gonorrhoea',
        verifiedDate: '2025-01-14',
        type: 'review',
        manuallyVerified: true,
        isDerived: false,
        derivation: {
            variables: [
                { name: 'condom_protection', value: '>90%', source: 'quote', highlight: 'more than 90%' }
            ],
            steps: ['Condoms provide >90% protection against Hepatitis B'],
            result: { name: 'condom_effectiveness', value: '>90% protection' },
            warnings: ['HBV is highly infectious — vaccination is the primary prevention']
        }
    },
    
    // ===========================================
    // TRICHOMONIASIS SOURCES - VERIFIED ✓
    // ===========================================
    
    // Per-act transmission (unknown)
    trich_ashm_per_act: {
        id: 'trich_ashm_per_act',
        name: 'ASHM Contact Tracing - Trichomoniasis Per-Act',
        url: 'https://contacttracing.ashm.org.au/trichomoniasis/',
        quote: 'Likelihood of transmission per act of unprotected intercourse ... Unknown, likely moderate to high',
        verifiedDate: '2025-01-14',
        type: 'guideline',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'per_act_rate', value: 'Unknown', source: 'quote', highlight: 'Unknown, likely moderate to high' }
            ],
            steps: ['No quantified per-act transmission rate exists for trichomoniasis'],
            result: { name: 'per_act_transmission', value: null },
            warnings: ['Per-act rate not quantified in medical literature', 'Believed to transmit readily during vaginal sex']
        }
    },
    
    // CDC prevalence and symptoms
    trich_cdc_prevalence: {
        id: 'trich_cdc_prevalence',
        name: 'CDC STI Treatment Guidelines - Trichomoniasis',
        url: 'https://www.cdc.gov/std/treatment-guidelines/trichomoniasis.htm',
        quote: 'Trichomoniasis is estimated to be the most prevalent nonviral STI worldwide, affecting approximately 2.6 million persons in the United States ... The U.S. population-based T. vaginalis prevalence is 2.1% among females and 0.5% among males',
        verifiedDate: '2025-01-14',
        type: 'guideline',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'us_cases', value: '~2.6 million', source: 'quote', highlight: '2.6 million persons' },
                { name: 'female_prevalence', value: '2.1%', source: 'quote', highlight: '2.1% among females' },
                { name: 'male_prevalence', value: '0.5%', source: 'quote', highlight: '0.5% among males' }
            ],
            steps: ['Most common curable STI in the US'],
            result: { name: 'prevalence', value: '~2.6 million US cases' },
            warnings: []
        }
    },
    
    // Asymptomatic rate
    trich_cdc_asymptomatic: {
        id: 'trich_cdc_asymptomatic',
        name: 'CDC STI Treatment Guidelines - Trichomoniasis Symptoms',
        url: 'https://www.cdc.gov/std/treatment-guidelines/trichomoniasis.htm',
        quote: 'The majority of persons who have trichomoniasis (70% ... 85%) either have minimal or no genital symptoms ... untreated infections might last from months to years',
        verifiedDate: '2025-01-14',
        type: 'guideline',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'asymptomatic_rate', value: '70-85%', source: 'quote', highlight: '70%–85%' }
            ],
            steps: ['Most infections are asymptomatic'],
            result: { name: 'symptom_rate', value: '70-85% have no symptoms' },
            warnings: ['Untreated infections can persist for months to years']
        }
    },
    
    // WHO global incidence
    trich_who_global: {
        id: 'trich_who_global',
        name: 'WHO Fact Sheet - Trichomoniasis',
        url: 'https://www.who.int/news-room/fact-sheets/detail/trichomoniasis',
        quote: 'In 2020 there were approximately 156 million new cases of T. vaginalis infection among people aged 15 ... 49 years old',
        verifiedDate: '2025-01-14',
        type: 'factsheet',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'global_annual_cases', value: '156 million', source: 'quote', highlight: '156 million new cases' }
            ],
            steps: ['Most common non-viral STI globally'],
            result: { name: 'global_incidence', value: '156 million new cases/year' },
            warnings: []
        }
    },
    
    // Trichomoniasis condom effectiveness
    trich_condom_effectiveness: {
        id: 'trich_condom_effectiveness',
        name: 'PMC Review - Condom Effectiveness for Trichomoniasis',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4660551/',
        quote: 'It is claimed to provide more than 90% protection against Trichomonas vaginitis, but the latest reports are controversial. Statistically significant reduction in trichomonas infection (30%) was reported with condom use.',
        verifiedDate: '2025-01-14',
        type: 'review',
        manuallyVerified: true,
        isDerived: false,
        derivation: {
            variables: [
                { name: 'claimed_protection', value: '>90%', source: 'quote', highlight: 'more than 90% protection' },
                { name: 'observed_reduction', value: '30%', source: 'quote', highlight: '30%' }
            ],
            steps: ['Early claims suggested >90% protection, but newer studies show only ~30% reduction'],
            result: { name: 'condom_effectiveness', value: '30% reduction (controversial)' },
            warnings: ['Condom effectiveness for trichomoniasis is controversial', 'Studies show widely varying results (30% to >90%)']
        }
    },
    
    // Trichomoniasis testing and window period
    trich_ashm_testing: {
        id: 'trich_ashm_testing',
        name: 'ASHM Contact Tracing - Trichomoniasis Testing',
        url: 'https://contacttracing.ashm.org.au/trichomoniasis/',
        quote: 'Incubation period ... There is insufficient data to provide a definitive period ... Nucleic acid amplification tests (NAATs) are the most sensitive tests available to detect Trichomonas vaginalis',
        verifiedDate: '2025-01-14',
        type: 'guideline',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'window_period', value: 'Insufficient data', source: 'quote', highlight: 'insufficient data to provide a definitive period' },
                { name: 'test_type', value: 'NAAT', source: 'quote', highlight: 'Nucleic acid amplification tests' }
            ],
            steps: ['No established window period for trichomoniasis testing'],
            result: { name: 'testing_guidance', value: 'NAAT testing; no defined window period' },
            warnings: ['Window period not established in medical literature']
        }
    },
    
    // ===========================================
    // HEPATITIS C SOURCES - VERIFIED ✓
    // ===========================================
    
    // Sexual transmission is negligible
    hepc_sexual_negligible: {
        id: 'hepc_sexual_negligible',
        name: 'AIDSmap - Hepatitis C Sexual Transmission',
        url: 'https://www.aidsmap.com/news/mar-2013/sexual-transmission-hepatitis-c-very-rare-monogamous-heterosexual-couples',
        quote: 'Sexual transmission of hepatitis C virus (HCV) among monogamous heterosexual couples is extremely rare ... The maximum incidence of sexual transmission was just 0.07% per year, equivalent to just one transmission per 190,000 sexual contacts',
        verifiedDate: '2025-01-14',
        type: 'news',
        isDerived: false,
        derivation: {
            variables: [
                { name: 'annual_rate', value: '0.07%', source: 'quote', highlight: '0.07% per year' },
                { name: 'per_contact_rate', value: '1 in 190,000', source: 'quote', highlight: 'one transmission per 190,000 sexual contacts' }
            ],
            steps: ['Sexual transmission of HCV is essentially negligible for heterosexual couples'],
            result: { name: 'per_act_transmission', value: '~0.0005% (1 in 190,000)' },
            warnings: ['This is for monogamous heterosexual couples', 'Risk may be higher with blood exposure or HIV co-infection']
        }
    }
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SOURCES };
} else {
    window.SOURCES = SOURCES;
}
