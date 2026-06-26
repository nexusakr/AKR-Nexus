-- ════════════════════════════════════════════════════════════════════
-- AKR Nexus — seed data (real, non-fabricated content only)
-- Safe to re-run (idempotent via ON CONFLICT).
-- ════════════════════════════════════════════════════════════════════

-- Blog categories (the 8 from the website blueprint)
insert into blog_categories (name, slug, sort_order) values
  ('Property Buying Guides', 'property-buying-guides', 1),
  ('Real Estate Investment', 'real-estate-investment', 2),
  ('Deoghar Real Estate', 'deoghar-real-estate', 3),
  ('Construction Knowledge', 'construction-knowledge', 4),
  ('Legal Documentation', 'legal-documentation', 5),
  ('NRI Property Guides', 'nri-property-guides', 6),
  ('Women Home Ownership', 'women-home-ownership', 7),
  ('Market Updates', 'market-updates', 8)
on conflict (slug) do nothing;

-- Customer programs (the six signature programs)
insert into customer_programs (slug, name, segment, summary, sort_order, status) values
  ('shakti', 'Shakti Home Ownership Initiative', 'Women',
    'Women-first advisory, safety-vetted properties, and guidance on joint or sole titles to put women confidently onto ownership.', 1, 'published'),
  ('guru-griha', 'Guru Griha Advantage Program', 'Teachers',
    'Fee-light, flexible assistance with an affordable-home shortlist plus loan and documentation hand-holding.', 2, 'published'),
  ('veer-awas', 'Veer Awas Program', 'Defence Personnel',
    'Fully-managed remote buying while posted away, with secure investment options and a trusted point-of-contact.', 3, 'published'),
  ('healthcare', 'Healthcare Professionals Property Program', 'Doctors',
    'Concierge, time-saving service for premium homes and clinic/commercial space, scheduled around demanding hours.', 4, 'published'),
  ('nri-care', 'NRI Property Care Program', 'NRIs',
    'Virtual tours, end-to-end legal & registration, and ongoing property upkeep, monitoring and reporting from afar.', 5, 'published'),
  ('first-home', 'First Home Advantage Program', 'First-time / local families',
    'Step-by-step guidance, loan facilitation, transparent pricing, and extra documentation support for first-time buyers.', 6, 'published')
on conflict (slug) do nothing;

-- Future divisions (Coming Soon)
insert into divisions (slug, title, summary, is_coming_soon, sort_order) values
  ('construction', 'Construction Division', 'Contracting and execution for own and third-party projects.', true, 1),
  ('infrastructure', 'Infrastructure Division', 'Roads, civic amenities and project-level public infrastructure.', true, 2),
  ('investment', 'Investment Division', 'Co-investment, land banking and project returns.', true, 3),
  ('proptech', 'PropTech Division', 'Digital platforms for discovery, transparency and documentation.', true, 4)
on conflict (slug) do nothing;
