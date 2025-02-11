import { NightlyConnectAdapter } from '@nightlylabs/wallet-selector-polkadot';

let _adapter: NightlyConnectAdapter | undefined;

export const getNCAdapter = async () => {
  try {
    if (_adapter) return _adapter;
    _adapter = await NightlyConnectAdapter.build(
      {
        appMetadata: {
          name: 'NC TEST AlephZero',
          description: 'Nightly Connect Test',
          icon: 'https://docs.nightly.app/img/logo.png',
          additionalInfo: 'Courtesy of Nightly Connect team',
        },
        network: 'AlephZero',
      },
      {}
    );

    return _adapter;
  } catch (error) {
    console.log(error);
    _adapter = undefined;
    return undefined;
  }
};
