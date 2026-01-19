# Know Your Numbers — STI Risk Calculator

**The numbers your doctor won't tell you.**

An evidence-based, fully transparent STI transmission risk calculator. Every number is sourced, every calculation is shown, every quote is verifiable.

🌐 **Live Site:** [https://sloganking.github.io/know-your-numbers/](https://sloganking.github.io/know-your-numbers/)

---

## Why This Exists

Doctors often give non-answers about STI transmission: *"Use a condom and you'll be fine"* or *"Don't worry about it."*

That's not good enough. If you have a partner with an STI, you deserve to know:
- What's the actual probability of transmission per encounter?
- How does condom use change that probability?
- What's the cumulative risk over time?

This site provides those numbers with complete transparency.

---

## Features

### 📊 Interactive Risk Calculator
- Select any of 8 STIs (HIV, HSV-2, HPV, Chlamydia, Gonorrhea, Syphilis, Hepatitis B, Trichomoniasis)
- Choose transmission direction (Male→Female or Female→Male)
- Adjust frequency and duration
- See cumulative risk over time with dual-line chart (protected vs unprotected)

### 🔍 Bulletproof Citations
- **Every number** has a hoverable citation showing:
  - The exact quote from the source
  - The calculation/derivation steps
  - A direct link to the source (with text highlighting)
- No hidden assumptions — inferences are marked with ⚠️ warnings

### ✅ Automated Verification
- Run `node test-sources.js` to verify all quotes still exist on their source pages
- Sources are re-verified periodically
- If a source goes down or changes, the test fails

---

## Tech Stack

- **Pure HTML/CSS/JavaScript** — no framework, no build step
- **Chart.js** — for the risk visualization
- **MathJax** — for mathematical notation in methodology section
- **GitHub Pages** — for hosting

---

## Project Structure

```
├── index.html          # Main page
├── app.js              # Calculator logic, chart rendering, citations
├── sources.js          # Source database with quotes and derivations
├── sources-backup.js   # Backup sources (not displayed, but verified)
├── styles.css          # Styling
├── test-sources.js     # Automated quote verification script
└── README.md           # You are here
```

---

## Running the Test Suite

Verify that all source quotes still exist on their linked pages:

```bash
node test-sources.js
```

Include backup sources:

```bash
node test-sources.js --include-backup
```

Expected output:
```
Testing 18 sources...
✓ hiv_cdc_risk_estimates - Quote verified
✓ hiv_boily_2009_meta - Quote verified
...
All sources verified!
```

---

## Citation Rules

This project follows strict citation rules (see `.cursorrules`):

1. **All knowledge must come from quoted text** — no implicit AI knowledge
2. **Quotes must include enough context** to be understandable alone
3. **Inferences must be marked** with ⚠️ and explained
4. **Per-partnership ≠ per-act** — never confuse these without explicit derivation
5. **No unused variables** — every extracted variable must be used in the calculation
6. **Test suite must pass** before any source change is accepted

---

## Data Sources

All transmission rates come from peer-reviewed studies and public health organizations, including:

- CDC HIV Risk and Prevention Estimates
- Boily et al. 2009 (Lancet) — HIV meta-analysis
- Corey et al. 2004 (NEJM) — HSV-2 transmission
- NCBI Book NBK261441 — Chlamydia/Gonorrhea per-act rates
- Malagón et al. 2021 (HITCH cohort) — HPV transmission
- Crosby et al. 2004 (JAMA Pediatrics) — Condom effectiveness

For the complete list with exact quotes, see `sources.js`.

---

## Limitations

- **Individual variation** — Population averages may not reflect your specific risk
- **Study populations** — Results may not generalize to all scenarios
- **Independence assumption** — The formula assumes each encounter is independent
- **Data age** — Some studies are older; we cite dates so you can assess currency

This is educational information, not medical advice. Consult a healthcare provider for personal decisions.

---

## Contributing

Found a better source? Want to add a new STI? PRs welcome, but:

1. Add source to `sources.js` with exact quote
2. Run `node test-sources.js` — must pass
3. Follow the citation rules in `.cursorrules`

---

## License

MIT — Use freely, cite responsibly.

---

*Made with frustration and math.*
