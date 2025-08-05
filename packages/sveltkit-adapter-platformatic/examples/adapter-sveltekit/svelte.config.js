import platformaticAdapter from 'sveltekit-adapter-platformatic';

const config = {
  kit: {
    adapter: platformaticAdapter()
  }
};

export default config;
