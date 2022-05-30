# 3장: this

# “ 상황에 따라 달라지는 this..”

### this === 어떤 맥락(context)를 바라보고 있다

- 실행 컨텍스트가 생성될 때 함께 결정된다
    
    = 함수가 호출될 때 
    

## ✅ 엄격모드에서의 this

**[The Strict Mode of ECMAScript](http://www.ecma-international.org/ecma-262/#sec-strict-mode-of-ecmascript)**

|  | 비엄격 모드 | 엄격 모드 |
| --- | --- | --- |
| this가 undefined or null | this에 전역 객체 바인딩 | 바인딩 하지 않음 |
| this가 원시값이라면 | autoboxing 수행 | 수행하지 않음(원시값 그대로를 가진다) |

```jsx
// this 값이 undefined인 경우

function nonStrictFunc() { 
    return this; 
}
function strictFunc() {
    'use strict'; // 함수 단위의 엄격모드 설정
    return this; 
}

console.log(nonStrictFunc() === window); // true
console.log(strictFunc() === window); // 
console.log(strictFunc()); // undefined

// this 값이 원시값인 경우
console.log(nonStrictFunc.bind('123')()); //  String{'123'}
console.log(strictFunc.bind('123')()); // '123'

// Function.prototype.call인 경우
console.log(nonStrictFunc.call('123') === '123'); // false
console.log(strictFunc.call('123') === '123'); // true
```

**➕ 오토박싱(Auto-Boxing)이란?**

- 특정한 원시타입에서 프로퍼티나 메소드를 호출하려 할 때, 자바스크립트는 처음으로 이것을 임시 래퍼 오브젝트로 바꾼 뒤에 프로퍼티나 메소드에 접근한다
- 이 때 오류가 발생하지 않는다. 원시 타입은 프로퍼티를 가질 수 없는데도 말이다. 왜냐하면 프로퍼티를 할당할 때 잠시 원시 타입을 이용한 `Wrapper Object(래퍼 오브젝트)`를 만들고 거기에 할당하기 때문이다
- 이 때문에 몇몇 원시 타입들 (Strings, Numbers, Booleans) 는 Object(객체)처럼 동작한다

```jsx
//호출
const foo = "bar";
foo.length; // 3
foo === "bar"; // true

//할당
const foo = 42;
foo.bar = "baz"; // Assignment done on temporary wrapper object
foo.bar; // undefined
```

## 전역 공간에서의 this

- 전역 객체를 가리킨다
- 전역 컨텍스트를 생성하는 주체가 전역 객체이기 때문에
- 브라우저에서는 window, Node.js에서는 global이다

**전역 변수를 선언하면?** 

- 전역객체(LexicalEnvironment)의 프로퍼티로 할당한다
- 그래서 window, this의 a 모두 값이 1인 것 (a는 앞에 window.이 생략된 형태로 봐도 된다)

```jsx
var a = 1;
console.log(a)
console.log(window.a)
console.log(this.a)
```

- 삭제: 전역변수는 삭제가 안되고, 프로퍼티는 삭제가 된다 *(근데 이유는..?)*

```jsx
var a = 1;
delete window.a
console.log(a, window.a, this.a) // 1 1 1

window.c = 3
delete window.c
console.log(c, window.c, this.c) // c is not defined
```

## 함수 안에서 쓴 this

: 함수는 그 자체로 독립적인 기능을 수행한다

- 함수 안에서 this는 window이다

```jsx
function myFunction() {
  return this;
}
console.log(myFunction()); //Window
```

- “use strict”에서는 undefined이다 (위에와 연결되는 내용)

```jsx
"use strict";
 
function myFunction() {
  return this;
}
console.log(myFunction()); //undefined
```

### ✅ 상위 this를 활용하고 싶을 때 (우회법)

1. self
2. 화살표 함수 사용하기 

## 메서드 안에서 쓴 this

: 자신을 호출한 대상 객체에 관한 동작을 수행한다

- 메서드로 호출되면 호출한 객체가 this가 된다

```jsx
var func = function(x) {
	console.log(this.x)
}

func(1) // Window. { ...}

var obj = {
	method: func
}

obj.method(2)  // {method: f }  2
```

## 생성자 안에서 쓴 this

: 생성자 함수가 생성하는 객체로 this가 바인딩

```jsx
function Person(name) {
  this.name = name;
}
 
var kim = new Person('kim');
var lee = new Person('lee');
 
console.log(kim.name); //kim
console.log(lee.name); //lee
```

‼️ ’new’ 키워드 빼먹으면 일반 함수 호출이기 때문에 this가 window에 바인딩 된다

```jsx
var name = 'window';
function Person(name) {
  this.name = name;
}
 
var kim = Person('kim');
 
console.log(window.name); //kim
```

## 이벤트 핸들러 안에서 쓴 this

: 이벤트 핸들러에서 this는 이벤트를 받는 HTML 요소를 가리킨다

```jsx
var btn = document.querySelector('#btn')
btn.addEventListener('click', function () {
  console.log(this); //#btn
});
```

---

# 명시적 바인딩: **apply | call | bind**

- 모두 `Function.prototype`의 메서드로, 함수가 상속받아 사용할 수 있다
→ 인자를 this로 만들어주는 기능을 한다
- apply, call
    - 본질적인 기능은 함수를 호출하는 것이다
    - 인수를 전달하는 방식만 다르고 동일하게 동작한다

## apply

- `function.apply(thisArg, argArray)` 형태로 메서드를 사용한다.
- 호출할 함수의 인수를 배열로 묶어 전달한다
그 **배열의 요소들을 호출할 함수의 매개변수로 지정**한다
- thisArg를 인자로 넘긴 객체를 명시적으로 바인딩하고, argArray로 넘긴 인자를 함수 내부로 넘긴 인자로 인식하여 사용한다.

```jsx
var func = function (a, b, c){
	console.log(this, a, b, c);
}

func.apply({x: 1}, [4, 5, 6]); // {x : 1} 4 5 6

var obj = {
	a: 1,
    method: function(x, y) {
    	console.log(this.a, x, y);
    }
};
obj.method.apply({ a: 4 }, [5, 6]); //4 5 6
출처: https://overcome-the-limits.tistory.com/348 [Plus Ultra:티스토리]
```

## call

- 호출할 함수의 인수를 쉼표로 구분한 리스트 형식으로 전달한다

## bind

---

참고 글

[https://nykim.work/71](https://nykim.work/71)
