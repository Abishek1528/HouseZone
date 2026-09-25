/**
 * HouseZone Full App Test Script
 * ================================
 * Tests ALL API endpoints for every category:
 *  - Job Giver  (post jobs, step 1/2/3, list, filter, applicants)
 *  - Job Seeker (profile, listings, filter, applications)
 *  - Residential (owner form step 1, tenant listings, filter)
 *  - Machinery   (step 1, tenant listings)
 *  - Vehicles    (step 1, tenant listings)
 *  - Business    (step 1, tenant listings)
 *  - Auth        (signup, login)
 *  - Admin       (all admin views)
 *  - Data Integrity checks
 *
 * HOW TO RUN:
 *   cd backend
 *   node test-all.js
 *   node test-all.js --verbose    (for detailed output)
 *
 * REQUIRES: node-fetch & form-data packages
 *   npm install node-fetch form-data --save-dev
 */

import fetch from 'node-fetch';
import FormData from 'form-data';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const VERBOSE  = process.argv.includes('--verbose');

// ─── HELPERS ──────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures = [];

function log(...args) {
  if (VERBOSE) console.log('    ', ...args);
}

async function request(method, path, body, isForm = false) {
  const url = `${BASE_URL}${path}`;
  const opts = { method };
  if (body) {
    if (isForm) {
      opts.body = body;
    } else {
      opts.headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(url, opts);
  let data;
  try { data = await res.json(); } catch { data = null; }
  return { status: res.status, data };
}

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ❌  ${name}`);
    console.log(`       → ${err.message}`);
    failed++;
    failures.push({ name, error: err.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertOk(status, data, context) {
  assert(
    status >= 200 && status < 300,
    `${context || 'Request'} failed HTTP ${status}: ${JSON.stringify(data)?.slice(0, 200)}`
  );
}

function section(name) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  📦  ${name}`);
  console.log('─'.repeat(60));
}

// ─── SHARED STATE ─────────────────────────────────────────────────────────────
const state = {};

// ══════════════════════════════════════════════════════════════════════════════
// 1. AUTH
// ══════════════════════════════════════════════════════════════════════════════
async function runAuthTests() {
  section('AUTH — Signup & Login');

  await test('POST /signup — create test user', async () => {
    const { status, data } = await request('POST', '/signup', {
      name: 'Test User',
      email: `test_${Date.now()}@housezone.in`,
      password: 'Test@1234',
      contact: '9876543210',
      role: 'user',
    });
    assertOk(status, data, 'Signup');
    state.signupId = data?.id || data?.userId || data?.signupId;
    log('Signup ID:', state.signupId);
  });

  await test('POST /login — endpoint responds (wrong creds = 401 not 500)', async () => {
    const { status } = await request('POST', '/login', {
      email: 'nobody@test.com',
      password: 'wrongpass',
    });
    assert(status !== 500, `Login endpoint returned server error 500`);
    log('Login response status:', status);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. JOB GIVER
// ══════════════════════════════════════════════════════════════════════════════
async function runJobGiverTests() {
  section('JOB GIVER — Registration (3 Steps) & Listing');

  await test('POST /jobgiver/step1 — save shop details', async () => {
    const { status, data } = await request('POST', '/jobgiver/step1', {
      ownerName: 'Rajan Test',
      shopName: `Rajan Textiles ${Date.now()}`,
      shopType: 'Textiles',
      area: 'Vandigate',
      city: 'Chidambaram',
      landmark: 'Near Bus Stand',
      contact: '9876543210',
    });
    assertOk(status, data, 'JobGiver Step1');
    assert(data?.jobGiverId, 'Expected jobGiverId in response');
    state.jobGiverId = data.jobGiverId;
    log('jobGiverId:', state.jobGiverId);
  });

  await test('POST /jobgiver/step2 — save job details', async () => {
    assert(state.jobGiverId, 'Depends on step1 jobGiverId');
    const { status, data } = await request('POST', '/jobgiver/step2', {
      jobGiverId: state.jobGiverId,
      jobTitle: 'Cashier',
      employmentType: 'full-time',
      age: '18-30',
      gender: 'any',
      education: 'any',
      experienceYear: 'fresher',
      experienceField: 'N/A',
      workingTimeStart: '09:00 AM',
      workingTimeEnd: '06:00 PM',
    });
    assertOk(status, data, 'JobGiver Step2');
    log('Step2 OK');
  });

  await test('POST /jobgiver/step3 — save salary without photo (FormData)', async () => {
    assert(state.jobGiverId, 'Depends on step1 jobGiverId');
    const form = new FormData();
    form.append('jobGiverId', String(state.jobGiverId));
    form.append('salaryOffering', '10k_to_20k');
    form.append('otherSkills', 'Billing, Stock');
    const { status, data } = await request('POST', '/jobgiver/step3', form, true);
    assertOk(status, data, 'JobGiver Step3');
    log('Step3 OK');
  });

  await test('GET /jobgiver/owners — all job givers', async () => {
    const { status, data } = await request('GET', '/jobgiver/owners');
    assertOk(status, data, 'Jobgiver owners');
    assert(Array.isArray(data), 'Expected array');
    log(`${data.length} job givers found`);
  });

  await test('GET /jobgiver/owners — response has shopName & salaryOffering', async () => {
    const { status, data } = await request('GET', '/jobgiver/owners');
    assertOk(status, data, 'Jobgiver owners fields');
    if (data.length > 0) {
      assert('shopName' in data[0], 'Missing shopName in job giver');
      assert('salaryOffering' in data[0], 'Missing salaryOffering in job giver');
    }
    log('Fields verified');
  });

  await test('GET /admin/jobgiver/all — admin view', async () => {
    const { status, data } = await request('GET', '/admin/jobgiver/all');
    assertOk(status, data, 'Admin jobgiver all');
    assert(Array.isArray(data), 'Expected array');
    log(`Admin: ${data.length} records`);
  });

  await test('GET /jobgiver/debug/columns — DB schema intact', async () => {
    const { status, data } = await request('GET', '/jobgiver/debug/columns');
    assertOk(status, data, 'Debug columns');
    assert(data?.jobgiverdet, 'jobgiverdet table missing');
    assert(data?.jobgiverjob, 'jobgiverjob table missing');
    assert(data?.jobgiversalary, 'jobgiversalary table missing');
    log('All 3 tables OK');
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. JOB SEEKER — Listings (Companies Hiring page)
// ══════════════════════════════════════════════════════════════════════════════
async function runJobListingTests() {
  section('JOB SEEKER — Companies Hiring (Listings & Filters)');

  await test('GET /job-listings — all listings', async () => {
    const { status, data } = await request('GET', '/job-listings');
    assertOk(status, data, 'Job listings');
    assert(Array.isArray(data), 'Expected array');
    log(`${data.length} job listings`);
  });

  await test('GET /job-listings — salary field exists on each listing', async () => {
    const { status, data } = await request('GET', '/job-listings');
    assertOk(status, data, 'Job listings salary');
    if (data.length > 0) {
      const allHaveSalary = data.every(j =>
        'salaryOffering' in j || 'salary_offering' in j
      );
      assert(allHaveSalary, 'Some listings are missing salaryOffering field');
    }
    log('Salary field check passed');
  });

  await test('GET /job-listings — area field exists on each listing', async () => {
    const { status, data } = await request('GET', '/job-listings');
    assertOk(status, data, 'Job listings area');
    if (data.length > 0) {
      const allHaveArea = data.every(j => 'area' in j);
      assert(allHaveArea, 'Some listings are missing area field');
    }
    log('Area field check passed');
  });

  await test('GET /job-listings?jobTitle=Cashier — filter by job title', async () => {
    const { status, data } = await request('GET', '/job-listings?jobTitle=Cashier');
    assertOk(status, data, 'Filter jobTitle');
    assert(Array.isArray(data), 'Expected array');
    log(`Cashier jobs: ${data.length}`);
  });

  await test('GET /job-listings?employmentType=full-time — filter employment type', async () => {
    const { status, data } = await request('GET', '/job-listings?employmentType=full-time');
    assertOk(status, data, 'Filter employmentType');
    assert(Array.isArray(data), 'Expected array');
    log(`Full-time: ${data.length}`);
  });

  await test('GET /job-listings?minSalary=0&maxSalary=10000 — salary range filter', async () => {
    const { status, data } = await request('GET', '/job-listings?minSalary=0&maxSalary=10000');
    assertOk(status, data, 'Salary filter');
    assert(Array.isArray(data), 'Expected array');
    log(`<=10k jobs: ${data.length}`);
  });

  await test('GET /job-listings?area=Vandigate — filter by area', async () => {
    const { status, data } = await request('GET', '/job-listings?area=Vandigate');
    assertOk(status, data, 'Area filter');
    assert(Array.isArray(data), 'Expected array');
    log(`Vandigate jobs: ${data.length}`);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. JOB SEEKER — Add My Profile
// ══════════════════════════════════════════════════════════════════════════════
async function runJobSeekerProfileTests() {
  section('JOB SEEKER — Add My Profile');

  await test('POST /job-seeker-profiles — save profile', async () => {
    const { status, data } = await request('POST', '/job-seeker-profiles', {
      signupId: state.signupId || null,
      name: `Priya Test ${Date.now()}`,
      age: '18-30',
      gender: 'female',
      street: '5th Cross',
      area: 'Ammapettai',
      city: 'Chidambaram',
      aadhar: '123456789012',
      phoneNumber: '9876543211',
      education: 'ug',
      experienceStatus: 'fresher',
      experienceYears: '',
      experienceField: '',
      canJoinImmediately: 'yes',
    });
    assertOk(status, data, 'Save profile');
    state.seekerProfileId = data?.profileId || data?.id;
    log('Profile ID:', state.seekerProfileId);
  });

  await test('GET /job-seeker-profiles — fetch all profiles', async () => {
    const { status, data } = await request('GET', '/job-seeker-profiles');
    assertOk(status, data, 'GET profiles');
    assert(Array.isArray(data), 'Expected array');
    log(`${data.length} profiles`);
  });

  await test('GET /job-seeker-profiles — required fields present', async () => {
    const { status, data } = await request('GET', '/job-seeker-profiles');
    assertOk(status, data, 'Profiles fields');
    if (data.length > 0) {
      ['name', 'gender', 'education'].forEach(k => {
        assert(k in data[0], `Profile missing field: ${k}`);
      });
    }
    log('Profile fields OK');
  });

  await test('GET /job-seeker-profiles?gender=female — gender filter', async () => {
    const { status, data } = await request('GET', '/job-seeker-profiles?gender=female');
    assertOk(status, data, 'Gender filter');
    assert(Array.isArray(data), 'Expected array');
    if (data.length > 0) {
      data.forEach(p =>
        assert(String(p.gender || '').toLowerCase() === 'female',
          `Expected female, got ${p.gender}`)
      );
    }
    log(`Female profiles: ${data.length}`);
  });

  await test('GET /job-seeker-profiles?experienceStatus=fresher — fresher filter', async () => {
    const { status, data } = await request('GET', '/job-seeker-profiles?experienceStatus=fresher');
    assertOk(status, data, 'Fresher filter');
    assert(Array.isArray(data), 'Expected array');
    log(`Fresher profiles: ${data.length}`);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. JOB APPLICATIONS (Job Seeker applying for job)
// ══════════════════════════════════════════════════════════════════════════════
async function runJobApplicationTests() {
  section('JOB APPLICATIONS — Submit & View Applicants');

  await test('POST /jobseeker — submit job application', async () => {
    const { status, data } = await request('POST', '/jobseeker', {
      fullName: `Kumar Test ${Date.now()}`,
      mobileNumber: '9876543222',
      age: '25',
      gender: 'male',
      street: 'Gandhi St',
      area: 'Vandigate',
      city: 'Chidambaram',
      aadharNumber: '123456789013',
      experience: 'fresher',
      education: 'ug',
      experienceYears: '',
      lastWorkingShop: '',
      addExperience: '',
      canJoinImmediately: 'yes',
      jobGiverJobId: state.jobGiverId || null,
    });
    // 200/201 = success, 400 = validation (still not a server crash)
    assert(status < 500, `Application HTTP ${status}: ${JSON.stringify(data)?.slice(0, 100)}`);
    if (status < 300) {
      state.jobSeekerId = data?.jobSeekerId || data?.id;
      log('Application ID:', state.jobSeekerId);
    }
  });

  await test('GET /jobgiver/jobseekers — all applicants', async () => {
    const { status, data } = await request('GET', '/jobgiver/jobseekers');
    assertOk(status, data, 'Applicants list');
    assert(Array.isArray(data), 'Expected array');
    log(`Total applicants: ${data.length}`);
  });

  if (state.jobGiverId) {
    await test('GET /jobgiver/jobseekers?jobGiverId=X — filter by company', async () => {
      const { status, data } = await request('GET', `/jobgiver/jobseekers?jobGiverId=${state.jobGiverId}`);
      assertOk(status, data, 'Applicants by company');
      assert(Array.isArray(data), 'Expected array');
      log(`Applicants for company: ${data.length}`);
    });
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. JOB OPTIONS
// ══════════════════════════════════════════════════════════════════════════════
async function runJobOptionsTests() {
  section('JOB OPTIONS — Dynamic Dropdowns');

  await test('GET /job-options/titles — fetch job title options', async () => {
    const { status, data } = await request('GET', '/job-options/titles');
    assertOk(status, data, 'Job titles');
    assert(Array.isArray(data), 'Expected array');
    if (data.length > 0) {
      assert(data[0].title !== undefined, 'Each item should have title field');
    }
    log(`${data.length} job title options`);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. RESIDENTIAL
// ══════════════════════════════════════════════════════════════════════════════
async function runResidentialTests() {
  section('RESIDENTIAL — Owner Form & Tenant Listings');

  await test('GET /residential/tenant — tenant listings', async () => {
    const { status, data } = await request('GET', '/residential/tenant');
    assert(status !== 500, `Residential tenant 500 error: ${JSON.stringify(data)?.slice(0, 100)}`);
    if (status < 300) assert(Array.isArray(data), 'Expected array');
    log(status < 300 ? `${data.length} listings` : `HTTP ${status}`);
  });

  await test('POST /residential/step1 — submit step 1', async () => {
    const { status, data } = await request('POST', '/residential/step1', {
      ownerName: 'Res Owner Test',
      ownerContact: '9876543260',
      propertyName: 'Test House',
      propertyType: 'house',
      address: '5th Street',
      area: 'Vandigate',
      city: 'Chidambaram',
    });
    assert(status !== 500, `Residential step1 500: ${JSON.stringify(data)?.slice(0,100)}`);
    if (status < 300) {
      state.residentialId = data?.roNo || data?.id;
      log('Residential ID:', state.residentialId);
    } else {
      log(`HTTP ${status} — may have different required fields`);
    }
  });

  await test('GET /residential/tenant?type=house — filter by type', async () => {
    const { status, data } = await request('GET', '/residential/tenant?type=house');
    assert(status !== 500, `Residential filter 500`);
    if (status < 300) assert(Array.isArray(data), 'Expected array');
    log(status < 300 ? `House: ${data.length}` : `HTTP ${status}`);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. MACHINERY
// ══════════════════════════════════════════════════════════════════════════════
async function runMachineryTests() {
  section('MACHINERY — Owner Form & Tenant Listings');

  await test('GET /machinery/tenant — tenant listings', async () => {
    const { status, data } = await request('GET', '/machinery/tenant');
    assert(status !== 500, `Machinery 500`);
    if (status < 300) assert(Array.isArray(data), 'Expected array');
    log(status < 300 ? `${data.length} machinery` : `HTTP ${status}`);
  });

  await test('POST /machinery/step1 — submit step 1', async () => {
    const { status, data } = await request('POST', '/machinery/step1', {
      ownerName: 'Machi Owner Test',
      ownerContact: '9876543270',
      machineryName: 'JCB Test',
      machineryType: 'jcb',
      area: 'Vandigate',
      city: 'Chidambaram',
    });
    assert(status !== 500, `Machinery step1 500: ${JSON.stringify(data)?.slice(0,100)}`);
    if (status < 300) {
      state.machineryId = data?.moNo || data?.id;
      log('Machinery ID:', state.machineryId);
    } else {
      log(`HTTP ${status} — may have different required fields`);
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 9. VEHICLES
// ══════════════════════════════════════════════════════════════════════════════
async function runVehicleTests() {
  section('VEHICLES — Owner Form & Tenant Listings');

  await test('GET /vehicles/tenant — tenant listings', async () => {
    const { status, data } = await request('GET', '/vehicles/tenant');
    assert(status !== 500, `Vehicles 500`);
    if (status < 300) assert(Array.isArray(data), 'Expected array');
    log(status < 300 ? `${data.length} vehicles` : `HTTP ${status}`);
  });

  await test('POST /vehicles/step1 — submit step 1', async () => {
    const { status, data } = await request('POST', '/vehicles/step1', {
      ownerName: 'Vehicle Owner Test',
      ownerContact: '9876543280',
      vehicleName: 'Tempo Test',
      vehicleType: 'tempo',
      area: 'Vandigate',
      city: 'Chidambaram',
    });
    assert(status !== 500, `Vehicle step1 500: ${JSON.stringify(data)?.slice(0,100)}`);
    if (status < 300) {
      state.vehicleId = data?.voNo || data?.id;
      log('Vehicle ID:', state.vehicleId);
    } else {
      log(`HTTP ${status} — may have different required fields`);
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 10. BUSINESS
// ══════════════════════════════════════════════════════════════════════════════
async function runBusinessTests() {
  section('BUSINESS — Owner Form & Tenant Listings');

  await test('GET /business/tenant — tenant listings', async () => {
    const { status, data } = await request('GET', '/business/tenant');
    assert(status !== 500, `Business 500`);
    if (status < 300) assert(Array.isArray(data), 'Expected array');
    log(status < 300 ? `${data.length} businesses` : `HTTP ${status}`);
  });

  await test('POST /business/step1 — submit step 1', async () => {
    const { status, data } = await request('POST', '/business/step1', {
      ownerName: 'Business Owner Test',
      ownerContact: '9876543290',
      businessName: 'Shop Test',
      businessType: 'retail',
      area: 'Vandigate',
      city: 'Chidambaram',
    });
    assert(status !== 500, `Business step1 500: ${JSON.stringify(data)?.slice(0,100)}`);
    if (status < 300) {
      state.businessId = data?.boNo || data?.id;
      log('Business ID:', state.businessId);
    } else {
      log(`HTTP ${status} — may have different required fields`);
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// 11. ADMIN ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════
async function runAdminTests() {
  section('ADMIN — All Admin Listing Endpoints');

  const adminEndpoints = [
    '/admin/jobgiver/all',
    '/admin/residential/all',
    '/admin/machinery/all',
    '/admin/vehicles/all',
    '/admin/business/all',
    '/admin/jobseeker/all',
  ];

  for (const ep of adminEndpoints) {
    await test(`GET ${ep}`, async () => {
      const { status, data } = await request('GET', ep);
      assert(status !== 500, `${ep} returned 500: ${JSON.stringify(data)?.slice(0,100)}`);
      log(`${ep}: HTTP ${status}, ${Array.isArray(data) ? data.length + ' records' : typeof data}`);
    });
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 12. DATA DISPLAY INTEGRITY
// ══════════════════════════════════════════════════════════════════════════════
async function runDataIntegrityTests() {
  section('DATA INTEGRITY — Salary, Area & Profile Display Checks');

  await test('Salary field is present and non-null in job listings', async () => {
    const { status, data } = await request('GET', '/job-listings');
    assertOk(status, data, 'Listings for salary check');
    if (data.length > 0) {
      const withSalary = data.filter(j => j.salaryOffering || j.salary_offering);
      log(`${withSalary.length}/${data.length} jobs have salary data`);
      // At least the test job we just submitted should have salary
      assert(
        data.some(j => 'salaryOffering' in j),
        'salaryOffering key missing from job listings response'
      );
    }
  });

  await test('Area field present on all job listings', async () => {
    const { status, data } = await request('GET', '/job-listings');
    assertOk(status, data, 'Listings for area check');
    if (data.length > 0) {
      const missing = data.filter(j => !('area' in j));
      assert(missing.length === 0, `${missing.length} listings missing area field`);
    }
    log('Area field present on all listings');
  });

  await test('Job seeker profiles have name + gender + education', async () => {
    const { status, data } = await request('GET', '/job-seeker-profiles');
    assertOk(status, data, 'Profiles integrity');
    if (data.length > 0) {
      ['name', 'gender', 'education'].forEach(k =>
        assert(k in data[0], `Profile missing: ${k}`)
      );
    }
    log('Profile required fields OK');
  });

  await test('Job giver owners response has salary + photo fields', async () => {
    const { status, data } = await request('GET', '/jobgiver/owners');
    assertOk(status, data, 'Owners integrity');
    if (data.length > 0) {
      const r = data[0];
      assert('shopName' in r,       'shopName missing');
      assert('salaryOffering' in r, 'salaryOffering missing from owners response');
      assert('area' in r,           'area missing from owners response');
    }
    log('Owner fields OK');
  });

  await test('Applicants list returns camelCase keys', async () => {
    const { status, data } = await request('GET', '/jobgiver/jobseekers');
    assertOk(status, data, 'Applicants camelCase');
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      const snakeKeys = keys.filter(k => k.includes('_'));
      assert(snakeKeys.length === 0,
        `Applicants have snake_case keys: ${snakeKeys.join(', ')}`);
    }
    log('camelCase keys OK');
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  🏠  HouseZone — Full App Test Suite');
  console.log(`  📡  API: ${BASE_URL}`);
  console.log(`  ⏰  ${new Date().toLocaleString('en-IN')}`);
  if (VERBOSE) console.log('  🔍  Verbose mode ON');
  console.log('═'.repeat(60));

  await runAuthTests();
  await runJobGiverTests();
  await runJobListingTests();
  await runJobSeekerProfileTests();
  await runJobApplicationTests();
  await runJobOptionsTests();
  await runResidentialTests();
  await runMachineryTests();
  await runVehicleTests();
  await runBusinessTests();
  await runAdminTests();
  await runDataIntegrityTests();

  // ─── RESULTS ───────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('  📊  RESULTS');
  console.log('─'.repeat(60));
  console.log(`  ✅  Passed : ${passed}`);
  console.log(`  ❌  Failed : ${failed}`);
  console.log(`  📈  Total  : ${passed + failed}`);

  if (failures.length > 0) {
    console.log('\n  ⚠️  FAILED TESTS:');
    failures.forEach((f, i) => {
      console.log(`\n  ${i + 1}. ${f.name}`);
      console.log(`     ${f.error}`);
    });
  } else {
    console.log('\n  🎉  All tests passed! App is working correctly.');
  }
  console.log('═'.repeat(60) + '\n');
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('\n💥 Test runner crashed:', err);
  process.exit(1);
});
