const { encode } = require('./encoder');

describe('Encoder', () => {
  test("returns an encoder", () => {
    const models = ["gpt-4o", "gpt-4", "gpt-3.5-turbo", "davinci", "text-davinci-edit-001", "gpt2"]

    for (const model of models) {
      const tokens = encode("this is a sentence", model);
      expect(tokens).not.toBeUndefined();
      expect(tokens.length).toBeGreaterThan(0);
    }
  });
});
