#### Фабрика (непонял немного с абстрактными и нет вернуть позже)

Представляет собой класс/функцию/метод который будет помогать создавать нам определенные объекты на основании каких-либо входных данных.

```javascript
class BmwFactory {
  constructor(model, price, maxSpeed) {
    this.model = model;
    this.price = price;
    this.maxSpeed = maxSpeed;
  }
}
```

#### Фабричный метод

Уже содержит все необходимые данные для создания объектов в фабрике.
Но может требовать тип объекта который надо создать.

```javascript
class BmwFactoryMethod {
  create(type) {
    if (type === "X5") return new Bmw(type, 108000, 300);
    if (type === "X6") return new Bmw(type, 111000, 320);
  }
}
```

<span style="font-size: 12px;">Фабричный метод --- Логистика</span>
![[Pasted image 20241007153616.png]]

#### Структура

![[Pasted image 20241007160959.png]]

### Минусы

При большом количестве создаваемых объектов структура начнет разрастаться.
Эту проблему поможет решить [[Abstract Factory Method]].

![[Pasted image 20241007161425.png]]

###### _Пример фабричного метода:_

```javascript
class BmwFactory {
  constructor(model, price, maxSpeed) {
    this.model = model;
    this.price = price;
    this.maxSpeed = maxSpeed;
  }
}
```

```javascript
class BmwFactoryMethod {
  create(type) {
    if (type === "X5") return new Bmw(type, 108000, 300);
    if (type === "X6") return new Bmw(type, 111000, 320);
  }
}
```

```javascript
const bmw_x5 = BmwFactoryMethod("X5");
const bmw_x6 = BmwFactoryMethod("X6");
```

```javascript
// Фабрика
class АвтомобильнаяФабрика {
  создатьАвтомобиль(марка, модель) {
    // создать автомобиль
  }
}

// Фабричный метод
class АвтомобильныйФабричныйМетод {
  создатьАвтомобиль(тип) {
    // создать автомобиль
  }
}
```

###### _Пример фабрики (**Effector**):_

```javascript
export const marginModelFactory = () => {
	/** Events */
    const resetMargin = createEvent();
    const getMargin = createEvent<MarginPayload>();
    const MarginGate = createGate<MarginPayload>();

    /** Effects */
    const getMarginFx = createEffect(
        withAbortController(async ({ email, rate }: MarginPayload) => {
            const { data } = await api.employee.getMargin({ email, rate });
            return data;
        }),
    );

    /** Stores */
    const $margin = createStore<Nullable<number>>(null);
    const $errorMessage = createStore<Nullable<string>>(null);

    /** Connections */
    sample({
        clock: MarginGate.state,
        filter: ({ email, rate }) => Boolean(email && rate),
        target: getMargin,
    });
    split({
        source: getMargin,
        match: {
            isValid: ({ rate }) => Number(rate) > 0,
            isNotValid: ({ rate }) => Number(rate) <= 0,
        },
        cases: {
            isValid: getMarginFx,
            isNotValid: resetMargin,
        },
    });
    sample({
        clock: getMarginFx.failData,
        fn: (error) => {
            const code = getErrorCode(error) as AvailableMessages;
            const message = errorMessages[code] ?? 'Произошла ошибка...';
            return message;
        },
        target: $errorMessage,
    });
    sample({
        clock: getMarginFx.doneData,
        fn: ({ margin }) => margin,
        target: $margin,
    });
    reset({
        clock: [resetMargin, MarginGate.close],
        target: $margin,
    });

    /** Exports */
    return {
        $margin,
        $errorMessage,
        MarginGate,
    };
};
```

```javascript
export const Margin = ({ userId, rate }: MarginProps) => {
  const email = useGetUserById(Number(userId))?.email ?? "";
  const model = useMemo(marginModelFactory, []);
  const [margin, errorMessage] = useUnit([model.$margin, model.$errorMessage]);
  useGate(model.MarginGate, { email, rate });

  return (
    <Condition
      value={margin}
      then={
        <Typography fontWeight="normal">{getMarginText(margin)}</Typography>
      }
      else={
        <Typography fontSize="xs" color="red">
          {errorMessage}
        </Typography>
      }
    />
  );
};
```

Теперь где бы мы ни добавили компонент `Margin` у него будет своя `model`.
Нам достаточно использовать: `<Margin />` и все. У него создаться своя локальная модель при инициализации компонента.

Можно создать хоть 10000 `<Margin />` и они не будут связаны между собой.
![[Pasted image 20241007144442.png]]
