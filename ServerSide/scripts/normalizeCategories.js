// One-time migration: normalize legacy lowercase category values to the
// canonical capitalized enum (work -> Work, personal -> Personal, urgent -> Urgent).
require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.collection('tasks');
  const map = { work: 'Work', personal: 'Personal', urgent: 'Urgent', important: 'Important' };
  let total = 0;
  for (const [from, to] of Object.entries(map)) {
    const res = await coll.updateMany({ category: from }, { $set: { category: to } });
    if (res.modifiedCount) console.log(`  ${from} -> ${to}: ${res.modifiedCount}`);
    total += res.modifiedCount;
  }
  console.log(`Normalized ${total} document(s).`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
