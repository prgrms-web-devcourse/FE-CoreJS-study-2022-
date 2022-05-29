# this란?

> 실행 컨택스트가 형성됐을 떄 결정됨

실행 컨택스트가 생성되면 this의 값을 바인딩해서 환경 정보로 저장합니다. 그런데 여기서 this의 값은 실행 컨텍스트가 어디서 어떻게 만들어 지는 지에 따라 상이합니다.

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

# this에 특정값을 바인딩하려면?
