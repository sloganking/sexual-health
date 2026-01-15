/**
 * BACKUP/ALTERNATIVE SOURCES DATABASE
 * 
 * This file contains verified sources that we're not currently using on the website,
 * but which provide corroborating data or serve as backups if primary sources break.
 * 
 * These sources are still verified by the test suite to ensure quotes remain accurate.
 * 
 * Run `node test-sources.js --include-backup` to test these sources as well.
 */

const BACKUP_SOURCES = {
    // ===========================================
    // CORROBORATING / ALTERNATIVE SOURCES
    // ===========================================
    
    // Sources we don't want to use as primary but want to keep for reference

    syphilis_msm_per_act_pmc: {
        id: 'syphilis_msm_per_act_pmc',
        name: 'Gray et al. (cited in PMC5973824) - Syphilis Per-Act Transmission (MSM)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5973824/',
        quote: 'Gray et al . estimated a syphilis transmission probability of 0.5–1.4% per sexual act among MSM ... penile-anal sex (1.4% transmission probability per act) ... penile-oral sex (1.0% transmission probability per act) ... during primary and secondary syphilis.',
        verifiedDate: '2025-01-14',
        type: 'webpage',
        primarySourceId: 'syphilis_schober_1983',
        notes: 'MSM-only estimate (anal/oral). Not used on site; kept as backup context.'
    },
    
    // EXAMPLE STRUCTURE:
    // hiv_alternative_study: {
    //     id: 'hiv_alternative_study',
    //     name: 'Alternative Study Name',
    //     url: 'https://example.com',
    //     quote: 'Exact quote from the source',
    //     verifiedDate: '2025-01-14',
    //     type: 'abstract',
    //     primarySourceId: 'hiv_cdc_risk_estimates', // Which primary source this backs up
    //     notes: 'Why this is a backup rather than primary'
    // }
};

// Export for use in browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BACKUP_SOURCES };
} else {
    window.BACKUP_SOURCES = BACKUP_SOURCES;
}
