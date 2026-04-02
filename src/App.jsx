import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Calendar,
  Syringe,
  Calculator,
  User,
  Plus,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  RotateCcw,
  Save,
  Trash2,
  Edit2,
  Sparkles,
  Wand2,
  Sun,
  Moon,
  Droplets,
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Heart,
  Scale,
  Coffee,
  Rainbow,
  Zap,
  BookOpen,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
} from 'recharts';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

// --- Helper for Local Date/Time ---
const getLocalIsoString = (dateObj) => {
  if (!dateObj) return '';
  const d = new Date(dateObj);
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60 * 1000).toISOString().split("T")[0];
};

const getDisplayDate = (isoString) => {
  if (!isoString) return '';
  const [y, m, d] = isoString.split('T')[0].split('-');
  return new Date(y, m - 1, d);
};

// --- Firebase Setup ---
const firebaseConfig = {
  apiKey: 'AIzaSyDHsV2LgKLwI8IwsSIBhslCvbzvD0hbOKI',
  authDomain: 'xeias-potions.firebaseapp.com',
  projectId: 'xeias-potions',
  storageBucket: 'xeias-potions.firebasestorage.app',
  messagingSenderId: '418686704196',
  appId: '1:418686704196:web:0311a09ad2e81deddc7a11',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'xeias-potions-app';

// --- Theme Colors ---
const theme = {
  bgLight: 'dark:bg-stone-800 bg-[#FCF9F2]',
  tomato: 'text-[#C64633]',
  bgTomato: 'bg-[#C64633]',
  borderTomato: 'border-[#C64633]',
  pear: 'text-[#E5A024]',
  bgPear: 'bg-[#E5A024]',
  honey: 'text-[#F2D59B]',
  bgHoney: 'bg-[#F2D59B]',
  sage: 'text-[#9AA078]',
  bgSage: 'bg-[#9AA078]',
};

// --- Peptide Library Database ---
const peptideDatabase = [
  {
    name: 'AOD 9604',
    category: 'HGH Fragment / Lipolytic Peptide',
    origin:
      'A fragment of human growth hormone (HGH), specifically derived from the section (amino acids 176-191) responsible for promoting fat breakdown. Designed to target fat loss without affecting other systemic growth processes.',
    mechanism: [
      'Lipolysis Promotion: Stimulates the release of fatty acids from adipose tissue, mimicking HGH fat-burning effects.',
      'Regulation of Fat Metabolism: Reduces fat cell size and minimizes fat storage.',
      'GH Specificity: Exclusively targets fat without altering IGF-1 or carbohydrate metabolism.',
    ],
    impact: [
      'Targeted Fat Reduction: Highly effective for stubborn fat areas, like the abdominal region.',
      'Lean Muscle Preservation: Reduces fat stores while supporting lean mass maintenance.',
      'Joint/Cartilage Regeneration: When combined with Hyaluronic Acid (HA), acts as a potent therapy for osteoarthritis.',
    ],
    dosage:
      'Subcutaneous: 250-500 mcg daily, typically fasted. Can be combined with HA for intra-articular joint injections.',
    safety:
      'Displays a very good safety profile indistinguishable from placebo. Lacks the adverse effects associated with full-length HGH.',
  },
  {
    name: 'Cagrilintide',
    category: 'Synthetic Amylin Analogue',
    origin:
      'A synthetic analogue of amylin, a naturally occurring hormone co-secreted with insulin by the pancreas that regulates blood sugar, appetite, and satiety.',
    mechanism: [
      'Promotes Satiety: Signals the brain to feel fuller for longer, reducing caloric intake naturally.',
      'Slows Gastric Emptying: Delays the passage of food through the stomach.',
      'Stabilizes Blood Sugar: Works synergistically with insulin to smooth out blood sugar fluctuations.',
    ],
    impact: [
      'Sustainable Weight Loss: Targets hunger regulation and cravings at the root cause.',
      'Improved Glycemic Control: Enhances insulin sensitivity and lowers postprandial blood sugar.',
      'Synergistic Therapy: Highly effective when stacked with GLP-1 receptor agonists (e.g., CagriSema).',
    ],
    dosage:
      'Subcutaneous: Typically administered at doses of 250 mcg or less weekly, often titrated slowly.',
    safety:
      'Strong safety profile. Common side effects are mild and include transient gastrointestinal discomfort like nausea or constipation during the initiation phase.',
  },
  {
    name: 'GHK-Cu (Copper Peptide)',
    category: 'Regenerative / Anti-Aging',
    origin:
      'A naturally occurring peptide complex composed of the glycyl-histidyl-lysine (GHK) sequence bound to a copper ion. Initially identified in human plasma, extensively studied for skin rejuvenation.',
    mechanism: [
      'Collagen Production: Stimulates the synthesis of collagen and glycosaminoglycans in the extracellular matrix.',
      'Anti-Inflammatory Effects: Exhibits strong properties that reduce redness, irritation, and swelling.',
      'Regenerative Action: Promotes tissue regeneration by increasing fibroblast activity and stimulating stem cells.',
      'Gene Expression Modulation: Upregulates tissue repair genes while downregulating genes linked to inflammation.',
    ],
    impact: [
      'Skin Rejuvenation: Enhances skin elasticity, reduces wrinkles, and improves skin tone and texture.',
      'Wound Healing: Accelerates the healing process of cuts, burns, and other injuries.',
      'Hair Regrowth: Promotes hair follicle growth and improves hair thickness.',
    ],
    dosage:
      'Topical: 1% for facial use, 2% for body, 3% for hair growth. Subcutaneous: 1-2 mg every 1-2 days. Zinc supplementation is highly recommended (offset by 2 hours) to prevent depletion.',
    safety:
      'Generally safe and well-tolerated. Side effects are rare and may include mild irritation or redness when applied topically or injected.',
  },
  {
    name: 'Glutathione',
    category: 'Tripeptide Antioxidant',
    origin:
      "A naturally occurring tripeptide (glutamine, cysteine, glycine). The body's most powerful antioxidant for cellular protection and detoxification.",
    mechanism: [
      'Antioxidant Action: Neutralizes free radicals and reactive oxygen species.',
      'Detoxification: Binds to toxins and heavy metals to promote elimination.',
      'Immune Support: Regulates T-cell activity and supports antiviral defenses.',
    ],
    impact: [
      'Cellular Health: Promotes DNA repair, cell regeneration, and cellular longevity.',
      'Liver Health: Enhances liver function and reduces toxin accumulation.',
      'Immune Defense: Strengthens defenses in compromised individuals or chronic illness.',
    ],
    dosage:
      'Subcutaneous: 100-200 mg daily. Oral (liposomal): 250-500 mg daily.',
    safety:
      'Very well-tolerated. High doses may occasionally cause mild bloating or nausea.',
  },
  {
    name: 'KPV',
    category: 'Alpha-MSH Stimulating Peptide',
    origin:
      'A tripeptide (Lys-Pro-Val) based on the alpha-Melanocyte-stimulating hormone (a-MSH) molecule. It possesses powerful anti-inflammatory properties.',
    mechanism: [
      'Inflammatory Pathway Inactivation: Exerts its anti-inflammatory function inside cells by inactivating inflammatory pathways (e.g., inhibiting NF-kB).',
      'Cytokine Regulation: Reduces pro-inflammatory cytokine release and leukocyte migration.',
      'Microbial Defense: Offers antimicrobial properties against various pathogens.',
    ],
    impact: [
      'Gut Health: Attenuates inflammatory responses of colonic epithelial cells (highly effective for IBD/colitis).',
      'Systemic Inflammation: Mitigates metaflammation and supports immune modulation.',
      'Synergistic Healing: Highly effective when stacked with BPC-157 for gastrointestinal healing.',
    ],
    dosage:
      'Oral / Subcutaneous: 500 mcg twice a day (BID). Can be used orally, transdermally, or via injection without localized side effects.',
    safety:
      'Reported extremely safe and efficacious in recommended dosages. Does not cause skin pigmentation (unlike full a-MSH).',
  },
  {
    name: 'L-Carnitine',
    category: 'Amino Acid Derivative',
    origin:
      'Synthesized in the liver and kidneys from lysine and methionine. Critical for fat metabolism and mitochondrial function.',
    mechanism: [
      'Fat Transport & Oxidation: Transports fatty acids into mitochondria for ATP production via beta-oxidation.',
      'Mitochondrial Support: Reduces oxidative stress and improves cellular energy output.',
      'Metabolic Regulation: Supports insulin sensitivity.',
    ],
    impact: [
      "Fat Loss & Weight Management: Enhances the body's ability to utilize fat for energy.",
      'Athletic Performance: Aids in muscle endurance and oxygen utilization.',
      'Cognitive Support: Improves brain function and reduces fatigue.',
    ],
    dosage:
      'Subcutaneous/Intramuscular: 250 mg to 1,000 mg daily. Oral: 500 mg to 2,000 mg daily.',
    safety:
      'Well-tolerated. May cause mild GI discomfort or increased energy affecting sleep if taken late in the day.',
  },
  {
    name: 'Lipo-B',
    category: 'Lipotropic Injection',
    origin:
      'A formulated blend supporting fat metabolism and liver function. Contains Methionine, Inositol, Choline, Vitamin B12, and Vitamin B6.',
    mechanism: [
      'Fat Metabolism: Stimulates lipolysis by mobilizing stored fat for energy.',
      'Liver Detoxification: Aids in the processing and elimination of toxins from the liver.',
      'Metabolic Support: Reduces fatigue and supports energy conversion.',
    ],
    impact: [
      'Fat Loss: Enhances fat-burning processes while preserving lean mass.',
      'Liver Health: Reduces fatty liver risk and promotes better digestion.',
      'Energy & Mood Support: Boosts energy levels and mental clarity through B-vitamin supplementation.',
    ],
    dosage:
      'Subcutaneous/Intramuscular: 1-2 ml, administered 1-2 times per week.',
    safety:
      'Minimal side effects. Mild gastrointestinal discomfort or localized injection site irritation may occur.',
  },
  {
    name: 'Lipo-C',
    category: 'Lipotropic Injection',
    origin:
      'An advanced formulated blend supporting fat metabolism. Contains Methionine, Inositol, Choline, Vitamin B12, and specifically includes L-Carnitine for enhanced fat transport.',
    mechanism: [
      'Fat Transport: L-Carnitine actively transports fatty acids into mitochondria for energy.',
      'Fat Metabolism: Increases lipolysis and prevents fat accumulation.',
      'Liver Detoxification: Supports liver function by aiding toxin elimination.',
    ],
    impact: [
      'Fat Loss: Highly effective component of weight loss programs due to L-Carnitine synergy.',
      'Liver Health: Enhances detoxification, supporting liver function and metabolic regulation.',
      'Energy Boost: Increases metabolic function and provides natural energy enhancement.',
    ],
    dosage:
      'Subcutaneous/Intramuscular: 1-2 ml, administered 2-3 times weekly.',
    safety:
      'Well-tolerated. May cause mild nausea or localized injection site irritation. Proper hydration is recommended.',
  },
  {
    name: 'MOTS-c',
    category: 'Mitochondrial-Derived Peptide (MDP)',
    origin:
      'Encoded within the 12S rRNA region of mitochondrial DNA. A unique peptide that influences mitochondrial function directly, regulating metabolism and energy production.',
    mechanism: [
      'Energy Metabolism Regulation: Increases endogenous AICAR levels and activates AMPK.',
      'Fat Loss & Efficiency: Promotes lipolysis, increases caloric expenditure, upregulates brown adipose tissue.',
      'Insulin Sensitivity: Enhances glucose uptake into muscle cells.',
    ],
    impact: [
      'Metabolic Health & Weight Management: Supports fat loss while preserving muscle mass.',
      'Anti-Aging & Longevity: Protects mitochondria, delays age-related metabolic decline.',
      'Increased Energy: Enhances physical performance and endurance.',
    ],
    dosage: 'Subcutaneous: 5mg to 10mg injected 2 times a week.',
    safety:
      'Well-tolerated. May deplete intracellular folate; supplementing with folate/folinic acid is heavily advised during cycles.',
  },
  {
    name: 'NAD+',
    category: 'Coenzyme',
    origin:
      'Nicotinamide Adenine Dinucleotide is a naturally occurring coenzyme found in all living cells. Essential for energy metabolism, DNA repair, and sirtuin activation.',
    mechanism: [
      'Energy Production: Serves as a cofactor in cellular respiration (ATP production).',
      'DNA Repair & Longevity: Supports PARP enzymes for genomic stability.',
      'Sirtuin Activation: Regulates cellular health, metabolism, and aging-related processes.',
    ],
    impact: [
      'Cellular Energy: Improves metabolic efficiency and overall vitality.',
      'Neuroprotection: Protects against neurodegenerative diseases and supports mental clarity.',
      'Anti-Aging: Promotes DNA repair and reduces oxidative stress.',
    ],
    dosage:
      'Subcutaneous: Titrated protocol. Week 1-2 (25mg 2x/wk), Week 3-4 (50mg 2x/wk), up to 200mg 3x/wk. IV: 500-1000mg.',
    safety:
      'May cause temporary flushing, nausea, or transient fatigue immediately upon injection as the body adjusts.',
  },
  {
    name: 'Selank',
    category: 'Tuftsin Mimetic / Anxiolytic',
    origin:
      'A synthetic analogue of the endogenous immunomodulatory peptide tuftsin. Developed in Russia for its anxiolytic, cognitive-enhancing, and immune-modulating effects.',
    mechanism: [
      'Anxiolytic Effects: Modulates serotonin and GABAergic systems without sedative effects.',
      'Cognitive Enhancement: Increases brain-derived neurotrophic factor (BDNF) for neuroplasticity.',
      'Immune Modulation: Regulates cytokine activity (IL-6, Th1, Th2 balance).',
    ],
    impact: [
      'Stress & Anxiety Reduction: Helps mitigate chronic stress and generalized anxiety.',
      'Cognitive Enhancement: Improves focus, memory retention, and mental clarity.',
      'Gastric ulcer accelerated healing.',
    ],
    dosage:
      'Subcutaneous: 300-1000 mcg daily or 2x weekly. Intranasal (0.15%): 2-3 drops each nostril, 2-3 times daily for immediate relief.',
    safety:
      "Safe, no addiction potential or 'hangover' effects. May cause mild nasal irritation if used as a spray.",
  },
  {
    name: 'Semaglutide',
    category: 'GLP-1 Receptor Agonist',
    origin:
      'A synthetic GLP-1 receptor agonist designed to mimic the naturally occurring GLP-1 hormone, playing a crucial role in glucose metabolism, appetite regulation, and weight management.',
    mechanism: [
      'GLP-1 Receptor Activation: Enhances insulin secretion and suppresses glucagon release.',
      'Appetite Suppression & Satiety: Delays gastric emptying and signals satiety to the brain.',
      'Glucose Regulation: Stabilizes postprandial glucose levels.',
    ],
    impact: [
      'Weight Loss: Significant body fat reduction by reducing hunger and caloric intake.',
      'Type 2 Diabetes Management: Lowers fasting blood glucose and HbA1c.',
      'Cardiovascular Benefits: Reduces risk of major cardiovascular events.',
    ],
    dosage:
      'Subcutaneous: Start at 0.25mg weekly. Increase gradually every 4 weeks up to 1-2.4mg weekly based on clinical response.',
    safety:
      'May cause nausea, vomiting, or diarrhea. Contraindicated in patients with a history of medullary thyroid carcinoma (MTC) or MEN 2.',
  },
  {
    name: 'Semax',
    category: 'ACTH (4-10) Fragment Analogue',
    origin:
      'A heptapeptide, synthetic analog of an ACTH fragment developed in Russia. Used as a nootropic or cognitive enhancing peptide with neuroprotective and neurogenic properties.',
    mechanism: [
      'Neuroprotection & BDNF Stimulation: Increases BDNF levels, supporting neuronal growth and repair.',
      'Cognitive Enhancement: Modulates dopamine, serotonin, and acetylcholine.',
      'HPA Axis Regulation: Helps to reduce stress, anxiety, and mental fatigue.',
    ],
    impact: [
      'Cognitive Enhancement: Improves memory retention, mental clarity, and focus.',
      'Neurological Recovery: Supports recovery from stroke, TBI, and neurodegenerative conditions.',
      'Stress & Fatigue Reduction.',
    ],
    dosage:
      'Subcutaneous: 100-1000 mcg daily or 2x weekly. Intranasal (0.1%): 1-2 drops each nostril 2-3 times a day.',
    safety:
      'Minimal side effects. Does not have sedative effects or dependency risks. May cause mild overstimulation if taken late in the day.',
  },
  {
    name: 'SS-31',
    category: 'Mitochondria-Targeting Peptide',
    origin:
      'Designed to protect and enhance mitochondrial function. Developed to mitigate oxidative stress, improve energy production, and enhance cellular longevity.',
    mechanism: [
      'Mitochondrial Protection: Selectively binds to cardiolipin, stabilizing mitochondrial membranes.',
      'Cellular Longevity: Improves ATP production and reduces oxidative damage.',
    ],
    impact: [
      'Anti-Aging & Longevity: Slows down age-related cellular decline.',
      'Cardiovascular Health: Protects cardiac tissue and reduces ischemia-reperfusion injury.',
      'Neuroprotection: Reduces neurodegeneration.',
    ],
    dosage:
      'Subcutaneous: 10-20 mg weekly, or 4 mg daily for 10-20 days. Often used in 12-week cycles.',
    safety:
      'Considered safe. Minimal reported side effects, potentially localized injection site irritation or transient fatigue.',
  },
  {
    name: 'Tesamorelin',
    category: 'GHRH Analogue',
    origin:
      'A synthetic peptide analog of growth hormone-releasing hormone (GHRH), designed to stimulate natural growth hormone (GH) secretion. Originally developed to reduce visceral fat in HIV-associated lipodystrophy.',
    mechanism: [
      'GH Secretion Stimulation: Binds to GHRH receptors in the anterior pituitary, increasing GH and IGF-1.',
      'Visceral Fat Reduction: Stimulates lipolysis leading to a reduction in abdominal fat.',
      'Metabolic Enhancement: Improves lipid profiles, glucose metabolism, and insulin sensitivity.',
    ],
    impact: [
      'Decreases visceral adipose tissue (VAT) by 15%-20% over 6-12 months.',
      'Improved Body Composition: Promotes lean muscle mass retention.',
      'Improves cognitive function in mild cognitive impairment (MCI).',
    ],
    dosage:
      'Subcutaneous: 1-2 mg daily, administered at least 90 minutes after the last meal, typically before bedtime.',
    safety:
      'Well-tolerated. Mild injection site erythema, transient water retention. Contraindicated with active malignancy or pituitary conditions.',
  },
  {
    name: 'Tirzepatide',
    category: 'Dual GIP & GLP-1 Receptor Agonist',
    origin:
      'A synthetic peptide acting as a dual agonist for both GIP (glucose-dependent insulinotropic polypeptide) and GLP-1 (glucagon-like peptide-1) receptors. Developed for Type 2 diabetes and obesity management.',
    mechanism: [
      'Dual Agonism: Synergistically activates both GIP and GLP-1 receptors to maximize metabolic benefits.',
      'Appetite Suppression: Signals the brain to reduce hunger and caloric intake while significantly delaying gastric emptying.',
      'Insulin Sensitization: Vastly improves insulin sensitivity and pancreatic beta-cell function.',
    ],
    impact: [
      'Extreme Weight Loss: Demonstrates unprecedented fat reduction compared to GLP-1 only agonists.',
      'Glycemic Control: Excellent reduction of HbA1c in individuals with Type 2 Diabetes.',
      'Cardiovascular Health: Reduces triglycerides, blood pressure, and markers of non-alcoholic fatty liver.',
    ],
    dosage:
      'Subcutaneous: Start at 2.5 mg once weekly for 4 weeks. Escalate by 2.5 mg every 4 weeks to a maximum of 15 mg weekly, based on tolerability and clinical goals.',
    safety:
      'Common side effects include nausea, diarrhea, vomiting, and constipation, primarily during dosage increases. Contraindicated in patients with a history of Medullary Thyroid Carcinoma (MTC).',
  },
];

export default function App() {
  // --- State Management ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [peptides, setPeptides] = useState([]);
  const [logs, setLogs] = useState([]);
  const [aestheticsLogs, setAestheticsLogs] = useState([]);
  const [microneedlingLogs, setMicroneedlingLogs] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [mealLogs, setMealLogs] = useState([]);
  const [waterLogs, setWaterLogs] = useState([]);
  const [hrtLogs, setHrtLogs] = useState([]);
  const [supplementLogs, setSupplementLogs] = useState([]);
  const [profile, setProfile] = useState({
    height: '',
    weight: '',
    goalWeight: '',
    age: '',
    gender: 'Female',
    name: 'Alchemist',
    showTransition: true,
    showAesthetics: true,
    showMicroneedling: true,
    showMeals: true,
    showSupplements: true,
    showWeight: true,
  });
  const [loading, setLoading] = useState(true);

  // --- UI State ---
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const [showPeptideModal, setShowPeptideModal] = useState(false);
  const [editingPeptide, setEditingPeptide] = useState(null);
  const [showLogInjection, setShowLogInjection] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  // --- Firebase Auth & Data Fetching ---
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error('Auth Error:', error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const peptidesRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'peptides'
    );
    const unsubPeptides = onSnapshot(
      peptidesRef,
      (snapshot) => {
        const peps = [];
        snapshot.forEach((doc) => peps.push({ id: doc.id, ...doc.data() }));
        setPeptides(peps);
      },
      (error) => console.error('Error fetching peptides:', error)
    );

    const logsRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'logs'
    );
    const unsubLogs = onSnapshot(
      logsRef,
      (snapshot) => {
        const logData = [];
        snapshot.forEach((doc) => logData.push({ id: doc.id, ...doc.data() }));
        logData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLogs(logData);
      },
      (error) => console.error('Error fetching logs:', error)
    );

    const aestheticsRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'aesthetics_logs'
    );
    const unsubAesthetics = onSnapshot(
      aestheticsRef,
      (snapshot) => {
        const aLogs = [];
        snapshot.forEach((doc) => aLogs.push({ id: doc.id, ...doc.data() }));
        aLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAestheticsLogs(aLogs);
      },
      (error) => console.error('Error fetching aesthetics logs:', error)
    );

    const mnRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'microneedling_logs'
    );
    const unsubMN = onSnapshot(
      mnRef,
      (snapshot) => {
        const mnData = [];
        snapshot.forEach((doc) => mnData.push({ id: doc.id, ...doc.data() }));
        mnData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMicroneedlingLogs(mnData);
      },
      (error) => console.error('Error fetching microneedling logs:', error)
    );

    const weightRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'weight_logs'
    );
    const unsubWeight = onSnapshot(
      weightRef,
      (snapshot) => {
        const wData = [];
        snapshot.forEach((doc) => wData.push({ id: doc.id, ...doc.data() }));
        wData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWeightLogs(wData);
      },
      (error) => console.error('Error fetching weight logs:', error)
    );

    const mealRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'meal_logs'
    );
    const unsubMeal = onSnapshot(
      mealRef,
      (snapshot) => {
        const mData = [];
        snapshot.forEach((doc) => mData.push({ id: doc.id, ...doc.data() }));
        mData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMealLogs(mData);
      },
      (error) => console.error('Error fetching meal logs:', error)
    );

    const waterRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'water_logs'
    );
    const unsubWater = onSnapshot(
      waterRef,
      (snapshot) => {
        const wData = [];
        snapshot.forEach((doc) => wData.push({ id: doc.id, ...doc.data() }));
        wData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWaterLogs(wData);
      },
      (error) => console.error('Error fetching water logs:', error)
    );

    const hrtRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'hrt_logs'
    );
    const unsubHRT = onSnapshot(
      hrtRef,
      (snapshot) => {
        const hData = [];
        snapshot.forEach((doc) => hData.push({ id: doc.id, ...doc.data() }));
        hData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHrtLogs(hData);
      },
      (error) => console.error('Error fetching hrt logs:', error)
    );

    const suppRef = collection(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'supplement_logs'
    );
    const unsubSupplements = onSnapshot(
      suppRef,
      (snapshot) => {
        const sData = [];
        snapshot.forEach((doc) => sData.push({ id: doc.id, ...doc.data() }));
        sData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setSupplementLogs(sData);
      },
      (error) => console.error('Error fetching supplement logs:', error)
    );

    const profileRef = doc(
      db,
      'artifacts',
      appId,
      'users',
      user.uid,
      'profile',
      'data'
    );
    const unsubProfile = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      },
      (error) => console.error('Error fetching profile:', error)
    );

    return () => {
      unsubPeptides();
      unsubLogs();
      unsubAesthetics();
      unsubMN();
      unsubWeight();
      unsubMeal();
      unsubWater();
      unsubHRT();
      unsubSupplements();
      unsubProfile();
    };
  }, [user]);

  // --- Handlers ---
  const handleSaveProfile = async (newProfile) => {
    if (!user || !db) return;
    try {
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data'),
        newProfile
      );
      setProfile(newProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSavePeptide = async (peptideData, id) => {
    if (!user || !db) return;
    try {
      if (id) {
        await updateDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'peptides', id),
          peptideData
        );
      } else {
        await addDoc(
          collection(db, 'artifacts', appId, 'users', user.uid, 'peptides'),
          peptideData
        );
      }
      setShowPeptideModal(false);
      setEditingPeptide(null);
    } catch (error) {
      console.error('Error saving peptide:', error);
    }
  };

  const handleDeletePeptide = async (id) => {
    if (!user || !db) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'peptides', id)
      );
    } catch (error) {
      console.error('Error deleting peptide:', error);
    }
  };

  const handleLogInjection = async (logData, id) => {
    if (!user || !db) return;
    try {
      if (id) {
        await updateDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'logs', id),
          logData
        );
      } else {
        await addDoc(
          collection(db, 'artifacts', appId, 'users', user.uid, 'logs'),
          {
            ...logData,
            date: logData.date || new Date().toISOString(),
          }
        );
      }
      setShowLogInjection(false);
      setEditingLog(null);
    } catch (error) {
      console.error('Error logging injection:', error);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!user || !db) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'logs', id)
      );
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  };

  const handleLogAesthetics = async (logData, id) => {
    if (!user || !db) return;
    try {
      if (id) {
        await updateDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'aesthetics_logs', id),
          logData
        );
      } else {
        await addDoc(
          collection(
            db,
            'artifacts',
            appId,
            'users',
            user.uid,
            'aesthetics_logs'
          ),
          {
            ...logData,
            date: logData.date || new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Error logging aesthetics:', error);
    }
  };

  const handleDeleteAestheticsLog = async (id) => {
    if (!user || !db) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'aesthetics_logs', id)
      );
    } catch (error) {
      console.error('Error deleting aesthetics log:', error);
    }
  };

  const handleLogMicroneedling = async (logData, id) => {
    if (!user || !db) return;
    try {
      if (id) {
        await updateDoc(
          doc(
            db,
            'artifacts',
            appId,
            'users',
            user.uid,
            'microneedling_logs',
            id
          ),
          logData
        );
      } else {
        await addDoc(
          collection(
            db,
            'artifacts',
            appId,
            'users',
            user.uid,
            'microneedling_logs'
          ),
          {
            ...logData,
            date: logData.date || new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Error logging microneedling:', error);
    }
  };

  const handleDeleteMicroneedlingLog = async (id) => {
    if (!user || !db) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'microneedling_logs', id)
      );
    } catch (error) {
      console.error('Error deleting microneedling log:', error);
    }
  };

  const handleLogWeight = async (logData, id) => {
    if (!user || !db) return;
    try {
      if (id) {
        await updateDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'weight_logs', id),
          logData
        );
      } else {
        await addDoc(
          collection(db, 'artifacts', appId, 'users', user.uid, 'weight_logs'),
          {
            ...logData,
            date: logData.date || new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Error logging weight:', error);
    }
  };

  const handleDeleteWeightLog = async (id) => {
    if (!user || !db) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'weight_logs', id)
      );
    } catch (error) {
      console.error('Error deleting weight log:', error);
    }
  };

  const handleLogMeal = async (logData, id) => {
    if (!user || !db) return;
    try {
      if (id) {
        await updateDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'meal_logs', id),
          logData
        );
      } else {
        await addDoc(
          collection(db, 'artifacts', appId, 'users', user.uid, 'meal_logs'),
          {
            ...logData,
            date: logData.date || new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Error logging meal:', error);
    }
  };

  const handleDeleteMealLog = async (id) => {
    if (!user || !db) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'meal_logs', id)
      );
    } catch (error) {
      console.error('Error deleting meal log:', error);
    }
  };

  const handleLogWater = async (amountToAdd) => {
    if (!user || !db) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const currentLog = waterLogs.find((w) => w.id === todayStr);
    const newAmount = (currentLog ? currentLog.amount : 0) + amountToAdd;
    try {
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'water_logs', todayStr),
        {
          amount: Math.max(0, newAmount),
          date: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error logging water:', error);
    }
  };

  const handleLogHRT = async (logData, id) => {
    if (!user || !db) return;
    try {
      if (id) {
        await updateDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'hrt_logs', id),
          logData
        );
      } else {
        await addDoc(
          collection(db, 'artifacts', appId, 'users', user.uid, 'hrt_logs'),
          {
            ...logData,
            date: logData.date || new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Error logging HRT:', error);
    }
  };

  const handleDeleteHRTLog = async (id) => {
    if (!user || !db) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'hrt_logs', id)
      );
    } catch (error) {
      console.error('Error deleting HRT log:', error);
    }
  };

  const handleLogSupplement = async (logData, id) => {
    if (!user || !db) return;
    try {
      if (id) {
        await updateDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'supplement_logs', id),
          logData
        );
      } else {
        await addDoc(
          collection(db, 'artifacts', appId, 'users', user.uid, 'supplement_logs'),
          {
            ...logData,
            date: logData.date || new Date().toISOString(),
          }
        );
      }
    } catch (error) {
      console.error('Error logging supplement:', error);
    }
  };

  const handleDeleteSupplementLog = async (id) => {
    if (!user || !db) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'supplement_logs', id)
      );
    } catch (error) {
      console.error('Error deleting supplement log:', error);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center dark:bg-stone-900 bg-[#FCF9F2] ${theme.tomato} font-bold`}
      >
        Brewing Potions...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen dark:bg-stone-900 bg-[#FCF9F2] dark:text-stone-100 text-stone-800 flex flex-col md:flex-row font-sans transition-colors duration-300`}
    >
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 dark:bg-stone-950 bg-white p-4 flex flex-row md:flex-col gap-2 overflow-x-auto border-b md:border-b-0 md:border-r border-[#F2D59B] shadow-sm z-10 custom-scrollbar shrink-0">
        <div className="flex items-center justify-between md:hidden w-full mb-4">
          <div className="flex items-center gap-3 px-2">
            <MoleculeLogo className={`w-8 h-8 flex-shrink-0 ${theme.tomato}`} />
            <h1 className={`text-lg font-extrabold ${theme.tomato}`}>
              Xeia's Potions
            </h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-[#FCF9F2] dark:bg-stone-800 text-[#E5A024] hover:bg-[#F2D59B] dark:hover:bg-stone-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <div className="hidden md:flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <MoleculeLogo className={`w-10 h-10 flex-shrink-0 ${theme.tomato}`} />
            <h1 className={`text-xl font-extrabold ${theme.tomato}`}>
              Xeia's Potions
            </h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full dark:bg-stone-800 bg-[#FCF9F2] text-[#E5A024] hover:bg-[#F2D59B] dark:hover:bg-stone-700 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <NavButton
          icon={<Activity />}
          label="Dashboard"
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        />
        <NavButton
          icon={<Syringe />}
          label="Stack & Cycles"
          active={activeTab === 'stack'}
          onClick={() => setActiveTab('stack')}
        />
        {profile.showTransition !== false && (
          <NavButton
            icon={<Rainbow />}
            label="Transition"
            active={activeTab === 'transition'}
            onClick={() => setActiveTab('transition')}
          />
        )}
        {profile.showAesthetics !== false && (
          <NavButton
            icon={<Sparkles />}
            label="Meso, Botox & RF"
            active={activeTab === 'aesthetics'}
            onClick={() => setActiveTab('aesthetics')}
          />
        )}
        {profile.showMicroneedling !== false && (
          <NavButton
            icon={<Wand2 />}
            label="Microneedling"
            active={activeTab === 'microneedling'}
            onClick={() => setActiveTab('microneedling')}
          />
        )}
        {profile.showMeals !== false && (
          <NavButton
            icon={<Coffee />}
            label="Meals & Water"
            active={activeTab === 'meals'}
            onClick={() => setActiveTab('meals')}
          />
        )}
        {profile.showSupplements !== false && (
          <NavButton
            icon={<Heart />}
            label="Supplements"
            active={activeTab === 'supplements'}
            onClick={() => setActiveTab('supplements')}
          />
        )}
        {profile.showWeight !== false && (
          <NavButton
            icon={<Scale />}
            label="Weight Tracker"
            active={activeTab === 'weight'}
            onClick={() => setActiveTab('weight')}
          />
        )}
        <NavButton
          icon={<Calendar />}
          label="Logs"
          active={activeTab === 'logs'}
          onClick={() => setActiveTab('logs')}
        />
        <NavButton
          icon={<Calculator />}
          label="Calculators"
          active={activeTab === 'calculators'}
          onClick={() => setActiveTab('calculators')}
        />

      
        <NavButton
          icon={<ShieldCheck />}
          label="Privacy & Info"
          active={activeTab === 'info'}
          onClick={() => setActiveTab('info')}
        />
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard
            peptides={peptides}
            logs={logs}
            onLogClick={() => {
              setEditingLog(null);
              setShowLogInjection(true);
            }}
            onAddClick={() => {
              setEditingPeptide(null);
              setShowPeptideModal(true);
            }}
          />
        )}
        {activeTab === 'stack' && (
          <StackManager
            peptides={peptides}
            onAddClick={() => {
              setEditingPeptide(null);
              setShowPeptideModal(true);
            }}
            onEditClick={(pep) => {
              setEditingPeptide(pep);
              setShowPeptideModal(true);
            }}
            onDelete={handleDeletePeptide}
          />
        )}
        {activeTab === 'aesthetics' && (
          <AestheticsView
            logs={aestheticsLogs}
            onSave={handleLogAesthetics}
            onDelete={handleDeleteAestheticsLog}
          />
        )}
        {activeTab === 'microneedling' && (
          <MicroneedlingView
            logs={microneedlingLogs}
            onSave={handleLogMicroneedling}
            onDelete={handleDeleteMicroneedlingLog}
          />
        )}
        {activeTab === 'meals' && (
          <MealWaterView
            mealLogs={mealLogs}
            waterLogs={waterLogs}
            onSaveMeal={handleLogMeal}
            onDeleteMeal={handleDeleteMealLog}
            onLogWater={handleLogWater}
          />
        )}
        {activeTab === 'transition' && (
          <TransitionView
            logs={hrtLogs}
            onSave={handleLogHRT}
            onDelete={handleDeleteHRTLog}
          />
        )}
        {activeTab === 'supplements' && (
          <SupplementTrackerView
            logs={supplementLogs}
            onSave={handleLogSupplement}
            onDelete={handleDeleteSupplementLog}
          />
        )}
        {activeTab === 'weight' && (
          <WeightTrackerView
            logs={weightLogs}
            profile={profile}
            onSave={handleLogWeight}
            onDelete={handleDeleteWeightLog}
            onUpdateProfile={handleSaveProfile}
          />
        )}
        {activeTab === 'logs' && (
          <LogHistory
            logs={logs}
            peptides={peptides}
            onEdit={(log) => {
              setEditingLog(log);
              setShowLogInjection(true);
            }}
            onDelete={handleDeleteLog}
          />
        )}
        {activeTab === 'calculators' && <Calculators profile={profile} />}
        {activeTab === 'profile' && (
          <UserProfile
            profile={profile}
            onSave={handleSaveProfile}
            user={user}
          />
        )}
        {activeTab === 'info' && <PrivacyInfoView />}
      </main>

      {/* Modals */}
      {showPeptideModal && (
        <PeptideModal
          initialData={editingPeptide}
          onClose={() => {
            setShowPeptideModal(false);
            setEditingPeptide(null);
          }}
          onSave={handleSavePeptide}
        />
      )}
      {showLogInjection && (
        <LogInjectionModal
          initialData={editingLog}
          onClose={() => {
            setShowLogInjection(false);
            setEditingLog(null);
          }}
          onSave={handleLogInjection}
          peptides={peptides}
        />
      )}
    </div>
  );
}

// --- Navigation Component ---
function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
        active
          ? 'bg-[#F2D59B]/40 text-[#C64633] font-bold'
          : 'dark:text-stone-400 text-stone-500 hover:bg-[#F2D59B]/20 hover:text-[#C64633]'
      }`}
    >
      {React.cloneElement(icon, { className: 'w-5 h-5 flex-shrink-0' })}
      <span className="truncate">{label}</span>
    </button>
  );
}

// --- Logo Component ---
function MoleculeLogo(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="6" cy="8" r="2" />
      <circle cx="7" cy="17" r="2.5" />
      <circle cx="16" cy="18" r="2" />
      <circle cx="18" cy="10" r="2" />
      <circle cx="19" cy="4" r="1.5" />
      <path
        d="M6 8 Q9 10 12 12 M7 17 Q9.5 14.5 12 12 M16 18 Q14 15 12 12 M18 10 Q15 11 12 12"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// --- Dashboard View ---
function Dashboard({ peptides, logs, onLogClick, onAddClick }) {
  const activePeptides = peptides.filter((p) => p.status !== 'completed');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = new Date().toISOString().split('T')[0];

  const injectionsToday = logs.filter((l) =>
    l.date.startsWith(todayStr)
  ).length;

  const updosingPeptides = activePeptides.filter(
    (p) => p.updoseIncrementMg > 0
  );
  const [selectedChartPepId, setSelectedChartPepId] = useState(
    updosingPeptides.length > 0 ? updosingPeptides[0].id : null
  );

  useEffect(() => {
    if (
      updosingPeptides.length > 0 &&
      !updosingPeptides.find((p) => p.id === selectedChartPepId)
    ) {
      setSelectedChartPepId(updosingPeptides[0].id);
    }
  }, [peptides, updosingPeptides, selectedChartPepId]);

  let chartData = [];
  let selectedChartPep = null;
  if (selectedChartPepId) {
    selectedChartPep = updosingPeptides.find(
      (p) => p.id === selectedChartPepId
    );
    if (selectedChartPep) {
      let projectedDose = selectedChartPep.currentDoseMg;
      for (let w = 1; w <= 12; w++) {
        chartData.push({
          week: `W${w}`,
          dose: parseFloat(projectedDose.toFixed(2)),
        });
        if (w % selectedChartPep.updoseFrequencyWeeks === 0) {
          projectedDose += selectedChartPep.updoseIncrementMg;
          if (
            selectedChartPep.maxDoseMg > 0 &&
            projectedDose > selectedChartPep.maxDoseMg
          ) {
            projectedDose = selectedChartPep.maxDoseMg;
          }
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">
            Alchemist's Overview
          </h2>
          <p className="dark:text-stone-400 text-stone-500">
            Track your current cycles, potions, and schedules.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onLogClick}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F2D59B] hover:bg-[#E5A024] text-[#C64633] px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Log Dose
          </button>
          <button
            onClick={onAddClick}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#C64633] hover:bg-[#A83724] text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm shadow-[#F2D59B]"
          >
            <Plus className="w-4 h-4" /> Add Potion
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Protocols"
          value={activePeptides.length}
          icon={<Activity />}
          color="text-[#C64633]"
          bg="bg-[#C64633]/10"
        />
        <StatCard
          title="Injections Today"
          value={injectionsToday}
          icon={<Syringe />}
          color="text-[#E5A024]"
          bg="bg-[#E5A024]/10"
        />
        <StatCard
          title="Total Logs"
          value={logs.length}
          icon={<Database />}
          color="text-[#9AA078]"
          bg="bg-[#9AA078]/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-stone-100 text-stone-800">
            <AlertCircle className="text-[#C64633] w-5 h-5" /> Cycle & Vial
            Alerts
          </h3>
          {activePeptides.length === 0 ? (
            <p className="dark:text-stone-400 text-stone-500 text-sm">
              No active protocols. Add one to see alerts.
            </p>
          ) : (
            <div className="space-y-4">
              {activePeptides.map((pep) => {
                const daysPerVial =
                  Math.floor(pep.vialSizeMg / pep.currentDoseMg) *
                  pep.frequencyDays;
                const startDate = new Date(pep.startDate);
                const depletionDate = new Date(
                  startDate.getTime() + daysPerVial * 24 * 60 * 60 * 1000
                );
                const isLow =
                  depletionDate.getTime() - new Date().getTime() <
                  7 * 24 * 60 * 60 * 1000;

                return (
                  <div
                    key={pep.id}
                    className="p-3 dark:bg-stone-800 bg-[#FCF9F2] rounded-lg border border-[#F2D59B] flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold dark:text-stone-100 text-stone-800">{pep.name}</p>
                      <p className="text-xs dark:text-stone-400 text-stone-500">
                        Cycle ends in {pep.cycleOnWeeks} weeks
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-bold ${
                          isLow ? 'text-[#C64633]' : 'text-[#9AA078]'
                        }`}
                      >
                        Vial lasts ~{daysPerVial} days
                      </p>
                      <p className="text-xs dark:text-stone-400 text-stone-500">
                        Reconstitute new vial on: {depletionDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2 dark:text-stone-100 text-stone-800">
              <TrendingUp className="text-[#E5A024] w-5 h-5" /> Updosing
              Schedule
            </h3>
            {updosingPeptides.length > 0 && (
              <select
                value={selectedChartPepId || ''}
                onChange={(e) => setSelectedChartPepId(e.target.value)}
                className="dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] text-sm rounded-lg p-1.5 dark:text-stone-200 text-stone-700 font-medium focus:outline-none"
              >
                {updosingPeptides.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {updosingPeptides.length === 0 ? (
            <p className="text-sm dark:text-stone-400 text-stone-500">
              No active protocols have an updosing schedule set.
            </p>
          ) : (
            <>
              <p className="text-xs dark:text-stone-400 text-stone-500 mb-4 font-medium uppercase tracking-wider">
                12-Week Projection for {selectedChartPep?.name}
              </p>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2D59B" />
                    <XAxis dataKey="week" stroke="#A8A29E" fontSize={12} />
                    <YAxis stroke="#A8A29E" fontSize={12} width={40} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #F2D59B',
                        borderRadius: '8px',
                        color: '#1C1917',
                      }}
                    />
                    <Line
                      type="stepAfter"
                      dataKey="dose"
                      stroke="#C64633"
                      strokeWidth={3}
                      dot={{ fill: '#C64633', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Calendar Projection */}
      <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-stone-100 text-stone-800">
          <Calendar className="text-[#9AA078] w-5 h-5" /> Upcoming Schedule
          Projection
        </h3>
        <p className="text-sm dark:text-stone-400 text-stone-500 mb-4">
          Your projected injection days for the next 14 days based on your
          active cycles.
        </p>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {Array.from({ length: 14 }).map((_, i) => {
              const d = new Date(today);
              d.setDate(today.getDate() + i);
              const isToday = i === 0;

              const dayInjections = activePeptides.filter((pep) => {
                const startDate = new Date(pep.startDate);
                startDate.setHours(0, 0, 0, 0);

                const diffTime = d.getTime() - startDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) return false;

                const cycleTotalDays =
                  (pep.cycleOnWeeks + pep.cycleOffWeeks) * 7;
                const daysIntoCycle = diffDays % cycleTotalDays;
                const isCycleOn = daysIntoCycle < pep.cycleOnWeeks * 7;

                if (!isCycleOn) return false;
                return diffDays % pep.frequencyDays === 0;
              });

              return (
                <div
                  key={i}
                  className={`w-36 flex-shrink-0 rounded-xl border ${
                    isToday
                      ? 'border-[#C64633] dark:bg-stone-800 bg-[#FCF9F2] shadow-md shadow-[#F2D59B]'
                      : 'border-[#F2D59B] dark:bg-stone-900 bg-white shadow-sm'
                  } overflow-hidden`}
                >
                  <div
                    className={`text-center py-2 ${
                      isToday
                        ? 'bg-[#C64633] text-white'
                        : 'dark:bg-stone-800 bg-[#FCF9F2] dark:text-stone-300 text-stone-600'
                    } font-bold text-sm border-b border-[#F2D59B]`}
                  >
                    {isToday
                      ? 'Today'
                      : d.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                  </div>
                  <div className="p-3 space-y-2 min-h-[90px]">
                    {dayInjections.length === 0 ? (
                      <p className="text-xs text-center text-stone-400 font-medium italic mt-2">
                        No injections
                      </p>
                    ) : (
                      dayInjections.map((pep) => (
                        <div
                          key={pep.id}
                          className="text-xs dark:bg-stone-900 bg-white border border-[#F2D59B] rounded-lg p-2 shadow-sm"
                        >
                          <span className="font-bold text-[#C64633] block truncate">
                            {pep.name}
                          </span>
                          <span className="dark:text-stone-400 text-stone-500 font-medium">
                            {pep.currentDoseMg} mg
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Stack & Cycles View ---
function StackManager({ peptides, onAddClick, onEditClick, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">Stack & Cycles</h2>
          <p className="dark:text-stone-400 text-stone-500">
            Manage your potion protocols and scheduling rules.
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-[#C64633] hover:bg-[#A83724] text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm shadow-[#F2D59B]"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {peptides.length === 0 ? (
        <div className="text-center py-12 dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm">
          <Syringe className="w-12 h-12 text-[#F2D59B] mx-auto mb-3" />
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">No Potions Yet</h3>
          <p className="dark:text-stone-400 text-stone-500 mb-4">
            Add your first potion to start tracking your stack.
          </p>
          <button
            onClick={onAddClick}
            className="text-[#C64633] hover:text-[#A83724] font-bold"
          >
            + Add Potion Protocol
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {peptides.map((pep) => (
            <div
              key={pep.id}
              className="dark:bg-stone-900 bg-white p-5 rounded-xl border border-[#F2D59B] shadow-sm relative group hover:border-[#E5A024] transition-colors"
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEditClick(pep)}
                  className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-800 bg-[#FCF9F2] p-1.5 rounded-md transition-colors border border-transparent hover:border-[#F2D59B]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(pep.id)}
                  className="text-stone-400 hover:text-[#C64633] dark:bg-stone-800 bg-[#FCF9F2] p-1.5 rounded-md transition-colors border border-transparent hover:border-[#F2D59B]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold dark:text-stone-100 text-stone-800">
                    {pep.name}
                  </h3>
                  <p className="text-sm text-[#E5A024] font-medium">
                    {pep.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <span className="text-stone-400 block text-xs uppercase font-bold tracking-wider">
                    Current Dose
                  </span>
                  <span className="font-bold dark:text-stone-200 text-stone-700">
                    {pep.currentDoseMg} mg
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs uppercase font-bold tracking-wider">
                    Frequency
                  </span>
                  <span className="font-bold dark:text-stone-200 text-stone-700">
                    Every {pep.frequencyDays} day(s)
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs uppercase font-bold tracking-wider">
                    Cycle Rule
                  </span>
                  <span className="font-bold dark:text-stone-200 text-stone-700">
                    {pep.cycleOnWeeks}w ON / {pep.cycleOffWeeks}w OFF
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-xs uppercase font-bold tracking-wider">
                    Vial Size
                  </span>
                  <span className="font-bold dark:text-stone-200 text-stone-700">
                    {pep.vialSizeMg} mg
                  </span>
                </div>
                {pep.updoseIncrementMg > 0 && (
                  <div className="col-span-2 dark:bg-stone-800 bg-[#FCF9F2] p-2.5 rounded-lg flex items-center gap-2 mt-2 border border-[#F2D59B]">
                    <TrendingUp className="w-4 h-4 text-[#C64633]" />
                    <span className="text-xs dark:text-stone-300 text-stone-600 font-medium">
                      Updosing: +{pep.updoseIncrementMg}mg every{' '}
                      {pep.updoseFrequencyWeeks}w (Max {pep.maxDoseMg}mg)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Weight Tracker View ---
function WeightTrackerView({
  logs,
  profile,
  onSave,
  onDelete,
  onUpdateProfile,
}) {
  const [weight, setWeight] = useState('');
  const [logDate, setLogDate] = useState(getLocalIsoString(new Date()));
  const [saving, setSaving] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);

  const [isEditingGoal, setIsEditingGoal] = useState(!profile.goalWeight);
  const [tempGoal, setTempGoal] = useState(profile.goalWeight || '');

  const goalWeight = profile.goalWeight ? Number(profile.goalWeight) : null;
  const currentWeight =
    logs.length > 0
      ? Number(logs[0].weight)
      : profile.weight
      ? Number(profile.weight)
      : 0;

  useEffect(() => {
    setTempGoal(profile.goalWeight || '');
    if (profile.goalWeight) setIsEditingGoal(false);
  }, [profile.goalWeight]);

  const handleSaveGoal = async () => {
    if (onUpdateProfile) {
      await onUpdateProfile({ ...profile, goalWeight: tempGoal });
      setIsEditingGoal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(
      {
        weight: Number(weight),
        date: new Date(logDate).toISOString(),
      },
      editingLogId
    );
    setSaving(false);
    setWeight('');
    setLogDate(getLocalIsoString(new Date()));
    setEditingLogId(null);
  };

  const handleEdit = (log) => {
    setWeight(log.weight);
    setLogDate(
      log.date
        ? getLocalIsoString(new Date(log.date))
        : getLocalIsoString(new Date())
    );
    setEditingLogId(log.id);
  };

  const handleCancelEdit = () => {
    setWeight('');
    setLogDate(getLocalIsoString(new Date()));
    setEditingLogId(null);
  };

  const chartData = [...logs].reverse().map((l) => ({
    date: getDisplayDate(l.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    weight: l.weight,
  }));

  const comparisonData = [
    { name: 'Current', weight: currentWeight, fill: '#E5A024' },
    { name: 'Goal', weight: goalWeight || 0, fill: '#9AA078' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">Weight Management</h2>
        <p className="dark:text-stone-400 text-stone-500">
          Track your body metrics and progress towards your goal.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Logger */}
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm xl:col-span-1">
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#9AA078]" />{' '}
            {editingLogId ? 'Edit Weight Log' : 'Log Weight'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.0"
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving || !weight}
                className="flex-1 bg-[#9AA078] hover:bg-[#838965] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                {saving
                  ? 'Saving...'
                  : editingLogId
                  ? 'Update Log'
                  : 'Save Weight'}
              </button>
              {editingLogId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 bg-stone-100 hover:bg-stone-200 dark:text-stone-300 text-stone-600 font-bold py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 p-4 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-xl text-center relative group">
            {isEditingGoal ? (
              <div className="space-y-2">
                <p className="text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider">
                  Set Target Goal (kg)
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    placeholder="0.0"
                    className="w-full dark:bg-stone-900 bg-white border border-[#F2D59B] rounded-lg p-2 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#9AA078]"
                  />
                  {profile.goalWeight && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingGoal(false);
                        setTempGoal(profile.goalWeight);
                      }}
                      className="bg-stone-200 hover:bg-stone-300 dark:text-stone-300 text-stone-600 font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      X
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveGoal}
                    disabled={!tempGoal}
                    className="bg-[#9AA078] hover:bg-[#838965] disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="absolute top-2 right-2 text-stone-400 hover:text-[#9AA078] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <p className="text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider">
                  Target Goal
                </p>
                <p className="text-2xl font-bold text-[#9AA078]">
                  {goalWeight} kg
                </p>
                <p className="text-xs text-[#C64633] font-medium mt-1">
                  {currentWeight > goalWeight
                    ? `${(currentWeight - goalWeight).toFixed(1)} kg to lose!`
                    : `${(goalWeight - currentWeight).toFixed(1)} kg to gain!`}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm xl:col-span-2 flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <h3 className="text-sm font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-4">
              Weight Trend
            </h3>
            {chartData.length < 2 ? (
              <div className="h-48 flex items-center justify-center text-stone-400 italic text-sm border border-dashed border-[#F2D59B] rounded-xl">
                Need at least 2 logs for trend.
              </div>
            ) : (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F2D59B" />
                    <XAxis dataKey="date" stroke="#A8A29E" fontSize={12} />
                    <YAxis
                      stroke="#A8A29E"
                      fontSize={12}
                      width={40}
                      domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #F2D59B',
                        borderRadius: '8px',
                        color: '#1C1917',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#E5A024"
                      strokeWidth={3}
                      dot={{ fill: '#E5A024', r: 4 }}
                    />
                    {goalWeight && (
                      <ReferenceLine
                        y={goalWeight}
                        stroke="#9AA078"
                        strokeDasharray="3 3"
                        label={{
                          position: 'top',
                          value: 'Goal',
                          fill: '#9AA078',
                          fontSize: 10,
                        }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="md:w-1/3">
            <h3 className="text-sm font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-4 text-center">
              Current vs Goal
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F2D59B"
                  />
                  <XAxis dataKey="name" stroke="#A8A29E" fontSize={12} />
                  <YAxis
                    stroke="#A8A29E"
                    fontSize={12}
                    width={30}
                    domain={[0, 'auto']}
                    hide
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #F2D59B',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="weight" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden flex flex-col">
        <div className="dark:bg-stone-800 bg-[#FCF9F2] p-4 border-b border-[#F2D59B]">
          <h3 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#9AA078]" /> Weight History
          </h3>
        </div>
        {logs.length === 0 ? (
          <div className="p-8 text-center text-stone-400 font-medium flex-1 flex items-center justify-center">
            No weight logs yet.
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
              <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Weight</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {logs.map((log) => {
                  const d = getDisplayDate(log.date);
                  return (
                    <tr
                      key={log.id}
                      className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold dark:text-stone-100 text-stone-800">
                          {d.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[#E5A024] block">
                          {log.weight} kg
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(log)}
                            className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(log.id)}
                            className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Aesthetics View ---
function AestheticsView({ logs, onSave, onDelete }) {
  const [mesoName, setMesoName] = useState('Lemon Bottle');
  const [mesoVol, setMesoVol] = useState('');
  const [mesoDate, setMesoDate] = useState(getLocalIsoString(new Date()));

  const [botoxName, setBotoxName] = useState('Nabota');
  const [botoxUnits, setBotoxUnits] = useState('');
  const [botoxDate, setBotoxDate] = useState(getLocalIsoString(new Date()));

  const [rfArea, setRfArea] = useState('Belly');
  const [rfDuration, setRfDuration] = useState('');
  const [rfDate, setRfDate] = useState(getLocalIsoString(new Date()));

  const [savingMeso, setSavingMeso] = useState(false);
  const [savingBotox, setSavingBotox] = useState(false);
  const [savingRf, setSavingRf] = useState(false);

  const [editingMesoId, setEditingMesoId] = useState(null);
  const [editingBotoxId, setEditingBotoxId] = useState(null);
  const [editingRfId, setEditingRfId] = useState(null);

  const rfAreas = [
    'Face',
    'Neck',
    'Arms',
    'Belly',
    'Love Handles',
    'Thighs',
    'Glutes',
  ];

  const handleMesoSubmit = async (e) => {
    e.preventDefault();
    setSavingMeso(true);
    await onSave(
      {
        type: 'meso',
        mesoName: mesoName || 'Unknown',
        mesoVolume: mesoVol ? Number(mesoVol) : 0,
        date: new Date(mesoDate).toISOString(),
      },
      editingMesoId
    );
    setSavingMeso(false);
    setMesoVol('');
    setEditingMesoId(null);
    setMesoDate(getLocalIsoString(new Date()));
  };

  const handleBotoxSubmit = async (e) => {
    e.preventDefault();
    setSavingBotox(true);
    await onSave(
      {
        type: 'botox',
        botoxName: botoxName || 'Unknown',
        botoxUnits: botoxUnits ? Number(botoxUnits) : 0,
        date: new Date(botoxDate).toISOString(),
      },
      editingBotoxId
    );
    setSavingBotox(false);
    setBotoxUnits('');
    setEditingBotoxId(null);
    setBotoxDate(getLocalIsoString(new Date()));
  };

  const handleRfSubmit = async (e) => {
    e.preventDefault();
    setSavingRf(true);
    await onSave(
      {
        type: 'rf',
        rfArea: rfArea || 'Belly',
        rfDuration: rfDuration ? Number(rfDuration) : 0,
        date: new Date(rfDate).toISOString(),
      },
      editingRfId
    );
    setSavingRf(false);
    setRfDuration('');
    setEditingRfId(null);
    setRfDate(getLocalIsoString(new Date()));
  };

  const handleEditMeso = (log) => {
    setMesoName(log.mesoName);
    setMesoVol(log.mesoVolume);
    setMesoDate(
      log.date
        ? getLocalIsoString(new Date(log.date))
        : getLocalIsoString(new Date())
    );
    setEditingMesoId(log.id);
  };

  const handleCancelMesoEdit = () => {
    setMesoName('Lemon Bottle');
    setMesoVol('');
    setMesoDate(getLocalIsoString(new Date()));
    setEditingMesoId(null);
  };

  const handleEditBotox = (log) => {
    setBotoxName(log.botoxName);
    setBotoxUnits(log.botoxUnits);
    setBotoxDate(
      log.date
        ? getLocalIsoString(new Date(log.date))
        : getLocalIsoString(new Date())
    );
    setEditingBotoxId(log.id);
  };

  const handleCancelBotoxEdit = () => {
    setBotoxName('Nabota');
    setBotoxUnits('');
    setBotoxDate(getLocalIsoString(new Date()));
    setEditingBotoxId(null);
  };

  const handleEditRf = (log) => {
    setRfArea(log.rfArea);
    setRfDuration(log.rfDuration);
    setRfDate(
      log.date
        ? getLocalIsoString(new Date(log.date))
        : getLocalIsoString(new Date())
    );
    setEditingRfId(log.id);
  };

  const handleCancelRfEdit = () => {
    setRfArea('Belly');
    setRfDuration('');
    setRfDate(getLocalIsoString(new Date()));
    setEditingRfId(null);
  };

  const mesoLogs = logs.filter((l) => l.type === 'meso' || l.mesoVolume > 0);
  const botoxLogs = logs.filter((l) => l.type === 'botox' || l.botoxUnits > 0);
  const rfLogs = logs.filter((l) => l.type === 'rf');

  const lemonBottleGuide = [
    { area: 'Double Chin', points: '5 - 8', usage: '10 - 15' },
    { area: 'Abdomen', points: '8 - 10', usage: '30 - 40' },
    { area: 'Love Handle (One side)', points: '4 - 6', usage: '15 - 25' },
    { area: 'Upper Arms', points: '3 - 4', usage: '10 - 15' },
    { area: 'Outer Thighs (One side)', points: '5 - 7', usage: '10 - 20' },
    { area: 'Inner Thighs (One side)', points: '5 - 7', usage: '10 - 20' },
  ];

  const botoxGuide = [
    { area: 'Forehead Lines (Frontalis)', units: '10 - 30 Units' },
    { area: 'Frown Lines (Glabellar)', units: '15 - 25 Units' },
    { area: "Crow's Feet", units: '5 - 15 Units (per side)' },
    { area: 'Masseter (Jaw Slimming)', units: '15 - 30 Units (per side)' },
    { area: 'Bunny Lines', units: '2 - 5 Units (per side)' },
    { area: 'Lip Flip', units: '4 - 6 Units (total)' },
    { area: 'Dimpled Chin (Mentalis)', units: '2 - 6 Units' },
  ];

  const rfGuide = [
    { area: 'Face & Neck', time: '10 - 20 mins' },
    { area: 'Arms (Both)', time: '20 - 30 mins' },
    { area: 'Belly / Abdomen', time: '20 - 30 mins' },
    { area: 'Love Handles', time: '20 - 30 mins' },
    { area: 'Thighs / Glutes', time: '30 - 40 mins' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">
          Meso, Botox & RF Aesthetics
        </h2>
        <p className="dark:text-stone-400 text-stone-500">
          Mapping guides and treatment logging for your cosmetic injectables and
          machines.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-[#F2D59B] pb-4">
            <div className="p-2 dark:bg-stone-800 bg-[#FCF9F2] rounded-lg border border-[#F2D59B]">
              <Sparkles className="w-5 h-5 text-[#E5A024]" />
            </div>
            <div>
              <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">
                Lemon Bottle Guide
              </h3>
              <p className="text-xs dark:text-stone-400 text-stone-500 font-medium">
                Safe ingredients allowing high volume usage.
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {lemonBottleGuide.map((g) => (
              <div
                key={g.area}
                className="flex justify-between items-center p-3 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#F2D59B]"
              >
                <span className="font-bold dark:text-stone-100 text-stone-800 text-sm truncate pr-2" title={g.area}>
                  {g.area}
                </span>
                <div className="flex gap-2 flex-shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold text-white bg-[#E5A024] px-2 py-1 rounded-md">
                    {g.points} pts
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-white bg-[#E5A024] px-2 py-1 rounded-md">
                    {g.usage} ml
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#C64633]/30 text-sm">
            <p className="font-bold dark:text-stone-100 text-stone-800 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C64633]" /> Important
              Instructions:
            </p>
            <ul className="list-disc pl-5 dark:text-stone-300 text-stone-600 space-y-1 font-medium">
              <li>
                Formula: <strong>Total amount ÷ points injected</strong> =
                amount per point. (e.g., Abdomen 40ml ÷ 8 pts = 5ml per point).
              </li>
              <li>Draw a wider grid to reduce needle pain.</li>
              <li>
                <strong>Do not exceed 100cc (ml)</strong> in the whole body in
                one treatment.
              </li>
            </ul>
          </div>
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-[#F2D59B] pb-4">
            <div className="p-2 dark:bg-stone-800 bg-[#FCF9F2] rounded-lg border border-[#F2D59B]">
              <Syringe className="w-5 h-5 text-[#9AA078]" />
            </div>
            <div>
              <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">
                Botox Target Mapping
              </h3>
              <p className="text-xs dark:text-stone-400 text-stone-500 font-medium">
                Standard clinical unit recommendations.
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {botoxGuide.map((b) => (
              <div
                key={b.area}
                className="flex justify-between items-center p-3 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#F2D59B]"
              >
                <span className="font-bold dark:text-stone-100 text-stone-800 text-sm">
                  {b.area}
                </span>
                <span className="text-xs font-bold text-white bg-[#9AA078] px-2 py-1 rounded-md">
                  {b.units}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#9AA078]/30 text-sm">
            <p className="dark:text-stone-300 text-stone-600 font-medium text-center">
              Units vary highly based on muscle strength, biological sex, and
              desired aesthetic outcome. Always map dynamically to the
              individual's muscle movements.
            </p>
          </div>
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-[#F2D59B] pb-4">
            <div className="p-2 dark:bg-stone-800 bg-[#FCF9F2] rounded-lg border border-[#F2D59B]">
              <Zap className="w-5 h-5 text-[#C64633]" />
            </div>
            <div>
              <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">
                RF Session Guide
              </h3>
              <p className="text-xs dark:text-stone-400 text-stone-500 font-medium">
                Standard duration for skin tightening.
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {rfGuide.map((r) => (
              <div
                key={r.area}
                className="flex justify-between items-center p-3 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#F2D59B]"
              >
                <span className="font-bold dark:text-stone-100 text-stone-800 text-sm">
                  {r.area}
                </span>
                <span className="text-xs font-bold text-white bg-[#C64633] px-2 py-1 rounded-md">
                  {r.time}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#C64633]/30 text-sm">
            <p className="font-bold dark:text-stone-100 text-stone-800 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C64633]" /> RF Safety Tips:
            </p>
            <ul className="list-disc pl-5 dark:text-stone-300 text-stone-600 space-y-1 font-medium text-xs">
              <li>
                Always use <strong>conductive gel</strong> or glycerin.
              </li>
              <li>
                Keep the probe moving continuously in circles to avoid burns.
              </li>
              <li>Drink plenty of water before and after to flush toxins.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm relative">
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E5A024]" />{' '}
            {editingMesoId ? 'Edit Mesolipo Log' : 'Log Mesolipo'}
          </h3>
          <form onSubmit={handleMesoSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Meso Brand
              </label>
              <input
                type="text"
                value={mesoName}
                onChange={(e) => setMesoName(e.target.value)}
                placeholder="e.g. Lemon Bottle"
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                  Volume (ml)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={mesoVol}
                  onChange={(e) => setMesoVol(e.target.value)}
                  placeholder="0 ml"
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={mesoDate}
                  onChange={(e) => setMesoDate(e.target.value)}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={savingMeso || !mesoVol}
                className="flex-1 bg-[#E5A024] hover:bg-[#c98d20] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                {savingMeso
                  ? 'Saving...'
                  : editingMesoId
                  ? 'Update Log'
                  : 'Save Meso Log'}
              </button>
              {editingMesoId && (
                <button
                  type="button"
                  onClick={handleCancelMesoEdit}
                  className="px-4 bg-stone-100 hover:bg-stone-200 dark:text-stone-300 text-stone-600 font-bold py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm relative">
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-4 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-[#9AA078]" />{' '}
            {editingBotoxId ? 'Edit Botox Log' : 'Log Botox'}
          </h3>
          <form onSubmit={handleBotoxSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Botox Brand
              </label>
              <input
                type="text"
                value={botoxName}
                onChange={(e) => setBotoxName(e.target.value)}
                placeholder="e.g. Nabota"
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#9AA078]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                  Units (U)
                </label>
                <input
                  type="number"
                  step="1"
                  value={botoxUnits}
                  onChange={(e) => setBotoxUnits(e.target.value)}
                  placeholder="0 U"
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#9AA078]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={botoxDate}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#9AA078]"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={savingBotox || !botoxUnits}
                className="flex-1 bg-[#9AA078] hover:bg-[#838965] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                {savingBotox
                  ? 'Saving...'
                  : editingBotoxId
                  ? 'Update Log'
                  : 'Save Botox Log'}
              </button>
              {editingBotoxId && (
                <button
                  type="button"
                  onClick={handleCancelBotoxEdit}
                  className="px-4 bg-stone-100 hover:bg-stone-200 dark:text-stone-300 text-stone-600 font-bold py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm relative">
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#C64633]" />{' '}
            {editingRfId ? 'Edit RF Log' : 'Log RF Session'}
          </h3>
          <form onSubmit={handleRfSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Target Area
              </label>
              <select
                value={rfArea}
                onChange={(e) => setRfArea(e.target.value)}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
              >
                {rfAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                  Duration (Mins)
                </label>
                <input
                  type="number"
                  step="1"
                  value={rfDuration}
                  onChange={(e) => setRfDuration(e.target.value)}
                  placeholder="0 mins"
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={rfDate}
                  onChange={(e) => setRfDate(e.target.value)}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={savingRf || !rfDuration}
                className="flex-1 bg-[#C64633] hover:bg-[#A83724] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                {savingRf
                  ? 'Saving...'
                  : editingRfId
                  ? 'Update Log'
                  : 'Save RF Log'}
              </button>
              {editingRfId && (
                <button
                  type="button"
                  onClick={handleCancelRfEdit}
                  className="px-4 bg-stone-100 hover:bg-stone-200 dark:text-stone-300 text-stone-600 font-bold py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden flex flex-col">
          <div className="dark:bg-stone-800 bg-[#FCF9F2] p-4 border-b border-[#F2D59B]">
            <h3 className="font-bold text-[#E5A024] flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Mesolipo History
            </h3>
          </div>
          {mesoLogs.length === 0 ? (
            <div className="p-8 text-center text-stone-400 font-medium flex-1 flex items-center justify-center">
              No mesolipo treatments logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
                <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                  <tr>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Brand & Volume</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {mesoLogs.map((log) => {
                    const d = getDisplayDate(log.date);
                    return (
                      <tr
                        key={log.id}
                        className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold dark:text-stone-100 text-stone-800">
                            {d.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-[#C64633] block">
                            {log.mesoName}
                          </span>
                          <span className="dark:text-stone-400 text-stone-500 font-medium text-xs bg-stone-100 px-2 py-0.5 rounded mt-1 inline-block">
                            {log.mesoVolume} ml
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditMeso(log)}
                              className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(log.id)}
                              className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden flex flex-col">
          <div className="dark:bg-stone-800 bg-[#FCF9F2] p-4 border-b border-[#F2D59B]">
            <h3 className="font-bold text-[#9AA078] flex items-center gap-2">
              <Syringe className="w-4 h-4" /> Botox History
            </h3>
          </div>
          {botoxLogs.length === 0 ? (
            <div className="p-8 text-center text-stone-400 font-medium flex-1 flex items-center justify-center">
              No botox treatments logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
                <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                  <tr>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Brand & Units</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {botoxLogs.map((log) => {
                    const d = getDisplayDate(log.date);
                    return (
                      <tr
                        key={log.id}
                        className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold dark:text-stone-100 text-stone-800">
                            {d.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-[#9AA078] block">
                            {log.botoxName}
                          </span>
                          <span className="dark:text-stone-400 text-stone-500 font-medium text-xs bg-stone-100 px-2 py-0.5 rounded mt-1 inline-block">
                            {log.botoxUnits} U
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditBotox(log)}
                              className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(log.id)}
                              className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden flex flex-col">
          <div className="dark:bg-stone-800 bg-[#FCF9F2] p-4 border-b border-[#F2D59B]">
            <h3 className="font-bold text-[#C64633] flex items-center gap-2">
              <Zap className="w-4 h-4" /> RF History
            </h3>
          </div>
          {rfLogs.length === 0 ? (
            <div className="p-8 text-center text-stone-400 font-medium flex-1 flex items-center justify-center">
              No RF treatments logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
                <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                  <tr>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Area & Mins</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {rfLogs.map((log) => {
                    const d = getDisplayDate(log.date);
                    return (
                      <tr
                        key={log.id}
                        className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold dark:text-stone-100 text-stone-800">
                            {d.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-[#C64633] block">
                            {log.rfArea}
                          </span>
                          <span className="dark:text-stone-400 text-stone-500 font-medium text-xs bg-stone-100 px-2 py-0.5 rounded mt-1 inline-block">
                            {log.rfDuration} Mins
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditRf(log)}
                              className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(log.id)}
                              className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Microneedling Components ---
function MicroneedlingView({ logs, onSave, onDelete }) {
  const [editingLogId, setEditingLogId] = useState(null);

  const handleSave = async (data, id) => {
    await onSave(data, id);
    setEditingLogId(null);
  };

  const amEditingLog = logs.find(
    (l) => l.id === editingLogId && l.session === 'Morning'
  );
  const pmEditingLog = logs.find(
    (l) => l.id === editingLogId && l.session === 'Evening'
  );

  const techniqueGuide = [
    {
      name: 'Grid Pattern',
      desc: 'Horizontal & Vertical passes. Move smoothly, overlapping slightly.',
    },
    {
      name: 'Diagonal Passes',
      desc: 'Follow the grid with X-pattern diagonal lines for full coverage.',
    },
    {
      name: 'Small Circles',
      desc: 'Best for serum infusion. Keep circles tight and overlapping.',
    },
    {
      name: 'Stamping',
      desc: 'For deep acne scars or targeted spots. Press down and lift, do not drag.',
    },
  ];

  const depthGuide = [
    { area: 'Forehead, Nose, Eyes', depth: '0.25 - 0.5 mm' },
    { area: 'Cheeks, Chin, Neck', depth: '0.5 - 1.0 mm' },
    { area: 'Body, Deep Scars', depth: '1.5 - 2.5 mm' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">
          Microneedling Routine
        </h2>
        <p className="dark:text-stone-400 text-stone-500">
          Log your AM and PM collagen induction therapies and topical infusions.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-[#F2D59B] pb-4">
            <div className="p-2 dark:bg-stone-800 bg-[#FCF9F2] rounded-lg border border-[#F2D59B]">
              <Activity className="w-5 h-5 text-[#C64633]" />
            </div>
            <div>
              <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">
                Standard Techniques
              </h3>
              <p className="text-xs dark:text-stone-400 text-stone-500 font-medium">
                Standard directional movements for even coverage.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {techniqueGuide.map((g) => (
              <div
                key={g.name}
                className="p-3 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#F2D59B]"
              >
                <p className="font-bold dark:text-stone-100 text-stone-800 mb-1">{g.name}</p>
                <p className="text-xs dark:text-stone-300 text-stone-600 font-medium">{g.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#C64633]/30 text-sm">
            <p className="font-bold dark:text-stone-100 text-stone-800 mb-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C64633]" /> Pro Tips:
            </p>
            <ul className="list-disc pl-5 dark:text-stone-300 text-stone-600 space-y-1 font-medium">
              <li>Hold the skin taut while gliding the pen.</li>
              <li>
                Do not drag the pen forcefully; let it glide effortlessly on the
                serum.
              </li>
              <li>
                Apply slip (serum) <strong>before</strong> and{' '}
                <strong>after</strong> passes.
              </li>
            </ul>
          </div>
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-[#F2D59B] pb-4">
            <div className="p-2 dark:bg-stone-800 bg-[#FCF9F2] rounded-lg border border-[#F2D59B]">
              <Wand2 className="w-5 h-5 text-[#9AA078]" />
            </div>
            <div>
              <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">
                Needle Depth Reference
              </h3>
              <p className="text-xs dark:text-stone-400 text-stone-500 font-medium">
                Suggested depth settings per facial region.
              </p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {depthGuide.map((d) => (
              <div
                key={d.area}
                className="flex justify-between items-center p-3 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#F2D59B]"
              >
                <span className="font-bold dark:text-stone-100 text-stone-800 text-sm">
                  {d.area}
                </span>
                <span className="text-xs font-bold text-white bg-[#9AA078] px-2 py-1 rounded-md">
                  {d.depth}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#9AA078]/30 text-sm">
            <p className="dark:text-stone-300 text-stone-600 font-medium text-center">
              Adjust depth based on pain tolerance and skin thickness. Never
              push the pen deeply into the skin; let the automated needles do
              the work.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MicroneedlingForm
          session="Morning"
          icon={<Sun className="w-5 h-5 text-[#E5A024]" />}
          bgClass="dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B]"
          btnClass="bg-[#E5A024] hover:bg-[#c98d20] shadow-[#F2D59B]"
          editingLog={amEditingLog}
          onSave={handleSave}
          onCancel={() => setEditingLogId(null)}
        />
        <MicroneedlingForm
          session="Evening"
          icon={<Moon className="w-5 h-5 text-[#9AA078]" />}
          bgClass="dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B]"
          btnClass="bg-[#9AA078] hover:bg-[#838965] shadow-[#F2D59B]"
          editingLog={pmEditingLog}
          onSave={handleSave}
          onCancel={() => setEditingLogId(null)}
        />
      </div>

      <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden flex flex-col">
        <div className="dark:bg-stone-800 bg-[#FCF9F2] p-4 border-b border-[#F2D59B] flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-[#C64633]" />
          <h3 className="font-bold dark:text-stone-100 text-stone-800">Microneedling History</h3>
        </div>
        {logs.length === 0 ? (
          <div className="p-8 text-center text-stone-400 font-medium flex-1 flex items-center justify-center">
            No microneedling routines logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
              <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Date & Session</th>
                  <th className="px-4 py-3 font-bold">Device Settings</th>
                  <th className="px-4 py-3 font-bold">Topical Infusion</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {logs.map((log) => {
                  const d = getDisplayDate(log.date);
                  const isMorning = log.session === 'Morning';
                  return (
                    <tr
                      key={log.id}
                      className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold dark:text-stone-100 text-stone-800 mb-1">
                          {d.toLocaleDateString()}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                            isMorning
                              ? 'dark:bg-stone-800 bg-[#FCF9F2] text-[#E5A024] border border-[#F2D59B]'
                              : 'dark:bg-stone-800 bg-[#FCF9F2] text-[#9AA078] border border-[#F2D59B]'
                          }`}
                        >
                          {isMorning ? (
                            <Sun className="w-3 h-3" />
                          ) : (
                            <Moon className="w-3 h-3" />
                          )}{' '}
                          {log.session}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold dark:text-stone-100 text-stone-800">
                          {log.cartridge} at {log.depth} mm
                        </div>
                        <div className="text-xs dark:text-stone-400 text-stone-500 font-medium">
                          Area: {log.area} ({log.passes} passes)
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[#C64633] flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5" /> {log.topical}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingLogId(log.id)}
                            className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(log.id)}
                            className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const mnTopicals = [
  'PDRN Skinbooster',
  'Pink Hyaluronic',
  'Periocular Complex Undereye',
  'Recombinant Collagen',
  'Spotfading Vitamin C',
  'Acne Removal',
];

const mnCartridges = ['Nano', '12-pin', '16-pin', '24-pin', '36-pin', '42-pin'];
const mnAreas = [
  'Full Face',
  'Under Eyes',
  'Cheeks',
  'Forehead',
  'Neck',
  'Spot Treatment',
];

function MicroneedlingForm({
  session,
  icon,
  bgClass,
  btnClass,
  editingLog,
  onSave,
  onCancel,
}) {
  const [topical, setTopical] = useState(mnTopicals[0]);
  const [cartridge, setCartridge] = useState(mnCartridges[1]);
  const [depth, setDepth] = useState('0.5');
  const [area, setArea] = useState(mnAreas[0]);
  const [passes, setPasses] = useState('2');
  const [logDate, setLogDate] = useState(getLocalIsoString(new Date()));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingLog) {
      setTopical(editingLog.topical);
      setCartridge(editingLog.cartridge);
      setDepth(editingLog.depth);
      setArea(editingLog.area);
      setPasses(editingLog.passes);
      setLogDate(
        editingLog.date
          ? getLocalIsoString(new Date(editingLog.date))
          : getLocalIsoString(new Date())
      );
    } else {
      setTopical(mnTopicals[0]);
      setCartridge(mnCartridges[1]);
      setDepth('0.5');
      setArea(mnAreas[0]);
      setPasses('2');
      setLogDate(getLocalIsoString(new Date()));
    }
  }, [editingLog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(
      {
        session,
        topical,
        cartridge,
        depth: Number(depth),
        area,
        passes: Number(passes),
        date: new Date(logDate).toISOString(),
      },
      editingLog?.id
    );
    setSaving(false);
  };

  return (
    <div
      className={`dark:bg-stone-900 bg-white rounded-xl p-6 border ${
        editingLog ? 'border-[#E5A024] shadow-md' : 'border-[#F2D59B] shadow-sm'
      } relative`}
    >
      <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-4 flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${bgClass}`}>{icon}</div>
        {editingLog ? `Edit ${session} Log` : `${session} Routine`}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
              Topical Applied
            </label>
            <select
              value={topical}
              onChange={(e) => setTopical(e.target.value)}
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 text-[#C64633] font-bold focus:outline-none focus:border-[#E5A024]"
            >
              {mnTopicals.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
              Needle Cartridge
            </label>
            <select
              value={cartridge}
              onChange={(e) => setCartridge(e.target.value)}
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
            >
              {mnCartridges.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
              Depth (mm)
            </label>
            <input
              type="number"
              step="0.25"
              min="0"
              max="3"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
              Target Area
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
            >
              {mnAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
              Passes
            </label>
            <input
              type="number"
              step="1"
              min="1"
              max="10"
              value={passes}
              onChange={(e) => setPasses(e.target.value)}
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-2 pt-2 border-t border-[#FCF9F2]">
          <button
            type="submit"
            disabled={saving}
            className={`flex-1 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm ${btnClass}`}
          >
            {saving
              ? 'Saving...'
              : editingLog
              ? 'Update Log'
              : `Save ${session}`}
          </button>
          {editingLog && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 bg-stone-100 hover:bg-stone-200 dark:text-stone-300 text-stone-600 font-bold py-2.5 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// --- Meal & Water View ---
function MealWaterView({
  mealLogs,
  waterLogs,
  onSaveMeal,
  onDeleteMeal,
  onLogWater,
}) {
  const [mealType, setMealType] = useState('Breakfast');
  const [mealDesc, setMealDesc] = useState('');
  const [calories, setCalories] = useState('');
  const [mealDate, setMealDate] = useState(getLocalIsoString(new Date()));
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayWaterLog = waterLogs.find((w) => w.id === todayStr);
  const currentWater = todayWaterLog ? todayWaterLog.amount : 0;
  const maxWater = 2000;
  const waterPercentage = Math.min(currentWater / maxWater, 1);
  const fillHeight = waterPercentage * 100;

  const handleMealSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSaveMeal(
      {
        mealType,
        description: mealDesc,
        calories: calories ? Number(calories) : 0,
        date: new Date(mealDate).toISOString(),
      },
      editingId
    );
    setSaving(false);
    setMealDesc('');
    setCalories('');
    setEditingId(null);
    setMealDate(getLocalIsoString(new Date()));
  };

  const handleEdit = (log) => {
    setMealType(log.mealType);
    setMealDesc(log.description);
    setCalories(log.calories);
    setMealDate(
      log.date
        ? getLocalIsoString(new Date(log.date))
        : getLocalIsoString(new Date())
    );
    setEditingId(log.id);
  };

  const handleCancelEdit = () => {
    setMealType('Breakfast');
    setMealDesc('');
    setCalories('');
    setEditingId(null);
    setMealDate(getLocalIsoString(new Date()));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">Meals & Water</h2>
        <p className="dark:text-stone-400 text-stone-500">
          Plan your nutrition and track daily hydration goals.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm flex flex-col items-center xl:col-span-1">
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 w-full mb-6 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#9AA078]" /> Hydration Potion
          </h3>

          <div className="relative w-32 h-48 mb-6">
            <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-md">
              <defs>
                <clipPath id="bottleMask">
                  <path d="M35 15 L65 15 L65 40 L90 80 A 20 20 0 0 1 90 135 L10 135 A 20 20 0 0 1 10 80 L35 40 Z" />
                </clipPath>
              </defs>
              <path
                d="M35 15 L65 15 L65 40 L90 80 A 20 20 0 0 1 90 135 L10 135 A 20 20 0 0 1 10 80 L35 40 Z"
                fill="#FCF9F2"
                stroke="#F2D59B"
                strokeWidth="4"
              />
              <rect
                x="0"
                y={140 - fillHeight}
                width="100"
                height={fillHeight}
                fill="#9AA078"
                clipPath="url(#bottleMask)"
                className="transition-all duration-1000 ease-in-out"
              />
              <path
                d="M20 95 Q 15 115 30 125"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M45 20 L45 35"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col mt-12 text-white font-extrabold drop-shadow-md mix-blend-difference">
              <span className="text-2xl">{currentWater}</span>
              <span className="text-xs uppercase">/ {maxWater} ml</span>
            </div>
          </div>

          {currentWater >= maxWater && (
            <div className="mb-4 animate-bounce">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#9AA078]/20 text-[#9AA078] rounded-full text-xs font-bold border border-[#9AA078]/30">
                <Sparkles className="w-3.5 h-3.5" /> Daily Goal Reached!
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={() => onLogWater(250)}
              className="py-2 px-4 dark:bg-stone-800 bg-[#FCF9F2] hover:bg-[#F2D59B] text-[#9AA078] hover:text-white border border-[#F2D59B] rounded-lg font-bold transition-colors text-sm flex flex-col items-center"
            >
              + 250 ml{' '}
              <span className="text-[10px] font-medium opacity-80">(Cup)</span>
            </button>
            <button
              onClick={() => onLogWater(500)}
              className="py-2 px-4 dark:bg-stone-800 bg-[#FCF9F2] hover:bg-[#F2D59B] text-[#9AA078] hover:text-white border border-[#F2D59B] rounded-lg font-bold transition-colors text-sm flex flex-col items-center"
            >
              + 500 ml{' '}
              <span className="text-[10px] font-medium opacity-80">
                (Bottle)
              </span>
            </button>
          </div>
          <button
            onClick={() => onLogWater(-250)}
            className="mt-3 text-xs text-stone-400 hover:text-[#C64633] transition-colors"
          >
            Undo last glass (-250ml)
          </button>

          <div className="mt-8 w-full border-t border-[#F2D59B] pt-6">
            <h4 className="text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-3">
              Recent Hydration
            </h4>
            {waterLogs.length === 0 ? (
              <p className="text-xs text-stone-400 text-center italic">
                No water logged yet.
              </p>
            ) : (
              <div className="space-y-2">
                {waterLogs.slice(0, 5).map((log) => {
                  const isGoal = log.amount >= maxWater;
                  return (
                    <div
                      key={log.id}
                      className={`flex justify-between items-center text-sm p-2.5 rounded-lg border ${
                        isGoal
                          ? 'bg-[#9AA078]/10 border-[#9AA078]/30'
                          : 'dark:bg-stone-800 bg-[#FCF9F2] border-[#F2D59B]/50'
                      }`}
                    >
                      <span className="dark:text-stone-300 text-stone-600 font-bold">
                        {getDisplayDate(log.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            isGoal ? 'text-[#9AA078]' : 'dark:text-stone-400 text-stone-500'
                          }`}
                        >
                          {log.amount} ml
                        </span>
                        {isGoal && (
                          <CheckCircle2 className="w-4 h-4 text-[#9AA078]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm xl:col-span-2 flex flex-col">
          <div className="p-6 border-b border-[#F2D59B]">
            <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-4 flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#E5A024]" />{' '}
              {editingId ? 'Edit Meal Log' : 'Log Projected Meal'}
            </h3>
            <form onSubmit={handleMealSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                    Meal Type
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
                  >
                    {mealTypes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                    Meal Description
                  </label>
                  <input
                    type="text"
                    required
                    value={mealDesc}
                    onChange={(e) => setMealDesc(e.target.value)}
                    placeholder="e.g. Grilled Chicken & Quinoa"
                    className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                    Calories (Optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="0 kcal"
                    className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
                    className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#E5A024]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving || !mealDesc}
                  className="flex-1 bg-[#E5A024] hover:bg-[#c98d20] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  {saving
                    ? 'Saving...'
                    : editingId
                    ? 'Update Meal'
                    : 'Save Meal'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 bg-stone-100 hover:bg-stone-200 dark:text-stone-300 text-stone-600 font-bold py-2.5 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mealLogs.length === 0 ? (
              <div className="p-8 text-center text-stone-400 font-medium h-full flex items-center justify-center">
                No meals logged yet.
              </div>
            ) : (
              <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
                <thead className="text-xs uppercase dark:bg-stone-800 bg-[#FCF9F2] dark:text-stone-400 text-stone-500 border-b border-[#F2D59B]">
                  <tr>
                    <th className="px-4 py-3 font-bold">Date & Type</th>
                    <th className="px-4 py-3 font-bold">Description</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {mealLogs.map((log) => {
                    const d = getDisplayDate(log.date);
                    return (
                      <tr
                        key={log.id}
                        className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold dark:text-stone-100 text-stone-800">
                            {d.toLocaleDateString()}{' '}
                          </div>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-[#F2D59B]/30 text-[#C64633] border border-[#F2D59B]">
                            {log.mealType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold dark:text-stone-100 text-stone-800 block">
                            {log.description}
                          </span>
                          {log.calories > 0 && (
                            <span className="text-[#E5A024] font-bold text-xs">
                              {log.calories} kcal
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(log)}
                              className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteMeal(log.id)}
                              className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Transition View ---
function TransitionView({ logs, onSave, onDelete }) {
  const [logDate, setLogDate] = useState(getLocalIsoString(new Date()));
  const [antiAndrogenName, setAntiAndrogenName] = useState('');
  const [antiAndrogenDose, setAntiAndrogenDose] = useState('');
  const [estrogenName, setEstrogenName] = useState('');
  const [estrogenRoute, setEstrogenRoute] = useState('Oral');
  const [estrogenDose, setEstrogenDose] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const eRoutes = [
    'Oral',
    'Sublingual',
    'Transdermal Patch',
    'Transdermal Gel',
    'Injection',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(
      {
        date: new Date(logDate).toISOString(),
        antiAndrogenName: antiAndrogenName || 'None',
        antiAndrogenDose: antiAndrogenDose ? Number(antiAndrogenDose) : 0,
        estrogenName: estrogenName || 'None',
        estrogenRoute,
        estrogenDose: estrogenDose ? Number(estrogenDose) : 0,
      },
      editingId
    );
    setSaving(false);

    setEditingId(null);
    setLogDate(getLocalIsoString(new Date()));
    setAntiAndrogenName('');
    setAntiAndrogenDose('');
    setEstrogenName('');
    setEstrogenDose('');
    setEstrogenRoute('Oral');
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setLogDate(
      log.date
        ? getLocalIsoString(new Date(log.date))
        : getLocalIsoString(new Date())
    );
    setAntiAndrogenName(
      log.antiAndrogenName === 'None' ? '' : log.antiAndrogenName
    );
    setAntiAndrogenDose(log.antiAndrogenDose || '');
    setEstrogenName(log.estrogenName === 'None' ? '' : log.estrogenName);
    setEstrogenRoute(log.estrogenRoute || 'Oral');
    setEstrogenDose(log.estrogenDose || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setLogDate(getLocalIsoString(new Date()));
    setAntiAndrogenName('');
    setAntiAndrogenDose('');
    setEstrogenName('');
    setEstrogenDose('');
    setEstrogenRoute('Oral');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">
          Transition Journey
        </h2>
        <p className="dark:text-stone-400 text-stone-500">
          Log your HRT regimen, tracking anti-androgens and estrogens.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm xl:col-span-1 h-fit">
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-4 flex items-center gap-2">
            <Rainbow className="w-5 h-5 text-[#C64633]" />{' '}
            {editingId ? 'Edit HRT Log' : 'Log HRT Regimen'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
              />
            </div>

            <div className="p-4 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#F2D59B]">
              <h4 className="text-sm font-bold text-[#E5A024] mb-3 uppercase tracking-wider">
                Anti-Androgen (Blocker)
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 mb-1">
                    Brand / Name
                  </label>
                  <input
                    type="text"
                    value={antiAndrogenName}
                    onChange={(e) => setAntiAndrogenName(e.target.value)}
                    placeholder="e.g. Spironolactone"
                    className="w-full dark:bg-stone-900 bg-white border border-[#F2D59B] rounded-lg p-2 dark:text-stone-100 text-stone-800 focus:outline-none focus:border-[#C64633]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 mb-1">
                    Dose (mg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={antiAndrogenDose}
                    onChange={(e) => setAntiAndrogenDose(e.target.value)}
                    placeholder="0"
                    className="w-full dark:bg-stone-900 bg-white border border-[#F2D59B] rounded-lg p-2 dark:text-stone-100 text-stone-800 focus:outline-none focus:border-[#C64633]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#F2D59B]">
              <h4 className="text-sm font-bold text-[#C64633] mb-3 uppercase tracking-wider">
                Estrogen
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 mb-1">
                    Brand / Name
                  </label>
                  <input
                    type="text"
                    value={estrogenName}
                    onChange={(e) => setEstrogenName(e.target.value)}
                    placeholder="e.g. Estradiol Valerate"
                    className="w-full dark:bg-stone-900 bg-white border border-[#F2D59B] rounded-lg p-2 dark:text-stone-100 text-stone-800 focus:outline-none focus:border-[#C64633]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 mb-1">
                      Route
                    </label>
                    <select
                      value={estrogenRoute}
                      onChange={(e) => setEstrogenRoute(e.target.value)}
                      className="w-full dark:bg-stone-900 bg-white border border-[#F2D59B] rounded-lg p-2 dark:text-stone-100 text-stone-800 focus:outline-none focus:border-[#C64633]"
                    >
                      {eRoutes.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 mb-1">
                      Dose (mg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={estrogenDose}
                      onChange={(e) => setEstrogenDose(e.target.value)}
                      placeholder="0"
                      className="w-full dark:bg-stone-900 bg-white border border-[#F2D59B] rounded-lg p-2 dark:text-stone-100 text-stone-800 focus:outline-none focus:border-[#C64633]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || (!antiAndrogenName && !estrogenName)}
                className="flex-1 bg-[#C64633] hover:bg-[#A83724] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                  ? 'Update HRT Log'
                  : 'Save HRT Log'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 bg-stone-200 hover:bg-stone-300 dark:text-stone-200 text-stone-700 font-bold py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* History Table */}
        <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden flex flex-col xl:col-span-2">
          <div className="dark:bg-stone-800 bg-[#FCF9F2] p-4 border-b border-[#F2D59B]">
            <h3 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C64633]" /> HRT History
            </h3>
          </div>
          {logs.length === 0 ? (
            <div className="p-8 text-center text-stone-400 font-medium flex-1 flex items-center justify-center">
              No HRT routines logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
                <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                  <tr>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Anti-Androgen</th>
                    <th className="px-4 py-3 font-bold">Estrogen & Route</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {logs.map((log) => {
                    const d = getDisplayDate(log.date);
                    return (
                      <tr
                        key={log.id}
                        className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold dark:text-stone-100 text-stone-800">
                            {d.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {log.antiAndrogenDose > 0 ? (
                            <>
                              <span className="font-bold text-[#E5A024] block">
                                {log.antiAndrogenName}
                              </span>
                              <span className="dark:text-stone-400 text-stone-500 font-medium text-xs bg-stone-100 px-2 py-0.5 rounded mt-1 inline-block">
                                {log.antiAndrogenDose} mg
                              </span>
                            </>
                          ) : (
                            <span className="text-stone-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {log.estrogenDose > 0 ? (
                            <>
                              <span className="font-bold text-[#C64633] block">
                                {log.estrogenName}
                              </span>
                              <span className="dark:text-stone-400 text-stone-500 font-medium text-xs bg-stone-100 px-2 py-0.5 rounded mt-1 inline-block">
                                {log.estrogenDose} mg • {log.estrogenRoute}
                              </span>
                            </>
                          ) : (
                            <span className="text-stone-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(log)}
                              className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(log.id)}
                              className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Supplement Tracker View ---
function SupplementTrackerView({ logs, onSave, onDelete }) {
  const [logDate, setLogDate] = useState(getLocalIsoString(new Date()));
  const [suppName, setSuppName] = useState('');
  const [suppDose, setSuppDose] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('Morning');
  const [withMeal, setWithMeal] = useState('With Meal');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const timesOfDay = ['Morning', 'Afternoon', 'Nighttime'];
  const mealOptions = ['With Meal', 'Empty Stomach'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(
      {
        date: new Date(logDate).toISOString(),
        name: suppName,
        dose: suppDose,
        timeOfDay,
        withMeal,
      },
      editingId
    );
    setSaving(false);
    setEditingId(null);
    setSuppName('');
    setSuppDose('');
    setTimeOfDay('Morning');
    setWithMeal('With Meal');
    setLogDate(getLocalIsoString(new Date()));
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setLogDate(
      log.date
        ? getLocalIsoString(new Date(log.date))
        : getLocalIsoString(new Date())
    );
    setSuppName(log.name || '');
    setSuppDose(log.dose || '');
    setTimeOfDay(log.timeOfDay || 'Morning');
    setWithMeal(log.withMeal || 'With Meal');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSuppName('');
    setSuppDose('');
    setTimeOfDay('Morning');
    setWithMeal('With Meal');
    setLogDate(getLocalIsoString(new Date()));
  };

  const getTimeIcon = (time) => {
    if (time === 'Morning') return <Sun className="w-4 h-4 text-[#E5A024]" />;
    if (time === 'Afternoon') return <Coffee className="w-4 h-4 text-[#C64633]" />;
    return <Moon className="w-4 h-4 text-[#9AA078]" />;
  };

  // Derive active routine from unique recent logs
  const activeRoutine = useMemo(() => {
    const routine = { Morning: [], Afternoon: [], Nighttime: [] };
    const seen = new Set();
    // logs are sorted newest first
    for (const log of logs) {
      if (!seen.has(log.name)) {
        seen.add(log.name);
        if (routine[log.timeOfDay]) {
          routine[log.timeOfDay].push(log);
        } else {
          routine.Morning.push(log); // fallback
        }
      }
    }
    return routine;
  }, [logs]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">Supplements & Medications</h2>
        <p className="dark:text-stone-400 text-stone-500">Log your daily intake and manage your schedule.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm xl:col-span-1 h-fit">
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C64633]" />{' '}
            {editingId ? 'Edit Supplement' : 'Log Supplement'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={suppName}
                onChange={(e) => setSuppName(e.target.value)}
                placeholder="e.g. Vitamin D3"
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                Dose (mg / IU)
              </label>
              <input
                type="text"
                required
                value={suppDose}
                onChange={(e) => setSuppDose(e.target.value)}
                placeholder="e.g. 5000 IU"
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                  Time of Day
                </label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
                >
                  {timesOfDay.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold dark:text-stone-400 text-stone-500 uppercase tracking-wider mb-1">
                  Condition
                </label>
                <select
                  value={withMeal}
                  onChange={(e) => setWithMeal(e.target.value)}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:outline-none focus:border-[#C64633]"
                >
                  {mealOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving || !suppName || !suppDose}
                className="flex-1 bg-[#C64633] hover:bg-[#A83724] disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                {saving ? 'Saving...' : editingId ? 'Update Log' : 'Save Log'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 bg-stone-200 hover:bg-stone-300 dark:text-stone-200 text-stone-700 font-bold py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-6 xl:col-span-2 flex flex-col">
          {/* Daily Routine Projection */}
          <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm p-6">
            <h3 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#9AA078]" /> Daily Routine Projection
            </h3>
            {logs.length === 0 ? (
              <p className="text-sm dark:text-stone-400 text-stone-500 italic">No supplements logged to build a routine.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timesOfDay.map((time) => (
                  <div key={time} className="dark:bg-stone-800 bg-[#FCF9F2] p-4 rounded-xl border border-[#F2D59B]">
                    <h4 className="font-bold dark:text-stone-200 text-stone-700 flex items-center gap-2 mb-3 border-b border-[#F2D59B] pb-2">
                      {getTimeIcon(time)} {time}
                    </h4>
                    {activeRoutine[time].length === 0 ? (
                      <p className="text-xs text-stone-400 italic">None scheduled.</p>
                    ) : (
                      <ul className="space-y-2">
                        {activeRoutine[time].map((supp) => (
                          <li key={supp.name} className="flex justify-between items-start text-xs">
                            <span className="font-bold text-[#C64633]">{supp.name}</span>
                            <div className="text-right">
                              <span className="block font-medium dark:text-stone-300 text-stone-600">{supp.dose}</span>
                              <span className="text-[10px] text-stone-400 uppercase tracking-wider">{supp.withMeal}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden flex flex-col flex-1">
            <div className="dark:bg-stone-800 bg-[#FCF9F2] p-4 border-b border-[#F2D59B]">
              <h3 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C64633]" /> Supplement History
              </h3>
            </div>
          {logs.length === 0 ? (
            <div className="p-8 text-center text-stone-400 font-medium flex-1 flex items-center justify-center">
              No supplements logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
                <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                  <tr>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Supplement</th>
                    <th className="px-4 py-3 font-bold">Schedule</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {logs.map((log) => {
                    const d = getDisplayDate(log.date);
                    return (
                      <tr key={log.id} className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold dark:text-stone-100 text-stone-800">
                            {d.toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-[#C64633] block">{log.name}</span>
                          <span className="dark:text-stone-400 text-stone-500 font-medium text-xs bg-stone-100 px-2 py-0.5 rounded mt-1 inline-block">
                            {log.dose}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 font-bold dark:text-stone-200 text-stone-700">
                            {getTimeIcon(log.timeOfDay)} {log.timeOfDay}
                          </div>
                          <div className="text-xs dark:text-stone-400 text-stone-500 mt-1">
                            {log.withMeal}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(log)}
                              className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(log.id)}
                              className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden flex flex-col">
        <div className="dark:bg-stone-800 bg-[#FCF9F2] p-4 border-b border-[#F2D59B]">
          <h3 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#9AA078]" /> Weight History
          </h3>
        </div>
        {logs.length === 0 ? (
          <div className="p-8 text-center text-stone-400 font-medium flex-1 flex items-center justify-center">
            No weight logs yet.
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
              <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Date</th>
                  <th className="px-4 py-3 font-bold">Weight</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {logs.map((log) => {
                  const d = getDisplayDate(log.date);
                  return (
                    <tr
                      key={log.id}
                      className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold dark:text-stone-100 text-stone-800">
                          {d.toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[#E5A024] block">
                          {log.weight} kg
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(log)}
                            className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#F2D59B] transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(log.id)}
                            className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1 rounded border border-stone-200 hover:border-[#C64633] transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// --- NEW Component: Peptide Hub View ---
function PeptideHubView() {
  const sortedLibrary = useMemo(() => {
    return [...peptideDatabase].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const [selectedName, setSelectedName] = useState(sortedLibrary[0].name);
  const selectedPeptide = useMemo(
    () => sortedLibrary.find((p) => p.name === selectedName),
    [selectedName, sortedLibrary]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">Peptide Hub</h2>
        <p className="dark:text-stone-400 text-stone-500">
          Your comprehensive library of alchemical knowledge.
        </p>
      </div>

      <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm">
        <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-2">
          Select a Compound to Review
        </label>
        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="w-full md:w-1/2 lg:w-1/3 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-3 dark:text-stone-100 text-stone-800 font-bold focus:outline-none focus:border-[#C64633]"
        >
          {sortedLibrary.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPeptide && (
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 md:p-8 border border-[#F2D59B] shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
            <BookOpen className="w-64 h-64 text-[#C64633]" />
          </div>

          <div className="relative z-10">
            <div className="border-b border-[#F2D59B] pb-6 mb-6">
              <h3 className="text-3xl font-extrabold text-[#C64633] mb-2">
                {selectedPeptide.name}
              </h3>
              <span className="inline-block px-4 py-1.5 dark:bg-stone-800 bg-[#FCF9F2] text-[#E5A024] font-bold text-xs uppercase tracking-wider rounded-full border border-[#F2D59B]">
                {selectedPeptide.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2 mb-3">
                    <div className="p-1.5 dark:bg-stone-800 bg-[#FCF9F2] rounded-md border border-[#F2D59B]">
                      <BookOpen className="w-4 h-4 text-[#9AA078]" />
                    </div>
                    Origin & Overview
                  </h4>
                  <p className="text-sm dark:text-stone-300 text-stone-600 leading-relaxed dark:bg-stone-800 bg-[#FCF9F2]/50 p-4 rounded-xl border border-stone-100">
                    {selectedPeptide.origin}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2 mb-3">
                    <div className="p-1.5 dark:bg-stone-800 bg-[#FCF9F2] rounded-md border border-[#F2D59B]">
                      <Activity className="w-4 h-4 text-[#C64633]" />
                    </div>
                    Mechanism of Action
                  </h4>
                  <ul className="space-y-2 text-sm dark:text-stone-300 text-stone-600">
                    {selectedPeptide.mechanism.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#E5A024] mt-0.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2 mb-3">
                    <div className="p-1.5 dark:bg-stone-800 bg-[#FCF9F2] rounded-md border border-[#F2D59B]">
                      <Sparkles className="w-4 h-4 text-[#E5A024]" />
                    </div>
                    Impact & Benefits
                  </h4>
                  <ul className="space-y-2 text-sm dark:text-stone-300 text-stone-600">
                    {selectedPeptide.impact.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#9AA078] mt-0.5">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl border border-[#F2D59B]">
                  <h4 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2 mb-2 text-sm">
                    <Syringe className="w-4 h-4 text-[#C64633]" /> Dosage &
                    Administration
                  </h4>
                  <p className="text-sm dark:text-stone-300 text-stone-600 leading-relaxed mb-4">
                    {selectedPeptide.dosage}
                  </p>

                  <h4 className="font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2 mb-2 text-sm pt-4 border-t border-[#F2D59B]">
                    <ShieldCheck className="w-4 h-4 text-[#9AA078]" /> Safety
                    Profile
                  </h4>
                  <p className="text-sm dark:text-stone-300 text-stone-600 leading-relaxed">
                    {selectedPeptide.safety}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Privacy Info View ---
function PrivacyInfoView() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800 flex items-center justify-center md:justify-start gap-2">
          <ShieldCheck className="w-6 h-6 text-[#C64633]" /> Privacy & Data
          Security
        </h2>
        <p className="dark:text-stone-400 text-stone-500 mt-2">
          Your health and wellness data belongs to you. Here is how we keep it
          safe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dark:bg-stone-900 bg-white p-6 rounded-2xl border border-[#F2D59B] shadow-sm hover:border-[#E5A024] transition-colors">
          <div className="w-12 h-12 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl flex items-center justify-center mb-4 border border-[#F2D59B]">
            <Lock className="w-6 h-6 text-[#C64633]" />
          </div>
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-2">
            100% User Control
          </h3>
          <p className="text-sm dark:text-stone-300 text-stone-600 font-medium leading-relaxed">
            You decide exactly what goes into this app and what gets deleted.
            Every stack, aesthetic log, and routine can be permanently erased by
            you at any time. We do not restrict your access to your own records.
          </p>
        </div>

        <div className="dark:bg-stone-900 bg-white p-6 rounded-2xl border border-[#F2D59B] shadow-sm hover:border-[#E5A024] transition-colors">
          <div className="w-12 h-12 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl flex items-center justify-center mb-4 border border-[#F2D59B]">
            <EyeOff className="w-6 h-6 text-[#C64633]" />
          </div>
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-2">
            Private & Anonymous
          </h3>
          <p className="text-sm dark:text-stone-300 text-stone-600 font-medium leading-relaxed">
            Your data is strictly tied to your unique, secure session. We do not
            require you to link your public identity, social media, or email to
            use the core tracking features. Your routines remain your private
            business.
          </p>
        </div>

        <div className="dark:bg-stone-900 bg-white p-6 rounded-2xl border border-[#F2D59B] shadow-sm hover:border-[#E5A024] transition-colors">
          <div className="w-12 h-12 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl flex items-center justify-center mb-4 border border-[#F2D59B]">
            <Database className="w-6 h-6 text-[#C64633]" />
          </div>
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-2">
            Secure Cloud Sandbox
          </h3>
          <p className="text-sm dark:text-stone-300 text-stone-600 font-medium leading-relaxed">
            To ensure you don't lose your logs when switching devices, Xeia's
            Potions utilizes a secure cloud-sync feature. However, your database
            is "sandboxed"—meaning it is heavily encrypted and isolated so only
            your specific device can read it.
          </p>
        </div>

        <div className="dark:bg-stone-900 bg-white p-6 rounded-2xl border border-[#F2D59B] shadow-sm hover:border-[#E5A024] transition-colors">
          <div className="w-12 h-12 dark:bg-stone-800 bg-[#FCF9F2] rounded-xl flex items-center justify-center mb-4 border border-[#F2D59B]">
            <Heart className="w-6 h-6 text-[#C64633]" />
          </div>
          <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800 mb-2">
            Zero Data Selling
          </h3>
          <p className="text-sm dark:text-stone-300 text-stone-600 font-medium leading-relaxed">
            We will never sell, rent, or share your personal health data,
            injection history, or aesthetic routines to third-party advertisers,
            insurance companies, or data brokers. The app is built to serve you.
          </p>
        </div>
      </div>

      <div className="mt-8 dark:bg-stone-800 bg-[#FCF9F2] p-6 rounded-2xl border border-[#F2D59B] text-center shadow-sm">
        <h3 className="text-md font-bold dark:text-stone-100 text-stone-800 mb-2">
          Need to wipe your data?
        </h3>
        <p className="text-sm dark:text-stone-300 text-stone-600 font-medium mb-4 max-w-xl mx-auto">
          You have the "Right to be Forgotten." You can manually delete all your
          logs, stacks, and profile information through their respective tabs
          using the trash icons. Once deleted, data cannot be recovered.
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9AA078] dark:bg-stone-900 bg-white border border-[#9AA078] px-4 py-2 rounded-full">
          <ShieldCheck className="w-4 h-4" /> Security Protocol Active
        </div>
      </div>
    </div>
  );
}

// --- Helpers & Modals ---
function StatCard({ title, value, icon, color, bg }) {
  return (
    <div className="dark:bg-stone-900 bg-white p-5 rounded-xl border border-[#F2D59B] shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div>
        <p className="dark:text-stone-400 text-stone-500 text-sm font-bold uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-extrabold dark:text-stone-100 text-stone-800">{value}</p>
      </div>
    </div>
  );
}

function Calculators({ profile }) {
  const [vialMg, setVialMg] = useState(5);
  const [bacWater, setBacWater] = useState(2);
  const [desiredMg, setDesiredMg] = useState(2.5);
  const [syringeType, setSyringeType] = useState(100);

  const [height, setHeight] = useState(profile.height || 175);
  const [weight, setWeight] = useState(profile.weight || 70);
  const [age, setAge] = useState(profile.age || 30);
  const [gender, setGender] = useState(profile.gender || 'Female');

  const mgPerMl = bacWater > 0 ? (vialMg / bacWater) : 0;
  const mlNeeded = mgPerMl > 0 ? (desiredMg / mgPerMl) : 0;
  const unitsNeeded = (mlNeeded * 100).toFixed(1);
  const totalDoses = desiredMg > 0 ? (vialMg / desiredMg).toFixed(1) : '0.0';

  const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
  let bmiCategory = 'Normal';
  let bmiColor = 'text-[#9AA078]';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-[#E5A024]';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-[#E5A024]';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-[#C64633]';
  }

  let bodyFat = null;
  if (age && height && weight) {
    const genderModifier = gender === 'Male' ? 1 : 0;
    bodyFat = (
      1.2 * parseFloat(bmi) +
      0.23 * age -
      10.8 * genderModifier -
      5.4
    ).toFixed(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">Calculators</h2>
        <p className="dark:text-stone-400 text-stone-500">Reconstitution and Body Metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-[#F2D59B] pb-4">
            <div className="p-2 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg">
              <Syringe className="w-5 h-5 text-[#C64633]" />
            </div>
            <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">
              Reconstitution Calculator
            </h3>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Syringe Type (ml / units)
              </label>
              <select
                value={syringeType}
                onChange={(e) => setSyringeType(Number(e.target.value))}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#E5A024] focus:ring-1 focus:ring-[#E5A024] focus:outline-none"
              >
                <option value={30}>0.3 ml (30 units)</option>
                <option value={50}>0.5 ml (50 units)</option>
                <option value={100}>1.0 ml (100 units)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Vial Size (mg)
              </label>
              <input
                type="number"
                step="0.1"
                value={vialMg}
                onChange={(e) => setVialMg(Number(e.target.value))}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#E5A024] focus:ring-1 focus:ring-[#E5A024] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                BAC Water Added (ml)
              </label>
              <input
                type="number"
                step="0.1"
                value={bacWater}
                onChange={(e) => setBacWater(Number(e.target.value))}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#E5A024] focus:ring-1 focus:ring-[#E5A024] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Desired Dose (mg)
              </label>
              <input
                type="number"
                step="0.1"
                value={desiredMg}
                onChange={(e) => setDesiredMg(Number(e.target.value))}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#E5A024] focus:ring-1 focus:ring-[#E5A024] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 p-5 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-xl text-center">
            <p className="text-[#C64633] text-sm font-bold mb-1 uppercase tracking-wider">
              Pull the syringe to:
            </p>
            <p className="text-5xl font-extrabold text-[#C64633] drop-shadow-sm">
              {unitsNeeded}{' '}
              <span className="text-xl text-[#E5A024] font-bold">Units</span>
            </p>

            <div className="my-6 relative w-full h-24 max-w-sm mx-auto">
              <svg viewBox="0 0 400 100" className="w-full h-full drop-shadow-md">
                {/* Syringe Body Base */}
                <rect x="50" y="30" width="280" height="40" fill="white" stroke="#1C1917" strokeWidth="8" />

                {/* Plunger Fill */}
                <rect
                  x="54"
                  y="34"
                  width={280 * Math.min(unitsNeeded / syringeType, 1)}
                  height="32"
                  fill="#E5A024"
                  opacity="0.8"
                />

                {/* Needle Base & Needle */}
                <rect x="25" y="40" width="25" height="20" fill="#1C1917" />
                <line x1="0" y1="50" x2="25" y2="50" stroke="#1C1917" strokeWidth="3" />

                {/* Syringe Flanges & Plunger Handle */}
                <rect x="330" y="20" width="15" height="60" fill="#1C1917" />
                <rect x={330} y="42" width={40 + 280 * Math.min(unitsNeeded / syringeType, 1)} height="16" fill="#1C1917" />
                <ellipse cx={370 + 280 * Math.min(unitsNeeded / syringeType, 1)} cy="50" rx="10" ry="30" fill="#1C1917" />

                {/* Markings */}
                {Array.from({ length: syringeType + 1 }).map((_, i) => {
                  const x = 50 + (i / syringeType) * 280;
                  const isMajor = i % 10 === 0;
                  const isMid = i % 5 === 0 && !isMajor;

                  if (syringeType === 100 && i % 2 !== 0) return null; // Only show every 2 units for 1ml

                  const y1 = 34;
                  const y2 = isMajor ? 54 : (isMid ? 46 : 42);

                  return (
                    <g key={i}>
                      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#1C1917" strokeWidth={isMajor ? 2 : 1} />
                      {isMajor && i !== 0 && (
                        <text x={x} y="68" fontSize="10" fill="#1C1917" textAnchor="middle" fontWeight="bold">
                          {i}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            {Number(unitsNeeded) > syringeType && (
              <p className="text-xs font-bold text-[#C64633] mb-4 bg-[#C64633]/10 py-2 rounded border border-[#C64633]/20">
                Warning: The required units exceed the capacity of this syringe. Please choose a larger syringe or draw multiple times.
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 mt-4 border-t border-[#F2D59B] pt-4">
              <div>
                <p className="text-xs dark:text-stone-400 text-stone-500 font-bold uppercase tracking-wider mb-1">Number of doses</p>
                <p className="text-lg font-bold dark:text-stone-100 text-stone-800">{totalDoses}</p>
              </div>
              <div>
                <p className="text-xs dark:text-stone-400 text-stone-500 font-bold uppercase tracking-wider mb-1">Concentration</p>
                <p className="text-lg font-bold dark:text-stone-100 text-stone-800">{mgPerMl.toFixed(2)} mg/ml</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dark:bg-stone-900 bg-white rounded-xl p-6 border border-[#F2D59B] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-[#F2D59B] pb-4">
            <div className="p-2 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg">
              <User className="w-5 h-5 text-[#9AA078]" />
            </div>
            <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">
              Advanced Body Metrics
            </h3>
          </div>

          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#9AA078] focus:ring-1 focus:ring-[#9AA078] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#9AA078] focus:ring-1 focus:ring-[#9AA078] focus:outline-none"
                >
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#9AA078] focus:ring-1 focus:ring-[#9AA078] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#9AA078] focus:ring-1 focus:ring-[#9AA078] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-xl text-center">
              <p className="dark:text-stone-400 text-stone-500 font-bold text-xs mb-1 uppercase tracking-wider">
                BMI
              </p>
              <p className="text-3xl font-extrabold dark:text-stone-100 text-stone-800 drop-shadow-sm">
                {bmi}
              </p>
              <p className={`text-xs font-bold mt-1 ${bmiColor}`}>
                {bmiCategory}
              </p>
            </div>
            <div className="p-4 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-xl text-center">
              <p className="dark:text-stone-400 text-stone-500 font-bold text-xs mb-1 uppercase tracking-wider">
                Est. Body Fat
              </p>
              <p className="text-3xl font-extrabold dark:text-stone-100 text-stone-800 drop-shadow-sm">
                {bodyFat ? `${bodyFat}%` : '--'}
              </p>
              <p className="text-xs font-bold mt-1 text-[#C64633]">
                Based on Age/Gender
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserProfile({ profile, onSave, user }) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    age: profile.age || '',
    gender: profile.gender || 'Female',
    height: profile.height || '',
    weight: profile.weight || '',
    goalWeight: profile.goalWeight || '',
    goals: profile.goals || '',
    showTransition: profile.showTransition !== false,
    showAesthetics: profile.showAesthetics !== false,
    showMicroneedling: profile.showMicroneedling !== false,
    showMeals: profile.showMeals !== false,
    showSupplements: profile.showSupplements !== false,
    showWeight: profile.showWeight !== false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">Profile Settings</h2>
        <p className="dark:text-stone-400 text-stone-500">
          Manage your data and cloud sync status.
        </p>
      </div>

      <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F2D59B]">
          <div className="w-16 h-16 bg-[#C64633] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-[#F2D59B]">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold dark:text-stone-100 text-stone-800">Account Active</h3>
            <p className="text-xs text-stone-400 font-mono">
              ID: {user?.uid || 'Not synced'}
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-[#9AA078] font-bold mt-1 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] px-2 py-0.5 rounded-md">
              <Save className="w-3 h-3" /> Cloud Sync On
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
              >
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Goal Weight
              </label>
              <input
                type="number"
                value={formData.goalWeight}
                onChange={(e) =>
                  setFormData({ ...formData, goalWeight: e.target.value })
                }
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
              Primary Goals / Notes
            </label>
            <textarea
              rows="3"
              value={formData.goals}
              onChange={(e) =>
                setFormData({ ...formData, goals: e.target.value })
              }
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-[#F2D59B]">
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">Module Customization</h3>
            <p className="text-sm dark:text-stone-400 text-stone-500 mb-4">Toggle the modules you want to see in the sidebar navigation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showTransition}
                  onChange={(e) => setFormData({ ...formData, showTransition: e.target.checked })}
                  className="w-5 h-5 accent-[#C64633] rounded"
                />
                <span className="font-medium dark:text-stone-200 text-stone-700">Transition (HRT)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showAesthetics}
                  onChange={(e) => setFormData({ ...formData, showAesthetics: e.target.checked })}
                  className="w-5 h-5 accent-[#C64633] rounded"
                />
                <span className="font-medium dark:text-stone-200 text-stone-700">Meso, Botox & RF</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showMicroneedling}
                  onChange={(e) => setFormData({ ...formData, showMicroneedling: e.target.checked })}
                  className="w-5 h-5 accent-[#C64633] rounded"
                />
                <span className="font-medium dark:text-stone-200 text-stone-700">Microneedling</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showMeals}
                  onChange={(e) => setFormData({ ...formData, showMeals: e.target.checked })}
                  className="w-5 h-5 accent-[#C64633] rounded"
                />
                <span className="font-medium dark:text-stone-200 text-stone-700">Meals & Water</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showSupplements}
                  onChange={(e) => setFormData({ ...formData, showSupplements: e.target.checked })}
                  className="w-5 h-5 accent-[#C64633] rounded"
                />
                <span className="font-medium dark:text-stone-200 text-stone-700">Supplements</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showWeight}
                  onChange={(e) => setFormData({ ...formData, showWeight: e.target.checked })}
                  className="w-5 h-5 accent-[#C64633] rounded"
                />
                <span className="font-medium dark:text-stone-200 text-stone-700">Weight Tracker</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#C64633] hover:bg-[#A83724] text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm shadow-[#F2D59B]"
          >
            {saving ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function LogHistory({ logs, peptides, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold dark:text-stone-100 text-stone-800">Injection History</h2>
        <p className="dark:text-stone-400 text-stone-500">Your site rotation and dosage history.</p>
      </div>

      <div className="dark:bg-stone-900 bg-white rounded-xl border border-[#F2D59B] shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-stone-400 font-medium">
            No injections logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm dark:text-stone-300 text-stone-600">
              <thead className="text-xs uppercase dark:bg-stone-900 bg-white dark:text-stone-400 text-stone-500 border-b border-stone-100">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Date & Session
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">Potion</th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Dose & Route
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Injection Site
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {logs.map((log) => {
                  const pep = peptides.find((p) => p.id === log.peptideId);
                  const d = getDisplayDate(log.date);
                  return (
                    <tr
                      key={log.id}
                      className="dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold dark:text-stone-100 text-stone-800 mb-1">
                          {d.toLocaleDateString()}
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          log.sessionTime === 'Night'
                            ? 'dark:bg-stone-800 bg-[#FCF9F2] text-[#9AA078] border border-[#F2D59B]'
                            : 'dark:bg-stone-800 bg-[#FCF9F2] text-[#E5A024] border border-[#F2D59B]'
                        }`}>
                          {log.sessionTime === 'Night' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                          {log.sessionTime || 'Morning'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#C64633]">
                        {pep ? pep.name : 'Unknown Potion'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold dark:text-stone-200 text-stone-700">
                          {log.doseMg} mg
                        </div>
                        <div className="text-xs text-[#E5A024] font-medium uppercase tracking-wider">
                          {log.route || 'Subcutaneous'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] text-[#C64633] text-xs font-bold whitespace-nowrap">
                          {log.site}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(log)}
                            className="text-stone-400 hover:text-[#E5A024] dark:bg-stone-900 bg-white p-1.5 rounded-md border border-stone-200 hover:border-[#F2D59B] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(log.id)}
                            className="text-stone-400 hover:text-[#C64633] dark:bg-stone-900 bg-white p-1.5 rounded-md border border-stone-200 hover:border-[#C64633] transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PeptideModal({ initialData, onClose, onSave }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      description: '',
      vialSizeMg: 5,
      currentDoseMg: 2.5,
      frequencyDays: 1,
      cycleOnWeeks: 12,
      cycleOffWeeks: 4,
      startDate: new Date().toISOString().split('T')[0],
      updoseIncrementMg: 0,
      updoseFrequencyWeeks: 0,
      maxDoseMg: 0,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(
      {
        ...formData,
        vialSizeMg: Number(formData.vialSizeMg),
        currentDoseMg: Number(formData.currentDoseMg),
        frequencyDays: Number(formData.frequencyDays),
        cycleOnWeeks: Number(formData.cycleOnWeeks),
        cycleOffWeeks: Number(formData.cycleOffWeeks),
        updoseIncrementMg: Number(formData.updoseIncrementMg),
        updoseFrequencyWeeks: Number(formData.updoseFrequencyWeeks),
        maxDoseMg: Number(formData.maxDoseMg),
      },
      initialData?.id
    );
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="dark:bg-stone-900 bg-white rounded-2xl shadow-xl border border-[#F2D59B] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#F2D59B] flex justify-between items-center sticky top-0 dark:bg-stone-900 bg-white/95 backdrop-blur z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold dark:text-stone-100 text-stone-800">
            {initialData ? 'Edit Potion Protocol' : 'Add Potion Protocol'}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#C64633] dark:bg-stone-800 bg-[#FCF9F2] p-1.5 rounded-full transition-colors"
          >
            <RotateCcw className="w-5 h-5 rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-[#C64633] uppercase tracking-wider">
              1. Basic Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Potion Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Semaglutide"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Description / Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weight Loss"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#F2D59B]">
            <h3 className="text-sm font-extrabold text-[#C64633] uppercase tracking-wider">
              2. Dosing & Cycle Math
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Vial Size (mg)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  value={formData.vialSizeMg}
                  onChange={(e) =>
                    setFormData({ ...formData, vialSizeMg: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Current Dose (mg)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  value={formData.currentDoseMg}
                  onChange={(e) =>
                    setFormData({ ...formData, currentDoseMg: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Days Between Jabs
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  placeholder="1 = Daily"
                  value={formData.frequencyDays}
                  onChange={(e) =>
                    setFormData({ ...formData, frequencyDays: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Cycle ON (Weeks)
                </label>
                <input
                  required
                  type="number"
                  value={formData.cycleOnWeeks}
                  onChange={(e) =>
                    setFormData({ ...formData, cycleOnWeeks: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Cycle OFF (Weeks)
                </label>
                <input
                  required
                  type="number"
                  value={formData.cycleOffWeeks}
                  onChange={(e) =>
                    setFormData({ ...formData, cycleOffWeeks: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Start Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#F2D59B]">
            <h3 className="text-sm font-extrabold text-[#C64633] uppercase tracking-wider">
              3. Updosing (Optional)
            </h3>
            <p className="text-xs text-stone-400 font-medium -mt-2">
              Leave at 0 if dose stays constant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  + Increase (mg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.updoseIncrementMg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      updoseIncrementMg: e.target.value,
                    })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Every X Weeks
                </label>
                <input
                  type="number"
                  value={formData.updoseFrequencyWeeks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      updoseFrequencyWeeks: e.target.value,
                    })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                  Max Ceiling Dose
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.maxDoseMg}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDoseMg: e.target.value })
                  }
                  className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 dark:text-stone-400 text-stone-500 font-bold dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#C64633] hover:bg-[#A83724] text-white font-bold px-8 py-2 rounded-lg shadow-sm shadow-[#F2D59B] transition-colors"
            >
              Save Protocol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LogInjectionModal({ initialData, onClose, onSave, peptides }) {
  const routes = [
    'Subcutaneous',
    'Intramuscular',
    'Intravenous',
    'Intradermal',
  ];
  const subQSites = [
    'Upper right abdomen',
    'Lower right abdomen',
    'Upper left abdomen',
    'Lower left abdomen',
    'Right arm',
    'Left arm',
  ];
  const imSites = [
    'Deltoid',
    'Ventrogluteal',
    'Vastus Lateralis',
    'Dorsogluteal',
  ];
  const defaultSites = ['Standard Site'];

  const [peptideId, setPeptideId] = useState(
    initialData?.peptideId || (peptides.length > 0 ? peptides[0].id : '')
  );
  const [route, setRoute] = useState(initialData?.route || routes[0]);
  const availableSites =
    route === 'Subcutaneous'
      ? subQSites
      : route === 'Intramuscular'
      ? imSites
      : defaultSites;

  const [isCustomSite, setIsCustomSite] = useState(() => {
    if (initialData?.site && !subQSites.includes(initialData.site) && !imSites.includes(initialData.site) && !defaultSites.includes(initialData.site)) {
      return true;
    }
    return false;
  });
  const [site, setSite] = useState(initialData?.site || availableSites[0]);
  const [customSite, setCustomSite] = useState(() => isCustomSite ? initialData.site : '');
  const [dose, setDose] = useState(initialData?.doseMg || '');
  const [sessionTime, setSessionTime] = useState(initialData?.sessionTime || 'Morning');
  const [logDate, setLogDate] = useState(() => {
    if (initialData?.date) return getLocalIsoString(new Date(initialData.date));
    return getLocalIsoString(new Date());
  });

  useEffect(() => {
    if (peptideId && !initialData) {
      const pep = peptides.find((p) => p.id === peptideId);
      if (pep) setDose(pep.currentDoseMg);
    }
  }, [peptideId, peptides, initialData]);

  useEffect(() => {
    if (!isCustomSite) {
      const sites =
        route === 'Subcutaneous'
          ? subQSites
          : route === 'Intramuscular'
          ? imSites
          : defaultSites;
      if (!sites.includes(site)) {
        setSite(sites[0]);
      }
    }
  }, [route, isCustomSite]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSite = isCustomSite ? (customSite || 'Custom Site') : site;
    onSave(
      {
        peptideId,
        site: finalSite,
        route,
        doseMg: Number(dose),
        sessionTime,
        date: new Date(logDate).toISOString(),
      },
      initialData?.id
    );
  };

  if (peptides.length === 0) {
    return (
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="dark:bg-stone-900 bg-white p-8 rounded-2xl border border-[#F2D59B] shadow-xl text-center max-w-sm">
          <div className="w-16 h-16 dark:bg-stone-800 bg-[#FCF9F2] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F2D59B]">
            <AlertCircle className="w-8 h-8 text-[#C64633]" />
          </div>
          <h3 className="text-xl font-bold dark:text-stone-100 text-stone-800 mb-2">
            No Potions Found
          </h3>
          <p className="dark:text-stone-400 text-stone-500 mb-6 font-medium">
            Please add a potion to your stack before logging an injection.
          </p>
          <button
            onClick={onClose}
            className="bg-[#C64633] hover:bg-[#A83724] px-6 py-3 rounded-xl text-white font-bold w-full transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="dark:bg-stone-900 bg-white rounded-2xl shadow-xl border border-[#F2D59B] w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#F2D59B] flex justify-between items-center dark:bg-stone-900 bg-white sticky top-0 z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold dark:text-stone-100 text-stone-800 flex items-center gap-2">
            <div className="p-1.5 dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg">
              <Syringe className="w-5 h-5 text-[#C64633]" />
            </div>{' '}
            {initialData ? 'Edit Injection' : 'Log Injection'}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-[#C64633] dark:bg-stone-800 bg-[#FCF9F2] p-1.5 rounded-full transition-colors"
          >
            <RotateCcw className="w-5 h-5 rotate-45" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
              Select Potion
            </label>
            <select
              required
              value={peptideId}
              onChange={(e) => setPeptideId(e.target.value)}
              className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
            >
              {peptides.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Dose (mg)
              </label>
              <input
                required
                type="number"
                step="0.1"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-1">
                Date
              </label>
              <input
                required
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 font-medium focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-2">
              Time of Day
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSessionTime('Morning')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all border ${
                  sessionTime === 'Morning'
                    ? 'bg-[#E5A024]/10 border-[#E5A024] text-[#E5A024]'
                    : 'dark:bg-stone-900 bg-white border-stone-200 text-stone-400 hover:border-[#F2D59B]'
                }`}
              >
                <Sun className="w-4 h-4" /> Morning
              </button>
              <button
                type="button"
                onClick={() => setSessionTime('Night')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all border ${
                  sessionTime === 'Night'
                    ? 'bg-[#9AA078]/10 border-[#9AA078] text-[#9AA078]'
                    : 'dark:bg-stone-900 bg-white border-stone-200 text-stone-400 hover:border-[#F2D59B]'
                }`}
              >
                <Moon className="w-4 h-4" /> Night
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-2">
              Administration Route
            </label>
            <div className="flex flex-wrap gap-2">
              {routes.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoute(r)}
                  className={`px-4 py-2 rounded-xl text-sm border font-bold transition-all ${
                    route === r
                      ? 'dark:bg-stone-800 bg-[#FCF9F2] border-[#E5A024] text-[#E5A024] shadow-sm'
                      : 'dark:bg-stone-900 bg-white border-stone-200 dark:text-stone-400 text-stone-500 hover:border-[#F2D59B] dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-stone-300 text-stone-600 mb-2">
              Injection Site
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableSites.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setIsCustomSite(false);
                    setSite(s);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm border font-bold transition-all ${
                    site === s && !isCustomSite
                      ? 'dark:bg-stone-800 bg-[#FCF9F2] border-[#E5A024] text-[#E5A024] shadow-sm'
                      : 'dark:bg-stone-900 bg-white border-stone-200 dark:text-stone-400 text-stone-500 hover:border-[#F2D59B] dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800'
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomSite(true)}
                className={`px-4 py-2 rounded-xl text-sm border font-bold transition-all ${
                  isCustomSite
                    ? 'dark:bg-stone-800 bg-[#FCF9F2] border-[#E5A024] text-[#E5A024] shadow-sm'
                    : 'dark:bg-stone-900 bg-white border-stone-200 dark:text-stone-400 text-stone-500 hover:border-[#F2D59B] dark:bg-stone-900 bg-white hover:bg-[#FCF9F2] dark:hover:bg-stone-800'
                }`}
              >
                Other / Custom
              </button>
            </div>
            {isCustomSite && (
              <input
                required
                type="text"
                placeholder="Type your injection site..."
                value={customSite}
                onChange={(e) => setCustomSite(e.target.value)}
                className="w-full dark:bg-stone-800 bg-[#FCF9F2] border border-[#F2D59B] rounded-lg p-2.5 dark:text-stone-100 text-stone-800 focus:border-[#C64633] focus:ring-1 focus:ring-[#C64633] focus:outline-none"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#C64633] hover:bg-[#A83724] text-white font-bold py-3.5 rounded-xl mt-6 shadow-sm shadow-[#F2D59B] transition-colors"
          >
            {initialData ? 'Update Log' : 'Save Log'}
          </button>
        </form>
      </div>
    </div>
  );
}
