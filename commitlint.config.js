// match format like "[MQ-1309] feat(layout): layout setup"
const matchOptionalTicketNumberWithSpaceAfter = /(?:\[(\w+-\d+)\]\s)?/; // "[MQ-1309] ", "[MQ-1]", optional
const matchType = /(\w+)/; // "feat", "fix", etc., non-optional
const matchOptionalScope = /(?:\(([\w\$\.\-\* ]*)\))?\:/; // "(layout):", optional
const matchSubject = /( .+)/; // " layout setup", non-optional

module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: new RegExp(
        "^" +
          matchOptionalTicketNumberWithSpaceAfter.source +
          matchType.source +
          matchOptionalScope.source +
          matchSubject.source +
          "$"
      ),
      headerCorrespondence: ["jira_id", "type", "scope", "subject"]
    }
  },
  plugins: [
    {
      rules: {
        "header-match-team-pattern": (parsed) => {
          const { type, subject } = parsed;

          if (!type || !subject) {
            return [false, "header must be in format '[jira_id]? type(scope)?: subject' ? is optional"];
          }

          return [true, ""];
        }
      }
    }
  ],
  rules: {
    "header-match-team-pattern": [2, "always"],
    "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore"]]
  }
};
