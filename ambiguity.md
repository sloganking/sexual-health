# Ambiguity Log

This document records instances where text on the site was too vague, technical, or ambiguous for users to understand. Each entry documents what was wrong and how we fixed it.

**Purpose:** Build a reference of ambiguity patterns so we can avoid them in the future.

---

## Pattern Recognition

After fixing several issues, watch for these common ambiguity patterns:

1. **Missing actor** — WHO does the action? (infected partner? uninfected partner?)
2. **Jargon without explanation** — medical terms users won't know
3. **Assumed knowledge** — assuming users understand how medications/conditions work
4. **Passive voice** — hides who is doing what
5. **Acronyms without expansion** — U=U, ART, PrEP without explanation

---

## Logged Instances

### #1: Valacyclovir — Who Takes It?

**Date:** 2026-01-20  
**Location:** Calculator checkbox for HSV-2

**Before (ambiguous):**
```
💊 Daily antivirals (suppressive therapy)
   Hint: "Show risk reduction with medication"
```

**Problems:**
- "Suppressive therapy" — medical jargon, means nothing to most people
- Doesn't say WHO takes the medication
- Doesn't say what kind of medication
- User might think THEY need to take it (wrong — it's the infected partner)

**After (clear):**
```
💊 Infected partner takes daily valacyclovir [47% reduction]
   Hint: "Prescription antiviral taken by the HSV-2+ partner"
```

**Why it's better:**
- Names the specific medication (valacyclovir)
- Explicitly says WHO takes it (infected partner)
- Shows the reduction percentage
- Hint reinforces who takes it

---

### #2: HIV U=U — What Does "Undetectable Viral Load" Mean?

**Date:** 2026-01-20  
**Location:** Calculator checkbox for HIV

**Before (ambiguous):**
```
💊 Infected partner has undetectable viral load [100% reduction]
   Hint: "Undetectable = Untransmittable when on effective ART"
```

**Problems:**
- "Viral load" — medical term most people don't understand
- "Undetectable" — what does this mean practically?
- "Effective ART" — acronym (antiretroviral therapy) without explanation
- User doesn't know how someone gets to "undetectable" status
- Doesn't explain this requires the infected partner to take medication

**After (clear):**
```
💊 HIV+ partner takes daily medication (virus suppressed) [100% reduction]
   Hint: "Called 'U=U' — when HIV medication suppresses the virus, transmission drops to zero"
```

**Why it's better:**
- Says it's about taking medication (the ACTION)
- "Virus suppressed" is clearer than "undetectable viral load"
- Explains U=U in plain terms
- User understands this depends on partner's medication adherence

---

## Questions to Ask Before Publishing Text

Use this checklist to catch ambiguity before it goes live:

- [ ] **Who?** Is it clear who does the action? (infected/uninfected partner, the user, a doctor?)
- [ ] **What?** Would a non-medical person understand every word?
- [ ] **How?** If it's a medication/action, is it clear how to get it or do it?
- [ ] **Jargon?** Are there any medical terms that need plain-language alternatives?
- [ ] **Acronyms?** Are all acronyms explained on first use?
- [ ] **Passive voice?** Rewrite any "X is reduced" to "Y reduces X"

---

## Change Log

| Date | Location | Issue | Fix |
|------|----------|-------|-----|
| 2026-01-20 | HSV-2 checkbox | Didn't say who takes valacyclovir | "Infected partner takes daily valacyclovir" |
| 2026-01-20 | HIV checkbox | "Undetectable viral load" is jargon | "HIV+ partner takes daily medication (virus suppressed)" |
| 2026-01-20 | Chart labels | shortName "Antivirals" didn't name the drug | Changed to "Valacyclovir" |
| 2026-01-20 | Chart labels | shortName "U=U" didn't explain what medication | Changed to "ART (U=U)" |
| 2026-01-20 | HIV PrEP checkbox | Didn't name the actual drug | Added "Truvada or Descovy" to name |

---

### #3: Chart Labels — Generic "Antivirals" Instead of Drug Name

**Date:** 2026-01-20  
**Location:** Chart legend labels

**Before (ambiguous):**
```
Chart shows: "Antivirals Only" line
```

**Problems:**
- "Antivirals" is generic — user can't look up what medication this refers to
- If someone wants to get this medication, they don't know what to ask for

**After (clear):**
```
Chart shows: "Valacyclovir Only" line
```

**Why it's better:**
- Names the specific drug
- User can search for "valacyclovir" or ask their doctor about it

---

### #4: PrEP Without Drug Names

**Date:** 2026-01-20  
**Location:** HIV PrEP checkbox

**Before (ambiguous):**
```
💊 Uninfected partner takes daily PrEP medication
```

**Problems:**
- "PrEP medication" doesn't tell you what drug to ask for
- User might not know PrEP is a brand-agnostic term for specific drugs

**After (clear):**
```
💊 Uninfected partner takes daily Truvada or Descovy (PrEP)
```

**Why it's better:**
- Names the actual drugs (Truvada, Descovy)
- User can ask their doctor for these by name
- Still includes "PrEP" for those familiar with the term

