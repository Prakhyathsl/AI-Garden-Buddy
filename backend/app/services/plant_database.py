"""Curated horticultural seed database.
Provides verified botanical and growing details for home and container gardeners.
"""

from typing import List, Optional
from pydantic import BaseModel


class PlantRecord(BaseModel):
    id: str
    common_name: str
    scientific_name: Optional[str]
    category: str  # "Herb", "Vegetable", "Flower", "Medicinal"
    container_friendly: bool
    sunlight_requirement: str  # "Full Sun (6+ hrs)", "Partial Sun (4-6 hrs)", "Partial Shade (2-4 hrs)", "Bright Indirect Light"
    watering_needs: str  # "High", "Moderate", "Low"
    difficulty: str  # "Easy", "Moderate", "Challenging"
    growing_period_days: Optional[str]
    ideal_temperature_range: str
    suitable_soil: str
    container_depth_inches: Optional[int]
    spacing_inches: Optional[int]
    planting_summary: str
    harvesting_summary: str
    common_problems: List[str]
    preventive_care: List[str]
    companion_plants: List[str]
    caution_or_toxicity_notes: Optional[str]
    horticultural_sources: List[str]


CURATED_PLANTS: List[PlantRecord] = [
    PlantRecord(
        id="tulsi",
        common_name="Holy Basil (Tulsi)",
        scientific_name="Ocimum tenuiflorum",
        category="Herb",
        container_friendly=True,
        sunlight_requirement="Full Sun (6+ hrs)",
        watering_needs="Moderate",
        difficulty="Easy",
        growing_period_days="60-90 days to full bush",
        ideal_temperature_range="20°C - 35°C (Warm tropical/subtropical)",
        suitable_soil="Well-draining potting soil mixed with 30% organic compost; slight alkalinity preferred",
        container_depth_inches=10,
        spacing_inches=12,
        planting_summary="Sow seeds 0.5 cm deep or propagate from stem cuttings. Needs warmth and moist but non-waterlogged soil to germinate in 7-14 days.",
        harvesting_summary="Pinch outer leaves and terminal shoots in the morning. Regular pinching prevents flowering and promotes bushy foliage.",
        common_problems=["Root rot from waterlogging", "Aphids during humid spells", "Powdery mildew in poor air circulation"],
        preventive_care=["Ensure pot has clear drainage hole", "Spray diluted neem seed kernel extract for pests", "Prune spent blooms promptly"],
        companion_plants=["Marigold", "Chilli", "Tomato"],
        caution_or_toxicity_notes="Non-toxic to humans and common pets. In traditional practice, consumed fresh in teas.",
        horticultural_sources=["Indian Council of Agricultural Research (ICAR)", "Royal Horticultural Society (RHS)"]
    ),
    PlantRecord(
        id="mint",
        common_name="Spearmint / Pudina",
        scientific_name="Mentha spicata",
        category="Herb",
        container_friendly=True,
        sunlight_requirement="Partial Sun (4-6 hrs)",
        watering_needs="High",
        difficulty="Easy",
        growing_period_days="30-45 days from cuttings",
        ideal_temperature_range="15°C - 30°C",
        suitable_soil="Rich, moist, loamy soil with plenty of organic matter; tolerates slight acidity",
        container_depth_inches=8,
        spacing_inches=8,
        planting_summary="Grow from nursery runner or grocery stem cuttings in water. Best grown in dedicated pots as roots spread aggressively.",
        harvesting_summary="Snip top 2-3 inches of stems as needed. Cutting encourages denser leafy branching.",
        common_problems=["Spider mites in dry weather", "Leaf rust in prolonged damp foliage", "Invasive root expansion"],
        preventive_care=["Keep in isolated container", "Water at root level without wetting foliage at dusk", "Pinch stems regularly"],
        companion_plants=["Tomato", "Cabbage (deters pests)"],
        caution_or_toxicity_notes="Large quantities may cause mild stomach upset in cats and dogs due to essential oils.",
        horticultural_sources=["University of California Agriculture and Natural Resources", "RHS Plant Finder"]
    ),
    PlantRecord(
        id="cherry-tomato",
        common_name="Cherry Tomato",
        scientific_name="Solanum lycopersicum var. cerasiforme",
        category="Vegetable",
        container_friendly=True,
        sunlight_requirement="Full Sun (6+ hrs)",
        watering_needs="Moderate",
        difficulty="Moderate",
        growing_period_days="65-80 days from transplant",
        ideal_temperature_range="20°C - 32°C",
        suitable_soil="Deep, fertile potting mix enriched with aged compost, well-draining, pH 6.0-6.8",
        container_depth_inches=12,
        spacing_inches=18,
        planting_summary="Start seeds in trays and transplant when seedlings have 4-5 true leaves. Provide sturdy bamboo stake or cage.",
        harvesting_summary="Harvest individual fruits when fully colored and slightly tender to touch. Pick frequently to spur flowering.",
        common_problems=["Blossom end rot (calcium/watering irregularity)", "Whiteflies", "Early blight fungus"],
        preventive_care=["Mulch container surface to stabilize moisture", "Add crushed eggshell or calcium-rich compost", "Prune lower yellow leaves for air flow"],
        companion_plants=["Basil", "Marigold", "Nasturtium"],
        caution_or_toxicity_notes="Foliage and green stems contain solanine; do not consume green plant parts. Red fruit is safe.",
        horticultural_sources=["FAO Horticultural Guidelines", "Cornell University Vegetable Resources"]
    ),
    PlantRecord(
        id="green-chilli",
        common_name="Indian Green Chilli",
        scientific_name="Capsicum annuum",
        category="Vegetable",
        container_friendly=True,
        sunlight_requirement="Full Sun (6+ hrs)",
        watering_needs="Moderate",
        difficulty="Easy",
        growing_period_days="75-90 days",
        ideal_temperature_range="22°C - 35°C",
        suitable_soil="Warm, loose potting soil with good compost and sand for drainage",
        container_depth_inches=10,
        spacing_inches=14,
        planting_summary="Sow seeds 1 cm deep. Germinates best at warm temperatures (25°C+). Water gently with fine mist.",
        harvesting_summary="Snip green chillies with clean shears when firm and 2-3 inches long. Can be left to turn red for spicier flavor.",
        common_problems=["Leaf curl virus (transmitted by thrips/aphids)", "Damping off in wet soil", "Flower drop in extreme heat"],
        preventive_care=["Neem oil spray on leaf undersides every 10-14 days", "Avoid overhead watering", "Ensure container has good drainage"],
        companion_plants=["Basil", "Marigold", "Onion"],
        caution_or_toxicity_notes="Capsaicin can irritate eyes and skin. Handle freshly cut chillies with care; wash hands thoroughly.",
        horticultural_sources=["ICAR-Indian Institute of Horticultural Research", "University of Florida Extension"]
    ),
    PlantRecord(
        id="coriander",
        common_name="Coriander / Cilantro (Dhania)",
        scientific_name="Coriandrum sativum",
        category="Herb",
        container_friendly=True,
        sunlight_requirement="Partial Sun (4-6 hrs)",
        watering_needs="Moderate",
        difficulty="Easy",
        growing_period_days="35-45 days for leaves",
        ideal_temperature_range="16°C - 28°C (bolts quickly in hot sun)",
        suitable_soil="Light, crumbly potting soil with organic compost and coco-peat",
        container_depth_inches=6,
        spacing_inches=4,
        planting_summary="Gently crush whole coriander seeds into two halves before sowing. Sprinkle evenly and cover with 0.5 cm fine compost.",
        harvesting_summary="Harvest outer lower stems when 4-6 inches tall, leaving center crown to regenerate for a second cut.",
        common_problems=["Bolting to seed prematurely in heat", "Root rot if potting soil remains soggy"],
        preventive_care=["Provide afternoon shade in hot seasons", "Sow successively every 3 weeks for ongoing harvest"],
        companion_plants=["Mint", "Spinach", "Anise"],
        caution_or_toxicity_notes="Non-toxic. All parts (leaf, stem, seed) are culinary staples.",
        horticultural_sources=["RHS Gardening Advice", "Kisan Suvidha Portal"]
    ),
    PlantRecord(
        id="fenugreek",
        common_name="Fenugreek / Methi",
        scientific_name="Trigonella foenum-graecum",
        category="Herb",
        container_friendly=True,
        sunlight_requirement="Partial Sun (4-6 hrs)",
        watering_needs="Moderate",
        difficulty="Easy",
        growing_period_days="20-30 days for microgreens/greens",
        ideal_temperature_range="15°C - 30°C",
        suitable_soil="Well-aerated container mix, rich in compost, pH 6.0-7.0",
        container_depth_inches=6,
        spacing_inches=3,
        planting_summary="Soak kitchen methi seeds in water for 6-8 hours. Broadcast thickly in shallow wide troughs and lightly top with compost.",
        harvesting_summary="Cut whole shoots at soil level at 21-28 days when plants are 5-6 inches tall for tender, bitter-sweet greens.",
        common_problems=["Aphids in shaded conditions", "Damping off if seeds are oversown without ventilation"],
        preventive_care=["Maintain good air ventilation across balcony troughs", "Water only when surface soil feels dry"],
        companion_plants=["Garlic", "Coriander"],
        caution_or_toxicity_notes="Safe culinary green. High in fiber and iron.",
        horticultural_sources=["ICAR Crop Production Manual", "FAO Urban Agriculture"]
    ),
    PlantRecord(
        id="marigold",
        common_name="African / French Marigold (Genda)",
        scientific_name="Tagetes erecta / Tagetes patula",
        category="Flower",
        container_friendly=True,
        sunlight_requirement="Full Sun (6+ hrs)",
        watering_needs="Moderate",
        difficulty="Easy",
        growing_period_days="45-60 days to bloom",
        ideal_temperature_range="18°C - 35°C",
        suitable_soil="Standard potting soil with modest compost; avoids overly rich nitrogen soil which reduces blooms",
        container_depth_inches=8,
        spacing_inches=8,
        planting_summary="Sow thin needle-like seeds on surface and cover with 3 mm soil. Germinates readily within 4-7 days.",
        harvesting_summary="Snip open flower heads at base of stem for festive use, pest deterrence, or deadheading to encourage more buds.",
        common_problems=["Red spider mites during hot dry periods", "Botrytis rot in heavy rains"],
        preventive_care=["Deadhead spent blooms twice a week", "Plant alongside tomatoes and chillies to repel root-knot nematodes"],
        companion_plants=["Tomato", "Chilli", "Eggplant", "Basil"],
        caution_or_toxicity_notes="Mild sap irritation possible in sensitive skin; non-toxic to most mammals.",
        horticultural_sources=["Missouri Botanical Garden Plant Finder", "RHS Plants"]
    ),
    PlantRecord(
        id="malabar-spinach",
        common_name="Malabar Spinach (Basale Soppu)",
        scientific_name="Basella alba",
        category="Vegetable",
        container_friendly=True,
        sunlight_requirement="Full Sun (6+ hrs)",
        watering_needs="High",
        difficulty="Easy",
        growing_period_days="50-70 days",
        ideal_temperature_range="24°C - 38°C (Thrives in hot humid coastal climates)",
        suitable_soil="Rich, moisture-retentive potting mix with high vermicompost ratio",
        container_depth_inches=12,
        spacing_inches=12,
        planting_summary="Sow seeds after nicking the hard shell or propagate vigorous vine cuttings. Needs simple trellis or balcony railing to climb.",
        harvesting_summary="Harvest succulent fleshy leaves and tender top 6 inches of vine stems. Regrows vigorously throughout monsoon and warm seasons.",
        common_problems=["Leaf-spot fungus under prolonged stagnant humidity"],
        preventive_care=["Guide vines along open trellis for airflow", "Keep soil evenly moist with mulch layer"],
        companion_plants=["Sweet Potato", "Okra"],
        caution_or_toxicity_notes="Non-toxic; succulent leaves are high in vitamins A, C, and dietary minerals.",
        horticultural_sources=["University of Hawaii Cooperative Extension", "ICAR Coastal Agricultural Research"]
    ),
    PlantRecord(
        id="curry-leaf",
        common_name="Curry Leaf (Kadi Patta)",
        scientific_name="Murraya koenigii",
        category="Herb",
        container_friendly=True,
        sunlight_requirement="Full Sun (6+ hrs)",
        watering_needs="Moderate",
        difficulty="Moderate",
        growing_period_days="Perennial shrub (ongoing harvest after 6 months)",
        ideal_temperature_range="20°C - 36°C",
        suitable_soil="Well-draining, slightly acidic to neutral loam with compost and a dash of sour buttermilk monthly",
        container_depth_inches=14,
        spacing_inches=24,
        planting_summary="Propagate from root suckers or fresh black berry seeds. Slow starter; requires patience in year one.",
        harvesting_summary="Prune entire leaf compound stalks from branch tips rather than picking individual leaflets to encourage new branches.",
        common_problems=["Psyllids and scale insects on stems", "Iron chlorosis (yellowing between leaf veins) in alkaline soils"],
        preventive_care=["Feed with compost and organic iron/magnesium spray", "Scrape off scale insects with damp cloth and neem spray"],
        companion_plants=["Marigold", "Lemongrass"],
        caution_or_toxicity_notes="Curry leaves are edible culinary herbs; berries should not be consumed.",
        horticultural_sources=["ICAR-Central Plantation Crops Research Institute (CPCRI)", "Ayurvedic Pharmacopoeia"]
    ),
    PlantRecord(
        id="lemongrass",
        common_name="Lemongrass",
        scientific_name="Cymbopogon citratus",
        category="Herb",
        container_friendly=True,
        sunlight_requirement="Full Sun (6+ hrs)",
        watering_needs="Moderate",
        difficulty="Easy",
        growing_period_days="60-90 days for mature stalks",
        ideal_temperature_range="20°C - 38°C",
        suitable_soil="Loose sandy-loam potting mix with drainage pebbles at pot base",
        container_depth_inches=12,
        spacing_inches=12,
        planting_summary="Root market stalks in a cup of water until white roots sprout (7-10 days), then pot in a medium container.",
        harvesting_summary="Cut outer stalks at ground level with sharp knife when at least 0.5 inch thick. Use leaves for aromatic tea infusions.",
        common_problems=["Rust fungus on aging blade tips in high humidity"],
        preventive_care=["Trim dry leaf tips every month", "Divide clump every 1-2 years to rejuvenate pot space"],
        companion_plants=["Ginger", "Turmeric"],
        caution_or_toxicity_notes="Lemongrass oil can cause mild upset in dogs and cats if chewed in large amounts.",
        horticultural_sources=["Purdue University Center for New Crops", "RHS"]
    )
]


def search_plants(
    query: Optional[str] = None,
    category: Optional[str] = None,
    container_only: Optional[bool] = None,
    difficulty: Optional[str] = None,
    sunlight: Optional[str] = None
) -> List[PlantRecord]:
    """Filters plant library using curated criteria."""
    results = CURATED_PLANTS
    
    if query:
        q = query.lower().strip()
        results = [
            p for p in results
            if q in p.common_name.lower() or (p.scientific_name and q in p.scientific_name.lower())
        ]
        
    if category:
        cat = category.lower().strip()
        results = [p for p in results if p.category.lower() == cat]
        
    if container_only:
        results = [p for p in results if p.container_friendly]
        
    if difficulty:
        diff = difficulty.lower().strip()
        results = [p for p in results if p.difficulty.lower() == diff]
        
    if sunlight:
        sun = sunlight.lower().strip()
        results = [p for p in results if sun in p.sunlight_requirement.lower()]
        
    return results


def get_plant_by_id(plant_id: str) -> Optional[PlantRecord]:
    for p in CURATED_PLANTS:
        if p.id.lower() == plant_id.lower():
            return p
    return None
