import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { verifyProblemSolution } from './functions/verifyProblemSolution/resource';
import { searchFormulas } from './functions/searchFormulas/resource';
import { getFeaturedProblems } from './functions/getFeaturedProblems/resource';

/**
 * Physics 4C TA Backend
 * Collaborative physics learning platform with AI verification
 */
defineBackend({
  auth,
  data,
  storage,
  verifyProblemSolution,
  searchFormulas,
  getFeaturedProblems,
});
