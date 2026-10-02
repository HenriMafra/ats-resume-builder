# ATS Resume Builder: Semantic Density Scoring and High-Fidelity Print CSS Layout

**Author:** Henri Mafra  
**License:** MIT License  
**Domain:** Natural Language Processing, Document Layout Engineering, Information Extraction  

---

## 1. Overview

ATS Resume Builder is an engineering solution designed to eliminate programmatic parsing failures in automated **Applicant Tracking Systems (ATS)**. The platform features an algorithmic keyword salience and semantic density scoring engine, alongside a calibrated CSS Paged Media layout engine for deterministic, high-fidelity A4 document rendering.

---

## 2. Problem Formulation and Parsing Bottlenecks

Industrial ATS parsers (e.g., Sovren, Taleo, Workday) process resumes via linear text extractors and named entity recognition models. The following structural elements frequently trigger parse-tree collapse:
1. Multi-column floating divisions causing horizontal text interleaving.
2. Rasterized typography or icon fonts lacking semantic Unicode representations.
3. Irregular section headers failing standard taxonomy classifiers.

---

## 3. Algorithmic Formulation of ATS Scoring

The scoring engine evaluates the candidate document vector across four orthogonal dimensions:

$$Score = w_1 S_{\text{sec}} + w_2 S_{\text{act}} + w_3 S_{\text{quant}} + w_4 S_{\text{dens}}$$

Where:
- $S_{\text{sec}} \in [0, 1]$: Presence of canonical taxonomy sections (Experience, Education, Skills, Certifications).
- $S_{\text{act}} \in [0, 1]$: Frequency of high-impact action verbs (e.g., *Architected, Engineered, Implemented*).
- $S_{\text{quant}} \in [0, 1]$: Quantified business metrics (percentages, monetary gains, latency reductions).
- $S_{\text{dens}} \in [0, 1]$: Normalized keyword frequency relative to domain technical vocabularies.
- Weights: $w = (0.25, 0.25, 0.25, 0.25)$.

---

## 4. Precision Print Engine

The layout engine implements W3C Paged Media module specifications:

```css
@page {
  size: A4 portrait;
  margin: 15mm 15mm 15mm 15mm;
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page-break-avoid {
    break-inside: avoid;
  }
}
```

---

## 5. Setup and Execution

```bash
# 1. Clone repository
git clone https://github.com/HenriMafra/ats-resume-builder.git
cd ats-resume-builder

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

---

## 6. References

- W3C. (2018). *CSS Paged Media Module Level 3*. W3C Candidate Recommendation.
- Jurafsky, D., & Martin, J. H. (2023). *Speech and Language Processing* (3rd ed. draft). Pearson.

---

## 7. License

Licensed under the MIT License. Copyright (c) Henri Mafra.
