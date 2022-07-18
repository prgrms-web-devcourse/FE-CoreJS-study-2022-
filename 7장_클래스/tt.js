// let ES6 = class {
//   constructor(name) {
//     this.name = name;
//   }

//   static staticMethod() {
//     return this.name + " static method";
//   }

//   method() {
//     return this.name + " prototype method";
//   }
// };

// let es6Instance = new ES6("es6");
// console.log(ES6.staticMethod() + ", " + es6Instance.method());
// // ES6 static method, es6 prototype method
// let Rectangle = class {
//   constructor(width, height) {
//     this.width = width;
//     this.height = height;
//   }

//   getArea() {
//     return this.width * this.height;
//   }
// };

// let Square = class extends Rectangle {
//   constructor(width) {
//     super(width, width);
//   }

//   getArea() {
//     console.log(`size is : ${super.getArea()}`);
//   }
// };

// let sq = new Square(5);
// sq.getArea(); // size is : 25

// 퀴즈
// let Rectangle = function (width, height) {
//   this.width = width;
//   this.height = height;
// };

// Rectangle.prototype.getArea = function () {
//   return this.width * this.height;
// };

// let rect = new Rectangle(5, 3);
// console.log(rect.getArea()); // 15

let Rectangle = (width, height) => {
  this.width = width;
  this.height = height;
};

Rectangle.prototype.getArea = function () {
  return this.width * this.height;
}; // Cannot set properties of undefined (setting 'getArea')

let rect = new Rectangle(5, 3); // Rectangle is not a constructor
console.log(rect.getArea()); // 15

// 퀴즈 정답
/* 
  arrow function의 경우 prototype 프로퍼티가 존재하지 않는다.
  생성자 함수는 prototype 프로퍼티가 존재하고, 
  해당 객체의 constructor 프로퍼티를 사용한다.
*/
