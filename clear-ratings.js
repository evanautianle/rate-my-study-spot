const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rate-my-study-spot')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear all existing ratings to force new schema
    const result = await mongoose.connection.db.collection('spots').updateMany(
      {},
      { $unset: { ratings: 1 } }
    );
    
    console.log('Cleared ratings from', result.modifiedCount, 'spots');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
