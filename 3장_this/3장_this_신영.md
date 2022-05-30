# this란?

> 실행 컨택스트가 형성됐을 떄 결정됨

실행 컨택스트가 생성되면 this의 값을 바인딩해서 환경 정보로 저장합니다. 그런데 여기서 this의 값은 실행 컨텍스트가 어디서 어떻게 만들어 지는 지에 따라 상이합니다.

<br/>

## 1. 전역공간

> 전역 공간에서 this는 전역 객체를 의미

브라우저 환경에선 window, Node.js에선 global이 전역 객체를 의미하기 때문에 아래 코드를 각각 브라우저와 Node.js에서 찍어본다면 다음과 같은 결과가 출력될 것입니다.

- 브라우저

```js
console.log(this) // {alert: f(), atob: f(), blur: f(),...}
console.log(window) // {alert: f(), atob: f(), blur: f(),...}
console.log(this === window) //true
```

- Node.js

```js
console.log(this) // {alert: f(), atob: f(), blur: f(),...}
console.log(global) // {alert: f(), atob: f(), blur: f(),...}
console.log(this === global) //true
```

## 전역공간, this를 통해 변수에 접근하기

만약 전역 공간에 변수 a로 1를 할당하고 아래 코드를 실행하면 브라우저의 콘솔에는 어떤 값이 찍힐까요?

```js
var a = 1
console.log(a)
console.log(window.a)
console.log(this.a)
```

답은 모두 1입니다. 여기서 의문이 생길 수도 있습니다. a를 전역 객체에 등록한 게 아닌데 어째서 전역객체의 프로퍼티로 인식을 하는 걸까하고요. 이는 전역변수를 선언할 때 자바스크립트 엔진이 전역변수를 전역객체의 프로퍼티로 할당하고 있기 때문입니다. a앞에 window.을 생략했다고 볼 수 있습니다. 따라서 대부분의 경우 window의 프로퍼티에 값을 직접 할당하면 다음과 같이 전역변수의 값도 해당 값으로 변합니다.

```js
var a = 1
window.b = 2

console.log(a, window.a, this.a) // 1 1 1
console.log(b, window.b, this.b) // 2 2 2

window.a = 3
b = 4

console.log(a, window.a, this.a) // 3 3 3
console.log(b, window.b, this.b) // 4 4 4
```

### 예외: 삭제명령

> 전역 변수 선언과 전역 객체 프로퍼티가 달라

하지만 삭제 명령의 경우 결과가 다릅니다. 변수로 선언된 경우엔 값이 삭제가 되지 않고, 객체 프로퍼티로 할당한 경우엔 삭제가 됩니다.

```js
var a = 1
delete window.a // false
console.log(a, window.a, this.a) // 1 1 1

var b = 2
delete b // false
console.log(b, window.b, this.b) // 2 2 2

window.c = 3
delete window.c // true
console.log(c, window.c, this.c) // Uncaught ReferenceError: c is not defined
```

이는 전역변수 선언시 자바스크립트 엔진이 해당 프로퍼티의 configurable(변경, 삭제 가능성)값을 false로 정의해서 의도치 않은 변수 삭제를 막고있기 때문입니다.

<br/><br/>

## 2. 전역 공간이 아닐때

함수가 호출되면 새로운 실행 컨택스트가 만들어지고, 해당 함수의 스코프가 존재합니다. 이 경우 this는 어떤 객체를 가리키게 될까요? 일단 이 질문에 대해 답을 하기 전 함수의 호출 방식으로 구분지을 필요가 있습니다.

### 2.1 함수

> 함수를 독립적으로 호출

먼저 다음과 같이 함수를 호출한다면 console엔 다음과 같이 값이 출력됩니다.

```js
var func = function (x) {
  console.log(this, x) // window{...} 1
}
func(1)
```

독립적으로 호출이 가능한 상태일 때 우리는 함수를 메소드가 아닌 함수라고 하는데 이 때 호출 주체를 명시하지 않고 실행한 거라서 실행컨텍스트의 this엔 전역객체가 바인딩됩니다.

### 2.2 메서드

> 함수를 의존적으로 호출

메소드는 보통 객체의 프로퍼티에 할당된 함수라고 표현을 하는데 그보다 객체. 뒤에서만 의존적으로 호출이 가능한 함수라고 표현하는 게 더 정확합니다. 예로, 아까 만들어둔 func 함수와 똑같은 내용이라도, obj 객체의 method에 할당한 뒤 obj. 뒤에 붙여서 호출하면 메서드입니다.

```js
var func = function (x) {
  console.log(this, x) //{method: f} 1
}
func(1)

var obj = {
  method: func,
}

obj.method(1)
```

그리고 이땐 this는 전역객체가 아니라 메서드가 속한 객체입니다. 그래서 console엔 아까와 달리 {method: f} 1가 출력됩니다.

### 2.2.1 그렇다면 메서드 내부 메서드의 this는?

> 해당함수 앞에 붙는 객체

다음과 같이 obj객체 안에 메서드1과 내부 객체 inner가 존재하고 inner안에 또 메서드2가 존재한다고 했을 때 각각의 메서드를 호출해보도록 하겠습니다.

```js
var obj = {
  method1: function () {
    console.log(this)
  },
  inner: {
    method2: function () {
      console.log(this)
    },
  },
}

obj.method1() // {method1: f , inner:{...}}
obj.inner.method2() //{method2: f}
```

두 메서드 모두 this를 출력하는 데 메서드1의 this는 obj, 메서드2의 this는 inner 객체입니다. 즉, 메서드가 호출할 떄 의존하는 객체(.앞에 명시된 객체)가 this입니다.

### 2.2.2 메서드의 내부함수에서 this는?

> 호출 주체가 없다면 this는 전역객체다.

객체 obj 안에 메서드가 있고 해당 메서드를 호출하면 다음과 같이 내부 함수와 메소드를 실행할 때 각각의 this값은 다릅니다.

```js
var obj = {
  method: function () {
    console.log(this)

    var func = function () {
      console.log(this)
    }
    func()

    var obj2 = {
      method2: func,
    }
    obj2.method2()
  },
}

obj.method()
```

1. obj에 값이 할당된 후 obj.method로 객체의 메서드가 호출되면 실행컨텍스트가 만들어집니다.

2. 실행 컨택스트에 method 내부 호이스팅된 func, obj2 식별자와 외부환경 정보를 저장하고, this엔 method를 호출한 obj객체를 바인딩합니다.

3. 첫 번째 console.log(this)엔 2번에서 바인딩된 값 obj가 출력됩니다.

4. func에 익명함수가 할당되고 func 호출로 새로운 실행컨텍스트가 만들어집니다.

5. func를 호출한 주체가 없기 때문에 새로운 실행컨텍스트의 this엔 전역 객체가 바인딩됩니다.

6. 두 번째 console.log(this)엔 5번에서 바인딩된 값 window가 출력됩니다.

7. func로 만들어진 실행컨텍스트가 사라지고 obj2에 객체가 할당됩니다.

8. obj2.method2()로 새로운 실행컨텍스트가 생성되고 this엔 메서드2를 호출한 obj2 객체가 바인딩됩니다.

9. 여기서 method2의 값은 func이라서 아까와 마찬가지로 this를 콘솔에 출력하는데 이번엔 this가 obj2이기 때문에 같은 함수 코드라도 다른 값 obj2가 찍힙니다.

```js
var obj = {
  method: function () {
    console.log(this) //obj

    var func = function () {
      console.log(this) //window
    }
    func()

    var obj2 = {
      method2: func,
    }
    obj2.method2() //obj2
  },
}

obj.method()
```

### 2.2.3 내부 함수에 우회값 사용

> 외부의 this를 변수에 담아서 사용

만약 방금 전에 본 코드에서 func 함수 실행 시 console.log에 window가 아니라 obj가 찍히게 하려면 다음과 같이 method의 this를 변수 self에 담아서 self를 사용하면됩니다.

```js
var obj = {
  method: function () {
    console.log(this) //obj

    var self = this

    var func = function () {
      console.log(self) //obj
    }
    func()
  },
}

obj.method()
```

_this,that,_ 등의 변수명을 사용하는데 제일 자주 쓰이는 변수명은 self입니다.

<br/><br/>

# this에 특정값을 바인딩하려면?

> call, apply, bind 함수 사용

그렇다면 우회하지 않고 함수내 this에 특정값을 바인딩하려면 어떻게 할까요? 일단, 첫 번째로 call, apply함수를 통해 함수 호출시 this값을 지정해주는 방법이 있고 두 번째로 bind로 함수의 this에 특정값을 바인딩 후 해당 함수를 호출하는 방법이 있습니다.

## 1. call

> 함수.call(this,arg1,arg2,arg3,...)

call은 첫 번째 인자를 this에 바인딩하고 그다음 인자들은 함수의 매개변수로 사용합니다. call함수를 사용하는 순간 함수를 즉시 실행하기 때문에 별도의 함수 호출은 필요하지 않습니다.

### call 사용 예시

```js
var func = function (a, b) {
  console.log(this, a, b)
}

func(1, 2) // window 1 2
func.call({ x: 1 }, 1, 2) // {x:1} 1 2
```

함수를 그냥 호출하면 호출 주체가 없기 때문에 실행컨텍스트 환경 정보의 this엔 전역객체가 바인딩 됩니다. 반면 함수.call로 함수를 호출한 경우, this로 지정할 {x:1} 임의의 객체를 첫 번째 인자로 받기 때문에 전과 달리 this값이 {x:1}로 출력되는 걸 볼 수 있습니다.

## call 활용: 유사배열 객체

이런 특성을 활용하면 키가 0 또는 양의 정수인 프로퍼티가 존재하고 lenght 프로퍼티의 값이 0 또는 양의 정수인 유사배열 객체를 가지고 배열 메서드를 사용할 수 있습니다.

```js
var obj = {
  0: 'a',
  1: 'b',
  length: 2,
}

Array.prototype.push.call(obj, 'c') // 'c'를 다음 인덱스에 push

Array.prototype.slice.call(obj) // 얕은 복사  === Array.from(obj)
```

배열은 사실 키가 숫자인 객체의 형태고 length라는 프로퍼티와 메서드가 존재합니다. 따라서 obj를 call로 배열 프로토타입의 this로 지정해주면 배열처럼 메서드 사용이 가능합다.

1. Array.prototype.push.call(obj,'c')의 경우 ['a','b']에 push('c')를 하는 것이기 때문에 obj의 2프로퍼티엔 'c'가 추가되고 length 프로퍼티엔 3이 할당됩니다.

2. Array.prototype.slice.call(obj)은 ['a','b']에 slice()를 하는건데 slice는 매개변수로 잘라낼 시작인덱스, 마지막인덱스를 받는데 생략시 얕은 복사가
   됩니다.

### slice.call(obj) 대신 from(obj) 사용하기!

slice 메서드는 배열을 잘라내는 게 본래 목적입니다. 그러므로 얕은 복사를 할 땐 Array.from(obj)를 사용해서 코드의 의도를 분명히 해야 합니다.

> 문자열

문자열의 경우도 배열처럼 인덱스와 length 프로퍼티를 갖고 있기 때문에 call을 통해 배열의 메서드를 사용할 수 있습니다. 다만, 문자열은 length 프로퍼티가 읽기 전용이라 원본을 변경하는 (push,pop,shift,unshift,splice,...) 메서드는 에러를 던지고 concat처럼 대상이 반드시 배열인 경우는 제대로 된 결과를 얻을 수 없습니다.

```js
var str = 'ab cd'

Array.prototype.push.call(str, ' ef') // 에러
Array.prototype.concat.call(str, ' ef') // [String {'ab cd'}, ' ef']
Array.prototype.every.call(str, function (char) {
  char !== ' '
}) // false ' '이 한 번 존재함
Array.prototype.some.call(str, function (char) {
  char === ' '
}) // true ' '이 한 번 존재함
var newArr = Array.prototype.map.call(str, function (char) {
  return char + '/'
}) // ['a/','b/',' /','c/','d/']
```

> arguments, nodeList도 유사배열 객체

함수 내부에서 접근할 수 있는 arguments 객체도 유사배열 객체기 때문에 위 방법으로 배열로 전환해서 사용가능합니다. querySelectorAll, getElementsByClassName등의 nodeList를 반환하는 선택자들도 마찬가지입니다.

<br/>

## 2. apply

> 함수.apply(this,[argsArr])

apply 역시 call 처럼 첫 번째 인자를 함수의 this로 바인딩하고 함수를 즉시 호출한다는 점은 같지만 두 번째 인자를 배열로 받아 함수의 매개변수로 넘겨준다는 점이 다릅니다.

### apply 사용 예시

```js
var func = function (a, b) {
  console.log(this, a, b)
}

func(1, 2)
func.apply({ x: 1 }, [1, 2])
```

이처럼 배열로 인자를 넘겨줄 수 있다보니 함수의 매개변수가 여러개인 경우엔 apply를 사용하면 좋습니다. 위에 언급한 call의 활용 사례의 경우 매개변수가 하나라 call을 썼지만 다음의 경우엔 apply를 써봅니다.

```js
const fn = (a, b, c, d) => {
  console.log(a, b, c, d)
}

const debounde = function (fn, delay) {
  let timer = null
  if (timer) {
    clearTimeOut(timer)
  }
  return function () {
    const context = this
    const args = arguments // 넘기는 매개변수 [a,b,c,d]배열

    clearTimeout(timer)

    timer = setTimeout(fn.apply(context, args), delay)
  }
}
var str = 'abc'
var newArr = Array.prototype.reduce.apply(str, [
  function (acc, char, i) {
    return acc + char + i
  },
  '',
])
```

첫 번째는 디바운스 걸 함수 fn의 매개변수가 여러개일 때 arguments 유사배열 객체에 담긴 값들을 fn 함수에 한번에 넘기는 모습입니다. 두번째는 reduce 함수의 매개변수가 2개라 2개 값을 배열로 넘긴 모습입니다.

<br/>

## 3. bind

> 함수.bind(this,arg1,arg2,..) + 함수 호출

bind는 두 함수들과 달리 즉시 호출을 하지 않습니다. this에 임시 객체를 바인딩한 뒤 새로운 함수를 반환하는 게 전부라 bind로 만든 함수를 따로 호출해야 합니다. 즉, 함수에 this를 적용, 그리고 부분 적용함수를 구현하는 게 목적입니다.

```js
var func = function (a, b) {
  console.log(this, a, b)
}
func(1, 2) // window 1 2
var func2 = func.bind({ x: 1 })
func2(1, 2) // {x:1} 1 2
```

첫 번째 func(1, 2)와 두 번째 func2(1, 2)는 다른 결과를 도출합니다.

```js
console.log(func.name) //func
console.log(func2.name) //func2가 아니라 bound func
```

뿐만 아니라 함수의 name 프로퍼티도 각각 func, bound func로 다릅니다. 우리는 이를 통해 어떤 함수에서 bind를 썼는 지 추적할 수 있어서 apply나 call보다 원본과 변경된 함수를 구별하기 좋습니다.

### bind 활용 예시

self로 특정 this값을 사용하는 대신 bind로 this를 지정하면 더욱 깔끔한 코드를 작성할 수 있습니다. apply,call로도 작성가능하지만 bind 여부를 추적하고 싶은 경우 다음과 같이 작성하면 됩니다.

```js
var obj = {
  method: function () {
    console.log(this)

    var func = function () {
      console.log(this)
    }.bind(this)

    func() // func.call(this) || func.apply(this)도 가능
  },
}

obj.method()
```

이러면 아까처럼 self에 method의 this를 담아서 사용하지 않아도 func 내부의 console.log(this)에 obj가 찍힙니다.

<br/><br/>

## 4. 화살표 함수의 예외 사항

> lexical nesting structure 구조상 가장 가까운 this를 바인딩

ES6에 새로 도입된 화살표 함수는 실행 컨텍스트 생성시 this를 바인딩하는 과정이 제외됐습니다. 이 함수 내부엔 this가 없기에 접근하려하면 가장 가까운 스코프의 this를 가져다 씁니다.

```js
var obj = {
  method: function () {
    console.log(this)
    var func = function () {
      console.log(this)
    }
    var func2 = () => {
      console.log(this)
    }

    func() // window
    func2() // obj
  },
}
```

이러면 apply, call, bind로 this를 지정할 필요가 없어서 편리합니다.

<br/>

# 콜백함수 내부에서 this

> 별도의 인자가 있다면 해당값이 this, 없다면 전역객체

콜백함수를 인자로 받는 메서드 중 일부는 추가로 this로 지정할 객체를 인자로 받을 수 있습니다. 보통 배열 메서드에 많이 있는데 Set, Map에서도 찾아볼 수 있습니다. 대표적인 예는 다음과 같습니다.

```js
Array.prototype.forEach(callback함수, this)
Array.prototype.map(callback함수, this)
Array.prototype.filter(callback함수, this)
Array.prototype.some(callback함수, this)
Array.prototype.every(callback함수, this)
Array.prototype.find(callback함수, this)
Array.prototype.findIndex(callback함수, this)
Array.prototype.flatMap(callback함수, this)
Array.prototype.from(유사배열객체, callback함수, this)
Set.prototype.forEach(callback함수, this)
Map.prototype.forEach(callback함수, this)
```

<br/>

# 생성자 함수에서 this

> 생성자 함수로 만든 인스턴스

생성자 함수는 공통적인 특성의 객체를 찍어냅니다. 이 때 결과물을 인스턴스라고 하는데 해당 인스턴스의 this는 인스턴스 본인입니다.

```js
var Person = function (name, age) {
  this.name = name
  this.age = age
}

var young = new Person('junior', 1)
var old = new Person('senior', 100)

console.log(young) //{name: 'junior', age:1}
console.log(old) //{name: 'senior', age:100}
```

보시면 young 인스턴스 객체 내부의 this는 young이고, old 인스턴스 객체 내부의 this는 old입니다. 그리고 해당 생성자 함수를 또 다른 생성자 내부에서 new 키워드 없이 call,apply를 이용해 상속처럼 사용할 수도 있습니다.

```js
function Student(name, age, school) {
  Person.call(name, age)
  this.school = school
}

var student1 = new Student('hey', 20, 'university')
console.log(student1) //{name: 'hey', age:20, school: 'university'}
```

<br/><br/>

# 퀴즈

1. 콘솔 창의 출력 결과를 말하시오

```js
var func = function (a, b) {
  console.log(this, a, b)
}
var func2 = func.bind({ x: 1 })

console.log(func.name)
console.log(func2.name)
```

2. 메서드 내부 함수의 this값은 메서드의 this값과 같다(화살표 함수가 아닌 경우) (o,x)
