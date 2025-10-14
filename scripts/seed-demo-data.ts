#!/usr/bin/env tsx

/**
 * Seed Demo Data Script
 *
 * Creates sample chapters, formulas, and problems for testing
 * Run this after deploying the Amplify backend
 *
 * Usage: npm run seed
 */

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

console.log('🌱 Seeding demo data for Physics 4C TA...\n');

const client = generateClient<Schema>({
  authMode: 'iam', // System-level access for seeding
});

async function seed() {
  try {
    // Create sample chapters
    console.log('Creating chapters...');

    const chapters = [
      // Volume 1
      {
        volume: 'VOL1' as const,
        number: 1,
        title: 'Units and Measurement',
        description: 'Introduction to physical quantities, units, and dimensional analysis',
      },
      {
        volume: 'VOL1' as const,
        number: 16,
        title: 'Waves',
        description: 'Wave motion, interference, and wave phenomena',
      },
      // Volume 2
      {
        volume: 'VOL2' as const,
        number: 1,
        title: 'Temperature and Heat',
        description: 'Thermal properties of matter and heat transfer',
      },
      {
        volume: 'VOL2' as const,
        number: 2,
        title: 'The Kinetic Theory of Gases',
        description: 'Molecular interpretation of temperature and pressure',
      },
      // Volume 3
      {
        volume: 'VOL3' as const,
        number: 3,
        title: 'Wave Nature of Light',
        description: 'Interference, diffraction, and polarization',
      },
      {
        volume: 'VOL3' as const,
        number: 4,
        title: 'Quantum Physics',
        description: 'Photons, wave-particle duality, and quantum mechanics',
      },
    ];

    const createdChapters: any[] = [];
    for (const chapter of chapters) {
      const result = await client.models.Chapter.create(chapter);
      if (result.data) {
        createdChapters.push(result.data);
        console.log(`  ✓ Created: ${chapter.volume} Ch${chapter.number} - ${chapter.title}`);
      }
    }

    // Set up cross-linking: Vol 3 Ch 3-4 → Vol 1 Ch 16
    const vol1ch16 = createdChapters.find(c => c.volume === 'VOL1' && c.number === 16);
    const vol3ch3 = createdChapters.find(c => c.volume === 'VOL3' && c.number === 3);
    const vol3ch4 = createdChapters.find(c => c.volume === 'VOL3' && c.number === 4);

    if (vol1ch16 && vol3ch3) {
      await client.models.Chapter.update({
        volume: 'VOL3',
        number: 3,
        relatedChapterId: vol1ch16.id,
      });
      console.log('  ✓ Linked Vol 3 Ch 3 → Vol 1 Ch 16');
    }

    if (vol1ch16 && vol3ch4) {
      await client.models.Chapter.update({
        volume: 'VOL3',
        number: 4,
        relatedChapterId: vol1ch16.id,
      });
      console.log('  ✓ Linked Vol 3 Ch 4 → Vol 1 Ch 16');
    }

    // Create sample formulas
    console.log('\nCreating formulas...');

    const vol2ch1 = createdChapters.find(c => c.volume === 'VOL2' && c.number === 1);
    const vol2ch2 = createdChapters.find(c => c.volume === 'VOL2' && c.number === 2);

    if (vol2ch1) {
      const formulas = [
        {
          chapterId: vol2ch1.id,
          title: 'Heat Transfer',
          latex: 'Q = mc\\Delta T',
          description: 'Heat absorbed or released when temperature changes. Q is heat, m is mass, c is specific heat, ΔT is temperature change.',
          tags: ['heat', 'temperature', 'thermodynamics'],
          isScraped: false,
        },
        {
          chapterId: vol2ch1.id,
          title: 'Thermal Expansion (Linear)',
          latex: '\\Delta L = \\alpha L_0 \\Delta T',
          description: 'Change in length due to temperature change. α is coefficient of linear expansion.',
          tags: ['expansion', 'temperature'],
          isScraped: false,
        },
      ];

      for (const formula of formulas) {
        await client.models.Formula.create(formula);
        console.log(`  ✓ Created: ${formula.title}`);
      }
    }

    if (vol2ch2) {
      const formulas = [
        {
          chapterId: vol2ch2.id,
          title: 'Ideal Gas Law',
          latex: 'PV = nRT',
          description: 'Relates pressure (P), volume (V), amount (n), gas constant (R), and temperature (T).',
          tags: ['ideal gas', 'pressure', 'temperature', 'thermodynamics'],
          isScraped: false,
        },
        {
          chapterId: vol2ch2.id,
          title: 'Average Kinetic Energy',
          latex: '\\bar{K} = \\frac{3}{2}k_B T',
          description: 'Average kinetic energy of gas molecules. kB is Boltzmann constant.',
          tags: ['kinetic theory', 'energy', 'temperature'],
          isScraped: false,
        },
      ];

      for (const formula of formulas) {
        await client.models.Formula.create(formula);
        console.log(`  ✓ Created: ${formula.title}`);
      }
    }

    // Create sample user (teacher)
    console.log('\nCreating demo users...');

    const teacherResult = await client.models.User.create({
      email: 'teacher@physics4c.edu',
      name: 'Prof. Taylor',
      role: 'TEACHER',
    });

    const studentResult = await client.models.User.create({
      email: 'student@physics4c.edu',
      name: 'Alex Student',
      role: 'STUDENT',
    });

    console.log('  ✓ Created teacher and student accounts');

    // Create sample problems
    console.log('\nCreating demo problems...');

    if (vol2ch1 && studentResult.data) {
      const problems = [
        {
          chapterId: vol2ch1.id,
          title: 'Heat transfer in a copper rod',
          body: `A copper rod of mass 0.5 kg is heated from 20°C to 100°C. The specific heat of copper is 385 J/(kg·°C).

**Question:** How much heat is absorbed?

**Solution:**
Using $Q = mc\\Delta T$:

$Q = (0.5 \\text{ kg})(385 \\text{ J/kg°C})(100 - 20)\\text{°C}$

$Q = 15,400 \\text{ J} = 15.4 \\text{ kJ}$`,
          status: 'SOLVED' as const,
          difficulty: 2,
          tags: ['heat transfer', 'specific heat'],
          authorId: studentResult.data.id,
          aiVerified: true,
          aiVerificationNote: 'Correct! The calculation properly applies the heat transfer formula.',
          featured: true,
          featuredAt: new Date().toISOString(),
        },
        {
          chapterId: vol2ch2.id,
          title: 'Ideal gas pressure calculation',
          body: `A container holds 2.0 moles of an ideal gas at 300 K. The volume is 0.05 m³.

**Question:** What is the pressure? (R = 8.314 J/(mol·K))

**Need help:** I'm not sure if I should use atmospheres or Pascals for the answer.`,
          status: 'NEED_HELP' as const,
          difficulty: 3,
          tags: ['ideal gas', 'pressure'],
          authorId: studentResult.data.id,
        },
      ];

      for (const problem of problems) {
        await client.models.ProblemPost.create(problem);
        console.log(`  ✓ Created: ${problem.title}`);
      }
    }

    console.log('\n✅ Seed complete!');
    console.log('\n📊 Summary:');
    console.log(`  - ${createdChapters.length} chapters`);
    console.log('  - 4 formulas');
    console.log('  - 2 users (teacher + student)');
    console.log('  - 2 demo problems');
    console.log('\n🚀 You can now:');
    console.log('  1. Visit http://localhost:3000');
    console.log('  2. Sign up with any email');
    console.log('  3. Browse volumes and chapters');
    console.log('  4. Try the AI chat');
    console.log('  5. View featured problems');
    console.log('\n💡 To access admin panel:');
    console.log('  1. Sign up');
    console.log('  2. Manually set role="TEACHER" in DynamoDB User table');
    console.log('  3. Visit /admin');

  } catch (error: any) {
    console.error('\n❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seed();
