async function withRetry(fn, maxRetries = 3, delay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        console.log(`Retrying (${attempt}/${maxRetries})...`);
        if (attempt === maxRetries) throw error;
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  
  module.exports = withRetry;
  