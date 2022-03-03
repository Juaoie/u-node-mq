interface FooParams {
  type: 'foo';
  value: string;
}

interface BarParams {
  type: 'bar';
  value: number;
}

type Params = FooParams | BarParams;

function test<TParams extends Params>(
  type: TParams['type'],
  value: TParams['value'],
): void {}

function test1<TType extends Params['type']>(
  type: TType,
  value: Extract<Params, {type: TType}>['value'],
): void {}


test1("foo","213")