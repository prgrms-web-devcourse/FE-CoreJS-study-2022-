# 데이터 타입
## 1. 데이터 타입의 종류
- 기본형(Primitive Type)
    - 할당이나 연산시 복제
    - 불변성(Immutability)

    ```javascript
    let num = 533;              // Number
    let str = "string";         // String
    let flag = true;            // Boolean
    let empty = null;           // null
    let undef = undefined;      // undefined
    let sym = Symbol();         // Symbol
    ```

- 참조형(Reference Type)
    - 할당이나 연산시 참조

    ```javascript
    const arr = [1, 2, "str"];                  // Array
    const func = () => {...}                    // Function
    const today = new Date();                   // Date
    const regExp = new RegExp('ab+c')           // RegExp
    const map = new Map();                      // Map
    const weakMap = new WeakMap();              // WeakMap
    const set = new Set([0, 1, 2, 3]);          // Set
    const weakSet = new WeakSet([obj1, obj2]);  // WeakSet
    ```

---
## 2. 데이터 타입에 관한 배경지식
### 2-1 메모리와 데이터
- Javascript의 숫자 표현 단위는 64비트(정수형, 부동소수형 구분 X)
- 64비트 중 사용되는 용도
    - 1bit : 부호비트(Most Significant Bit)
    - 11bit : 지수부
    - 52bit : 가수부

### 2-2 변수와 식별자
- 변수 : 데이터가 담길 수 있는 공간
- 식별자 : 데이터가 담길 수 있는 공간을 식별할 수 있는 이름(변수명)

```javascript
/* let name(식별자) = "변수"(변수) */
let name = "변수";
```

---
## 3. 변수 선언과 데이터 할당
### 3-1 변수 선언
- 변경 가능한 데이터가 담길 수 있는 공간
- 변할 수 있는 데이터를 식별자를 부여하여 만듦

### 3-2 데이터 할당 과정
1. 메모리 공간 중 비어있는 한 개의 공간을 확보
2. 확보된 메모리 공간에 개발자가 입력한 식별자 저장
3. 메모리 공간 중 비어있는 한 개의 공간에 개발자가 입력한 데이터 저장
4. 개발자가 입력한 식별자를 메모리 공간에서 검색
5. 검색된 주소에 데이터가 저장된 주소값 저장

---
## 4. 기본형 데이터와 참조형 데이터
### 불변값
- 아래 예제에서 str식별자에 연결된 메모리 주소에 있는 abc의 값이 "abcdef"가 되는게 아닌 별도의 메모리 주소에 "abcdef" 값이 할당되고 새로 할당된 주소로 str식별자의 값이 참조되는걸 확인할 수 있다.
    ```javascript
    let str = "abc";
    ```
    ![image](https://user-images.githubusercontent.com/15838144/168477946-73c85ba7-dddc-455f-8f24-2a1154b4cfde.png)

    ```javascript
    let str = "abc";
    str += "def";
    ```
    ![image](https://user-images.githubusercontent.com/15838144/168477992-748581c9-3eb7-4214-aa78-66b1f99e8b02.png)


- 아래 예제에서는 num1식별자의 주소에는 5가 담겨져있는 메모리 주소를 참조한 뒤 num2를 선언하면 기존 num1에 담겨져있는 메모리 주소에서 바라보는 값도 5이므로 num2에도 num1의 값과 동일한 메모리 주소를 저장한다.
    ```javascript
    let num1 = 5;
    ```
    ![image](https://user-images.githubusercontent.com/15838144/168478889-aa51cc88-38b7-4307-b6bd-70d6fd4d59ff.png)
    
    ```javascript
    let num1 = 5;
    let num2 = 5;
    ```
    ![image](https://user-images.githubusercontent.com/15838144/168478932-506e0778-06e0-4dda-ad1e-d96774af35d7.png)

    
### 가변값
- 아래 예제에서 object형식의 데이터가 어떻게 저장되는지 확인할 수 있다.
    ```javascript
    let obj = {
        num: 1,
        str: "bbb"
    }
    ```
---
## 5. 불변 격체
> 불변 객체의 핵심은 객체 복사에 대한 이해라고 생각합니다.

- 얕은복사와 깊은복사 함수
    ```javascript
    let obj = {
        num: 1,
        innerObj: {
            nil: null,
            arr: [1, 2]
        }
    };

    // 얕은 복사
    let copyObejctShallow = (obj) => {
        let result = {};
        
        for(let prop in obj){
            result[prop] = target[prop];
        }

        return result;
    }

    // 깊은 복사
    let copyObjectDeep = (obj) => {
        let result = {};
        
        if(typeof obj === "object" && target !== null){
            for(let prop in obj){
                result[prop] = copyObjectDeep(target[prop]);
            }
        } else{
            result = target;
        }

        return result;
    }
    ```

- 얕은복사 예시
    ```javascript
    let obj2 = copyObejctShallow(obj);

    obj2.num = 3;
    obj2.innerObj.nil = "is not null";
    obj2.innerObj.arr[0] = 500;

    console.log(obj);
    console.log(obj2);
    ```

- 얕은복사 결과

    > 얕은복사된 사본의 프로퍼티 값이 변경되면 1Depth 요소를 제외하면 원본의 데이터도 동일하게 바뀐다.

    ![image](https://user-images.githubusercontent.com/15838144/168478205-afd95fc1-7f86-4164-880c-c558baf009d7.png)

- 깊은복사 예시
    ```javascript
    let obj2 = copyObjectDeep(obj);

    obj2.num = 3;
    obj2.innerObj.nil = "is not null";
    obj2.innerObj.arr[0] = 500;

    console.log(obj);
    console.log(obj2);
    ```

- 깊은복사 결과

    > 깊은복사된 사본은 내부 값이 변경되어도 원본에 영향이 없다.

    ![image](https://user-images.githubusercontent.com/15838144/168478263-16bded4f-c17e-48d4-8fbb-1799ab105deb.png)


- JSON을 이용한 복사
    ```javascript
    let copyObjectViaJSON = (obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    ```
    주의사항
    > JSON을 이용하여 동일한 객체 여부를 비교할 경우 객체 내부의 Key, Value요소는 같으나 Key의 순서가 다를 경우 false를 반환하므로 이 경우 Key의 정렬 연산이 선행되어야 한다.

---
## 6. undefined와 null
- null
    - 호출하려는 식별자가 선언되고 데이터가 초기화되었으나 값이 비어있는 경우
    - 비어있는 데이터를 명시적으로 선언할 경우 사용 가능(undefined 직접 초기화 지양)
```javascript
let nil = null;

console.log(nil);   // null 출력
```
- undefined
    - 호출하려는 식별자가 선언만 되고 값이 메모리 공간에서 초기화 되지 않았을 경우
    - 호출하려는 식별자에 undefined 값으로 초기화 되었을 경우(직접 할당은 가급적 주의!!)
    - 객체 내부에 존재하지 않는 프로퍼티에 접근할 경우
```javascript
let undef;

console.log(undef); // undefined 출력
```
- 연산자에 따른 null, undefined
```javascript
console.log(null == undefined);     // true 출력
console.log(null === undefined);    // false 출력
```

---

## Q) 깊은 복사의 여러 방법을 구현하고 장단점을 기술해주세요.

## A) 
### 1. 커스텀 재귀 함수
```javascript
let copyObjectDeep = (obj) => {
    let result = {};

    if(typeof obj === "object" && target !== null){
        for(let prop in obj){
            result[prop] = copyObjectDeep(target[prop]);
        }
    } else{
        result = target;
    }

    return result;
}
```

### 2. JSON객체의 함수 활용
```javascript
const obj1 = {
  a: 1,
  b: "string",
  c: {
    name: "Leon",
    age: "29"
  }
};

const obj2 = JSON.parse(JSON.stringify(obj1));
```

### 3. 라이브러리 사용
```javascript
const original = { a: { b: 2 } };
// cloneDeep 함수는 lodash 라이브러리에 구현된 함수
let copy = _.cloneDeep(original);
copy.a.b = 100;
console.log(original.a.b); //2 출력
```

### [성능비교](http://jsben.ch/2KRm3)

![image](https://user-images.githubusercontent.com/15838144/168521653-7a3fc8fb-fe87-47e7-a82a-eb996dd100eb.png)

### 장단점
1. 커스텀 함수
    - 장점 : 타 방법 대비 뛰어난 성능
    - 단점 : 직접 구현해야되는 번거로움이 있음
2. JSON객체 함수
    - 장점 : 라이브러리 사용 없이 편리하게 사용 가능
    - 단점 : 객체간의 비교 시 Key의 순서가 다를 경우 원하는 결과를 도출 못할 수 있음(별도의 Key 정렬 구현 필요), 깊은 복사가 불가능한 타입 존재(Date, 정규 표현식, 함수, etc...)
3. 라이브러리 사용
    - 장점 : 라이브러리 추가만 하면 1Line만 사용하여 함수 호출만 하면됨
    - 단점 : 커스텀 함수 대비 성능이 떨어짐 