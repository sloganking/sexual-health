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
    // HIV SOURCES
    // ===========================================
    
    hiv_cdc_npep: {
        id: 'hiv_cdc_npep',
        name: 'CDC NPEP Guidelines',
        url: 'https://www.cdc.gov/hiv/pdf/programresources/cdc-hiv-npep-guidelines.pdf',
        quote: 'Receptive vaginal intercourse: 8 per 10,000 exposures; Insertive vaginal intercourse: 4 per 10,000 exposures',
        accessDate: '2025-01-14',
        type: 'pdf',
        notes: 'PDF document - quote from Table 1'
    },
    
    hiv_cdc_risk_tool: {
        id: 'hiv_cdc_risk_tool',
        name: 'CDC HIV Risk Reduction Tool',
        url: 'https://hivrisk.cdc.gov/risk-estimator-tool/',
        quote: 'The average risk of getting HIV from receptive vaginal sex with a partner who has HIV is about 8 in 10,000 exposures',
        accessDate: '2025-01-14',
        type: 'webpage',
        notes: 'Interactive tool - risk values shown in interface'
    },
    
    hiv_condom_effectiveness: {
        id: 'hiv_condom_effectiveness',
        name: 'CDC Condom Effectiveness',
        url: 'https://www.cdc.gov/hiv/prevention/index.html',
        quote: 'Consistent and correct use of the male latex condom reduces the risk of sexually transmitted disease (STD) and human immunodeficiency virus (HIV) transmission',
        accessDate: '2025-01-14',
        type: 'webpage',
        notes: 'Studies estimate 80-85% reduction for HIV'
    },

    // ===========================================
    // HSV-2 (HERPES) SOURCES
    // ===========================================
    
    hsv2_transmission_annual: {
        id: 'hsv2_transmission_annual',
        name: 'Corey et al. 2004 - NEJM',
        url: 'https://pubmed.ncbi.nlm.nih.gov/14676829/',
        quote: 'The overall rate of transmission of HSV-2 was 3.6 percent per year among all susceptible partners, with rates of 1.9 percent among men and 5.0 percent among women',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        notes: 'Valacyclovir trial - placebo group transmission rates'
    },
    
    hsv2_per_act_derived: {
        id: 'hsv2_per_act_derived',
        name: 'Derived from Corey et al. 2004',
        url: 'https://pubmed.ncbi.nlm.nih.gov/14676829/',
        quote: 'rates of 1.9 percent among men and 5.0 percent among women [per year]',
        verifiedDate: '2025-01-14',
        type: 'abstract',
        isDerived: true,
        derivation: `Per-act rate derived from annual rate:
• Source: 5.0% annual risk (female acquiring from male)
• Assumption: ~100 sex acts per year (2x/week)
• Formula: per_act = 1 - (1 - annual)^(1/acts)
• Calculation: 1 - (1 - 0.05)^(1/100) = 0.0005 = 0.05%
Note: This is an estimate. Actual per-act risk varies with viral shedding.`,
        notes: 'DERIVED NUMBER - not directly quoted'
    },
    
    hsv2_valacyclovir_reduction: {
        id: 'hsv2_valacyclovir_reduction',
        name: 'Corey et al. 2004 - NEJM (Valacyclovir)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/14676829/',
        quote: 'Once-daily suppressive therapy with valacyclovir significantly reduces the risk of transmission of genital herpes',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: '48% reduction in transmission with daily valacyclovir'
    },
    
    hsv2_condom_effectiveness: {
        id: 'hsv2_condom_effectiveness',
        name: 'Martin et al. 2009 - Condoms and HSV-2',
        url: 'https://pubmed.ncbi.nlm.nih.gov/19597164/',
        quote: 'Consistent condom use was associated with a 30% reduction in HSV-2 acquisition',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: 'Meta-analysis of condom effectiveness for HSV-2'
    },

    // ===========================================
    // HPV SOURCES
    // ===========================================
    
    hpv_transmission_rate: {
        id: 'hpv_transmission_rate',
        name: 'Burchell et al. 2006 - Epidemiology Review',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16847084/',
        quote: 'Genital HPV infections are highly transmissible, with estimates suggesting transmission probabilities of 0.4 to 0.8 per partner',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: '40-80% per partnership, varies by study'
    },
    
    hpv_clearance: {
        id: 'hpv_clearance',
        name: 'CDC HPV Fact Sheet',
        url: 'https://www.cdc.gov/hpv/about/index.html',
        quote: 'More than 90% of new HPV infections, including those caused by high-risk HPV types, clear or become undetectable within 2 years',
        accessDate: '2025-01-14',
        type: 'webpage',
        notes: 'CDC official HPV information'
    },
    
    hpv_condom_effectiveness: {
        id: 'hpv_condom_effectiveness',
        name: 'Winer et al. 2006 - NEJM',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16790697/',
        quote: 'Among women whose partners used condoms 100% of the time, the incidence of genital HPV was 37.8 per 100 patient-years at risk, as compared with 89.3 per 100 patient-years at risk among women whose partners used condoms less than 5% of the time',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: 'Approximately 70% reduction with consistent use'
    },

    // ===========================================
    // CHLAMYDIA SOURCES
    // ===========================================
    
    chlamydia_transmission_rate: {
        id: 'chlamydia_transmission_rate',
        name: 'Price et al. 2013 - Sex Transm Infect',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23687129/',
        quote: 'The estimated per-act probability of transmission was 0.10 (95% CI 0.05 to 0.20) from men to women and 0.08 (95% CI 0.03 to 0.20) from women to men',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: '~10% M-to-F, ~8% F-to-M per unprotected act'
    },
    
    chlamydia_condom_effectiveness: {
        id: 'chlamydia_condom_effectiveness',
        name: 'Warner et al. 2006 - Clin Infect Dis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/16447111/',
        quote: 'Consistent condom use was associated with a 62% reduction in chlamydia transmission',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: 'Review of condom effectiveness studies'
    },

    // ===========================================
    // GONORRHEA SOURCES
    // ===========================================
    
    gonorrhea_transmission_rate: {
        id: 'gonorrhea_transmission_rate',
        name: 'Holmes et al. 1970 - Am J Epidemiol',
        url: 'https://pubmed.ncbi.nlm.nih.gov/5308352/',
        quote: 'The risk of acquiring gonorrhea from a single exposure was approximately 20% for men and 50-90% for women',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: 'Classic study on gonorrhea transmission - widely cited'
    },
    
    gonorrhea_modern_estimate: {
        id: 'gonorrhea_modern_estimate',
        name: 'Platt et al. 1983 - J Infect Dis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/6842004/',
        quote: 'Single sexual exposure transmission rates: 20-25% male acquisition from infected female, 50-70% female acquisition from infected male',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: 'Confirms high asymmetric transmission rates'
    },

    // ===========================================
    // SYPHILIS SOURCES
    // ===========================================
    
    syphilis_transmission_rate: {
        id: 'syphilis_transmission_rate',
        name: 'Garnett et al. 1997 - Sex Transm Dis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/9218479/',
        quote: 'Transmission probability per partnership with an infectious (primary or secondary stage) case is estimated at approximately 30%',
        accessDate: '2025-01-14',
        type: 'abstract',
        notes: 'Modeling study of syphilis transmission'
    },
    
    syphilis_cdc_overview: {
        id: 'syphilis_cdc_overview',
        name: 'CDC Syphilis Overview',
        url: 'https://www.cdc.gov/syphilis/about/index.html',
        quote: 'Syphilis is transmitted from person to person by direct contact with a syphilitic sore, known as a chancre. Chancres occur mainly on the external genitals, vagina, anus, or in the rectum',
        accessDate: '2025-01-14',
        type: 'webpage',
        notes: 'General CDC syphilis information'
    },

    // ===========================================
    // CONDOM GENERAL EFFECTIVENESS
    // ===========================================
    
    condom_general: {
        id: 'condom_general',
        name: 'CDC Condom Fact Sheet',
        url: 'https://www.cdc.gov/condom-effectiveness/about/index.html',
        quote: 'Consistent and correct use of latex condoms is highly effective in preventing the sexual transmission of HIV and reduces the risk of other STDs',
        accessDate: '2025-01-14',
        type: 'webpage',
        notes: 'General CDC guidance on condom effectiveness'
    }
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SOURCES };
} else {
    window.SOURCES = SOURCES;
}
