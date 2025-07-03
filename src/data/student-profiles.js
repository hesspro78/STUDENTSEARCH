
import { northAfricaProfiles } from './profiles/north-africa.js';
import { westAfricaGroup1 } from './profiles/west-africa-group1.js';
import { westAfricaGroup2 } from './profiles/west-africa-group2.js';
import { centralAfricaProfiles } from './profiles/central-africa.js';
import { otherRegionsProfiles } from './profiles/other-regions.js';

export const studentsData = [
  ...northAfricaProfiles,
  ...westAfricaGroup1,
  ...westAfricaGroup2,
  ...centralAfricaProfiles,
  ...otherRegionsProfiles
];
