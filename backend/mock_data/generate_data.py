"""
Mock Data Generator for Genskey Platform V2.0
Generates realistic scientific datasets for all departments
"""

import json
import random
import numpy as np
from datetime import datetime, timedelta

# Bacterial taxonomy - realistic species
BACTERIAL_SPECIES = {
    "Firmicutes": [
        "Faecalibacterium prausnitzii", "Clostridium butyricum", 
        "Lactobacillus plantarum", "Bifidobacterium longum",
        "Akkermansia muciniphila", "Roseburia intestinalis"
    ],
    "Bacteroidetes": [
        "Bacteroides fragilis", "Bacteroides thetaiotaomicron",
        "Prevotella copri", "Parabacteroides distasonis"
    ],
    "Proteobacteria": [
        "Escherichia coli Nissle 1917", "Klebsiella pneumoniae",
        "Enterobacter cloacae"
    ],
    "Actinobacteria": [
        "Bifidobacterium adolescentis", "Propionibacterium freudenreichii"
    ]
}

DISEASES = [
    "Inflammatory Bowel Disease (IBD)",
    "Irritable Bowel Syndrome (IBS)", 
    "Type 2 Diabetes (T2D)",
    "Obesity",
    "Colorectal Cancer (CRC)",
    "Clostridium difficile Infection (CDI)"
]

def generate_strain_library(n_strains=500):
    """Generate realistic bacterial strain metadata"""
    strains = []
    strain_id = 1
    
    for phylum, species_list in BACTERIAL_SPECIES.items():
        for species in species_list:
            for i in range(n_strains // 15):  # Distribute across species
                strain = {
                    "strain_id": f"GNS{strain_id:04d}",
                    "species": species,
                    "phylum": phylum,
                    "ncbi_taxonomy_id": random.randint(100000, 999999),
                    "genome_size_mb": round(random.uniform(1.5, 6.5), 2),
                    "gc_content": round(random.uniform(35, 65), 1),
                    "num_genes": random.randint(1500, 6000),
                    "num_bgcs": random.randint(0, 15),
                    "num_prophages": random.randint(0, 5),
                    "safety_level": random.choice(["GRAS", "QPS", "BSL-1", "Under Review"]),
                    "amr_genes": random.randint(0, 3),
                    "virulence_factors": random.randint(0, 2),
                    "growth_rate_h": round(random.uniform(0.5, 3.0), 2),
                    "oxygen_requirement": random.choice(["Aerobic", "Anaerobic", "Facultative"]),
                    "optimal_temp_c": random.randint(30, 42),
                    "optimal_ph": round(random.uniform(5.5, 8.0), 1),
                    "bile_tolerance": random.choice(["High", "Medium", "Low"]),
                    "acid_tolerance_ph3": random.choice([True, False]),
                    "isolation_source": random.choice(["Fecal", "Gut Biopsy", "Fermented Food", "Soil"]),
                    "collection_date": (datetime.now() - timedelta(days=random.randint(30, 1800))).isoformat(),
                    "sequenced": random.choice([True, True, True, False]),
                    "status": random.choice(["Active", "Active", "Archived", "In Testing"])
                }
                strains.append(strain)
                strain_id += 1
                
    return strains[:n_strains]

def generate_microbiome_profiles(n_samples=500):
    """Generate realistic microbiome abundance data"""
    all_species = [sp for species_list in BACTERIAL_SPECIES.values() for sp in species_list]
    
    profiles = []
    for i in range(n_samples):
        # Simulate alpha diversity
        n_species_present = random.randint(8, 15)
        species_present = random.sample(all_species, n_species_present)
        
        # Generate Dirichlet-distributed abundances
        alphas = np.random.uniform(0.5, 3.0, n_species_present)
        abundances = np.random.dirichlet(alphas)
        
        profile = {
            "sample_id": f"SAMPLE{i+1:04d}",
            "patient_id": f"PT{random.randint(1, 300):04d}",
            "collection_date": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
            "disease": random.choice(DISEASES + [None, None]),  # Some healthy controls
            "age": random.randint(18, 75),
            "bmi": round(random.uniform(18.5, 35.0), 1),
            "sex": random.choice(["M", "F"]),
            "shannon_diversity": round(random.uniform(1.5, 4.5), 2),
            "richness": n_species_present,
            "abundances": {species: float(round(ab, 6)) for species, ab in zip(species_present, abundances)}
        }
        profiles.append(profile)
        
    return profiles

def generate_clinical_trial_data(n_patients=300):
    """Generate realistic clinical trial patient data"""
    patients = []
    
    for i in range(1, n_patients + 1):
        enrollment_date = datetime.now() - timedelta(days=random.randint(30, 400))
        
        patient = {
            "patient_id": f"PT{i:04d}",
            "trial_id": random.choice(["GNS-IBD-001", "GNS-CDI-001", "GNS-IBS-002"]),
            "arm": random.choice(["Treatment", "Placebo", "Standard of Care"]),
            "enrollment_date": enrollment_date.isoformat(),
            "age": random.randint(21, 70),
            "sex": random.choice(["M", "F"]),
            "bmi": round(random.uniform(19.0, 38.0), 1),
            "smoking": random.choice([True, False]),
            "baseline_crp_mg_l": round(random.uniform(2.0, 50.0), 1),
            "baseline_calprotectin": round(random.uniform(50, 800), 0),
            "week_4_crp": round(random.uniform(1.5, 45.0), 1),
            "week_12_crp": round(random.uniform(1.0, 40.0), 1),
            "week_4_calprotectin": round(random.uniform(40, 700), 0),
            "week_12_calprotectin": round(random.uniform(30, 600), 0),
            "adverse_events": random.randint(0, 3),
            "serious_ae": random.choice([False, False, False, False, True]),
            "response": random.choice([True, True, False]),  # 60% response rate
            "remission": random.choice([True, False, False]),  # 30% remission rate
            "dropout": random.choice([False, False, False, False, True]),  # 20% dropout
            "cdx_result": random.choice(["Responder", "Non-Responder", "Indeterminate"]) if random.random() > 0.3 else None
        }
        patients.append(patient)
        
    return patients

def generate_manufacturing_batches(n_batches=50):
    """Generate realistic fermentation batch records"""
    batches = []
    
    for i in range(1, n_batches + 1):
        start_date = datetime.now() - timedelta(days=random.randint(10, 730))
        duration_hours = random.randint(36, 72)
        
        batch = {
            "batch_id": f"BATCH-2024-{i:03d}",
            "strain": random.choice([f"GNS{j:04d}" for j in range(1, 50)]),
            "fermenter": random.choice(["F1-500L", "F2-500L", "F3-200L", "F4-1000L"]),
            "start_date": start_date.isoformat(),
            "end_date": (start_date + timedelta(hours=duration_hours)).isoformat(),
            "scale": random.choice(["Pilot", "Pilot", "Commercial"]),
            "target_volume_l": random.choice([200, 500, 1000]),
            "actual_volume_l": random.choice([198, 495, 985]),
            "temperature_setpoint_c": 37.0,
            "ph_setpoint": 6.8,
            "do_setpoint_percent": random.choice([0, 5, 20]),  # Anaerobic or microaerobic
            "agitation_setpoint_rpm": random.randint(100, 400),
            "final_od600": round(random.uniform(15.0, 35.0), 2),
            "final_cfu_ml": f"{random.uniform(5, 15):.1f}e9",
            "viability_percent": round(random.uniform(85, 98), 1),
            "purity_percent": round(random.uniform(92, 99.9), 2),
            "endotoxin_eu_ml": round(random.uniform(0.1, 4.9), 2),
            "identity_confirmed": random.choice([True, True, True, False]),
            "release_status": random.choice(["Released", "Released", "Released", "Hold", "Reject"]),
            "deviation": random.choice([None, None, None, "Temperature excursion", "pH spike"]),
            "yield_kg": round(random.uniform(0.8, 3.5), 2),
            "cost_usd": random.randint(5000, 25000)
        }
        batches.append(batch)
        
    return batches

def generate_qc_tests(n_tests=200):
    """Generate quality control test results"""
    tests = []
    test_types = [
        "Viability", "Purity", "Identity (16S)", "Endotoxin",
        "Sterility", "Moisture Content", "pH", "Particle Size"
    ]
    
    for i in range(1, n_tests + 1):
        test_type = random.choice(test_types)
        
        # Define specs and results based on test type
        specs = {
            "Viability": {"spec": "≥90%", "result": f"{random.uniform(85, 98):.1f}%"},
            "Purity": {"spec": "≥95%", "result": f"{random.uniform(92, 99.8):.2f}%"},
            "Identity (16S)": {"spec": "Match reference", "result": random.choice(["Match", "Match", "No match"])},
            "Endotoxin": {"spec": "<5 EU/mL", "result": f"{random.uniform(0.1, 6.0):.2f} EU/mL"},
            "Sterility": {"spec": "No growth", "result": random.choice(["No growth", "No growth", "No growth", "Growth detected"])},
            "Moisture Content": {"spec": "≤5%", "result": f"{random.uniform(2.0, 6.5):.1f}%"},
            "pH": {"spec": "6.0-7.5", "result": f"{random.uniform(5.8, 7.7):.1f}"},
            "Particle Size": {"spec": "D50: 100-500 μm", "result": f"{random.randint(80, 550)} μm"}
        }
        
        spec_info = specs[test_type]
        
        test = {
            "test_id": f"QC{i:05d}",
            "batch_id": f"BATCH-2024-{random.randint(1, 50):03d}",
            "test_type": test_type,
            "test_date": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
            "specification": spec_info["spec"],
            "result": spec_info["result"],
            "pass_fail": random.choice(["Pass", "Pass", "Pass", "Fail"]),
            "analyst": random.choice(["Zhang Wei", "Li Ming", "Wang Fang", "Chen Hui", "Liu Yang"]),
            "reviewed_by": random.choice(["Dr. Wu", "Dr. Chen", "Dr. Liu"]),
            "comments": random.choice([None, None, "Borderline result", "Retest recommended", "Out of specification"])
        }
        tests.append(test)
        
    return tests

def save_all_mock_data():
    """Generate and save all mock datasets"""
    import os
    
    output_dir = "../frontend/src/data"
    os.makedirs(output_dir, exist_ok=True)
    
    print("Generating strain library...")
    strains = generate_strain_library(500)
    with open(f"{output_dir}/strains.json", "w") as f:
        json.dump(strains, f, indent=2)
    print(f"✅ Generated {len(strains)} strains")
    
    print("Generating microbiome profiles...")
    profiles = generate_microbiome_profiles(500)
    with open(f"{output_dir}/microbiome_profiles.json", "w") as f:
        json.dump(profiles, f, indent=2)
    print(f"✅ Generated {len(profiles)} microbiome samples")
    
    print("Generating clinical trial data...")
    patients = generate_clinical_trial_data(300)
    with open(f"{output_dir}/clinical_patients.json", "w") as f:
        json.dump(patients, f, indent=2)
    print(f"✅ Generated {len(patients)} patient records")
    
    print("Generating manufacturing batches...")
    batches = generate_manufacturing_batches(50)
    with open(f"{output_dir}/batches.json", "w") as f:
        json.dump(batches, f, indent=2)
    print(f"✅ Generated {len(batches)} batch records")
    
    print("Generating QC tests...")
    qc_tests = generate_qc_tests(200)
    with open(f"{output_dir}/qc_tests.json", "w") as f:
        json.dump(qc_tests, f, indent=2)
    print(f"✅ Generated {len(qc_tests)} QC test results")
    
    print("\n🎉 All mock data generated successfully!")
    print(f"Data saved to: {output_dir}/")

if __name__ == "__main__":
    save_all_mock_data()
