# this

this는 실행 컨텍스트가 생성될 때 결정 == 함수를 호출할 때 결정된다.

## 전역공간에서의 this

전역 공간에서는 전역 컨텍스트를 생성하는 주체가 전역 객체이기 때문에
**this는 전역 객체**를 가리킨다.

```javascript
console.log(this); // window
console.log(window); // window

console.log(this === window); // true
```

\*Node.js 환경에서는 global을 가리킨다.

<br>

### 전역 변수와 전역 객체

전역 공간에서 `var`를 통해 변수를 선언하면 **전역 객체의 프로퍼티로 할당**된다.

```javascript
var a = 1;

console.log(a); // 1
console.log(window.a); // 1
console.log(this.a); // 1
```

<br>

전역 객체의 프로퍼티에 할당하는 것이 `var`로 선언한 것과 같게 동작하지만

**삭제 명령에서는 다르게 동작한다.**

```javascript
var a = 1;

delete this.a;
console.log(a, window.a, this.a); // 1 1 1

window.b = 10;

delete window.b;
console.log(b, window.b, this.b); // ReferenceError: b is not defined
```

처음부터 전역객체의 프로퍼티로 할당한 경우에는 삭제가 되지만

전역 변수로 선언한 경우에는 삭제가 되지 않는다는 차이점이 있다.

<br>

## 함수 내부에서의 this

함수는 전역에 선언된 일반 함수와 객체 안의 메소드로 크게 구분할 수 있다.

**일반 함수로써 호출할 경우 this는 전역 객체**를 가리킨다.

객체의 **메서드로서 호출할 경우 this는 호출한 메서드 앞의 객체**를 가리킨다.

```javascript
var func = function (x) {
  console.log(this, x); // window {} 1
};

func(1);

var obj = {
  method: func,
};

obj.method(2); // {method: ƒ} 2
```

this에는 호출한 주체에 대한 정보가 담기고 어떤 함수를 메서드로서 호출하는 경우

호출 주체는 함수(메서드)명 앞의 객체이다. (마지막 점 앞에 명시된 객체)

```javascript
var obj1 = {
  outer: function () {
    console.log(this); // obj1
    var innerFunc = function () {
      console.log(this); // window
    };
    innerFunc();

    var obj2 = {
      innerMethod: innerFunc,
    };
    obj2.innerMethod(); // obj2
  },
};

obj1.outer();
```

<br>

### 메서드 내부 함수에서 this를 우회하는 방법

ES5에서는 내부 함수에 this를 상속하는 방법이 없기 때문에
변수를 활용하여 우회하여 사용한다.

```javascript
var obj = {
  outer: function () {
    console.log(this); // obj
    var innerFunc1 = function () {
      console.log(this); // window
    };
    innerFunc1();

    var self = this; // 상위 스코프의 this를 저장
    var innerFunc2 = function () {
      console.log(self); // obj
    };
    innerFunc2();
  },
};

obj.outer();
```

<br>

### 콜백 함수 내부에서의 this

콜백함수는 함수의 제어권을 다른 함수에 넘겨준 함수를 의미하며,

콜백함수 역시 함수이기 때문에 this는 전역 객체를 가리킨다.

제어권을 받은 함수에서 콜백함수에 별도로 this가 될 대상을 지정한 경우 그 대상을 참조하게 된다.

```javascript
setTimeout(function () {
  console.log(this); // window
}, 300);

[1, 2, 3, 4, 5].forEach(function (x) {
  console.log(this); // window  x 5
});
```

`setTimeout`과 `forEach` 메서드는 콜백 함수를 호출할 때 대상이 될 this를 지정하지 않는다.

```javascript
document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector("#a").addEventListener("click", function (e) {
  console.log(this); // <button id="a">클릭</button>
});
```

`addEventListener`메서드는 콜백 함수를 호출할 때 자신의 this를 상속하도록 정의되어 있다.

.addEventListener앞의 querySelector("#a")가 this가 되는 것

<br>

### 생성자 함수 내부에서의 this

함수가 생성자 함수로써 호출된 경우 내부에서의 this는 곧 **새로 만들 인스턴스 객체** 자신이 된다.

```javascript
var Person = function (name, age) {
  this.name = name;
  this.age = age;
  this.greeting = function () {
    console.log(`저는 ${this.name} 입니다.`);
  };
};

var jay = new Person("Jay", 20);

console.log(jay); // {name: 'Jay', age: 20, greeting: ƒ}
jay.greeting(); // 저는 Jay 입니다.
```

<br>

## 명시적인 this 바인딩

명시적으로 this를 바인딩 하는 메서드로는 `call`, `apply`, `bind` 메서드가 있다.

### 1. call 메서드

`call` 메서드의 첫 번째 인자를 this로 바인딩 하고 이후의 인자들을 호출할 함수의 매개변수로 전달한다.
임의의 객체를 this로 지정할 수 있다.

```javascript
var obj = {
  a: 100,
  method: function (x, y) {
    console.log(this.a, x, y);
  },
};

var test = {
  a: 200,
};

obj.method(1, 2); // 100 1 2
obj.method.call(test, 2, 3); // 200 2 3
```

### 2. apply 메서드

`call`과는 기능적으로는 동일하지만 `apply`메서드는 두 번째 인자를 배열로 받고

그 배열의 요소들을 호출할 함수의 매개변수로 지정한다는 점에 차이가 있다.

```javascript
var obj = {
  a: 100,
  method: function (x, y) {
    console.log(this.a, x, y);
  },
};

var test = {
  a: 200,
};

obj.method(1, 2); // 100 1 2
obj.method.apply(test, [2, 3]); // 200 2 3
```

### 3. bind 메서드

`call`과 비슷하지만 즉시 호출하지 않고 넘겨받은 this 및 인수들을 바탕으로 새로운 함수를 반환한다.

함수에 this를 미리 적용하는 것과 부분 적용 함수를 구현하는 두 가지 목적을 가진다.

```javascript
var obj = {
  a: 100,
  method: function (x, y) {
    console.log(this.a, x, y);
  },
};

var bindFunc1 = obj.method.bind({ a: 200 });
bindFunc1(4, 5); // 200 4 5

var bindFunc2 = obj.method.bind({ a: 200 }, 4, 5);
bindFunc2(); // 200 4 5
```

`bind` 메서드를 적용해서 만든 함수의 name 프로퍼티에는 bound라는 접두어가 붙는다.

이를 통해 원본과 `bind`로 변경한 함수를 구분할 수 있다.

```javascript
function func1(x, y) {
  console.log(this.a, x, y);
}

var bindFunc = func1.bind({ a: 200 }, 4, 5);

console.log(func1.name); // func1
console.log(bindFunc.name); // bound func1
```

<br>

## call/apply/bind의 활용

### 1. 유사배열 객체에 배열 메서드 적용

키가 0 또는 양의 정수인 프로퍼티, length 프로퍼티의 값이 0 또는 양의 정수인 객체의 경우

call/apply 메서드를 통해 배열 메서드를 사용할 수 있다.

```javascript
var obj = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
};

Array.prototype.push.call(obj, "d");
console.log(obj); // {0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4}
```

### 2. 유사배열 객체를 배열로 전환

ES5의 환경에서 유사배열 객체를 배열로 전환하는데에 사용할 수 있다.

> ES6에서는 유사 배열 객체나 반복 가능한 객체를 배열로 반환하는 Array.from이 도입되어
> 의도를 파악하기 쉽게 작성할 수 있게 되었다.

```javascript
function a() {
  console.log(arguments); // Arguments(3) [1, 2, 3, callee: ƒ, Symbol(Symbol.iterator): ƒ]
  console.log(Array.prototype.slice.call(arguments)); // [1, 2, 3]
  console.log(Array.from(arguments)); // [1, 2, 3]
}

a(1, 2, 3);
```

### 3. 생성자 내부에서 다른 생성자 호출

다른 생성자와 공통된 내용이 있을 경우 call/apply를 이용하여 반복을 줄일 수 있다.

```javascript
function Animal(name, age) {
  this.name = name;
  this.age = age;
}

function Cat(name, age, bark) {
  Animal.call(this, name, age);
  this.bark = bark;
}

var nabi = new Cat("nabi", 5, "야옹");

console.log(nabi); // Cat {name: 'nabi', age: 5, bark: '야옹'}
```

### 4. 상위 스코프의 this 전달

`call`, `apply`, `bind` 메서드를 사용한다면 변수를 활용한 우회법보다
깔끔하게 처리할 수 있다.

```javascript
var obj = {
  outer: function () {
    console.log(this); // obj

    var innerFunc1 = function () {
      console.log(this); //obj
    }.bind(this);
    innerFunc1();

    var innerFunc2 = function () {
      console.log(this); // obj
    };
    innerFunc2.call(this);
  },
};

obj.outer();
```

<br>

## 화살표 함수

ES6에서 함수 내부의 this가 전역 객체를 바라보는 문제점을 보완하기 위해 새로 도입되었다.

화살표 함수는 실행 컨텍스트를 생성할 때 **this 바인딩 과정 자체가 빠지게 되어**

**상위 스코프의 this를 그대로 활용**할 수 있다. (스코프 체인상 가장 가까운 this)

```javascript
var obj = {
  outer: function () {
    console.log(this); // obj

    var innerFunc1 = () => {
      console.log(this); //obj
    };
    innerFunc1();

    var innerFunc2 = () => {
      console.log(this); // obj
    };
    innerFunc2();
  },
};

obj.outer();
```

call, apply, bind 메서드를 사용하는 것 보다 간결하게 작성할 수 있다.

<br>

## 별도의 인자로 this를 받는 경우

콜백 함수를 인자로 받는 메서드 중 일부는 추가로 this로 지정할 객체를
인자로 받아서 명시적인 바인딩을 해줄 수 있다.

**thisArg 값을 지정**하면 콜백 함수 내에서 this를 변경할 수 있다.

thisArg는 보통 내부 요소에 대해 같은 동작을 반복 수행하는 배열 메서드에서 지정할 수 있으며,

`Set`, `Map`에서도 지정할 수 있다.

```javascript
var obj = { name: "Hi" };

[1, 2, 3, 4, 5].forEach(function (x) {
  console.log(this); // {name: 'Hi'}  x 5
}, obj);
```

### thisArg를 인자로 받는 메서드

- forEach, map, filter, some, every, find, findIndex, flatMap, from

- Set.prototype.forEach

- Map.prototype.forEach

## Quiz

### 1. 콘솔에 출력될 결과를 맞춰보세요.

```javascript
function func() {
  console.log(this); // ?
}

func.bind(1);
```

### 2. 콘솔에 출력될 결과를 맞춰보세요.

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayName = () => {
    console.log(`${this.name} 입니다.`);
  };
}

const jay = new Person("Jay", "20");
const hoy = new Person("Hoy", "22");

hoy.sayName.call(jay); /// ?
```
