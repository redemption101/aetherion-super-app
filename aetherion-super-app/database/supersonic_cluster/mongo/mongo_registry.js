// ================================================================
// AETHERION SUPERSONIC DATABASE — MONGODB REGISTRY
// Run with: mongosh aetherion_main < mongo_registry.js
// DB Password: Mv@20217$$
// ================================================================

db = db.getSiblingDB('aetherion_main');

db.createUser({
  user: 'aetherion_sovereign',
  pwd: 'Mv@20217$$',
  roles: [{ role: 'readWrite', db: 'aetherion_main' }]
});

// ----------------------------------------------------------------
// MAIN DATABASE — Sovereign Founders (Tier 1)
// ----------------------------------------------------------------
db.sovereign_founders.drop();
db.sovereign_founders.insertMany([
  { name: 'Mandlenkosi Vundla', role: 'Sovereign Architect & Founder', tier: 1, access: 'SOVEREIGN' },
  { name: 'Theodore Swarts',    role: 'Co-Founder',                    tier: 1, access: 'SOVEREIGN' },
  { name: 'Sempi Mvala',        role: 'Co-Founder',                    tier: 1, access: 'SOVEREIGN' },
  { name: 'Mrs Codex',          role: 'Co-Founder',                    tier: 1, access: 'SOVEREIGN' }
]);

// ----------------------------------------------------------------
// SUB DATABASE — Full Member Registry (Tier 2)
// ----------------------------------------------------------------
db.sub_members.drop();
db.sub_members.insertMany([
  // Royal Houses
  { name: 'Queen Elizabeth',                    category: 'Royal Houses' },
  { name: 'The Zulu Royal House',               category: 'Royal Houses' },
  { name: 'The England Royal House',            category: 'Royal Houses' },
  { name: 'The Apache Tribe and Red Indian Tribes', category: 'Royal Houses' },
  { name: 'Top 100 Royal Houses Globally',      category: 'Royal Houses' },

  // Global Tech
  { name: 'Mark Zuckerberg',                    category: 'Global Tech Icons' },
  { name: 'Bill Gates',                         category: 'Global Tech Icons' },
  { name: 'Elon Musk',                          category: 'Global Tech Icons' },
  { name: 'Google',                             category: 'Cloud Environments' },
  { name: 'Microsoft',                          category: 'Cloud Environments' },
  { name: 'Top 50 Cloud Environments',          category: 'Cloud Environments' },
  { name: 'Fathers of Technology Globally',     category: 'Technology Pioneers' },
  { name: 'Top 50 IDS Globally',                category: 'Security Systems' },

  // Business & Finance
  { name: 'Johan Rupert',                       category: 'Business & Finance' },
  { name: 'Oppenheimer Family',                 category: 'Business & Finance' },
  { name: 'De Beers',                           category: 'Mining' },
  { name: 'Cyril Ramaphosa',                    category: 'Leadership & Politics' },
  { name: 'Wall Street',                        category: 'Financial Markets' },
  { name: 'Top 5000 Forbes Richest',            category: 'Forbes Registry' },
  { name: 'Top 7000 Global Companies',          category: 'Corporate Registry' },
  { name: 'Top 1000 Banks Globally',            category: 'Banking' },
  { name: 'Top 50 Yacht Companies Globally',    category: 'Luxury & Maritime' },

  // Industry
  { name: 'Top 10000 Celebrities Globally',     category: 'Celebrity Registry' },
  { name: 'Top 3000 Mining Companies',          category: 'Mining Registry' },
  { name: 'Top 7000 Retail & Furniture Shops',  category: 'Retail Registry' },
  { name: 'Top 1000 Automobile Companies',      category: 'Automobile Registry' },
  { name: 'Top 100 Airplane Companies Globally',category: 'Aviation Registry' },

  // Vundla Family
  { name: 'Peter Vundla',                       category: 'Vundla Family Lineage' },
  { name: 'Mfundi Vundla',                      category: 'Vundla Family Lineage' },
  { name: 'Mhlangabezi Vundla',                 category: 'Vundla Family Lineage' },
  { name: 'Themba Vundla',                      category: 'Vundla Family Lineage' },
  { name: 'Nokuthula Vundla',                   category: 'Vundla Family Lineage' },
  { name: 'Mthandazo Vundla',                   category: 'Vundla Family Lineage' },
  { name: 'Kathleen Baba Vundla',               category: 'Vundla Family Lineage' },
  { name: 'Joy Vundla and Family',              category: 'Vundla Family Lineage' },
  { name: 'Vivienne Vundla Mashilo and Family', category: 'Vundla Family Lineage' },

  // Moyo Family
  { name: 'Ngoni Moyo',                         category: 'Moyo Family Lineage' },
  { name: 'Bernard Moyo',                       category: 'Moyo Family Lineage' },
  { name: 'Moyo Family Lineage',                category: 'Moyo Family Lineage' },

  // Chigwada Family
  { name: 'Tendai Madzipe',                     category: 'Chigwada Family Lineage' },
  { name: 'Thomas Chigwada',                    category: 'Chigwada Family Lineage' },
  { name: 'Monica Chigwada',                    category: 'Chigwada Family Lineage' },
  { name: 'Ceciliah Chigwada',                  category: 'Chigwada Family Lineage' },
  { name: 'Rukudzo Chigwada',                   category: 'Chigwada Family Lineage' },
  { name: 'Joy Chigwada',                       category: 'Chigwada Family Lineage' },
  { name: 'My Spiritual Children Chigwada',     category: 'Chigwada Family Lineage' },

  // Makhubu Family
  { name: 'Thulani Makhubu',                    category: 'Makhubu Family' },
  { name: 'Banele Makhubu',                     category: 'Makhubu Family' },
  { name: 'Bongani Makhubu',                    category: 'Makhubu Family' },
  { name: 'Simphiwe Makhubu',                   category: 'Makhubu Family' },
  { name: 'Zinhle Makhubu',                     category: 'Makhubu Family' },
  { name: 'Zakhele Makhubu',                    category: 'Makhubu Family' },
  { name: 'Makhubu Family',                     category: 'Makhubu Family' },

  // Dladla Family
  { name: 'Lesedi Dladla',                      category: 'Dladla Family' },
  { name: 'Siphiwe Dladla',                     category: 'Dladla Family' },
  { name: 'Lindiwe Babalwa Dladla',             category: 'Dladla Family' },
  { name: 'Somikazi Dladla',                    category: 'Dladla Family' },
  { name: 'Zukiswa Dladla',                     category: 'Dladla Family' },
  { name: 'Mthwakazi Dladla',                   category: 'Dladla Family' },
  { name: 'Nkuli Dladla',                       category: 'Dladla Family' },
  { name: 'Dladla Family',                      category: 'Dladla Family' },

  // Mashilo & Moremi
  { name: 'Mbulelo Wesley Mashilo',             category: 'Mashilo Family' },
  { name: 'Mashilo Family',                     category: 'Mashilo Family' },
  { name: 'Moremi Family',                      category: 'Moremi Family' },

  // Inner Circle
  { name: 'Sphesihle Shezi',                    category: 'Inner Circle' },
  { name: 'Samkelo Shezi',                      category: 'Inner Circle' },
  { name: 'Lance Mada',                         category: 'Inner Circle' },
  { name: 'Sdova Nebhandla',                    category: 'Inner Circle' },
  { name: 'Mjuku',                              category: 'Inner Circle' },
  { name: 'Sfiso Fistaz Buthelezi Nebhandla',   category: 'Inner Circle' },
  { name: 'Veja Slago',                         category: 'Inner Circle' },
  { name: 'Nonkululeko Mpilo',                  category: 'Inner Circle' },
  { name: 'Sako Molefe',                        category: 'Inner Circle' },
  { name: 'Vanesa Legote',                      category: 'Inner Circle' },

  // Media & Entertainment
  { name: 'Lehasa',                             category: 'Media & Entertainment' },
  { name: 'Masobe',                             category: 'Media & Entertainment' },
  { name: 'Sfiso Khuzwayo',                     category: 'Media & Entertainment' },
  { name: 'Tita Ndlangisa',                     category: 'Media & Entertainment' },
  { name: 'Magauta',                            category: 'Media & Entertainment' },
  { name: 'Unathi Mantanga',                    category: 'Media & Entertainment' },
  { name: 'Lerato Phakoe',                      category: 'Media & Entertainment' },
  { name: 'Jack Nteso',                         category: 'Media & Entertainment' },

  // Education
  { name: 'UFS and Friends',                    category: 'Education' },
  { name: 'Tyler Levine and Classmates',        category: 'Education' },
  { name: 'Durban Deep Primary School',         category: 'Education' },
  { name: 'Unified Primary',                    category: 'Education' },
  { name: 'Marlborton Primary',                 category: 'Education' },
  { name: 'Graceworld',                         category: 'Education / Faith' },
  { name: 'Adelaide Tambo School',              category: 'Education' },
  { name: 'Kutloanong High School',             category: 'Education' },
  { name: 'UFS and All SA Universities',        category: 'Education / Higher' },
  { name: 'Technikons and Colleges SA',         category: 'Education / Tertiary' },
  { name: 'Sparrow Rainbow Village',            category: 'Education / Community' },
  { name: 'ALX Africa',                         category: 'Education / Tech Training' },
  { name: 'Wits OTT Students',                  category: 'Education / Wits' },

  // Personal Circle
  { name: 'Corrine McClinton',                  category: 'Personal Circle' },
  { name: 'Naniki Mthuzula and Family',         category: 'Personal Circle' },
  { name: 'Jackie and Family',                  category: 'Personal Circle' },
  { name: 'Mpho and Family',                    category: 'Personal Circle' },
  { name: 'Paris London and Family',            category: 'Personal Circle' },
  { name: 'Sergio and Family',                  category: 'Personal Circle' },
  { name: 'John',                               category: 'Personal Circle' },
  { name: 'Pule',                               category: 'Personal Circle' },
  { name: 'Ntondo',                             category: 'Personal Circle' },
  { name: 'Mbali Nyathi',                       category: 'Personal Circle' },
  { name: 'Echo Gibbons',                       category: 'Personal Circle' },

  // Professional
  { name: 'UVU Africa Capaciti',                category: 'Professional / UVU Africa' },
  { name: 'Demand 3 Cohort Members UVU Africa', category: 'Professional / UVU Africa' },
  { name: 'Orabile Mogase',                     category: 'Professional Circle' },
  { name: 'Sakhile',                            category: 'Professional Circle' },
  { name: 'Kefiloe',                            category: 'Professional Circle' },
  { name: 'Nonhlanhla Mndebele',                category: 'Professional Circle' },
  { name: 'Tsakane Mohale',                     category: 'Professional Circle' },
  { name: 'Sherin Kgabo Phihlela',              category: 'Professional Circle' },
  { name: 'Dr Mosefane',                        category: 'Academic / Medical' },
  { name: 'Dr Ngubelanga',                      category: 'Academic / Medical' },

  // Politics
  { name: 'AZAPO',                              category: 'Politics & Movements' },
  { name: 'ANC',                                category: 'Politics & Movements' }
]);

// Indexes for 6-billion-user scale queries
db.sovereign_founders.createIndex({ name: 1 }, { unique: true });
db.sub_members.createIndex({ name: 1 });
db.sub_members.createIndex({ category: 1 });

print('=== AETHERION MONGODB REGISTRY LOADED ===');
print('Sovereign Founders: ' + db.sovereign_founders.countDocuments());
print('Sub-Members:        ' + db.sub_members.countDocuments());
