export class Structure {

  constructor(readonly id: number,
              readonly title: string,
              readonly address: string,
              readonly distance: string,
              readonly icon: string,
              ) {
  }

  static Structure_001(): Structure {
    return new Structure(
      1,
      'Structure Name 1',
      'Address',
      '0.94 Km',
      'https://reactjs.org/logo-og.png',
    );
  }

  static Structure_002(): Structure {
    return new Structure(
      2,
      'Structure Name 2',
      'Address',
      '0.94 Km',
      'https://reactjs.org/logo-og.png',
    );
  }

  static Structure_003(): Structure {
    return new Structure(
      3,
      'Structure Name 3',
      'Address',
      '0.94 Km',
      'https://reactjs.org/logo-og.png',
    );
  }

  static Structure_004(): Structure {
    return new Structure(
      4,
      'Structure Name 4',
      'Address',
      '0.94 Km',
      'https://reactjs.org/logo-og.png',
    );
  }

}
