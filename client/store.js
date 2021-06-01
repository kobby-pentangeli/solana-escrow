const path = require('path');
const fs = require('fs');

const DIR = path.join(__dirname, '../store');

module.exports = {

  /**
   * Return store location
   */
  location: () => DIR,

  /**
   * Load data
   */
  load: (filename) => {
    try {
      filename = path.join(DIR, filename + '.json');
      const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
      return data;
    } catch (er) {
      return null;
    }
  },

  /**
   * Save data
   */
  save: (filename, data) => {
    try {
      fs.mkdirSync(DIR);
    } catch (er) {
      // Nothing
    }
    filename = path.join(DIR, filename + '.json');
    data = JSON.stringify(data, null, 2);
    return fs.writeFileSync(filename, data, 'utf8');
  }
}
