# backend/services/document_generator_service.py

from datetime import datetime

class DocumentGeneratorService:

    def _get_research_report_template(self):
        return """
# {project_name} - Research Report

**Date:** {date}
**Version:** 1.0

## 1. Executive Summary
{executive_summary}

## 2. Introduction
{introduction}

## 3. Methods
{methods}

## 4. Results
{results}

## 5. Discussion
{discussion}

## 6. Conclusion
{conclusion}

## 7. References
{references}
"""

    def _get_protocol_sop_template(self):
        return """
# Standard Operating Procedure: {sop_title}

**Document ID:** SOP-{doc_id}
**Version:** {version}
**Effective Date:** {date}

## 1. Purpose
{purpose}

## 2. Scope
{scope}

## 3. Responsibilities
{responsibilities}

## 4. Materials and Equipment
{materials}

## 5. Procedure
{procedure}

## 6. Quality Control
{quality_control}

## 7. Revision History
- {version}: Initial Draft
"""

    def _get_ind_cta_template(self):
        return """
# Investigational New Drug (IND) Application

**Drug Name:** {drug_name}
**Sponsor:** Genskey Bio

## 1. Cover Letter
{cover_letter}

## 2. Form FDA 1571
(See attached Form 1571)

## 3. CMC (Chemistry, Manufacturing, and Controls)
### 3.1. Manufacturing Process
{cmc_manufacturing}

### 3.2. Quality Control
{cmc_qc}

### 3.3. Stability Data
{cmc_stability}

## 4. Preclinical Safety
### 4.1. Animal Studies
{preclinical_animal_studies}

### 4.2. Genomic Safety Analysis
{preclinical_genomic_safety}

## 5. Clinical Protocol
### 5.1. Trial Design
{clinical_trial_design}

### 5.2. Inclusion/Exclusion Criteria
{clinical_inclusion_exclusion}

## 6. Investigator's Brochure
(See attached Investigator's Brochure)
"""

    def generate_research_report(self, data: dict):
        """Generates a research report from a template."""
        template = self._get_research_report_template()
        
        # Add current date to data if not present
        if 'date' not in data:
            data['date'] = datetime.now().strftime("%Y-%m-%d")
            
        return template.format(**data)

    def generate_protocol_sop(self, data: dict):
        """Generates a Protocol SOP from a template."""
        template = self._get_protocol_sop_template()
        
        if 'date' not in data:
            data['date'] = datetime.now().strftime("%Y-%m-%d")
        if 'version' not in data:
            data['version'] = "1.0"
        if 'doc_id' not in data:
            data['doc_id'] = "001"

        return template.format(**data)

    def generate_ind_cta(self, data: dict):
        """Generates an IND/CTA application from a template."""
        template = self._get_ind_cta_template()
        return template.format(**data)

    def export_document(self, content: str, format: str = "markdown"):
        """Exports the document content to a specified format."""
        if format.lower() == "markdown":
            return content
        elif format.lower() == "pdf":
            # Placeholder for PDF generation logic (e.g., using WeasyPrint or ReportLab)
            print("PDF export is not implemented yet. Returning Markdown.")
            return content
        elif format.lower() == "docx":
            # Placeholder for DOCX generation logic (e.g., using python-docx)
            print("DOCX export is not implemented yet. Returning Markdown.")
            return content
        else:
            raise ValueError(f"Unsupported export format: {format}")


if __name__ == '__main__':
    doc_service = DocumentGeneratorService()
    
    # --- Example 1: Research Report ---
    report_data = {
        "project_name": "GNS0042 Efficacy in IBD Models",
        "executive_summary": "GNS0042 showed significant reduction in inflammation markers in a DSS-induced colitis mouse model.",
        "introduction": "Inflammatory Bowel Disease (IBD) is a chronic inflammatory condition...",
        "methods": "C57BL/6 mice were administered 3% DSS in drinking water...",
        "results": "GNS0042 treatment led to a 45% reduction in the Disease Activity Index (DAI)...",
        "discussion": "The observed effects are likely mediated by the production of butyrate...",
        "conclusion": "GNS0042 is a promising candidate for IBD treatment.",
        "references": "1. Author et al. (2022). J. Crohn's Colitis."
    }
    
    research_report = doc_service.generate_research_report(report_data)
    
    print("--- Generated Research Report (Markdown) ---")
    print(research_report)
    
    # --- Example 2: Protocol SOP ---
    sop_data = {
        "sop_title": "In Vitro SCFA Production Assay",
        "purpose": "To quantify the production of Short-Chain Fatty Acids (SCFAs) by candidate strains.",
        "scope": "This SOP applies to all in vitro assays performed in the R&D lab.",
        "responsibilities": "Lab Technician: Perform assay. Scientist: Analyze data.",
        "materials": "- YCFA broth\n- Candidate strains\n- GC-MS system",
        "procedure": "1. Grow strains to log phase...\n2. Inoculate YCFA broth...\n3. Sample at 24 and 48 hours...",
        "quality_control": "Run a known butyrate producer as a positive control."
    }

    protocol_sop = doc_service.generate_protocol_sop(sop_data)
    
    print("\n--- Generated Protocol SOP (Markdown) ---")
    print(protocol_sop)

    # --- Example 3: IND/CTA Application ---
    ind_data = {
        "drug_name": "GNS0042",
        "cover_letter": "Dear FDA Reviewer, please find attached the IND submission for GNS0042 for the treatment of mild to moderate Ulcerative Colitis.",
        "cmc_manufacturing": "The drug product is manufactured from a single strain of F. prausnitzii...",
        "cmc_qc": "Quality control tests include viability, purity, and identity...",
        "cmc_stability": "12-month stability data at 4C and 25C is available.",
        "preclinical_animal_studies": "No adverse effects were observed in GLP toxicology studies in rats and dogs.",
        "preclinical_genomic_safety": "Whole-genome sequencing confirms the absence of virulence factors and AMR genes.",
        "clinical_trial_design": "A Phase 1, double-blind, placebo-controlled study is proposed.",
        "clinical_inclusion_exclusion": "Inclusion: 18-65 years old, diagnosed with UC. Exclusion: concurrent use of biologics."
    }

    ind_application = doc_service.generate_ind_cta(ind_data)
    
    print("\n--- Generated IND Application (Markdown) ---")
    print(ind_application)

    # --- Example 4: Export ---
    exported_content = doc_service.export_document(research_report, format="pdf")
    # This will print a message and return the markdown content for now.
    
