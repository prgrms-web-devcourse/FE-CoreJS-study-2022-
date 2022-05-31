# this
## 1. 상황에 따라 달라지는 this
## 1-1 전역 공간에서의 this
- 전역 컨텍스트를 생성하는 주체는 전역 객체
- 환경별 전역 객체
    - 브라우저 : window
        ```js
        console.log(this);              // {alert: f(), atob: f(), blur: f(), ...}
        console.log(window);            // {alert: f(), atob: f(), blur: f(), ...}
        console.log(this === window);   // true
        ```
    - Node.js : global
        ```js
        console.log(this);              // {process: {title:'node', version: 'v17.8.0', ...}}
        console.log(global);            // {process: {title:'node', version: 'v17.8.0', ...}}
        console.log(this === global);   // true
        ```
- 전역변수 & 전역객체
    - 전역공간에서의 this는 전역객체를 의미함
    - 자바스크립트의 모든 변수는 "특정 객체(L.E)의 프로퍼티"로서 동작함
    - 전역 공간에서 var로 변수선언을 하는 것과 windows의 프로퍼티에 직접 할당하는 것은 delete 이외에 동일한 동작을 수행함
        ```js
        // 전역 변수를 선언하면 자바스크립트 엔진은 이를 전역객체의 프로퍼티로 할당
        var a = 1;      // === (windows.a = 1)
        window.b = 1;   // === (var b = 1)
        console.log(a, window.a, this.a);   // 1 1 1
        console.log(b, window.b, this.b);   // 1 1 1
        
        delete a;   // 삭제 명령 수행 안됨
        delete b;   // 삭제 명령 수행됨
        console.log(a, window.a, this.a);   // 1 1 1
        console.log(b, window.b, this.b);   // 1 1 1
        ```
## 1-2 메서드로서 호출할 때 해당 메서드 내부에서의 this
- 함수, 메서드 비교
    ```js
    var func = function(x){
        console.log(this, x);
    }
    // (function)직접 호출
    func(1);        // Window { ... } 1

    var obj = {
        method: func
    };
    // (method)객체의 프로퍼티에 할당해서 호출
    obj.method(2);      // {method: f} 2
    obj["method"](2);   // {method: f} 2
    ```
- 메서드 내부에서의 this
    ```js
    var obj = {
        methodA: function () {console.log(this);},
        inner: {
            methodB: function () {console.log(this);}
        }
    };

    // this == obj
    obj.methodA();      // {methodA: f, inner: {...}}
    obj["methodA"]();   // {methodA: f, inner: {...}}

    // this === obj.inner
    obj.inner.methodB();        // {methodB: f}
    obj.inner["methodB"]();     // {methodB: f}
    obj["inner"].methodB();     // {methodB: f}
    obj["inner"]["methodB"]();  // {methodB: f}
    ```
## 1-3 함수로서 호출할 때 해당 함수 내부에서의 this
### 1-3-1 함수와 메서드 내부에서의 this
- 함수에서의 this는 전역 객체, 메서드 내부에서의 this는 호출 객체
    ```js
    var obj1 = {
        outer: function(){
            console.log(this);
            var innerFunc = function(){
                console.log(this);
            };
            innerFunc();

            var obj2 = {
                innerMethod: innerFunc
            };
            obj2.innerMethod();
        }
    };
    obj1.outer();
    ```
    >```
    >1. obj1 생성
    >2. obj1.outer() 호출 후 console.log(this) 에서 {outer: f} 출력
    >3. innerFunc 익명함수 선언
    >4. innerFunc 호출 후 console.log(this) 에서 Window{...} 출력
    >5. obj2 생성
    >6. obj2.innerMethod() 호출 후 console.log(this) 에서 {innerMethod: f} 출력
    
- 메서드의 내부 함수에서의 this를 우회하는 방법
    ```js
    var obj = {
        outer: function() {
            console.log(this);  // {outer: f}
            var innerFunc1 = function(){
                console.log(this);  // Window {...}
            };
            innerFunc1();

            var self = this;    // self에 현재 스코프 정보(outer) 할당
            var innerFunc2 = function(){
                console.log(self);  // {outer: f}
            };
            innerFunc2();
        }
    }
    obj.outer();
    ```
- 화살표 함수는 실행 컨텍스트를 생성할 때 this바인딩이 생략돼서 상위 스코프의 this를 그대로 활용 가능
    ```js
     var obj = {
        outer: function(){
            console.log(this);      // {outer: f}
            var innerFunc = function(){
                console.log(this);  // Window {...}
            }
            var innerArrowFunc = () => {
                console.log(this);  // {outer: f}
            };
            innerFunc();
            innerArrowFunc();
        }
    }
    obj.outer();
    ```
### 1-3-2 콜백 함수 호출 시 해당 함수 내부에서의 this
```js
// 대상이 되는 객체 지정 x
setTimeout(function() {console.log(this);}, 300);   // 0.3초 뒤 Window {..} x

[1, 2, 3, 4, 5].forEach(function(x){
    console.log(this, x);   // Window {...} x
});

// 콜백 호출 시 this 상속
document.body.innerHTML += "<button id='a'>클릭</button>";
document.body.querySelector("#a").addEventListener("click", function(e){
    console.log(this, e);
});
```

### 1-3-3 생성자 함수 내부에서의 this
```js
var Cat = function(name, age){
    this.bark = "야옹";
    this.name = name;
    this.age = age;
};
var choco = new Cat("초코", 7);
var nabi = new Cat("나비", 5);

console.log(choco, nabi);
/* 출력 결과
    Cat {bark: "야옹", name: "초코", age: 7}
    Cat {bark: "야옹", name: "나비", age: 5}

    (실행한 생성자 함수 내부에서의 this는 인스턴스를 가리킴)
*/
```
---
## 2. 명시적으로 this를 바인딩하는 방법
- call 메서드
- apply 메서드
- bind 메서드
- 별도의 인자로 this를 받는 경우(콜백 함수 내에서의 this)

### 2-1 call 메서드
- [call 메서드 구문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
    ```js
    func.call(thisArg[, arg1[, arg2[, ...]]])
    ```
    > 이미 할당되어있는 다른 객체의 함수/메서드를 호출하는 해당 객체에 재할당할 때 사용
    ```js
    var func = function(a, b, c){
        console.log(this, a, b, c);
    };

    func(1, 2, 3);              // Window{...} 1 2 3
    func.call({x: 1}, 4, 5, 6); // {x: 1} 4 5 6
    ```
    
### 2-2 apply 메서드
- [apply 메서드 구문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
    ```js
    func.apply(thisArg, [argsArray])
    ```
    > 주어진 this값과 배열로 제공되는 arguments로 함수를 호출
    ```js
    var func = function(a, b, c){
        console.log(this, a, b, c); // {x: 1} 4 5 6
    };
    func.apply({x: 1}, [4, 5, 6]);

    var obj = {
        a: 1,
        method: function(x, y){
            console.log(this.a, x, y);  // 4 5 6
        }
    };
    obj.method.apply({a: 4}, [5, 6]);
    ```

### 2-3 call, apply 메서드 활용
- 객체에는 배열 메서드를 직접 적용할 수 없으나 하단의 조건을 충족하면 call, apply를 이용하여 적용 가능
    - key값이 0 이상의 정수인 프로퍼티가 존재
    - length 프로퍼티의 값이 0 이상인 정수

- 첫 번째 활용 사례 : 객체 데이터를 배열 데이터로 변환하는 방법
    - 유사배열객체(array-like object)에 배열 메서드 적용
        ```js
        var obj = {
            0: 'a',
            1: 'b',
            2: 'c',
            length: 3
        };
        Array.prototype.push.call(obj, "d");
        console.log(obj);   // {0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4}

        var arr = Array.prototype.slice.call(obj);
        console.log(arr);   // ['a', 'b', 'c', 'd']
        ```
    - Array.from 메서드 적용(ES6부터 적용 가능)
        ```js
        var obj = {
            0: 'a',
            1: 'b',
            2: 'c',
            length: 3
        };
        // Array.from을 통해 유사 배열 객체를 얕게 복사해서 새로운 배열 생성
        var arr = Array.from(obj);
        console.log(arr);
        ```
- 두 번째 활용 사례 : 생성자 내부에서 다른 생성자를 호출
    ```js
    function Person(name, gender){
        this.name = name;
        this.gender = gender;
        console.log(this.name, this.gender);
        /* 출력 결과
            alice female
            bob male
        */
    }
    function Student(name, gender, school){
        Person.call(this, name, gender);
        this.school = school;
    }
    function Employee(name, gender, company){
        Person.apply(this, [name, gender]);
        this.company = company;
    }
    var alice = new Student("alice", "female", "한국대");
    var bob = new Employee("bob", "male", "페이스북");
    ```

- 세 번째 활용 사례 : 여러 인수를 묶어 하나의 배열로 전달하고 싶을 때
    ```js
    var numbers = [10, 20, 3, 16, 45];
    var max = Math.max.apply(null, numbers);
    var min = Math.min.apply(null, numbers);
    console.log(max, min);  // 45 3

    // ES6부터는 전개구문을 활용할 수 있음
    max = Math.max(...number);
    min = Math.min(...numbers);
    console.log(max, min);  // 45 3
    ```

### 2-4 bind 메서드
- [bind 메서드 구문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
    ```js 
    func.bind(thisArg[, arg1[, arg2[, ...]]]) 
    ```
    > call과 유사하며 넘겨받은 매개변수들을 이용하여 새로운 함수를 반환해줌
    
    ```js
    var func = function(a, b, c, d){
        console.log(this, a, b, c, d);
    };
    func(1, 2, 3, 4);   // Window {...} 1 2 3 4

    var bindFunc1 = func.bind({x: 1});
    bindFunc1(5, 6, 7, 8);  // {x: 1} 5 6 7 8

    var bindFunc2 = func.bind({x: 2}, 4, 5);
    bindFunc2(6, 7);    // {x: 2} 4 5 6 7
    bindFunc2(8, 9);    // {x: 2} 4 5 8 9
    func(1, 2, 3, 4);
    ```
- name 프로퍼티
    > bind메서드를 사용해서 만든 함수의 name 프로퍼티는 "bound" 접두어가 붙어서 call이나 apply보다 코드를 추적하는데 용이함
    ```js
    var func = function(a, b, c, d){
        console.log(this, a, b, c, d);
    }
    var bindFunc = func.bind({x: 1}, 4, 5);
    console.log(func.name);     // func
    console.log(bindFunc.name); // bound func
    ```

### 2-5 별도의 인자로 this를 받는 경우(콜백 함수 내에서의 this)
```js
var report = {
    sum: 0,
    count: 0,
    add: function(){
        var args = Array.prototype.slice.call(arguments);
        args.forEach(function(entry){
            this.sum += entry;
            this.count += 1;
            console.log(this);
            /* 출력 결과
                {sum: 60, count: 1, add: f, average: f}
                {sum: 145, count: 2, add: f, average: f}
                {sum: 240, count: 3, add: f, average: f}
            */
        }, this);
    },
    average: function(){
        return this.sum / this.count;
    }
};
report.add(60, 85, 95);
console.log(report.sum, report.count, report.average());    // 240 3 80
```
> 콜백 함수와 함께 thisArg를 인자로 받는 메서드
```js
Array.prototype.forEach(callback[, thisArg])
Array.prototype.map(callback[, thisArg])
Array.prototype.filter(callback[, thisArg])
Array.prototype.some(callback[, thisArg])
Array.prototype.every(callback[, thisArg])
Array.prototype.find(callback[, thisArg])
Array.prototype.findIndex(callback[, thisArg])
Array.prototype.flatMap(callback[, thisArg])
Set.prototype.forEach(callback[, thisArg])
Map.prototype.forEach(callback[, thisArg])
```

---
## Quiz
### 1. 다음 코드가 실행될 때 출력 결과는?
```js
var fruit = "사과";
let person = {
    fruit: "딸기",
    eatFruit: eatFruitFunc,
    innerEatFruit: () => {
        eatFruitFunc();
    }
}

function eatFruitFunc(){
    console.log(`${this.fruit}를 먹습니다.`);
}

eatFruitFunc();         // ?
person.eatFruit();       // ?
person.innerEatFruit();  // ?
```

### 2. 다음 코드에서 한 줄만 변경해서 "Joo"를 출력해주세요.
```js
function Person(name) {
  this.name = name;
}

Person.prototype.doSomething = function(func) {
  if(typeof func === "function") {
    func();
  }
};

function foo() {
  console.log(this.name);   // undefined
}

var person = new Person("Joo");
person.doSomething(foo);
```