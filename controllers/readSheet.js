// reads a user's sheet
const retrieveSheet = require("./retrieveSheet"),
  searchSheet = require("./searchSheet"),
  User = require("../models/user");

module.exports = (req, res, next) => {
  // If it's a search request, delegate to search handler
  if (req.query.search) {
    return searchSheet(req, res, next);
  }

  // Refresh user's access token if necessary
  User.refreshAccessCode(res.locals.sheetIdDbResult.userGoogleId).then(
    validUser => {
      const query = {
        sheet: req.params.sheet,
        offset: req.query.offset,
        limit: req.query.limit
      };

      // Pass the valid user and result to the function which reads and parses the sheets, so as to supply the googleId of the sheet with the appropriate OAuth details.
      retrieveSheet(validUser, res.locals.sheetIdDbResult, query)
        .then(data => {
          res.json(data);
        })
        .catch(next);
    }
  );
};
