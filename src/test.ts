interface MyAdd {
  a: number;
  b: number;
}

class MyAAA {
  private config: MyAdd = {
    a: 10,
    b: 20,
  };

  constructor(config?: Partial<MyAdd>) {
    this.config = Object.assign(this.config, config);
  }

  public get num(): number {
    return this.config.a;
  }
}

const aaa = new MyAAA({ a: 99 });

console.log(aaa);
