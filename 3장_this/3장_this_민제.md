# this

자바스크립트에서 this는 어디에서나 사용할 수 있다(클래스에서만 this를 사용하는 다른 언어들과 달리). 상황에 따라 this가 바라보는 대상이 달라지기 때문에 정확한 이해가 필요하다.

자바스크립트에서 this는 함수와 객체(메서드)를 구분하는 유일한 기능이다.

this를 쉽게 이해하기 위한 핵심은 '호출된 시점'인 것 같다.

## 상황에 따라 달라지는 this

this는 기본적으로 실행 컨텍스트가 생성될 때 함께 결정된다. 실행 컨텍스트 자체는 '함수를 호출'할 때 생성된다. 즉, 함수를 호출할 때 this가 바라볼 대상이 정해진다. 선언된 시점이 아니라 '호출할 때 결정'된다는 것에 유념해야 한다.

### 전역 공간에서의 this

전역 공간에 있는 this가 바라보는 대상은 전역 객체다.

* 브라우저 환경에서 전역 객체 : winodw
* Node.js 환경에서 전역 객체 : global

```js
// 전역 공간에서의 this(브라우저 환경)
this === window // true

// 전역 공간에서의 this(Node.js 환경)
this === global // true
```

#### 전역 공간에서 발생하는 특이한 케이스

```js
console.log(this) // -> Window {window: Window, self: Window, document: document, name: '', location: Location, …}

console.log(this === window) // -> true

var a = 1;

console.log(a) // -> 1

console.log(window.a) // -> 1

console.log(this.a) // -> 1
```

전역 객체 내부에서 생성한 a라는 변수에 값 1을 할당하면, winodw.a와 this.a를 출력하면 모두 같은 결과가 나온다.

그 이유는 바로 자바스크립트에서 변수는 특정 '객체의 프로퍼티'로 동작하기 때문이다.

var keyword로 a를 선언했다지만, 자바스크립트는 실제로 전역 객체(위 예제에서)의 a 프로퍼티로 인식하는 것이다.

이러한 이유로, 전역 공간에서 키워드로 변수를 선언하고 할당하는 것처럼 전역 객체의 프로퍼티를 직접 할당해도 변수를 선언해 할당하는 것과 동일한 결과를 얻을 수 있다.

```js
var x = 100;
console.log(this.x, window.x, x) // 100, 100, 100
```

그러나 전역 변수를 선언하고 할당하는 것과 전역 객체 프로퍼티에 할당하는 것은 동일해보이지만 차이가 있다.

```js
var x = 100;
window.y = 200;

delete x; // false
delete y; // true

console.log(this.x, window.x, x); // 100 100 100
console.log(this.y, window.y, y); // ReferenceError: y is not defined
```

전역 객체의 프로퍼티로 할당한 경우 삭제가 되지만, 전역 변수로 할당한 경우에는 삭제가 되지 않는다.

전역 변수로 할당하는 것은 전역 객체의 프로퍼티로 할당하고, 프로퍼티의 configurable(변경 및 삭제 가능성 속성)을 false로 정의하는 것이다.


### 메서로 호출, 그리고 메서드 내부에서의 this

#### 1. 메서드 vs 함수

함수를 실행하는 방법으로 '함수로서 호출하는 것', '메서드로 호출하는 것'이 있다.

함수와 메서드를 구분하는 유일한 차이는 '독립성'이다.

- 함수 : 그 자체로 독립적 기능을 수행
- 메서드 : 자신을 호출한 대상 객체에 관한 동작을 수행

메서드를 '객체 프로퍼티에 할당된 함수'로 이해하는데, 정확히는 그렇지 않다.

객체 프로퍼티에 할당되었다고 메서드가 아니라, 메서드로서 호출한 경우에만 메서드로 동작한다. 그렇지 않은 경우는 함수로 동작한다.

```js
// Node.js 환경
var func = function (x) {
  console.log(this, x); // global..., 2
};

func(1);

var obj = {
  name: 'mj',
  method: func
};

obj.method(2); // { name: 'mj', method: [Function: func] } 2
```

- func 호출 (함수로서 호출) : this -> global
- obj.method 호출 (메서드로서 호출) : this -> obj 

func 변수에 할당한 것과 obj 객체의 method 프로퍼티에 할당한 것은 모두 최상단에 작성된 function을 참조한다. 같은 function을 참조하고 있지만, 호출의 방식에 따라 결과의 차이가 있다.

'함수로서 호출'과 '메서드로서 호출'을 구분하는 방법은 함수 앞의 (.)으로 구분할 수 있다.
##### 대괄호 표기법에 따른 경우도 메서드로서 호출한 것이다.

```js
// 메서드로서 호출
var cats = {
  name: '홍삼',
  say: function(x) {
    for(let i=0 ; i<x; i++) {
      console.log('meow');
    }
  }
};

cats.say(2);
cats['say'](2);
```

즉, 함수 앞에 객체가 명시되어 있는 경우 '메서드로 호출'한 것이고 그렇지 않은 모든 케이스가 '함수로서 호출'한 것이다.

#### 2. 메서드 내부에서의 this

this에는 바라보는 대상에 대한 정보가 담긴다. 함수를 메서드로 호출하게 되면 this가 바라보는 대상은 해당 객체가 되고, this에는 해당 객체의 정보가 담기게 된다.

```js
var profile = {
  name : "MJ",
  age : 27,
  say: function(){
      console.log(this)
  },
  cats: {
    catName : "홍삼이",
    say: function(){
      console.log(this)
    }
  }
};

profile.say();
profile.cats.say();

/*
profile.say() ->
{
  name: 'MJ',
  age: 27,
  say: [Function: say],
  cats: { catName: '홍삼이', say: [Function: say] }
}

profile.cats.say() ->
{ catName: '홍삼이', say: [Function: say] }
*/
```

### 함수로 호출, 그리고 메서드 내부에서의 this

#### 1. 함수 내부에서의 this

'함수로서 호출'한 경우 this는 지정되지 않는다. this는 호출한 대상(this가 바라보는 대상)에 대한 정보가 담기는데, '함수로서 호출'하는 것은 호출한 대상이 명시되지 않은 경우라서 this에 정보가 담기지 않게 되는 것이다.

2장(실행 컨텍스트)의 내용을 빌리자면, 실행 컨텍스트가 생성될 때 this가 정의되지 않은 경우 this는 전역 객체를 바라본다고 한다(이는 자바스크립트 설계상의 오류라고 합니다).

#### 2. 메서드 내부에서의 this

```js
var obj1 = {
  outer: function () {
    console.log(this);
    var innerFunc = function () {
      console.log(this)
    }
    innerFunc(); // 함수로서 호출

    var obj2 = {
      innerMethod: innerFunc
    };
    obj2.innerMethod(); // 메서드로서 호출
  }
};

obj1.outer(); // 메서드로서 호출
```

1. obj1.outer() 호출로 obj1 내부의 outer 프로퍼티가 실행
2. 첫 번째 console.log(this) -> obj1을 바라본다
3. innerFunc() 호출로 innerFunc 내부의 console.log() 실행
4. 두 번째 console.log(this) -> global
5. obj.innerMethod() 호출로 obj2 내부의 innerMethod 프로퍼티가 실행
6. innerMethod의 호출로 innerFunc 내부의 console.log() 실행
7. 세 번째 console.log(this) -> obj2

함수를 언제, 어떤 방식으로 호출했는지를 파악하면 this가 가르키는 대상을 정확하게 파악할 수 있다.

#### 3. 메서드의 내부 함수에서 this를 우회하는 방법

```js
var obj1 = {
  outer: function () {
    console.log(this);
    var innerFunc = function () {
      console.log(this);
    }
    innerFunc(); // 함수로서 호출

    var self = this;
    var innerFunc2 = function () {
      console.log(self);
    }
    innerFunc2(); // 함수로서 호출
  }
};

obj1.outer(); // 메서드로서 호출
```

위 예제에서 innerFunc2()를 함수로서 호출하고 있기 때문에 this는 전역 객체를 가르키게 된다. 그러나 self라는 변수에 outer 객체를 바라보는 this를 할당했기 때문에 함수로서 호출하더라도, outer 객체를 바라보게 된다.

#### 4. this를 바인딩하지 않는 함수

```js
var obj = {
  outer: function () {
    console.log(this);

    var innerFunc = () => {
      console.log(this);
    };

    innerFunc(); // 함수로서 호출
  }
};
obj.outer();

/*
{ outer: [Function: outer] }
{ outer: [Function: outer] }
*/
```

ES6부터 arrow function을 도입하여 함수 내부에서의 this가 전역 객체를 바라보는 것을 보완했다. arrow fucntion은 실행 컨텍스트를 수집할 때 this 바인딩 과정 자체라 빠지게 되어 상위 scope의 this를 그대로 물려 받는다.

arrow function의 경우 내부에 this가 없고, 접근하고자 하면 스코프체인상 가장 가까운 this로 접근하게 된다.

### 콜백 함수 호출 시 그 함수 내부에서의 this

```js
setTimeout(function () { console.log(this); }, 100); // global

[1,2,3,4,5].forEach(function (x) {
  console.log(this, x); // global
});

document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector('#a').addEventListener('click', 
  function (e) {
    console.log(this. e); // element, click event 객체
  }
);
```

함수의 제어권을 넘겨받은 콜백 함수에 따라 this가 정의되고 별도의 this 정의가 없는 경우에는 전역 객체를 가르키게 된다.

### 생성자 함수 내부에서의 this

```js
var catProfile = function (name, age) {
  this.name = name;
  this.age = age;
  this.say = 'meow'
};

var 홍삼 = new catProfile('홍삼', 4);
var 나비 = new catProfile('나비', 2);
console.log(홍삼, 나비);
// catProfile { name: '홍삼', age: 4, say: 'meow' } 
// catProfile { name: '나비', age: 2, say: 'meow' }
```

new 키워드를 통해 함수를 호출하면 '생성자'로 동작을 한다. 특정 함수가 생성자 함수로 호출된 경우 내부에서의 this는 인스턴스 자신이 된다.

1. new 키워드를 통해 생성자 호출
2. __proto__ 프로퍼티가 있는 객체(인스턴스) 생성
3. 공통 속성 및 개성을 this에 부여

## 명시적으로 this를 바인딩하는 방법

### 1. call 메서드

```js
Function.prototype.call(thisArg[, arg1[, arg2[, ...]]])
```

> call 메서드는 호출 주체인 함수를 즉시 실행하는 명령어

첫 번째 인자를 this로 바인딩하고, 이후 인자를 호출할 함수의 매개변수로 한다. call 메서드를 통해 임의의 객체를 this로 지정할 수 있다.

```js
function Cat(name, age) {
  this.name = name;
  this.age = age;
};

function 홍삼(name, age) {
  Cat.call(this, name, age);
};

console.log(new 홍삼('홍삼', 4).name);
```

### 2. apply 메서드

```js
Function.prototype.apply(thisArg, [argsArray])
```

call 메서드와 동일하지만, call 메서드는 인자 목록을 받지만 apply 메서드는 배열 하나를 받는다는 차이가 있다.

```js
function Cat(name, age) {
  this.name = name;
  this.age = age;
};

function 홍삼(name, age) {
  Cat.apply(this, [name, age]);
};

console.log(new 홍삼('홍삼', 4).name);
```

### 3. bind 메서드

```js
Function.prototype.call(thisArg[, arg1[, arg2[, ...]]])
```

> call과 비슷하지만, 함수를 즉시 호출하지 않고, 넘겨받은 인자들로 새로운 함수를 반환하기만 한다.

```js
var cats = {
  name : '홍삼',
  age : 4,
  hello: function() {
    console.log(`hello ${this.name}`)
  },
};
cats.hello(); // hello 홍삼

var a = cats.hello; // hello undefined
a();

var b = cats.hello.bind(cats); // hello 홍삼
b();
```

b()를 호출하는 것에서 a()를 호출한 것과 동일하게(this가 전역 객체를 바라보는 것) 동작할 것 같지만, bind를 통해 원본 객체가 반환되는 함수를 생성했기 때문에 this는 cats 객체를 바라보고, name 프로퍼티에 접근 할 수 있게 된다.

```js
var b = cats.hello.bind(cats);
b();
console.log(b.name); // bound hello
```

bind 메서드를 통해 새로 만든 함수는 name 프로퍼티로 함수명을 출력한 경우 'bound'라는 접두어가 붙는다.

#### 상위 컨텍스트의 this를 내부 함수나 콜백 함수에 전달하기

call, apply, bind 메서드를 통해 내부 함수에서 메서드의 this를 그대로 바라보게 지정할 수 있다.

```js
var obj = {
  outer: function () {
    console.log(this);

    var innerFunc1 = function () {
      console.log(this);
    };

    var innerFunc2 = function () {
      console.log(this);
    };

    var innerFunc3 = function () {
      console.log(this);
    }.bind(this);


    innerFunc1.call(this);
    innerFunc2.apply(this);
    innerFunc3();
  }
};
obj.outer();

// 4번의 결과 모두 outer 객체를 바라보고 있다.
```

콜백 함수 내에서의 this에 관여하는 함수나 메서드에 대해서도 bind 메서드를 통해 this가 바라볼 대상을 지정할 수 있다.

```js
var obj = {
  logThis: function () {
    console.log(this)
  },
  logThisLater1: function () {
    console.log(this)
    setTimeout(this.logThis, 100)
  },
  logThisLater2: function () {
    console.log(this)
    setTimeout(this.logThis.bind(this), 100)
  }
};

obj.logThisLater1();
obj.logThisLater2();
```

logThisLater1에서 this.logThis로 logThis 메서드를 콜백 함수로 넘겨준다. setTimeout 함수에서의 this는 전역 객체를 바라보고 있어 obj.logThisLater1()의 결과로 global 객체가 출력된다.

logThisLater2에서도 this.logThis로 logThis 메서드를 콜백 함수로 넘겨준다. setTimeout 함수에서의 this는 전역 객체를 바라보고 있는데, bind 메서드를 통해 현재 객체의 this(logThisLater2의 this는 obj 객체를 바라보고 있다.)를 지정해 obj.logThisLater2()의 결과로 obj 객체가 출력된다.

### 콜백 함수 내에서의 this

콜백 함수를 인자로 받는 메서드 중 몇몇은 thisArg 인자로 this를 지정해 줄 수 있다.

```js
var report = {
  sum: 0,
  count: 0,
  add: function () {
    var args = Array.prototype.slice.call(arguments);
    // [Arguments] { '0': 10, '1': 20, '2': 30, '3': 40 }
    // args = [10, 20, 30, 40]
    // this = report obj
    args.forEach((number) => {
      this.sum += number;
      ++this.count;
    }, this);
  },
  avg: function () {
    return this.sum / this.count;
  }  
};

report.add(10, 20, 30, 40);
console.log(report.sum, report.count, report.avg()); // 100 4 25
```

위 예제에서 forEach 메서드에서 콜백 함수를 인자로 받고, thisArg 인자를 통해 this를 지정해준다. add 메서드 내부에서의 this는 report 객체를 바라보고 있기 때문에 this로 report 객체를 가르키게 한다. 따라서 report 객체의 sum 프로퍼티에 접근할 수 있게 된다.

다음은 대표적인 콜백 함수와 함께 thisArg 인자를 받는 메서드들이다.

> Array.prototype.forEach(callback[, thisArg]) <br>
> Array.prototype.map(callback[, thisArg]) <br>
> Array.prototype.filter(callback[, thisArg]) <br>
> Array.prototype.some(callback[, thisArg]) <br>
> Array.prototype.every(callback[, thisArg]) <br>
> Array.prototype.find(callback[, thisArg]) <br>
> Array.prototype.findIndex(callback[, thisArg]) <br>
> Array.prototype.flatMap(callback[, thisArg]) <br>
> Set.prototype.forEach(callback[, thisArg]) <br>
> Map.prototype.forEach(callback[, thisArg]) <br>

---

# Quiz

## Quiz 1

```js
function Cats(name, age) {
  this.name = name;
  this.age = age;
};

var 홍삼 = new Cats('홍삼', 4);
```

Cats 생성자 함수를 new 키워드 없이 작성한 경우, this가 바라보는 대상은?

## Quiz 2
생성자 함수에서 return문이 없는 이유?

## Quiz 3
다음 코드의 실행 결과는?

```js
let Cats = {
  name: '홍삼',
  age: 4
};

function 홍삼 () {
  return Cats;
};

function 홍삼이 () {
  return Cats;
};

let a = new 홍삼();
let b = new 홍삼이();
console.log(this.a === this.b);
```

## Quiz 4
다음 코드에서 생성자 함수로 호출했을 경우와 그냥 함수를 호출했을 때의 binding 프로퍼티에 할당된 this는 각각 무엇을 가르키고 있는가?

```js
function Cats() {
  return {
    name: "홍삼",
    age: 4,
    binding: this
  };
};

let 홍삼 = new Cats();
console.log(홍삼.binding);

function Cats() {
  return {
    name: "홍삼",
    age: 4,
    binding: this
  };
};

let 홍삼 = Cats();
console.log(홍삼.binding)
```
