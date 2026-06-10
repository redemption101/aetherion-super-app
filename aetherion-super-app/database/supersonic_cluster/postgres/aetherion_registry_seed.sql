-- =============================================================
-- AETHERION SUPERSONIC DATABASE — SOVEREIGN REGISTRY
-- Master Password: Mv@20217$$
-- =============================================================

-- Create dedicated database user
CREATE USER aetherion_sovereign WITH PASSWORD 'Mv@20217$$';
CREATE DATABASE aetherion_main OWNER aetherion_sovereign;

\connect aetherion_main;

GRANT ALL PRIVILEGES ON DATABASE aetherion_main TO aetherion_sovereign;

-- =============================================================
-- MAIN DATABASE — TIER 1: SOVEREIGN ARCHITECTS & FOUNDERS
-- These 4 are the core pillars of the Aetherion system
-- =============================================================

CREATE TABLE IF NOT EXISTS sovereign_founders (
    id              SERIAL PRIMARY KEY,
    full_name       VARCHAR(120)  NOT NULL,
    role            VARCHAR(120)  NOT NULL,
    tier            INTEGER       DEFAULT 1,
    access_level    VARCHAR(20)   DEFAULT 'SOVEREIGN',
    registered_at   TIMESTAMPTZ   DEFAULT NOW()
);

INSERT INTO sovereign_founders (full_name, role, tier, access_level) VALUES
    ('Mandlenkosi Vundla',  'Sovereign Architect & Founder',  1, 'SOVEREIGN'),
    ('Theodore Swarts',     'Co-Founder',                     1, 'SOVEREIGN'),
    ('Sempi Mvala',         'Co-Founder',                     1, 'SOVEREIGN'),
    ('Mrs Codex',           'Co-Founder',                     1, 'SOVEREIGN');

-- =============================================================
-- SUB DATABASE — TIER 2: INNER CIRCLE & FAMILY REGISTRY
-- =============================================================

CREATE TABLE IF NOT EXISTS sub_members (
    id              SERIAL PRIMARY KEY,
    full_name       VARCHAR(180)  NOT NULL,
    category        VARCHAR(100),
    tier            INTEGER       DEFAULT 2,
    access_level    VARCHAR(20)   DEFAULT 'MEMBER',
    registered_at   TIMESTAMPTZ   DEFAULT NOW()
);

INSERT INTO sub_members (full_name, category) VALUES
-- === ROYAL & FAMILY LINEAGES ===
    ('Queen Elizabeth',                     'Royal House'),
    ('Peter Vundla',                        'Vundla Family Lineage'),
    ('Mfundi Vundla',                       'Vundla Family Lineage'),
    ('Mhlangabezi Vundla',                  'Vundla Family Lineage'),
    ('Themba Vundla',                       'Vundla Family Lineage'),
    ('Nokuthula Vundla',                    'Vundla Family Lineage'),
    ('Mthandazo Vundla',                    'Vundla Family Lineage'),
    ('Kathleen Baba Vundla',                'Vundla Family Lineage'),
    ('Joy Vundla and Family',               'Vundla Family Lineage'),
    ('Vivienne Vundla Mashilo and Family',  'Vundla Family Lineage / Mashilo Family'),
    ('Mbulelo Wesley Mashilo',              'Mashilo Family'),
    ('Mashilo Family',                      'Mashilo Family'),
    ('Ngoni Moyo',                          'Moyo Family Lineage'),
    ('Bernard Moyo',                        'Moyo Family Lineage'),
    ('Moyo Family Lineage',                 'Moyo Family Lineage'),
    ('Tendai Madzipe',                      'Chigwada Family Lineage'),
    ('Thomas Chigwada',                     'Chigwada Family Lineage'),
    ('Monica Chigwada',                     'Chigwada Family Lineage'),
    ('Ceciliah Chigwada',                   'Chigwada Family Lineage'),
    ('Rukudzo Chigwada',                    'Chigwada Family Lineage'),
    ('Joy Chigwada',                        'Chigwada Family Lineage / Spiritual Children'),
    ('My Spiritual Children Chigwada',      'Chigwada Family Lineage / Spiritual Children'),
    ('Chigwada Family Lineage',             'Chigwada Family Lineage'),
    ('Thulani Makhubu',                     'Makhubu Family'),
    ('Banele Makhubu',                      'Makhubu Family'),
    ('Bongani Makhubu',                     'Makhubu Family'),
    ('Simphiwe Makhubu',                    'Makhubu Family'),
    ('Zinhle Makhubu',                      'Makhubu Family'),
    ('Zakhele Makhubu',                     'Makhubu Family'),
    ('Makhubu Family',                      'Makhubu Family'),
    ('Lesedi Dladla',                       'Dladla Family'),
    ('Siphiwe Dladla',                      'Dladla Family'),
    ('Lindiwe Babalwa Dladla',              'Dladla Family'),
    ('Somikazi Dladla',                     'Dladla Family'),
    ('Zukiswa Dladla',                      'Dladla Family'),
    ('Mthwakazi Dladla',                    'Dladla Family'),
    ('Nkuli Dladla',                        'Dladla Family'),
    ('Dladla Family',                       'Dladla Family'),
    ('Moremi Family',                       'Moremi Family'),
-- === GLOBAL TECHNOLOGY & BUSINESS ICONS ===
    ('Mark Zuckerberg',                     'Global Tech Icons'),
    ('Bill Gates',                          'Global Tech Icons / Fathers of Technology'),
    ('Elon Musk',                           'Global Tech Icons'),
    ('Johan Rupert',                        'Business & Finance'),
    ('Oppenheimer Family',                  'Business & Finance / Mining'),
    ('De Beers',                            'Mining Companies'),
    ('Cyril Ramaphosa',                     'Leadership & Politics'),
    ('Top 5000 Forbes Richest',             'Forbes Registry'),
    ('Top 7000 Global Companies',           'Corporate Registry'),
    ('Top 10000 Celebrities Globally',      'Celebrity Registry'),
    ('Top 3000 Mining Companies',           'Mining Registry'),
    ('Top 7000 Retail & Furniture Shops',   'Retail Registry'),
    ('Top 1000 Automobile Companies',       'Automobile Registry'),
    ('Top 100 Airplane Companies Globally', 'Aviation Registry'),
    ('Top 1000 Banks Globally',             'Banking Registry'),
    ('Top 50 Yacht Companies Globally',     'Luxury & Maritime Registry'),
    ('Wall Street',                         'Financial Markets'),
    ('Google',                              'Top 50 Cloud Environments'),
    ('Microsoft',                           'Top 50 Cloud Environments'),
    ('Top 50 Cloud Environments',           'Technology Infrastructure'),
    ('Top 50 IDS Globally',                 'Security Systems Registry'),
    ('Fathers of Technology Globally',      'Technology Pioneers'),
-- === ENTERTAINMENT & MEDIA ===
    ('Sphesihle Shezi',                     'Inner Circle'),
    ('Samkelo Shezi',                       'Inner Circle'),
    ('Lance Mada',                          'Inner Circle'),
    ('Sdova Nebhandla',                     'Inner Circle'),
    ('Mjuku',                               'Inner Circle'),
    ('Sfiso Fistaz Buthelezi Nebhandla',    'Inner Circle'),
    ('Veja Slago',                          'Inner Circle'),
    ('Nonkululeko Mpilo',                   'Inner Circle'),
    ('Sako Molefe',                         'Inner Circle'),
    ('Vanesa Legote',                       'Inner Circle / Media'),
    ('Lehasa',                              'Media & Entertainment'),
    ('Masobe',                              'Media & Entertainment'),
    ('Sfiso Khuzwayo',                      'Media & Entertainment'),
    ('Tita Ndlangisa',                      'Media & Entertainment'),
    ('Magauta',                             'Media & Entertainment'),
    ('Unathi Mantanga',                     'Media & Entertainment'),
    ('Lerato Phakoe',                       'Media & Entertainment'),
    ('Jack Nteso',                          'Media & Entertainment'),
-- === EDUCATION & COMMUNITIES ===
    ('UFS and Friends',                         'Education / University of Free State'),
    ('Tyler Levine and Classmates',             'Education'),
    ('Durban Deep Primary School',              'Education / Primary Schools'),
    ('Unified Primary',                         'Education / Primary Schools'),
    ('Marlborton Primary',                      'Education / Primary Schools'),
    ('Graceworld',                              'Education / Faith Communities'),
    ('Adelaide Tambo School',                   'Education / Schools'),
    ('Kutloanong High School',                  'Education / High Schools'),
    ('UFS and All South African Universities',  'Education / Higher Education'),
    ('Technikons and Colleges SA',              'Education / Tertiary'),
    ('Sparrow Rainbow Village',                 'Education / Special Communities'),
-- === PERSONAL CIRCLE ===
    ('Corrine McClinton',               'Personal Circle'),
    ('Naniki Mthuzula and Family',      'Personal Circle'),
    ('Jackie and Family',               'Personal Circle'),
    ('Mpho and Family',                 'Personal Circle'),
    ('Paris London and Family',         'Personal Circle'),
    ('Sergio and Family',               'Personal Circle'),
    ('John',                            'Personal Circle'),
    ('Pule',                            'Personal Circle'),
    ('Ntondo',                          'Personal Circle'),
    ('Mbali Nyathi',                    'Personal Circle'),
    ('Echo Gibbons',                    'Personal Circle'),
-- === PROFESSIONAL & ACADEMIC ===
    ('UVU Africa Capaciti',                     'Professional / UVU Africa'),
    ('Demand 3 Cohort Members at UVU Africa',   'Professional / UVU Africa'),
    ('Orabile Mogase',                          'Professional Circle'),
    ('Sakhile',                                 'Professional Circle'),
    ('Kefiloe',                                 'Professional Circle'),
    ('Nonhlanhla Mndebele',                     'Professional Circle'),
    ('Wits OTT Students',                       'Education / Wits University'),
    ('Tsakane Mohale',                          'Professional Circle'),
    ('Sherin Kgabo Phihlela',                   'Professional Circle'),
    ('Dr Mosefane',                             'Academic / Medical'),
    ('Dr Ngubelanga',                           'Academic / Medical'),
    ('ALX Africa',                              'Education / Tech Training'),
-- === POLITICS & MOVEMENTS ===
    ('AZAPO',       'Political Organizations'),
    ('ANC',         'Political Organizations'),
-- === ROYAL HOUSES ===
    ('The Apache Tribe and Red Indian Tribes',  'Indigenous Royal Houses'),
    ('The Zulu Royal House',                    'African Royal Houses'),
    ('The England Royal House',                 'European Royal Houses'),
    ('Top 100 Royal Houses Globally',           'Global Royal Houses');

-- =============================================================
-- INDEXES for fast lookup across 6 billion user scale
-- =============================================================

CREATE INDEX idx_founders_name     ON sovereign_founders (full_name);
CREATE INDEX idx_sub_members_name  ON sub_members (full_name);
CREATE INDEX idx_sub_members_cat   ON sub_members (category);

-- =============================================================
-- CONFIRMATION VIEW — Shows the full registry in one query
-- =============================================================

CREATE OR REPLACE VIEW aetherion_full_registry AS
    SELECT 'SOVEREIGN' AS registry_tier, full_name, role AS category, access_level, registered_at
    FROM sovereign_founders
    UNION ALL
    SELECT 'SUB-MEMBER' AS registry_tier, full_name, category, access_level, registered_at
    FROM sub_members
    ORDER BY registry_tier DESC, registered_at;

-- Final confirmation
SELECT '=== AETHERION REGISTRY LOADED SUCCESSFULLY ===' AS status;
SELECT 'Sovereign Founders: ' || COUNT(*)::TEXT AS summary FROM sovereign_founders
UNION ALL
SELECT 'Sub-Members Registered: ' || COUNT(*)::TEXT FROM sub_members;
