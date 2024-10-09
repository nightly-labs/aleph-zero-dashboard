const typesBundle = {
  spec: {
    'aleph-node': {
      runtime: {
        AlephSessionApi: [
          {
            methods: {
              yearly_inflation: {
                description: 'Returns inflation from now to now + one year.',
                params: [],
                type: 'Perbill',
              },
            },
            version: 1,
          },
        ],
      },
    },
  },
};

export default typesBundle;
